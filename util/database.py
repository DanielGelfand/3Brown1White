import sqlite3
import os, datetime, random

LOGINS = "LOGINS"
FINANCE = "FINANCES"
LOSE = "SACRIFICES"
GOALS = "GOALS"
IMAGES = "IMAGES"
EXPENSES = "EXPENDITURES"
MONTHLY = "MONTHLY"
STAMPS = "TIMESTAMPS"

print('Database works')
DIR=os.path.dirname(__file__)
DIR=DIR[:len(DIR)-5]
DIR+="/data/database.db"
print(DIR)
CONNECT = sqlite3.connect(DIR)
CURSOR = CONNECT.cursor()
CURSOR.execute(f"CREATE TABLE IF NOT EXISTS {LOGINS}(user TEXT, pass TEXT, id INTEGER)")
CURSOR.execute(f"CREATE TABLE IF NOT EXISTS {FINANCE}(current_balance REAL, income REAL, id INTEGER)")
CURSOR.execute(f"CREATE TABLE IF NOT EXISTS {EXPENSES}(expense TEXT, cost REAL, id INTEGER)")
CURSOR.execute(f"CREATE TABLE IF NOT EXISTS {LOSE}(suggested0 INTEGER, suggested1 INTEGER, suggested2 INTEGER, custom REAL, id INTEGER)")
CURSOR.execute(f"CREATE TABLE IF NOT EXISTS {GOALS}(name TEXT, cost REAL, perc REAL, id INTEGER)")
CURSOR.execute(f"CREATE TABLE IF NOT EXISTS {IMAGES}(goal TEXT, goal_alt TEXT, id INTEGER)") # can be expanded later on
CURSOR.execute(f"CREATE TABLE IF NOT EXISTS {MONTHLY}(monthly_expense TEXT, cost REAL, id INTEGER)")
CURSOR.execute(f"CREATE TABLE IF NOT EXISTS {STAMPS}(date TEXT, id INTEGER)")
CONNECT.commit()
CONNECT.close()

def register(username, password):
    """
    Registers the user in the database with the given password.
    Returns False if user is already in database, True otherwise
    """
    print(username)
    CONNECT = sqlite3.connect(DIR)
    CURSOR = CONNECT.cursor()
    CURSOR.execute(f"SELECT * FROM {LOGINS}")
    wait = CURSOR.fetchall()
    user_list = [x[0] for x in wait]
    id_nums = [x[-1] for x in wait]
    print(user_list)
    if username not in user_list:
        print('Username not in table')
        num = int(random.random() * 10000)
        while num in id_nums:
            num = int(random.random() * 10000)
        CURSOR.execute(f"INSERT INTO {LOGINS} VALUES(\"{username}\", \"{password}\", \"{num}\")")
    else:
        print('Username in table')
        return False
    CONNECT.commit()
    CONNECT.close()
    return True

def search_user_list(*args, ret_all=False):
    """
    Searches the user logins table for the given arguments.
    Returns a list of tuples that contain the arguments.
    """
    CONNECT = sqlite3.connect(DIR)
    CURSOR = CONNECT.cursor()
    CURSOR.execute(f"SELECT * FROM {LOGINS}")
    query_list = CURSOR.fetchall()
    if ret_all:
        return [ x for x in query_list ]
    return [x for x in query_list for a in args if a in x]

def update_user_list(user, pwd, id_num, rem=False):
    if rem: # remove from table
        CONNECT = sqlite3.connect(DIR)
        CURSOR = CONNECT.cursor()
        # complete erase
        CURSOR.execute(f"DELETE FROM {LOGINS} WHERE id = \"{id_num}\"")
        CURSOR.execute(f"DELETE FROM {FINANCE} WHERE id = \"{id_num}\"")
        CURSOR.execute(f"DELETE FROM {LOSE} WHERE id = \"{id_num}\"")
        CURSOR.execute(f"DELETE FROM {GOALS} WHERE id = \"{id_num}\"")
        CURSOR.execute(f"DELETE FROM {IMAGES} WHERE id = \"{id_num}\"")
        CURSOR.execute(f"DELETE FROM {EXPENSES} WHERE id = \"{id_num}\"")
        CURSOR.execute(f"DELETE FROM {MONTHLY} WHERE id = \"{id_num}\"")
        CURSOR.execute(f"DELETE FROM {STAMPS} WHERE id = \"{id_num}\"")
        CONNECT.commit()
        CONNECT.close()
        return id_num
    else:
        CONNECT = sqlite3.connect(DIR)
        CURSOR = CONNECT.cursor()
        CURSOR.execute(f"UPDATE {LOGINS} SET user = \"{user}\", pass = \"{pwd}\" WHERE id = \"{id_num}\"")
        CONNECT.commit()
        CONNECT.close()
        return id_num
def search_finance_list(*args):
    """
    Searches the finances table for the given arguments.
    Returns a list of tuples that contain the arguments.
    """
    CONNECT = sqlite3.connect(DIR)
    CURSOR = CONNECT.cursor()
    CURSOR.execute(f"SELECT * FROM {FINANCE}")
    query_list = CURSOR.fetchall()
    return [ x for x in query_list for a in args if a in x ]

def search_expense_list(*args, ret_all=False, is_id=False):
    """
    Searches the expenses table for the given arguments.
    If is_id is specified, treats the given arguments as ID numbers.
    is_id defaults to False.
    Returns a list of tuples that contain the arguments.
    """
    CONNECT = sqlite3.connect(DIR)
    CURSOR = CONNECT.cursor()
    CURSOR.execute(f"SELECT * FROM {EXPENSES}")
    query_list = CURSOR.fetchall()
    if ret_all:
        return [ x for x in query_list ]
    if is_id:
        return [ x for x in query_list for a in args if a == x[2] ] # the given input was an id
    return [ x for x in query_list for a in args if a in x ]

def search_monthly_list(*args, ret_all=False, is_id=False):
    """
    Searches the monthly expenditures table for the given arguments.
    If is_id is specified, treats the given arguments as ID numbers.
    is_id defaults to False.
    Returns a list of tuples that contain the arguments.
    """
    CONNECT = sqlite3.connect(DIR)
    CURSOR = CONNECT.cursor()
    CURSOR.execute(f"SELECT * FROM {MONTHLY}")
    query_list = CURSOR.fetchall()
    if ret_all:
        return [ x for x in query_list ]
    if is_id:
        return [ x for x in query_list for a in args if a == x[2] ]
    return [ x for x in query_list for a in args if a in x ]

def search_sacrifice_list(*args, ret_all=False):
    """
    Searches the sacrifices table for the given arguments.
    Returns a list of tuples that contain the arguments.
    """
    CONNECT = sqlite3.connect(DIR)
    CURSOR = CONNECT.cursor()
    CURSOR.execute(f"SELECT * FROM {LOSE}")
    query_list = CURSOR.fetchall()
    if ret_all:
        return [ x for x in query_list ]
    return [ x for x in query_list for a in args if a in x ]

def search_goal_list(*args, ret_all=False):
    """
    Searches the goals table for the given arguments.
    Returns a list of tuples that contain the arguments.
    """
    CONNECT = sqlite3.connect(DIR)
    CURSOR = CONNECT.cursor()
    CURSOR.execute(f"SELECT * FROM {GOALS}")
    query_list = CURSOR.fetchall()
    if ret_all:
        return [ x for x in query_list ]
    return [ x for x in query_list for a in args if a in x ]
    

def search_image_list(*args, ret_all=False):
    """
    Searches the images table for the given arguments.
    Returns a list of tuples that contain the arguments.
    """
    CONNECT = sqlite3.connect(DIR)
    CURSOR = CONNECT.cursor()
    CURSOR.execute(f"SELECT * FROM {IMAGES}")
    query_list = CURSOR.fetchall()
    if ret_all:
        return [ x for x in query_list ]
    return [ x for x in query_list for a in args if a in x ]

def search_time_list(*args, ret_all=False):
    """
    Searches the timestamps table for the given arguments.
    Returns a list of tuples that contain the arguments.
    """
    CONNECT = sqlite3.connect(DIR)
    CURSOR = CONNECT.cursor()
    CURSOR.execute(f"SELECT * FROM {STAMPS}")
    query_list = CURSOR.fetchall()
    if ret_all:
        return [ x for x in query_list ]
    return [ x for x in query_list for a in args if a in x ]

def reset_statistics(id_num, items:dict):
    for b in items:
        if items[b]:
            CONNECT = sqlite3.connect(DIR)
            CURSOR = CONNECT.cursor()
            CURSOR.execute(f"DELETE FROM {b} WHERE id = \"{id_num}\"")
            if b == FINANCE:
                CURSOR.execute(f"DELETE FROM {EXPENSES} WHERE id = \"{id_num}\"")
                CURSOR.execute(f"DELETE FROM {MONTHLY} WHERE id = \"{id_num}\"")
            if b == GOALS:
                CURSOR.execute(f"DELETE FROM {IMAGES} WHERE id = \"{id_num}\"")
                CURSOR.execute(f"DELETE FROM {STAMPS} WHERE id = \"{id_num}\"")
            CONNECT.commit()
            CONNECT.close()
    return id_num
def add_finances(balance, cost, income, expenses, id_num):
    """
    Adds the given balance, costs, income, and expense to the database under the given ID.
    Writes the given data to a CSV file.
    Returns the ID number of the user.
    """
    CONNECT = sqlite3.connect(DIR)
    CURSOR = CONNECT.cursor()
    CURSOR.execute(f"SELECT * FROM {FINANCE}")
    finance_list = CURSOR.fetchall()
    user_ids = [ x[-1] for x in finance_list ]
    data = search_finance_list(id_num)
    file=f'static/finance.csv'
    try:
        with open(file) as f:
            lines = f.readlines()
            f.close()
    except:
        with open(file, 'a') as f: # creates the file
            f.write(f"balance,mcost,income,dexpense,id_num\n")
            f.close()
    mcost="".join(str(cost).split(","))
    print("stuff",mcost)
    dexpense="".join(str(expenses).split(","))
    if id_num in user_ids:
        CURSOR.execute(f"UPDATE {FINANCE} SET current_balance = \"{balance}\", income = \"{income}\" WHERE id = \"{id_num}\"")
        with open(file, "r") as f:
            lines = f.readlines()
        # For some reason, I keep getting a UnboundLocalError on str()
        with open(file, "w") as f:
            for line in lines:
                if str(id_num) != line.strip("\n").split(",")[-1]:
                    f.write(line)
            f.write(f"{balance},{mcost},{income},{dexpense},{id_num}\n")
            f.close()
    else:
        CURSOR.execute(f"INSERT INTO {FINANCE} VALUES(\"{balance}\", \"{income}\", \"{id_num}\")")
        with open(file, 'a') as f:
            f.write(f"{balance},{mcost},{income},{dexpense},{id_num}\n")
            f.close()
    CURSOR.execute(f"SELECT * FROM {EXPENSES}")
    expense_list = CURSOR.fetchall()
    print(expense_list)
    print(finance_list)
    print(expenses)
    a = [ x for x in expense_list for w in expenses if w in x and x[2] == id_num ]
    s = [x[0] for x in a]
    CURSOR.execute(f"DELETE FROM {EXPENSES} WHERE id = \"{id_num}\"")
    for name in expenses:
        CURSOR.execute(f"INSERT INTO {EXPENSES} VALUES(\"{name}\", \"{expenses[name]}\", \"{id_num}\")")
    CURSOR.execute(f"SELECT * FROM {MONTHLY}")
    monthly_list = CURSOR.fetchall()
    print(monthly_list)
    a = [ x for x in monthly_list for w in cost if w in x and x[2] == id_num ]
    s = [ x[0] for x in a ]
    CURSOR.execute(F"DELETE FROM {MONTHLY} WHERE id = \"{id_num}\"")
    for name in cost:
        CURSOR.execute(f"INSERT INTO {MONTHLY} VALUES(\"{name}\", \"{cost[name]}\", \"{id_num}\")")
    CONNECT.commit()
    CONNECT.close()
    return id_num

def add_goals(name, price, percent, id_num):
    """
    Adds the name and price to the database under the given ID number.
    Returns the ID number of the user.
    """
    CONNECT = sqlite3.connect(DIR)
    CURSOR = CONNECT.cursor()
    CURSOR.execute(f"SELECT * FROM {GOALS}")
    goal_list = CURSOR.fetchall()
    user_ids = [ x[-1] for x in goal_list ]
    print(user_ids)
    print(id_num)
    file=f'static/goals.csv'
    try:
        with open(file) as f: # if readable, file already exists
            print("File found, not creating...")
            lines = f.readlines()
            f.close()
    except Exception as e:
        print(e)
        with open(file, 'a+') as f: # creates the file
            print("File not found, creating...")
            f.write(f"id,name,price,date,percentage\n")
            f.close()
    if id_num in user_ids:
        print("ID is in user_id")
        CURSOR.execute(f"UPDATE {GOALS} SET name = \"{name}\", cost = \"{price}\", perc = \"{percent}\" WHERE id = \"{id_num}\"")
        CURSOR.execute(f"UPDATE {STAMPS} SET date = \"{datetime.date.today()}\" WHERE id = \"{id_num}\" ")
        with open(file, "r") as f:
            lines = f.readlines()
        with open(file, "w") as f:
            for line in lines:
                if str(id_num) != line.strip("\n").split(",")[0]:
                    f.write(line)
            f.write(f"{id_num},{name},{price},{datetime.date.today()},{percent}\n")
            f.close()
    else:
        CURSOR.execute(f"INSERT INTO {GOALS} VALUES(\"{name}\", \"{price}\", \"{percent}\", \"{id_num}\")")
        CURSOR.execute(f"INSERT INTO {STAMPS} VALUES(\"{datetime.date.today()}\", \"{id_num}\")")
        with open(file, "a") as f:
            f.write(f"{id_num},{name},{price},{datetime.date.today()},{percent}\n")
            f.close()
    CONNECT.commit()
    CONNECT.close()
    return id_num

def add_images(goal, goal_alt, id_num):
    """
    Adds the goal image and alternative text to the database under the given ID number.
    Returns the ID number of the user.
    """
    CONNECT = sqlite3.connect(DIR)
    CURSOR = CONNECT.cursor()
    CURSOR.execute(f"SELECT * FROM {IMAGES}")
    image_list = CURSOR.fetchall()
    user_ids = [ x[-1] for x in image_list ]
    if id_num in user_ids:
        print("id in user ids")
        CURSOR.execute(f"UPDATE {IMAGES} SET goal = \"{goal}\", goal_alt = \"{goal_alt}\" WHERE id = \"{id_num}\"")
    else:
        CURSOR.execute(f"INSERT INTO {IMAGES} VALUES(\"{goal}\", \"{goal_alt}\", \"{id_num}\")")
    CONNECT.commit()
    CONNECT.close()
    return id_num
