import sqlite3

LOGINS = "LOGINS"

print('Database works')

def register(username, password):
    print(username)
    CONNECT = sqlite3.connect('./data/database.db')
    CURSOR = CONNECT.cursor()
    CURSOR.execute(f"CREATE TABLE IF NOT EXISTS {LOGINS}(user TEXT, pass TEXT, id INTEGER)")
    print(f"SELECT * FROM {LOGINS} WHERE user = {username}")
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