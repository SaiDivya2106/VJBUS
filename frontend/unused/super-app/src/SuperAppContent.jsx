import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Login from "./Login"; // ✅ Import Login component

// SuperApp	🏫	Campus
// VJ Bus	🚌	Bus Tracking
// Fake News Check	📰	Fake News Detection
// Nitro	⚡	Activity & Speed
// stacKmaps	🗺️	Navigation
// Expresso	💡	Doubt Solving
// DevCore	💻	Developer Hub
// easyfind	🔎	Search & Discovery
// easyfind-admin	🛠️	Admin Panel for Search
// Innovators	🏛️	Hall Booking & Events
// Spartans	🛡️	Complaints & Security
// WEBX	📊	Project Management
// Hello	🔗	Networking & Social

 
const APPS = [

    { name: "VJ Bus", url: "https://bus.vjstartup.com/", icon: "🚌" },
    { name: "Fake News Check", url: "https://wall.vjstartup.com/", icon: "📰" },
    { name: "EasyFind", url: "https://easyfind.vjstartup.com/", icon: "🔍" },
    { name: "Undoubt", url: "https://undoubt.vjstartup.com/", icon: "🗣️" },
    { name: "Complaints", url: "https://complaints.vjstartup.com/", icon: "🧑‍⚖️" },
    { name: "Flask Demo App", url: "https://flaskapp.vjstartup.com/", icon: "🌐" },
    { name: "App One", url: "https://app1.vjstartup.com/", icon: "1️⃣" },
    { name: "App Two", url: "https://app2.vjstartup.com/", icon: "2️⃣" },
    { name: "App Three", url: "https://app3.vjstartup.com/", icon: "3️⃣" },

    
];

const SuperAppContent = () => {
    const [user, setUser] = useState(null);
    const [activeApp, setActiveApp] = useState(null);
    const [showLogin, setShowLogin] = useState(false); // ✅ Track if login button was clicked

    useEffect(() => {
        // ✅ Load user from cookies instead of forcing login
        const storedUser = Cookies.get("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);


    const handleLogout = () => {
        console.log(`${import.meta.env.VITE_APP_COOKIE_DOMAIN}`); 
        const cookieDomain = import.meta.env.VITE_APP_COOKIE_DOMAIN || "localhost";

    
        Cookies.remove("userToken", { domain: cookieDomain, path: "/" });
        Cookies.remove("user", { domain: cookieDomain, path: "/" });
    
        setUser(null); // ✅ Clear user state
        window.location.reload();
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh", width: "100vw", overflow: "hidden" }}>
            {/* ✅ Header Section */}
            <header style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "#007bff", color: "white", width: "100%", boxSizing: "border-box" }}>
            <h2 
                onClick={() => window.location.reload()} 
                style={{ cursor: "pointer" }}
            >
               🦸SuperApp 
            </h2>

                <div>
                    {user ? (
                        <>
                            <span>👤 {user.name}</span>
                            <button
                                onClick={handleLogout}
                                style={{
                                    marginLeft: "10px",
                                    background: "#ff4d4d",
                                    color: "white",
                                    border: "none",
                                    padding: "5px 10px",
                                    cursor: "pointer",
                                }}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Login onLoginSuccess={setUser} /> // ✅ Show Google Login Popup
                    )}
                </div>
            </header>

            {/* ✅ App Selection Grid / Embedded App View */}
            {activeApp === null ? (
                <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", 
                    gap: "20px", 
                    padding: "20px", 
                    textAlign: "center", 
                    width: "100vw", 
                    maxWidth: "100%", 
                    margin: "0 auto",
                    boxSizing: "border-box"
                }}>
                    {APPS.map((app) => (
                        <div 
                            key={app.url} 
                            role="button" 
                            tabIndex="0" 
                            onClick={() => setActiveApp(app.url)}
                            onKeyPress={(e) => e.key === "Enter" && setActiveApp(app.url)}
                            style={{ 
                                cursor: "pointer", 
                                padding: "20px", 
                                border: "1px solid #ccc", 
                                borderRadius: "10px", 
                                background: "#f8f9fa",
                                display: "flex", 
                                flexDirection: "column", 
                                alignItems: "center", 
                                justifyContent: "center", 
                                minWidth: "120px", 
                                minHeight: "120px", 
                                width: "100%",
                                boxSizing: "border-box"
                            }} 
                        >
                            <div style={{ fontSize: "40px" }}>{app.icon}</div>
                            <p style={{ fontSize: "14px", marginTop: "10px" }}>{app.name}</p>
                        </div>
                    ))}
                </div>
            ) : (
                // To Avoid iframe caching : add a random query parameter. But it increases load on server
                // src={`${activeApp}?cache=${Date.now()}`}
                <iframe
                    src={`${activeApp}?cache=1}`}
                    title="Embedded App"
                    width="100%"
                    height="100%"
                    style={{ border: "none", flexGrow: 1 }}
                />
            )}
        </div>
    );
};

export default SuperAppContent;


// 🚀 General Purpose Icons
// 🏫 Campus
// 🏠 Home
// 🔍 Search
// ⚡ Speed
// 📊 Dashboard
// 📁 Files
// 🖥️ Computer
// 📡 Network
// 🏛️ Events & Hall Booking
// 🎤 Podcast
// 🛠️ Admin Panel
// 📋 Tasks & To-Do
// 🎯 Goals & Achievements
// 🏆 Leaderboard
// 📌 Pinned Items
// 🚗 Travel & Maps
// 🗺️ Navigation
// 🚌 Bus Tracking
// 🚗 Carpooling
// 🚀 Fast Travel
// 📍 Location Sharing
// 📰 News & Media
// 📰 Fake News Check
// 🗣️ Discussions
// 🎥 Live Streaming
// 📢 Announcements
// 🎧 Podcast Hub
// 🛡️ Security & Complaints
// 🛡️ Complaints & Security
// 🔐 Privacy
// 🏦 Banking & Transactions
// 🔒 Lock & Authentication
// 🧑‍⚖️ Legal & Compliance
// 💡 Learning & Development
// 💡 Doubt Solving
// 📚 Library
// ✍️ Assignments
// 🏗️ Projects
// 🎓 Education & Training
// 💻 Developer & Tech
// 💻 Developer Hub
// 🖥️ Tech Support
// 🎛️ Control Panel
// 🔧 Tools & Utilities
// 🌐 Web Development
// 📌 Bonus: Numbers (1 to 5)
// 1️⃣ One
// 2️⃣ Two
// 3️⃣ Three
// 4️⃣ Four
// 5️⃣ Five