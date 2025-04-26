from flask import Flask, render_template

app = Flask(__name__, static_folder="static", template_folder="templates")

# Route for home page
@app.route("/")
def home():
    return render_template("index.html")

# Run Flask on port 3001
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3001, debug=True)
