# 3Brown1White

## Roster: Daniel Gelfand (PM), Ahnaf Hasan (Dealing with User Input), Mohammad Jamil (D3) and Jabir Chowdhury (Databases)

## Overview 

Our project is a money manager application to get your finances on track. Use our tools to input your goals such as a dream car or vacation. Using your financial information such as income, balance, and daily expenditures, we suggest what can be cut out to get you to your goal faster than ever!

## [Watch Our Video Demo Here](https://youtu.be/OF1cJb6Q8jk)

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
2. Move to the www directory: `cd /var/www`
3. Add write permissions. This is to ensure that nothing goes wrong.
```

chgrp -R www-data ./
chmod -R g+w ./

```
4. Clone the repo `git clone https://github.com/DanielGelfand/3Brown1White.git GreenBags`
5. Move <appname>.wsgi file outside of the repo folder to `/var/www/GreenBags/`
6. Move into the project repo, rename app.py to __init__.py and install the requirement from requirements.txt
    * `cd GreenBags`
    * `mv app.py __init__.py`
    * `pip3 install -r requirements.txt`
7. Move to sites-available directory with `cd ~/../../etc/apache2/sites-available/` 
8. Move config file to /etc/apache2/sites-available/
9. Change the server name in the GreenBags.conf file to the ip adress of your droplet
10. Run `a2ensite GreenBags`
11. Restart the server with `sudo service apache2 restart`
12. Go to your droplet's ip address on your browser

 ## How To Procure API Keys?

 * Pixabay - Create an AirVisual account and generate a key from your dashboard.
    * [Sign up here](https://pixabay.com/service/about/api/)
    * Copy and paste given key into the value corresponding to "Pixabay" of data/keys.json
    
## Required modules and plugins
* **datetime**
   * Allows for retrieval of current dates and times.
   * Include `import datetime` on the top of your python file to use the datetime module
   
* **sankey**
   * Allows for visualization of income flow
   * Download [js file](https://github.com/d3/d3-sankey/releases/tag/v0.9.1)
   * Include script tag in your html file `<script src=path/to/sankey.js></script>`
   
  


