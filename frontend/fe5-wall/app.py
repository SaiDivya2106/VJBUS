from flask import Flask, render_template
import pandas as pd
import time
import requests
from io import StringIO
from flask_caching import Cache

app = Flask(__name__)

# Configure caching (simple in-memory cache)
app.config["CACHE_TYPE"] = "simple"
app.config["CACHE_DEFAULT_TIMEOUT"] = 120  # 2-minute caching
cache = Cache(app)

GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/14hey-KIdpDL00qnID0jE9HlKzEVu7s8f2PC_rXwLxMY/gviz/tq?tqx=out:csv&gid=616528629"

@cache.cached(timeout=120)  # Cache the function result for 2 minutes
def fetch_google_sheet_data():
    """
    Fetches data from Google Sheets with a retry mechanism and caches it for 2 minutes.
    """
    try:
        for attempt in range(3):  # Try up to 3 times
            try:
                response = requests.get(GOOGLE_SHEET_CSV_URL, timeout=10)
                response.raise_for_status()  # Raise error for HTTP issues
                df = pd.read_csv(StringIO(response.text), encoding="utf-8")
                break  # Success, exit loop
            except Exception as e:
                print(f"Attempt {attempt + 1}: Retrying due to error: {e}")
                time.sleep(3)  # Wait before retrying
        else:
            raise Exception("Failed to load Google Sheet after multiple attempts")

        # Define expected columns
        expected_columns = [
            "Timestamp", "Name", "Roll Number", "Branch", "Year of Study", 
            "Message Received Date", "Message Source", "Sender Name", "Sender Contact", 
            "Message Category", "Scam Indicators", "Response Given", "Personal Data Taken", 
            "Legitimacy Score", "Additional Info", "Verification Status"
        ]

        # Rename columns dynamically to handle Google Sheet structure changes
        df.columns = expected_columns[:len(df.columns)]

        # Fill missing 'Verification Status' values
        if "Verification Status" in df.columns:
            df["Verification Status"] = df["Verification Status"].fillna("Under Review")

        return df
    except Exception as e:
        print(f"Error fetching data: {e}")
        return None

@app.route("/")
def home():
    df = fetch_google_sheet_data()
    if df is None:
        return "<h3>Error loading data. Please try again later.</h3>"
    return render_template("index.html", df=df)

if __name__ == "__main__":
    cache.init_app(app)  # Initialize caching
    app.run(host="0.0.0.0", port=3105, debug=True)
