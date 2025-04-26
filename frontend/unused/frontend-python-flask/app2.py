from flask import Flask, render_template, request, redirect, url_for, session, flash
import requests
import json
import jwt
from jwt.exceptions import ExpiredSignatureError, DecodeError


app = Flask(__name__)
app.secret_key = 'your_secret_key_here'  # Change this to a secure key

# API Configuration
BASE_URI = "https://automation.vnrvjiet.ac.in/eduprime3sandbox/api/"
API_KEY = "1234567890"

@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        # API Request for authentication
        url = f"{BASE_URI}Auth/Validate"
        headers = {
            "APIKey": API_KEY,
            "Content-Type": "application/json"
        }
        payload = json.dumps({"UserName": username, "Password": password})
        response = requests.post(url, headers=headers, data=payload)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('Status') == 1:
                session['token'] = data.get('Data')  # Store authentication token
                session['username'] = username
                flash("Login successful!", "success")
                return redirect(url_for('dashboard'))
            else:
                flash("Invalid credentials. Please try again.", "danger")
        else:
            flash("Error connecting to the authentication server.", "danger")
    
    return render_template('login.html')

@app.route('/dashboard')
def dashboard():
    if 'token' not in session:
        flash("Please log in first.", "warning")
        return redirect(url_for('login'))
    
    token = session['token']
    
    try:
        decoded_token = jwt.decode(token, options={"verify_signature": False})  # Disable verification for inspection
    except jwt.ExpiredSignatureError:
        decoded_token = "Token has expired."
    except jwt.DecodeError:
        decoded_token = "Invalid token format."
    
    return f"Welcome {session['username']}!<br>Your token:<br><code>{token}</code><br><br>Decoded Token:<br><pre>{decoded_token}</pre>"
@app.route('/logout')
def logout():
    session.clear()
    flash("Logged out successfully.", "info")
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True, port=3002)

