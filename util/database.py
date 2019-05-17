import sqlite3
import os

LOGINS = "LOGINS"
FINANCE = "FINANCES"
LOSE = "SACRIFICES"
GOALS = "GOALS"

print('Database works')
DIR=os.path.dirname(__file__)
DIR=DIR[:len(DIR)-5]
DIR+="/data/database.db"
print(DIR)
CONNECT = sqlite3.connect(DIR)
CURSOR = CONNECT.cursor()
CURSOR.execute(f"CREATE TABLE IF NOT EXISTS {LOGINS}(user TEXT, pass TEXT, id INTEGER)") # table is always there
CURSOR.execute(f"CREATE TABLE IF NOT EXISTS {FINANCE}(current_balance REAL, monthly_costs REAL, income INTEGER, id INTEGER)")
CURSOR.execute(f"CREATE TABLE IF NOT EXISTS {LOSE}(suggested0 INTEGER, suggested1 INTEGER, suggested2 INTEGER, custom REAL, id INTEGER)")
CURSOR.execute(f"CREATE TABLE IF NOT EXISTS {GOALS}(name TEXT, cost REAL, id INTEGER)")
CONNECT.commit()
CONNECT.close()

def register(username, password):
    print(username)
    CONNECT = sqlite3.connect(DIR)
    CURSOR = CONNECT.cursor()
    # print(f"SELECT * FROM {LOGINS} WHERE user = {username}")
    try:
        CURSOR.execute(f"SELECT * FROM {LOGINS} WHERE user = {username}")
    except:
        # print(e)
        CURSOR.execute(f"SELECT * FROM {LOGINS}")
    user_list = [x[0] for x in CURSOR.fetchall()]
    print(user_list)
    if username not in user_list:
        print('Username not in table')
        CURSOR.execute(f"INSERT INTO {LOGINS} VALUES(\"{username}\", \"{password}\", \"{len(user_list) + 1}\")")
    else:
        print('Username in table')
        return False
    CONNECT.commit()
    CONNECT.close()
    return True

def search_user_list(*args):
    CONNECT = sqlite3.connect(DIR)
    CURSOR = CONNECT.cursor()
    CURSOR.execute(f"SELECT * FROM {LOGINS}")
    query_list = CURSOR.fetchall()
    return [x for x in query_list for a in args if a in x]

def search_finance_list(*args):
    CONNECT = sqlite3.connect(DIR)
    CURSOR = CONNECT.cursor()
    CURSOR.execute(f"SELECT * FROM {FINANCE}")
    query_list = CURSOR.fetchall()
    return [ x for x in query_list for a in args if a in x ]

def search_sacrifice_list(*args):
    CONNECT = sqlite3.connect(DIR)
    CURSOR = CONNECT.cursor()
    CURSOR.execute(f"SELECT * FROM {LOSE}")
    query_list = CURSOR.fetchall()
    return [ x for x in query_list for a in args if a in x ]

def search_goal_list(*args):
    CONNECT = sqlite3.connect(DIR)
    CURSOR = CONNECT.cursor()
    CURSOR.execute(f"SELECT * FROM {GOALS}")
    query_list = CURSOR.fetchall()
    return [ x for x in query_list for a in args if a in x ]
