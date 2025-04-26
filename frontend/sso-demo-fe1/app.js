const API_URL = "https://auth.vnrzone.site";
const BACKEND_URL = "https://demo1.vnrzone.site/demo1-be";

// ✅ Function to get cookie values
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}

async function fetchProtectedData() {
    try {
        console.log("🔍 Fetching secure data from backend1...");
        const res = await fetch(`${BACKEND_URL}/protected`, {
            method: "GET",
            credentials: "include",  // ✅ Send cookies
        });

        const data = await res.json();
        console.log("✅ Debug: Secure data response =", data);

        if (data.user) {
            document.getElementById("secure-data").innerText = `Secure message: ${data.message}, User: ${data.user.email}`;
        } else {
            document.getElementById("secure-data").innerText = "Unauthorized";
        }
    } catch (error) {
        console.error("❌ Error fetching secure data:", error);
    }
}


// ✅ Check login status on page load
async function checkLoginStatus() {
    console.log("🔍 Checking login status...");
    
    try {
        const res = await fetch(`${API_URL}/check-auth`, {
            method: "GET",
            credentials: "include"  // ✅ Ensures cookies are sent
        });

        const data = await res.json();
        console.log("🔍 Debug: Login Status Response =", data);

        if (data.logged_in) {
            document.getElementById("user-info").innerText = `Logged in as: ${data.user.email}`;
            document.getElementById("login").style.display = "none";  // ✅ Hide login button
            document.getElementById("logout").style.display = "block"; // ✅ Show logout button
        } else {
            document.getElementById("login").style.display = "block";
            document.getElementById("logout").style.display = "none";
        }
    } catch (error) {
        console.error("⚠️ Error checking login status:", error);
    }
}

// ✅ Handle Google login response
async function handleCredentialResponse(response) {
    console.log("✅ Google Login Success:", response);

    try {
        const idToken = response.credential;
        const res = await fetch(`${API_URL}/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: idToken }),
            credentials: "include"  // ✅ Ensure cookies are stored
        });

        const data = await res.json();
        console.log("🔍 Debug: Server Response =", data);

        // ✅ Update UI
        document.getElementById("user-info").innerText = `Logged in as: ${data.user.email}`;
        document.getElementById("login").style.display = "none";  
        document.getElementById("logout").style.display = "block";

    } catch (error) {
        console.error("⚠️ Error during login:", error);
    }
}

// ✅ Logout function (Removes cookies and logs out)
async function handleLogout() {
    try {
        await fetch(`${API_URL}/logout`, { method: "POST", credentials: "include" });

        // ✅ Clear UI & Remove cookies manually
        document.getElementById("user-info").innerText = "Logged out";
        document.getElementById("login").style.display = "block";  
        document.getElementById("logout").style.display = "none";

        // ✅ Remove cookies manually
        document.cookie = "userToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        document.cookie = "user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC;";

    } catch (error) {
        console.error("⚠️ Error during logout:", error);
    }
}

// ✅ Initialize Google login on page load
window.onload = () => {
    console.log("🔍 Initializing Google Login...");

    google.accounts.id.initialize({
        client_id: "522460567146-ubk3ojomopil8f68hl73jt1pj0jbbm68.apps.googleusercontent.com",
        callback: handleCredentialResponse,
        ux_mode: "popup"
    });

    console.log("🔍 Rendering Google Login Button...");
    google.accounts.id.renderButton(
        document.getElementById("login"),
        { theme: "outline", size: "large" }
    );

    document.getElementById("fetch-data").addEventListener("click", fetchProtectedData);

    // ✅ Check login status on page load
    checkLoginStatus();
};

// ✅ Event Listeners for login & logout buttons
document.getElementById("logout").addEventListener("click", handleLogout);
