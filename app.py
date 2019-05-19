import os

from flask import Flask, flash, json, redirect, render_template, session, url_for, request
import util.database as db
template_path=os.path.dirname(__file__)+"/templates"

if template_path!="/templates":
    app = Flask("__main__",template_folder=os.path.dirname(__file__)+"/templates")
else:
    app = Flask("__main__")
app.secret_key = os.urandom(32)
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
    return render_template('findata.html')

@app.route('/goals')
def goal():
    if 'username' not in session:
        flash("You must be logged in to access this page")
        return redirect(url_for('login'))
    return render_template('goals.html')

@app.route('/fincalc', methods=['POST'])
def calc():
    bal = request.form['balance']
    monthly = request.form['monthly']
    income = request.form['income']
    daily = request.form['daily']
    user_id = db.search_user_list(session['username'])[0][2]
    db.add_finances(bal, monthly, income, user_id)
    flash("Finances updated")
    return redirect(url_for('home'))

@app.route('/goals')
def goals():
    if 'username' not in session:
        flash("You must be logged in to access this page")
        return redirect(url_for('login'))
    return render_template('goals.html')

@app.route('/gcalc', methods=['POST'])
def gcalc():
    goal_name = request.form['goal']
    goal_price = request.form['goal_price']
    user_id = db.search_user_list(session['username'])[0][2]
    db.add_goals(goal_name, goal_price, user_id)
    flash(f"Goal for {goal_name} at ${goal_price} has been added!")
    return redirect(url_for('home'))

@app.route('/logout')
def logout():
    if 'username' in session:
        session.pop('username')
    return redirect(url_for('home'))

if __name__ == "__main__":
    app.debug = True
    app.run()
