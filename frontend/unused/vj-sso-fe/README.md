## One Time Setup

npm create vite@latest vj-sso-fe -- --template react

cd vj-sso-fe
npm install
npm run dev


npx create-react-app vj-sso-fe


npm install axios react-router-dom



# React SSO Login App

This project is a **Reusable Single Sign-On (SSO) Login Application** built using **React and Vite**. It can be used across multiple frontend applications to provide a centralized authentication system.

---

## 📌 Features
- 🔐 **Centralized Authentication**: Works with the Flask SSO backend.
- 🚀 **Reusable Across Multiple React Apps**.
- ✅ **Session Management** using cookies.
- 🔄 **Auto Redirect After Login**.
- 📡 **Vite for Fast Development**.

---

## 🛠️ Installation & Setup

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/head-iie/vj-servers.git
cd vj-servers/frontend
cd sso-login-app
```

### **2️⃣ Install Dependencies**
```sh
npm install
```

### **3️⃣ Configure the API URL**
- Open `src/context/AuthContext.jsx`
- Update `API_URL` to point to your Flask SSO backend:
```js
const API_URL = "http://localhost:5000/api"; // Change if backend runs elsewhere
```

### **4️⃣ Run the Application**
```sh
npm run dev
```
Access the app at **`http://localhost:5173/`**

---

## 🚀 Deployment

### **Using Vite Build**
```sh
npm run build
```
Then, serve the built files:
```sh
npm run serve
```

---

## 📡 Folder Structure
```
sso-login-app/
│── src/
│   │── components/
│   │   │── Login.jsx
│   │   │── LogoutButton.jsx
│   │── context/
│   │   │── AuthContext.jsx
│   │── pages/
│   │   │── Home.jsx
│   │   │── Redirecting.jsx
│   │── App.jsx
│   │── main.jsx
│   └── index.css
│── public/
│   │── index.html
│── package.json
│── vite.config.js
│── README.md
```

---

## 📜 License
This project is licensed under the **MIT License**.

---

## 📞 Contact
For support, contact **your-email@example.com**.

Happy Coding! 🚀