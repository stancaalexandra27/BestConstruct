from flask import Flask, request
from flask_mysqldb import MySQL
from flask_cors import CORS
import hashlib
import MySQLdb
import json
import smtplib
import requests
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import random

smtp_server = 'smtp.mailersend.net'
port = 587
sender_email = 'MS_6ejtnc@trial-vywj2lp82pkg7oqz.mlsender.net'
sender_password = 'mlsn.cffef6ed91070dcc8454779064cd17b8d9b32568c67b03485cbf6d83799c9217'

app = Flask(__name__)
CORS(app)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'construction_services'

mysql = MySQL(app)

std_err_msg = 'Am intampinat o eroare. Va rugam sa incercati din nou.'

@app.route('/')
def hello_world():
    return 'Hello, World!'


@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        email = data['email']
        password = data['password']
        first_name = data['first_name']
        last_name = data['last_name']
        firm = data['firm']
        role = ''

        if firm:
            role = 'firm'
        else:
            role = 'client'

        curs = mysql.connection.cursor()
        curs.execute('SELECT * FROM users WHERE email = %s', (email,))

        if curs.fetchone():
            return {
                'status': True,
                'registered': False,
                'message': 'Adresa de email este deja folosita.',
                'error': ''
            }

        hashed_password = hashlib.sha256(password.encode()).hexdigest()

        curs.execute('INSERT INTO users (email, password, first_name, last_name, role) VALUES (%s, %s, %s, %s, %s)', (email, hashed_password, first_name, last_name, role))
        mysql.connection.commit()
        curs.close()

        return {
            'status': True,
            'registered': True,
            'message': 'Contul a fost creat cu succes.',
            'error': ''
        }
    except Exception as e:
        return {
            'status': False,
            'registered': False,
            'message': std_err_msg,
            'error': str(e)
        }


@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        email = data['email']
        password = data['password']

        hashed_password = hashlib.sha256(password.encode()).hexdigest()

        curs = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        curs.execute('SELECT * FROM users WHERE email = %s AND password = %s', (email, hashed_password,))
        user = curs.fetchone()

        if user:
            return {
                'status': True,
                'authenticated': True,
                'id': user["id"],
                'role': user["role"],
                'message': 'Autentificare reusita.',
                'error': ''
            }
        
        return {
            'status': True,
            'authenticated': False,
            'id': 0,
            'role': '',
            'message': 'Datele de autentificare sunt incorecte.',
            'error': ''
        }
    except Exception as e:
        print(e)
        return {
            'status': False,
            'authenticated': False,
            'id': 0,
            'role': '',
            'message': std_err_msg,
            'error': str(e)
        }


@app.route('/getFirmProfile', methods=['GET'])
def get_firm_profile():
    try:
        id_user = request.args.get('id')

        curs = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        curs.execute('SELECT * FROM firm_profile WHERE id_user = %s', (id_user,))
        firm = curs.fetchone()
        curs.close()

        return {
            'status': True,
            'data': firm,
            'message': '',
            'error': ''
        }
    except Exception as e:
        return {
            'status': False,
            'data': '',
            'message': std_err_msg,
            'error': str(e)
        }


@app.route('/saveFirmProfile', methods=['POST'])
def save_firm_profile():
    try:
        data = request.json
        id_user = data['id']
        name = data['name']
        CUI = data['CUI']
        country = data['country']
        district = data['district']
        city = data['city']
        street = data['street']
        street_number = data['street_number']
        block = data['block']
        entrance = data['entrance']
        floor = data['floor']
        apartment = data['apartment']
        phone = data['phone']
        lat = data['lat']
        lng = data['lng']
        radius = data['radius']
        logo = data['logo']

        curs = mysql.connection.cursor()
        curs.execute('SELECT * FROM firm_profile WHERE id_user = %s', (id_user,))
        firm = curs.fetchone()

        if firm:
            curs.execute('UPDATE firm_profile SET name = %s, CUI = %s, country = %s, district = %s, city = %s, street = %s, street_number = %s, block = %s, entrance = %s, floor = %s, apartment = %s, phone = %s, lat = %s, lng = %s, radius = %s, logo = %s WHERE id_user = %s', (name, CUI, country, district, city, street, street_number, block, entrance, floor, apartment, phone, lat, lng, radius, logo, id_user))
        else:
            curs.execute('INSERT INTO firm_profile (id_user, name, CUI, country, district, city, street, street_number, block, entrance, floor, apartment, phone, lat, lng, radius, logo) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)', (id_user, name, CUI, country, district, city, street, street_number, block, entrance, floor, apartment, phone, lat, lng, radius, logo))
        mysql.connection.commit()
        curs.close()

        return {
            'status': True,
            'message': '',
            'error': ''
        }
    except Exception as e:
        return {
            'status': False,
            'message': std_err_msg,
            'error': str(e)
        }


@app.route('/postJob', methods=['POST'])
def post_job():
    try:
        data = request.json
        id_user = data['user_id']
        title = data['title']
        description = data['description']
        start_date = data['start_date']
        budget = data['budget']
        lat = data['lat']
        lng = data['lng']
        img1 = data['img1']
        img2 = data['img2']
        img3 = data['img3']
        img4 = data['img4']
        img5 = data['img5']
        img6 = data['img6']
        img7 = data['img7']
        img8 = data['img8']

        curs = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        curs.execute('INSERT INTO jobs (id_user, title, description, start_date, max_price, lat, lng, img1, img2, img3, img4, img5, img6, img7, img8) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)', (id_user, title, description, start_date, budget, lat, lng, img1, img2, img3, img4, img5, img6, img7, img8))
        mysql.connection.commit()

        lat = float(lat)
        lng = float(lng)

        curs.execute("""SELECT u.email FROM users u
                    JOIN firm_profile fp ON u.id = fp.id_user
                    WHERE u.role = 'firm' 
                    AND fp.lat BETWEEN (%s - fp.radius / 1000 / 111) AND (%s + fp.radius / 1000 / 111) 
                    AND fp.lng BETWEEN (%s - fp.radius / 1000 / 100) AND (%s + fp.radius / 1000 / 100)""", (lat, lat, lng, lng))
        emails = curs.fetchall()

        for email in emails:
            message = 'Un nou proiect a fost postat in zona dumneavoastra. Va rugam sa verificati aplicatia pentru mai multe detalii.'
            send_email(email['email'], message)
        curs.close()

        return {  
            'status': True,
            'message': '',
            'error': ''
        }
    except Exception as e:
        print(e)
        return {
            'status': False,
            'message': std_err_msg,
            'error': str(e)
        }


@app.route('/getJobs', methods=['GET'])
def get_jobs():
    try:
        id_user = request.args.get('id')

        curs = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        curs.execute('SELECT lat, lng, radius FROM firm_profile WHERE id_user = %s', (id_user,))
        firm = curs.fetchone()

        lat = float(firm['lat'])
        lng = float(firm['lng'])
        radius = float(firm['radius']) / 1000

        curs.execute("""SELECT * FROM jobs 
                    WHERE lat BETWEEN (%s - %s / 111) AND (%s + %s / 111) AND 
                    lng BETWEEN (%s - %s / 100) AND (%s + %s / 100)
                    AND id NOT IN (SELECT id_job FROM bids WHERE id_user = %s)""", (lat, radius, lat, radius, lng, radius, lng, radius, id_user))
        jobs = curs.fetchall()
        curs.close()

        return {
            'status': True,
            'data': jobs,
            'message': '',
            'error': ''
        }
    except Exception as e:
        return {
            'status': False,
            'data': '',
            'message': std_err_msg,
            'error': str(e)
        }


@app.route('/bid', methods=['POST'])
def bid():
    try:
        data = request.json
        id_user = data['id_user']
        id_job = data['id_job']
        price = data['price']
        days = data['days']

        curs = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        curs.execute('INSERT INTO bids (id_user, id_job, price, days) VALUES (%s, %s, %s, %s)', (id_user, id_job, price, days))

        curs.execute('SELECT email FROM users JOIN jobs ON jobs.id_user = users.id WHERE jobs.id = %s', (id_job,))
        email = curs.fetchone()['email']

        message = 'Ati primit o noua oferta pentru proiectul dumneavoastra. Va rugam sa verificati aplicatia pentru mai multe detalii.'
        send_email(email, message)

        mysql.connection.commit()
        curs.close()

        return {
            'status': True,
            'message': '',
            'error': ''
        }
    except Exception as e:
        print(e)
        return {
            'status': False,
            'message': std_err_msg,
            'error': str(e)
        }


@app.route('/getOffers', methods=['GET'])
def get_offers():
    try:
        id_user = request.args.get('id')
        
        curs = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        curs.execute('SELECT id, title, max_price, start_date FROM jobs WHERE id_user = %s', (id_user,))
        jobs = curs.fetchall()

        for job in jobs:
            curs.execute("""SELECT b.id, b.days, b.price, fp.name,
                        COALESCE((SELECT AVG(grade) FROM reviews WHERE id_firm = b.id_user), 0) as rating
                        FROM bids b
                        JOIN firm_profile fp ON fp.id_user = b.id_user
                        WHERE b.id_job = %s""", (job['id'],))
            bids = curs.fetchall()
            job['bids'] = bids
        curs.close()

        return {
            'status': True,
            'data': jobs,
            'message': '',
            'error': ''
        }
    except Exception as e:
        print(e)
        return {
            'status': False,
            'data': '',
            'message': std_err_msg,
            'error': str(e)
        }


@app.route('/acceptOffer', methods=['POST'])
def accept_offer():
    try:
        data = request.json
        id_bid = data['id_bid']

        curs = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        curs.execute("""SELECT b.id_user AS id_firm, b.days, b.price, j.id_user, j.title, j.description, j.start_date,
                    j.img1, j.img2, j.img3, j.img4, j.img5, j.img6, j.img7, j.img8, j.id AS id_job
                    FROM bids b
                    JOIN jobs j ON b.id_job = j.id
                    WHERE b.id = %s""", (id_bid,))
        bid = curs.fetchone()

        curs.execute('INSERT INTO queue (id_firm, id_user, title, description, start_date, price, days, img1, img2, img3, img4, img5, img6, img7, img8) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)', (bid['id_firm'], bid['id_user'], bid['title'], bid['description'], bid['start_date'], bid['price'], bid['days'], bid['img1'], bid['img2'], bid['img3'], bid['img4'], bid['img5'], bid['img6'], bid['img7'], bid['img8']))

        curs.execute('DELETE FROM jobs WHERE id = %s', (bid['id_job'],))

        curs.execute('SELECT email FROM users WHERE id = %s', (bid['id_firm'],))
        email = curs.fetchone()['email']

        message = 'Oferta dumneavoastra a fost acceptata. Va rugam sa verificati aplicatia pentru mai multe detalii.'
        send_email(email, message)

        mysql.connection.commit()
        curs.close()

        return {
            'status': True,
            'message': '',
            'error': ''
        }
    except Exception as e:
        print(e)
        return {
            'status': False,
            'message': std_err_msg,
            'error': str(e)
        }


@app.route('/getJobsClient', methods=['GET'])
def my_jobs_client():
    try:
        id_user = request.args.get('id')

        curs = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        curs.execute('SELECT q.*, fp.name FROM queue q JOIN firm_profile fp ON fp.id_user = q.id_firm WHERE q.id_user = %s', (id_user,))
        jobs = curs.fetchall()
        curs.close()

        return {
            'status': True,
            'data': jobs,
            'message': '',
            'error': ''
        }
    except Exception as e:
        print(e)
        return {
            'status': False,
            'data': '',
            'message': std_err_msg,
            'error': str(e)
        }



@app.route('/getFirmJobs', methods=['GET'])
def firm_jobs():
    try:
        id_user = request.args.get('id')

        curs = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        curs.execute('SELECT q.*, u.first_name, u.last_name FROM queue q JOIN users u ON u.id = q.id_user WHERE q.id_firm = %s', (id_user,))
        jobs = curs.fetchall()
        curs.close()

        return {
            'status': True,
            'data': jobs,
            'message': '',
            'error': ''
        }
    except Exception as e:
        print(e)
        return {
            'status': False,
            'data': '',
            'message': std_err_msg,
            'error': str(e)
        }



@app.route('/sendMessage', methods=['POST'])
def send_message():
    try:
        data = request.json
        id_user = data['id_user']
        id_job = data['id_job']
        message = data['message']
        timestamp = data['timestamp']

        curs = mysql.connection.cursor(MySQLdb.cursors.DictCursor)

        curs.execute('SELECT first_name, last_name, role FROM users WHERE id = %s', (id_user,))
        user = curs.fetchone()
        name = user['first_name'] + ' ' + user['last_name']
        role = user['role']

        if role == 'firm':
            curs.execute("SELECT name FROM firm_profile WHERE id_user = %s", (id_user,))
            name = curs.fetchone()['name']

        message = {
            'name': name,
            'message': message,
            'timestamp': timestamp
        }

        curs.execute('SELECT messages FROM queue WHERE id = %s', (id_job,))
        messages = curs.fetchone()['messages']

        messages = json.loads(messages)
        messages.append(message)
        messages = json.dumps(messages)

        curs.execute('UPDATE queue SET messages = %s WHERE id = %s', (messages, id_job))

        mysql.connection.commit()
        curs.close()

        return {
            'status': True,
            'message': '',
            'error': ''
        }
    except Exception as e:
        print(e)
        return {
            'status': False,
            'message': std_err_msg,
            'error': str(e)
        }


@app.route('/changeJobStatus', methods=['POST'])
def change_job_status():
    try:
        data = request.json
        id = data['id']
        status = data['status']

        curs = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        curs.execute('UPDATE queue SET status = %s WHERE id = %s', (status, id))
        mysql.connection.commit()
        curs.close()

        return {
            'status': True,
            'message': '',
            'error': ''
        }
    except Exception as e:
        print(e)
        return {
            'status': False,
            'message': std_err_msg,
            'error': str(e)
        }



@app.route('/rate', methods=['POST'])
def rate():
    try:
        data = request.json
        id_job = data['id_job']
        grade = data['grade']
        review = data['review']

        curs = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        curs.execute('SELECT id_firm FROM queue WHERE id = %s', (id_job,))
        id_firm = curs.fetchone()['id_firm']

        curs.execute('INSERT INTO reviews (id_firm, grade, review) VALUES (%s, %s, %s)', (id_firm, grade, review))

        curs.execute('SELECT id_user, id_firm, title, price, start_date, days FROM queue WHERE id = %s', (id_job,))
        job = curs.fetchone()

        curs.execute('INSERT INTO history (id_user, id_firm, title, price, start_date, days, grade) VALUES (%s, %s, %s, %s, %s, %s, %s)', (job['id_user'], job['id_firm'], job['title'], job['price'], job['start_date'], job['days'], grade))
        
        curs.execute('DELETE FROM queue WHERE id = %s', (id_job,))
        mysql.connection.commit()
        curs.close()

        return {
            'status': True,
            'message': '',
            'error': ''
        }
    except Exception as e:
        print(e)
        return {
            'status': False,
            'message': std_err_msg,
            'error': str(e)
        }


@app.route('/getHistory', methods=['GET'])
def get_history():
    try:
        id_user = request.args.get('id')

        curs = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        curs.execute('SELECT * FROM history WHERE id_firm = %s ORDER BY start_date DESC', (id_user,))
        history = curs.fetchall()
        curs.close()

        return {
            'status': True,
            'data': history,
            'message': '',
            'error': ''
        }
    except Exception as e:
        print(e)
        return {
            'status': False,
            'data': '',
            'message': std_err_msg,
            'error': str(e)
        }


@app.route('/getReviews', methods=['GET'])
def get_reviews():
    try:
        curs = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        curs.execute('SELECT r.*, fp.name, fp.logo FROM reviews r JOIN firm_profile fp ON r.id_firm = fp.id_user ORDER BY r.id_firm')
        reviews = curs.fetchall()
        curs.close()

        return {
            'status': True,
            'data': reviews,
            'message': '',
            'error': ''
        }
    except Exception as e:
        print(e)
        return {
            'status': False,
            'data': '',
            'message': std_err_msg,
            'error': str(e)
        }

@app.route('/sendCode', methods=['POST'])
def send_code():
    try:
        email = request.json.get('email')
        code = str(random.randint(100000, 999999))

        
        send_email(email, f"Codul tau de recuperare este: {code}")

        curs = mysql.connection.cursor()
        curs.execute('UPDATE users SET code = %s WHERE email = %s', (code, email))
        mysql.connection.commit()
        curs.close()

        return {
            'status': True,
            'message': 'Cod trimis cu succes',
            'error': ''
        }
    except Exception as e:
        print(e)
        return {
            'status': False,
            'message': std_err_msg,
            'error': str(e)
        }
    
@app.route('/resetPassword', methods=['POST'])
def reset_password():
    try:
        data = request.json
        email = data['email']
        code = data['code']
        new_password = data['new_password']

        curs = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        curs.execute('SELECT code FROM users WHERE email = %s', (email,))
        user_code = curs.fetchone()

        if not user_code or user_code['code'] != code:
            return {
                'status': False,
                'message': 'Invalid code',
                'error': ''
            }

        hashed_password = hashlib.sha256(new_password.encode()).hexdigest()
        curs.execute('UPDATE users SET password = %s, code = NULL WHERE email = %s', (hashed_password, email))
        mysql.connection.commit()
        curs.close()

        return {
            'status': True,
            'message': 'Parola resetata cu success',
            'error': ''
        }
    except Exception as e:
        print(e)
        return {
            'status': False,
            'message': std_err_msg,
            'error': str(e)
        }

API_KEY = 'mlsn.e5d7800b20b0d4c44d87d625ff6c2f53b8da35bdfe9edb730a3a2d5aff022949'
EMAIL = 'MS_6ejtnc@test-y7zpl98nd7045vx6.mlsender.net'
URL = 'https://api.mailersend.com/v1/email'

def send_email(email, message):
    try:
        headers = {
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "from": {
                "email": EMAIL,
                "name": "Construction Services"
            },
            "to": [
                {
                    "email": email
                }
            ],
            "subject": "Nou proiect",
            "text": message,
            "html": f"<p>{message}</p>"
        }
        response = requests.post(URL, headers=headers, json=payload)
        if response.status_code == 200 or response.status_code == 202:
            print('Email trimis cu succes.')
        else:
            print(f'Eroare la trimiterea emialului: {response.status_code} - {response.text}')
    except Exception as e:
        print(f'Error sending email: {e}')

if __name__ == '__main__':
    app.run(debug=True, port=3000)