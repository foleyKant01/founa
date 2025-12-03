from email.mime.image import MIMEImage
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from flask import render_template

from config.constant import *

client_id = CLIENT_ID
client_secret = CLIENT_SECRET
sender_number = SENDER_NUMBER

gmail_user = EMAIL_USER
gmail_password = EMAIL_PASSWORD


def send_mailer_update_password(email: str, u_uid: str):
    try:
        try:
            server = smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT)
            print('Connexion SMTP réussie.')
        except Exception as e:
            return {"status": "0", "error": f"Erreur lors de la connexion SMTP : {e}"}

        try:
            server.login(EMAIL_USER, EMAIL_PASSWORD)
            print('Authentification SMTP réussie.')
        except Exception as e:
            return {"status": "0", "error": f"Erreur lors de l'authentification : {e}"}

        subject = 'Changing your PIN code'
        body = render_template("update_password.html", u_uid=u_uid)

        msg = MIMEMultipart()
        msg["From"] = EMAIL_USER
        msg["To"] = email
        msg["Subject"] = subject
        msg.attach(MIMEText(body, 'html', 'utf-8'))

        with open("static/assets/logo.png", 'rb') as img_file:
            img = MIMEImage(img_file.read())
            img.add_header('Content-ID', '<logoimg>')
            img.add_header('Content-Disposition', 'inline', filename="logo.png")
            msg.attach(img)

        try:
            server.sendmail(EMAIL_USER, email, msg.as_string())
            print("Email envoyé avec succès.")
        except Exception as e:
            return {"status": "0", "error": f"Erreur lors de l'envoi de l'email : {e}"}
        finally:
            server.quit()

        return {"status": "1", "message": "Email envoyé avec succès."}

    except Exception as e:
        return {"status": "0", "error": str(e)}
    
