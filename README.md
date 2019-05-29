# 3Brown1White

## Roster: Daniel Gelfand, Ahnaf Hasan, Mohammad Jamil and Jabir Chowdhury

## Overview 

Our project is a money manager application to get your finances on track. Use our tools to input your goals such as a dream car or vacation. Using your financial information such as income, balance, and daily expenditures, we suggest what can be cut out to get you to your goal faster than ever!

## Launch Instructions

### Install and run on localhost

1. Clone the repo
    * ssh - `git@github.com:DanielGelfand/3Brown1White.git`
    * https - `https://github.com/DanielGelfand/3Brown1White.git`
2. `$ cd 3Brown1White`
   * Move to root of repo
3. `pip install -r requirements.txt`
    * Install the requirements for the project
4.  `$ . location_of_venv/venv_name/bin/activate`
    * Activate your virtual environment
5. `$ python3 app.py`
    * Start the website
7. Open up your browser and type [127.0.0.1:5000](http://127.0.0.1:5000/)
    * Load app in browser and enjoy

### Install and run on Apache2

1. SSH into your droplet with `ssh <user>@<ip address>`
2. Move to the www directory: `cd ../../var/www`
3. Create a directory named after your app and then cd into it
    * `mkdir <appname>`
    * `cd <appname>`
4. Create the <appname>.wsgi file
5. Clone the repo `git clone https://github.com/DanielGelfand/3Brown1White.git <appname>`
6. Move into the project repo, rename app.py to __init__.py and install the requirement from requirements.txt
    * `cd appname`
    * `mv app.py __init__.py`
    * `pip3 install -r requirements.txt`
7. Move to sites-enabled directory and make a config file with path /etc/apache2/sites-enabled/<appname>.conf
8. Run `a2ensite <appname>`
9. Restart the server with `sudo service apache2 restart`
10. Go to your droplet's ip address on your browser

 ## How To Procure API Keys?

 * Pixabay - Create an AirVisual account and generate a key from your dashboard.
    * [Sign up here](https://pixabay.com/service/about/api/)
    * Copy and paste given key into the value corresponding to "Pixabay" of data/keys.json


