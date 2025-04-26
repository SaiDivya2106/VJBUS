from flask import Flask, redirect, request, session, jsonify
import requests

app = Flask(__name__)
app.secret_key = "your-secret-key"

AUTH_SERVER = "http://localhost:5000/auth/google"
USER_INFO_ENDPOINT = "http://localhost:5000/auth/profile"

@app.route("/")
def home():
    return '<h2>Welcome! <a href="/login">Login with Google</a></h2>'

@app.route("/login")
def login():
    return redirect(AUTH_SERVER)

@app.route("/callback")
def callback():
    token = request.args.get("token")

    if not token:
        return "Authentication failed", 401

    session["token"] = token

    # ✅ Fetch user details with the token
    headers = {"Authorization": f"Bearer {token}"}
    user_response = requests.get(USER_INFO_ENDPOINT, headers=headers)

    if user_response.status_code == 200:
        session["user"] = user_response.json()
        return redirect("/dashboard")
    else:
        print("Failed to fetch user details:", user_response.text)
        return "Failed to fetch user details", 401

@app.route("/dashboard")
def dashboard():
    user = session.get("user")
    if not user:
        return redirect("/login")
    
    return jsonify(user)

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")

if __name__ == "__main__":
    app.run(port=80, debug=True)
