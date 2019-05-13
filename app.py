from flask import Flask, flash, json, redirect, render_template, session, url_for, request
import util.database as db

app = Flask("__main__")

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/register')
def register():
    return render_template('register.html')
@app.route('/auth', methods=['POST'])
def auth():
    user = request.form.get("user")
    paswrd = request.form.get('pass')
    db.register(user, paswrd)
    return redirect(url_for('home'))

if __name__ == "__main__":
    app.debug = True
    app.run()
