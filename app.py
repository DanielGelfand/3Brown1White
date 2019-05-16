import os

from flask import Flask, flash, json, redirect, render_template, session, url_for, request
import util.database as db


app = Flask("__main__")
app.secret_key = os.urandom(32)
@app.route('/')
def home():
    print(db.search_user_list('hello'))
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

@app.route('/fincalc')
def calc():
    return redirect(url_for('home'))
@app.route('/logout')
def logout():
    if 'username' in session:
        session.pop('username')
    return redirect(url_for('home'))

if __name__ == "__main__":
    app.debug = True
    app.run()
