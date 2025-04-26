# Onetime setup

cd
python3 -m venv fastapi_env
source ~/python_fe_env/bin/activate

pip install flask


# Folder Structure
fe2/
│── app.py               # Main Flask application
│── templates/
│   └── index.html       # HTML file
│── static/
│   ├── style.css        # CSS file
│   └── script.js        # JavaScript file

### Automation of creation of the director files. 
 cd code/vj-servers/frontend/fe2/
 touch app.py
 mkdir templates
 touch templates/index.html
 mkdir static 
 touch static/style.css
 touch static/script.js


# How to run the frontend server

source ~/python_fe_env/bin/activate

cd ~/code/vj-servers/frontend/fe2/
python app.py