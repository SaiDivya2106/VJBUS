import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"; 
import { setToken } from "../slices/authSlice";

const Form = ({ closeForm }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch(); 

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage(""); 
  
        const payload = { username, password };
  
        try {
            // Login API to get the token
            const response = await fetch("http://campus.vnrzone.site/sso-be/auth/eduprime", { // ✅ Fixed API URL
                method: "POST",
                credentials: "include",  // Include cookies if required
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data)
            if (data.token) {
                setMessage("Login successful! Setting token...");
                dispatch(setToken(data.token));

                // ✅ Store token in local storage (optional)
                
                // ✅ Send token to the server to set session
                console.log(data.token)
                await setTokenOnServer(data.token);

                // ✅ Redirect after successful login
                window.location.href = "http://campus.vnrzone.site";
            } else {
                setMessage(data.error || "Authentication failed.");
            }
        } catch (error) {
            console.error("Login Error:", error);
            setMessage("Something went wrong. Please try again.");
        }
    };

    const setTokenOnServer = async (token) => {
        try {
            const response = await fetch("http://campus.vnrzone.site/sa-be/public/set-api", { // ✅ Fixed API URL
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token }),
            });

            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }

            const result = await response.json();
            dispatch(setToken(result.token));

            if (result.token) {
                setMessage("Token set successfully! Fetching user data...");
            } else {
                setMessage("Failed to set token.");
            }
        } catch (error) {
            console.error("Error setting token:", error);
            setMessage("Error setting token. Please try again.");
        }
    };

    return (
        <StyledWrapper>
            <div className="form-container">
                <div className="close-cont" onClick={closeForm}>
                    <p className='close'>X</p>
                </div>
                <p className="title">Login</p>
                <form onSubmit={handleSubmit} className="form">
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" name="username" id="username" placeholder='Username' required value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" placeholder='Password' required value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button className="sign">Sign in</button>
                </form>
                <p>{message}</p>
            </div>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
  .form-container {
    margin: auto;
    margin-top: 25vh;
    width: 350px;
    border-radius: 0.75rem;
    background-color: rgba(17, 24, 39, 1);
    padding: 2rem;
    color: rgba(243, 244, 246, 1);
    position: relative;
    z-index: 3000;
  }
  .close-cont {
    position: absolute;
    right: 1vw;
    top: 2vh;
    border-radius: 15px;
    background-color: rgb(34, 55, 100);
    width: 50px;
    height: 50px;
    font-size: 20px;
    display: flex;
    cursor: pointer;
  }
  .close-cont:hover {
    background-color: white;
    color: black;
  }
  .close {
    margin: auto;
  }
  .title {
    text-align: center;
    font-size: 1.5rem;
    font-weight: 700;
  }
  .input-group {
    margin-top: 0.25rem;
    font-size: 0.875rem;
  }
  .input-group label {
    display: block;
    color: rgba(156, 163, 175, 1);
    margin-bottom: 4px;
  }
  .input-group input {
    width: 100%;
    border-radius: 0.375rem;
    border: 1px solid rgba(55, 65, 81, 1);
    outline: 0;
    background-color: rgba(17, 24, 39, 1);
    padding: 0.75rem 1rem;
    color: rgba(243, 244, 246, 1);
  }
  .sign {
    display: block;
    width: 100%;
    background-color: rgba(167, 139, 250, 1);
    padding: 0.75rem;
    text-align: center;
    color: rgba(17, 24, 39, 1);
    border: none;
    border-radius: 0.375rem;
    font-weight: 600;
    max-width: 90px;
    margin: auto;
    margin-top: 15px;
  }
`;

export default Form;
