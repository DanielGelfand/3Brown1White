import sqlite3
import os

LOGINS = "LOGINS"
FINANCE = "FINANCES"
LOSE = "SACRIFICES"
GOALS = "GOALS"
IMAGES = "IMAGES"
EXPENSES = "EXPENDITURES"

print('Database works')
DIR=os.path.dirname(__file__)
DIR=DIR[:len(DIR)-5]
DIR+="/data/database.db"
print(DIR)
CONNECT = sqlite3.connect(DIR)
CURSOR = CONNECT.cursor()
CURSOR.execute(f"CREATE TABLE IF NOT EXISTS {LOGINS}(user TEXT, pass TEXT, id INTEGER)")
CURSOR.execute(f"CREATE TABLE IF NOT EXISTS {FINANCE}(current_balance REAL, monthly_costs REAL, income REAL, id INTEGER)")
CURSOR.execute(f"CREATE TABLE IF NOT EXISTS {EXPENSES}(expense TEXT, cost REAL, id INTEGER)")
CURSOR.execute(f"CREATE TABLE IF NOT EXISTS {LOSE}(suggested0 INTEGER, suggested1 INTEGER, suggested2 INTEGER, custom REAL, id INTEGER)")
CURSOR.execute(f"CREATE TABLE IF NOT EXISTS {GOALS}(name TEXT, cost REAL, id INTEGER)")
CURSOR.execute(f"CREATE TABLE IF NOT EXISTS {IMAGES}(goal TEXT, goal_alt TEXT, id INTEGER)") # can be expanded later on
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

def search_expense_list(*args, is_id):
    CONNECT = sqlite3.connect(DIR)
    CURSOR = CONNECT.cursor()
    CURSOR.execute(f"SELECT * FROM {EXPENSES}")
    query_list = CURSOR.fetchall()
    if is_id:
        return [ x for x in query_list for a in args if a == x[2] ] # the given input was an id
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

def search_image_list(*args):
    CONNECT = sqlite3.connect(DIR)
    CURSOR = CONNECT.cursor()
    CURSOR.execute(f"SELECT * FROM {IMAGES}")
    query_list = CURSOR.fetchall()
    return [ x for x in query_list for a in args if a in x ]

def add_finances(balance, cost, income, expenses, id_num):
    CONNECT = sqlite3.connect(DIR)
    CURSOR = CONNECT.cursor()
    CURSOR.execute(f"SELECT * FROM {FINANCE}")
    finance_list = CURSOR.fetchall()
    user_ids = [ x[-1] for x in finance_list ]
    data = search_finance_list(id_num)
    file=f'static/finance.csv'
    if id_num in user_ids:
        CURSOR.execute(f"UPDATE {FINANCE} SET current_balance = \"{balance}\", monthly_costs = \"{cost}\", income = \"{income}\" WHERE id = \"{id_num}\"")
        with open(file, "r") as f:
            lines = f.readlines()
        with open(file, "w") as f:
            for line in lines:
                if line.strip("\n").split(",")[-1] != str(id_num):
                    f.write(line)
            f.write(f"{balance},{cost},{income},{expenses},{id_num}\n")
            f.close()
    else:
        CURSOR.execute(f"INSERT INTO {FINANCE} VALUES(\"{balance}\", \"{cost}\", \"{income}\", \"{id_num}\")")
        with open(file, 'a') as f:
            f.write(f"{balance},{cost},{income},{expenses},{id_num}\n")
            f.close()
    CURSOR.execute(f"SELECT * FROM {EXPENSES}")
    expense_list = CURSOR.fetchall()
    print(expense_list)
    print(finance_list)
    print(expenses)
    a = [ x for x in expense_list for w in expenses if w in x and x[2] == id_num ]
    s = [x[0] for x in a]
    CURSOR.execute(f"DELETE FROM {EXPENSES} WHERE id = \"{id_num}\"")
    file=f'static/expense.csv'
    str = f'id,{id_num}'
    for name in expenses:
        # if name not in s:
        CURSOR.execute(f"INSERT INTO {EXPENSES} VALUES(\"{name}\", \"{expenses[name]}\", \"{id_num}\")")
        str += f',{name},{expenses[name]}'
        # else:
        #     CURSOR.execute(f"UPDATE {EXPENSES} SET cost = \"{expenses[name]}\" WHERE expense = \"{name}\" AND id = \"{id_num}\"")
    with open(file, "r") as f:
            lines = f.readlines()
    with open(file, "w") as f:
         for line in lines:
            if line.strip("\n").split(",")[1] != str(id_num):
                 f.write(line)
         f.write(str+'\n')
         f.close()
    CONNECT.commit()
    CONNECT.close()
    return id_num

def add_goals(name, price, id_num):
    CONNECT = sqlite3.connect(DIR)
    CURSOR = CONNECT.cursor()
    CURSOR.execute(f"SELECT * FROM {GOALS}")
    goal_list = CURSOR.fetchall()
    user_ids = [ x[-1] for x in goal_list ]
    print(user_ids)
    print(id_num)
    if id_num in user_ids:
        print("ID is in user_id")
        CURSOR.execute(f"UPDATE {GOALS} SET name = \"{name}\", cost = \"{price}\" WHERE id = \"{id_num}\"")
    else:
        CURSOR.execute(f"INSERT INTO {GOALS} VALUES(\"{name}\", \"{price}\", \"{id_num}\")")
    CONNECT.commit()
    CONNECT.close()
    return id_num

def add_images(goal, goal_alt, id_num):
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
