import requests
from dotenv import load_dotenv
import os

# Wczytaj zmienne środowiskowe
load_dotenv()
app_key = os.getenv('EMAILLABS_APP_KEY')
app_secret = os.getenv('EMAILLABS_APP_SECRET')

# Funkcja wysyłająca wiadomości e-mail
def send_email(subject, recipient, content):
    url = 'https://api.emaillabs.net.pl/api/v2.1/sendmail'
    headers = {
        'Content-Type': 'application/json',
        'X-EmailLabs-AppKey': app_key,
        'X-EmailLabs-Signature': app_secret
    }
    data = {
        'to': [recipient],
        'subject': subject,
        'html': content,
        'from': 'kontakt@braid-hair-glamour.com'
    }
    response = requests.post(url, json=data, headers=headers)
    return response.status_code, response.json()
