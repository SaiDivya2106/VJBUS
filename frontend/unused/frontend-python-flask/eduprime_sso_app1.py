from flask import Flask, redirect, url_for, session, request, jsonify, render_template, flash
import requests
import jwt
import os

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "super_secret_key")  # Change in production

# Configurations
SSO_SERVER = "http://10.45.30.252:5001"  # Change if hosted elsewhere
# JWT_SECRET = os.getenv("JWT_SECRET", "your_jwt_secret")

@app.route('/')
def home():
    if 'token' in session:
        return redirect(url_for('dashboard'))
    return render_template('login.html')

@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')
    print("Got username, pwd")
    if not username or not password:
        flash("Please enter username and password", "danger")
        return redirect(url_for('home'))
    print("valid names")
    response = requests.post(f"{SSO_SERVER}/auth/eduprime", json={"username": username, "password": password})
    print("Got response")
    if response.status_code == 200:
        data = response.json()
        session['token'] = data.get('token')
        session['token1'] = data.get('token')
        session['token2'] = data.get('token')
        session['token3'] = data.get('token')
        flash("Login successful!", "success")
        return redirect(url_for('dashboard'))
    else:
        flash("Login failed. Check credentials.", "danger")
        return redirect(url_for('home'))

@app.route('/dashboard')
def dashboard():
    if 'token' not in session:
        flash("Please log in first.", "warning")
        return redirect(url_for('home'))
    
    headers = {"Authorization": f"Bearer {session['token']}"}
    response = requests.get(f"{SSO_SERVER}/auth/profile", headers=headers)
    
    if response.status_code == 200:
        user_data = response.json()
        return render_template('dashboard.html', user=user_data)
    else:
        flash("Session expired, please log in again.", "danger")
        session.pop('token', None)
        return redirect(url_for('home'))

@app.route('/logout')
def logout():
    session.pop('token', None)
    flash("Logged out successfully.", "info")
    return redirect(url_for('home'))

if __name__ == '__main__':
    app.run(debug=True, port=3001)
