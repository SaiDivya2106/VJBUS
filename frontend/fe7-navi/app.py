from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")

@app.route("/e-block")
def eblock():
    return render_template("EBlock.html")

@app.route("/main-block")
def mainblock():
    return render_template("index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0",port=3107, debug=True)
