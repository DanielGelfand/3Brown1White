import os, datetime
import urllib

from flask import (Flask, flash, json, jsonify, redirect, render_template,
                    request, session, url_for)

import util.database as db

template_path=os.path.dirname(__file__)+"/templates"

if template_path!="/templates":
    app = Flask("__main__",template_folder=os.path.dirname(__file__)+"/templates")
else:
    app = Flask("__main__")
app.secret_key = os.urandom(32)

file = open('data/keys.json')
content = file.read()
keys = json.loads(content)

# has a 5000 calls/day limit
PIXABAY_KEY = keys['Pixabay']
PIXABAY_STUB = "https://pixabay.com/api/?key=" + PIXABAY_KEY + "&q=" #separate words with "+"
@app.route('/')
def home():
    if "username" in session:
        id_num=db.search_user_list(session["username"])[0][2]
        finavail=db.search_finance_list(id_num)
        goalavail=db.search_finance_list(id_num)
        set_goal = db.search_goal_list(id_num)
        print(set_goal)
        if set_goal != []:
            user_id = db.search_user_list(session['username'])[0][2]
            g = db.search_goal_list(user_id)
            b = db.search_finance_list(user_id)
            t = db.search_time_list(user_id)
            date_now = datetime.date.today()
            price = g
            perc = g
            delta_months = 0
            if g != []:
                g = g[0][0]
            if price != []:
                price = price[0][1]
            if perc != []:
                perc = perc[0][2]
            ##function to get difference in months between 2 dates
            def months_between(date1,date2):
                if date1>date2:
                    date1,date2=date2,date1
                m1=date1.year*12+date1.month
                m2=date2.year*12+date2.month
                months=m2-m1
                if date1.day>date2.day:
                    months-=1
                elif date1.day==date2.day:
                    seconds1=date1.hour*3600+date1.minute+date1.second
                    seconds2=date2.hour*3600+date2.minute+date2.second
                    if seconds1>seconds2:
                        months-=1
                return months

            if t != []:
                t = t[0][0]
                delta_months = months_between(datetime.datetime.strptime(t,'%Y-%m-%d'), datetime.datetime.strptime(str(date_now),'%Y-%m-%d'))
            print(delta_months)

            img = db.search_image_list(user_id)
            if img != []:
                img = img[0][0]
            if b != []:
                bal = b[0][0]
                inc = b[0][1]
            print(b)
            print(g)
            print(price)
            print(perc)
            print(img)
            if g or price:
                if b:
                    print("Used the first one")
                    perc_complete = (delta_months * (perc / 100.0) * inc)/price
                    print(perc_complete)
                    return render_template('home.html',fin=finavail,goal=goalavail, set_goal= set_goal, goal_name =g,  goal_price=price,perc_inc = perc, image=img, bal=bal, income=inc, months= delta_months, perc_comp = perc_complete * 100 )
            return render_template('home.html',fin=finavail,goal=goalavail)
        return render_template('home.html',fin=finavail,goal=goalavail)
    return render_template('home.html')

@app.route('/register')
def register():
    return render_template('register.html')
@app.route('/login')
def login():
    return render_template('login.html')
@app.route('/auth', methods=['POST'])
def auth():
    user = request.form.get("user")
    paswrd = request.form.get('pass')
    if request.form.get("submit")=="Register":
        paswrd2 = request.form.get("pass2")
        print(paswrd)
        print(paswrd2)
        if paswrd != paswrd2:
            flash("Passwords Do Not Match")
            return redirect(url_for('register'))
        if  db.register(user, paswrd):
            flash("Registered successfully")
            session['username'] = request.form['user']
        else:
            flash("Unable to register the user")
            return redirect(url_for('register'))
            print("Username has been registered previously!")
    else:
        match=db.search_user_list(user)
        if len(match)>0:
            if match[0][1]==paswrd:
                session["username"]=request.form["user"]
            else:
                flash("wrong Password")
                return redirect(url_for('login'))
        else:
            flash("User not found")
            return redirect(url_for('login'))
    return redirect(url_for('home'))

@app.route('/finances')
def finance():
    if 'username' not in session:
        flash("You must be logged in to access this page")
        return redirect(url_for('login'))
    user_id = db.search_user_list(session['username'])[0][2]
    items = db.search_finance_list(user_id)
    daily = db.search_expense_list(user_id, is_id=True)
    monthly = db.search_monthly_list(user_id, is_id=True)
    ratings = db.search_rating_list(user_id, is_id=True)
    print(ratings)
    print(f"Unlike month, this is daily: {daily}\n")
    w = dict([ (x[0], x[1]) for x in daily ])
    s = dict([ (x[0], x[1]) for x in monthly ])
    r = dict([ (x[0], x[1]) for x in ratings ])
    print(f"THIS is monthly: {monthly}")
    print(f"THIS is s: {s}")
    print(f"These are the ratings: {r}")
    total = 0
    m_total = 0
    for x in w.values():
        total += float(x)
    for x in s.values():
        m_total += float(x)
    if items != []:
        bal,income,i = items[0]
        diction = {"Balance":bal, "Income":income}
        return render_template('findata.html',
                                diction=diction,
                                daily=w,
                                months = s,
                                total=total,
                                mtotal = m_total,completed=True, ratings=r)
    return render_template('findata.html')

@app.route('/fincalc', methods=['POST'])
def calc():
    if 'username' not in session:
        flash("You must be logged in to access this page")
        return redirect(url_for('login'))
    print(request.form)
    session["finances"]=session["username"]
    bal = request.form['balance'][1:]
    monthly = request.form['monthly-inputs']
    income = request.form['income'][1:]
    # print(request.form)
    s = request.form
    d_rates = request.form['daily-importance']
    m_rates = request.form['monthly-importance']
    print(d_rates)
    user_id = db.search_user_list(session['username'])[0][2]
    daily_dict = json.loads(d_rates)
    monthly_dict = json.loads(m_rates)

    dai_im = dict([x for x in daily_dict.values()]) # {expenseName: rating, expenseName2: rating, ...}
    mon_im = dict([x for x in monthly_dict.values()])
    for item in mon_im:
        db.add_rating(item, mon_im[item], user_id)
    for item in dai_im:
        db.add_rating(item, dai_im[item], user_id)

    daily = request.form['all-inputs']
    print(f"This is daily: {monthly}")
    daily = json.loads(daily) # dictionary
    monthly = json.loads(monthly)
    print(f"This is daily now {monthly}")
    w = dict([x for x in daily.values()]) # {expense1: $$$, expense2: $$$, ...}
    m = dict([x for x in monthly.values()])
    print(f"\nThis is calculated m:{m}\n")
    db.add_finances(bal, m, income, w, user_id)
    flash("Finances updated")
    return redirect(url_for('home'))

@app.route('/goals')
def goals():
    if 'username' not in session:
        flash("You must be logged in to access this page")
        return redirect(url_for('login'))
    user_id = db.search_user_list(session['username'])[0][2]
    g = db.search_goal_list(user_id)
    b = db.search_finance_list(user_id)
    t = db.search_time_list(user_id)
    date_now = datetime.date.today()
    price = g
    perc = g
    delta_months = 0
    if g != []:
        g = g[0][0]
    if price != []:
        price = price[0][1]
    if perc != []:
        perc = perc[0][2]
    ##function to get difference in months between 2 dates
    def months_between(date1,date2):
        if date1>date2:
            date1,date2=date2,date1
        m1=date1.year*12+date1.month
        m2=date2.year*12+date2.month
        months=m2-m1
        if date1.day>date2.day:
            months-=1
        elif date1.day==date2.day:
            seconds1=date1.hour*3600+date1.minute+date1.second
            seconds2=date2.hour*3600+date2.minute+date2.second
            if seconds1>seconds2:
                months-=1
        return months

    if t != []:
        t = t[0][0]
        delta_months = months_between(datetime.datetime.strptime(t,'%Y-%m-%d'), datetime.datetime.strptime(str(date_now),'%Y-%m-%d'))
    print(delta_months)

    img = db.search_image_list(user_id)
    if img != []:
        img = img[0][0]
    if b != []:
        bal = b[0][0]
        inc = b[0][1]
    print(b)
    print(g)
    print(price)
    print(perc)
    print(img)
    if g or price:
        if b:
            print("Used the first one")
            perc_complete = (delta_months * (perc / 100.0) * inc)/price
            print(perc_complete)
            return render_template('goals.html', goal=g, goal_price=price,perc_inc = perc, image=img, bal=bal, income=inc, months= delta_months, perc_comp = perc_complete * 100 )
        else:
            print("Used the second")
            return render_template('goals.html', goal=g, goal_price=price,perc_inc = perc, image=img)
    else:
        if b:
            return render_template('goals.html', bal=bal, income=inc)
        else:
            return render_template('goals.html')

@app.route('/gcalc', methods=['POST'])
def gcalc():
    if 'username' not in session:
        flash("You must be logged in to access this page")
        return redirect(url_for('login'))
    goal_name = request.form['goal']
    goal_price = request.form['goal_price'][1:]
    percentage = request.form['slide']
    print("This is percentage:")
    print(percentage)
    print("gcalc")
    print(goal_name)
    print(goal_price)
    user_id = db.search_user_list(session['username'])[0][2]
    db.add_goals(goal_name, goal_price, percentage, user_id)
    a = db.search_image_list(user_id)
    print(a)
    # optimization to save on api calls
    if a == [] or a[0][2] != goal_name:
        try:
            l = urllib.request.urlopen(PIXABAY_STUB + goal_name.replace(' ', '+') + "&image_type=photo")
            p = json.loads(l.read())
            img = p['hits'][0]['webformatURL']
        except:
            return render_template('error.html', err="Cannot connect to API", fix="Try refreshing or contacting the site owner")
    else:
        img = a[0][1]
    db.add_images(img, goal_name, user_id)
    flash(f"Goal for {goal_name} at ${goal_price} has been added!")
    return redirect(url_for('home'))

@app.route('/sankey')
def sankey():
    if 'username' not in session:
        flash("You must be logged in to access this page")
        return redirect(url_for('login'))
    user_id = db.search_user_list(session['username'])[0][2]
    return render_template('sankey.html',idnum=user_id)
@app.route('/pie')
def pie():
    if 'username' not in session:
        flash("You must be logged in to access this page")
        return redirect(url_for('login'))
    user_id = db.search_user_list(session['username'])[0][2]
    return render_template('pie.html',idnum=user_id)
@app.route('/area')
def area():
    if 'username' not in session:
        flash("You must be logged in to access this page")
        return redirect(url_for('login'))
    user_id = db.search_user_list(session['username'])[0][2]
    return render_template('area.html',idnum=user_id)
@app.route('/logout')
def logout():
    if 'username' in session:
        session.pop('username')
    return redirect(url_for('home'))

@app.route('/account')
def account():
    if 'username' not in session:
        flash("You must be logged in to access this page")
        return redirect(url_for('login'))
    # print(db.search_user_list(session['username']))
    user_list = json.dumps(db.search_user_list(ret_all=True))
    print(json.dumps(db.search_user_list(ret_all=True)))
    return render_template('accounts.html', user_list=user_list)

@app.route('/update', methods=["POST"])
def update():
    print('this is the updates')
    update_dict = request.form['all-options']
    update_dict = json.loads(update_dict)
    print(request.form)
    user_ids = db.search_user_list(session['username'])
    user = user_ids[0][-1]
    print(user)
    db.update_user_list(update_dict['username'] or user_ids[0][0], update_dict['password'] or user_ids[0][1], user)
    db.reset_statistics(user, update_dict['reset'])
    session.pop('username')
    session['username'] = update_dict['username'] or user_ids[0][0] # change username in session
    flash("Account information updated successfully")
    return redirect(url_for('home'))

@app.route('/del')
def delete():
    if 'username' not in session:
        flash("Woops. You can't be here")
        return redirect(url_for('login'))
    user = db.search_user_list(session['username'])[0][-1]
    print(user)
    db.update_user_list(None, None, user, rem=True)
    flash("User successfully removed")
    session.pop('username')
    return redirect(url_for('home'))

if __name__ == "__main__":
    app.debug = True
    app.run()
