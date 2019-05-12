from flask import Flask, flash, json, redirect, render_template, session, url_for, request
import util.database as db

app = Flask("__main__")

@app.route('/')
def home():
    return render_template('base.html')

@app.route('/register', methods=['POST'])
def register():
    user = request.form.get("user")
    paswrd = request.form.get('pass')
    db.register(user, paswrd)
    return render_template('base.html')

if __name__ == "__main__":
    app.debug = True
    app.run()
