import pynput.keyboard
import mysql.connector
import pyperclip

conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="novelread"
)

cursor = conn.cursor()
number = 54

def increment_number():
    global number
    number += 1

def on_press(key):
    if key == pynput.keyboard.KeyCode(char='k'):
        increment_number()
        copied_text = pyperclip.paste()
        cursor.execute("INSERT INTO capitulos (titulo, numero, marcado, capitulo, id_Novelas) VALUES (%s, %s, %s, %s, %s)",  ("Capitulo: ", number, "0", copied_text, "7"))
        conn.commit()
        print("Se subio el capitulo: ", number)

with pynput.keyboard.Listener(on_press=on_press) as listener:
    listener.join()

conn.close()
