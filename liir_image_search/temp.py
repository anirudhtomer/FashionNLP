__author__ = 'atomer'

import sqlite3

# Create a database in RAM

db = sqlite3.connect('F:/wor/liir.susana/NLPImageSearch/liir_image_search/database.sqlite')



cursor = db.cursor()
cursor.execute('''
    CREATE TABLE users(id INTEGER PRIMARY KEY, name TEXT,
                       phone TEXT, email TEXT unique, password TEXT)
''')
db.commit()


cursor.execute("SELECT * FROM sqlite_master WHERE type='table' AND name='" + 'users' + "'")
all_rows = cursor.fetchall()
print(len(all_rows))
for row in all_rows:
    # row[0] returns the first column in the query (name), row[1] returns email column.
    print('{0} : {1}, {2}'.format(row[0], row[1], row[2]))


cursor = db.cursor()
name1 = 'Andres'
phone1 = '3366858'
email1 = 'user@example.com'
# A very secure password
password1 = '12345'

name2 = 'John'
phone2 = '5557241'
email2 = 'johndoe@example.com'
password2 = 'abcdef'

# Insert user 1
cursor.execute('''INSERT INTO users(id, name, phone, email, password)
                  VALUES(?,?,?,?,?)''', (1, name1, phone1, email1, password1))
print('First user inserted')

# Insert user 2
cursor.execute('''INSERT INTO users(id, name, phone, email, password)
                  VALUES(?,?,?,?,?)''', (2, name2, phone2, email2, password2))
print('Second user inserted')

db.commit()

cursor.execute("UPDATE users SET name=:who where id=:idee", {'who': 'Anirudh', 'idee':2})

cursor.execute("SELECT id, name, email, phone FROM users where name=:who", {'who': 'Anirudh'})
row=cursor.fetchone()
print(row[1])



cursor.execute("SELECT id, name, email, phone FROM users")
all_rows = cursor.fetchall()
for row in all_rows:
    # row[0] returns the first column in the query (name), row[1] returns email column.
    print('{0} : {1}, {2}'.format(row[0], row[1], row[2]))
