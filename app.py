import os
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
        return render_template('home.html',fin=finavail)
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
    print(f"Unlike month, this is daily: {daily}\n")
    w = dict([ (x[0], x[1]) for x in daily ])
    s = dict([ (x[0], x[1]) for x in monthly ])
    print(f"THIS is monthly: {monthly}")
    print(f"THIS is s: {s}")
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
                                mtotal = m_total)
    return render_template('findata.html')

@app.route('/fincalc', methods=['POST'])
def calc():
    print(request.form)
    bal = request.form['balance'][1:]
    monthly = request.form['monthly-inputs']
    income = request.form['income'][1:]
    print(request.form)
    daily = request.form['all-inputs']
    print(f"This is daily: {monthly}")
    daily = json.loads(daily) # dictionary
    monthly = json.loads(monthly)
    print(f"This is daily now {monthly}")
    w = dict([x for x in daily.values()]) # {expense1: $$$, expense2: $$$, ...}
    m = dict([x for x in monthly.values()])
    print(f"\nThis is calculated m:{m}\n")
    user_id = db.search_user_list(session['username'])[0][2]
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
    price = g
    if g != []:
        g = g[0][0]
    if price != []:
        price = price[0][1]
    img = db.search_image_list(user_id)
    if img != []:
        img = img[0][0]
    if b != []:
        b = b[0][0]
    print(b)
    print(g)
    print(price)
    print(img)
    if g or price:
        if b:
            print("Used the first one")
            return render_template('goals.html', goal=g, goal_price=price, image=img, bal=b)
        else:
            print("Used the second")
            return render_template('goals.html', goal=g, goal_price=price, image=img)
    else:
        if b:
            return render_template('goals.html', bal=b)
        else:
            return render_template('goals.html')

@app.route('/gcalc', methods=['POST'])
def gcalc():
    goal_name = request.form['goal']
    goal_price = request.form['goal_price'][1:]
    print("gcalc")
    print(goal_name)
    print(goal_price)
    user_id = db.search_user_list(session['username'])[0][2]
    db.add_goals(goal_name, goal_price, user_id)
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
   user_id = db.search_user_list(session['username'])[0][2]
   return render_template('sankey.html',idnum=user_id)
@app.route('/pie')
def pie():
   user_id = db.search_user_list(session['username'])[0][2]
   return render_template('pie.html',idnum=user_id)
@app.route('/logout')
def logout():
    if 'username' in session:
        session.pop('username')
    return redirect(url_for('home'))

if __name__ == "__main__":
    app.debug = True
    app.run()