from bs4 import BeautifulSoup
import requests
import sqlite3 as sq
import random
from geopy.geocoders import Nominatim


url = 'https://dom.mingkh.ru/avarijnye/sverdlovskaya-oblast/ekaterinburg/'
response = requests.get(url)
html_content = response.content

conn = sq.connect('db.sqlite3')
cur = conn.cursor()

soup = BeautifulSoup(html_content, 'html.parser')

table = soup.find('table')

loc = Nominatim(user_agent="GetLoc")

id = 0

for row in table.find_all('tr'):
    id += 1
    cells = row.find_all(['td', 'th'])
    adress = cells[1].text.strip()
    square = cells[8].text.strip()

    getLoc = loc.geocode(adress)
    latitude = getLoc.latitude
    longitude = getLoc.longitude

    priceTemp = random.randint(100000, 200000)
    price = float(priceTemp)
    cur.execute("INSERT INTO map_adresses (id, square, price, latitude, longitude) VALUES (?,?,?,?,?);",
                (id, square, price, latitude,longitude))
    conn.commit()




