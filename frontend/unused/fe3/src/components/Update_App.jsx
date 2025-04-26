import React, { useState } from 'react';

function Update_App() {
  const [appName, setAppName] = useState('');
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState('');

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/public/update-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ appName, newUrl:url })
      });
      
      const data = await response.json();
      if (response.ok) {
        setMessage('App updated successfully!');
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      setMessage('Failed to update app. Please try again.');
    }
  };

  return (
    <div className="p-4 border rounded shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Update App</h2>
      <input 
        type="text" 
        placeholder="App Name" 
        value={appName} 
        onChange={(e) => setAppName(e.target.value)} 
        className="w-full p-2 border rounded mb-2"
      />
      <input 
        type="text" 
        placeholder="App URL" 
        value={url} 
        onChange={(e) => setUrl(e.target.value)} 
        className="w-full p-2 border rounded mb-2"
      />
      <button 
        onClick={handleUpdate} 
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Update App
      </button>
      {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
    </div>
  );
}

export default Update_App;
