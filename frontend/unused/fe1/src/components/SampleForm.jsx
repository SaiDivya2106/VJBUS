import React, { useState } from 'react';
import './SampleForm.css';

function SampleForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);  
    const [errorMessage, setErrorMessage] = useState(''); 

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);  
        setErrorMessage('');  
        
        let payload = { username, password };
        
        try {
            const response = await fetch('http://10.45.30.252:5000/user/register', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();    <link rel="icon" type="image/svg+xml" href="/vite.svg" />

            setLoading(false);  

            if (data.success) {
                alert('User Added Successfully');
            } else {
                setErrorMessage("User Already Exists in the database");
            }
        } catch (er) {
            setLoading(false);  
            setErrorMessage(er.message); 
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="formCont">
                    <label htmlFor="username">Username :- </label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <label htmlFor="password">password :- </label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </form>
        </div>
    );
}

export default SampleForm;
