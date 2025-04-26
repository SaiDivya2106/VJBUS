import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RegisterPrc.css';
import x from '../../AllCorrectPages/images/img2.png';

function RegisterPrc() {
  let backendURL = process.env.REACT_APP_backend_url;
  const [formData, setFormData] = useState({
    dept_id: '',
    password: '',
    department: '', // Default department to null
    agreeToTerms: false
  });
  const [err,setErr]=useState('')

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      id: formData.dept_id,
      password: formData.password,
      department: formData.department   
    };
     console.log(dataToSend)
    const url = `${backendURL}/registerPrc`; // Updated URL

    try {
      const response = await axios.post(url, dataToSend, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data);
      if(response.data.message==='User registered successfully!'){
      
      navigate('/login'); // Redirect to home page
      }
      else{
        setErr(response.data.error)
      }
    } catch (error) {
      console.error(`Error submitting data: ${error.message}`);
      setErr(error.message)
      // handle error (e.g., display an error message)
    }
  };

  return (
    <div className="signup-container">
      <div className="form-container">
        <h2 className='text-center'>Sign up</h2>
        <p className='text-center'>Register as a member to experience.</p>
        <form className="signup-form mx-auto text-start" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className='p-2' htmlFor="dept_id">DEPT ID</label>
            <input type="number" className="form-control" id="dept_id" name="dept_id" placeholder="DEPARTMENT ID" value={formData.id} onChange={handleChange} />
          </div>
        
          <div className="form-group">
            <label className='p-2' htmlFor="password">Password</label>
            <input type="password" className="form-control" id="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className='p-2' htmlFor="department">Department</label>
            <select className="form-control" id="department" name="department" value={formData.department} onChange={handleChange}>
              <option value="" disabled>Select Department</option>
              <option value="CE">CE</option>
              <option value="EEE">EEE</option>
              <option value="ECE">ECE</option>
              <option value="ME">ME</option>
              <option value="CSE">CSE</option>
              <option value="CS-AIML">CS-AIML</option>
              <option value="CS-DS">CS-DS</option>
              <option value="CS-IOT">CS-IOT</option>
              <option value="CS-CyS">CS-CyS</option>
              <option value="AI & DS">AI & DS</option>
              <option value="CSBS">CSBS</option>
              <option value="EIE">EIE</option>
              <option value="IT">IT</option>
              <option value="AE">AE</option>
            </select>

          </div>
          <div className="form-check">
            <input type="checkbox" className="form-check-input" id="terms" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} />
            <label className="form-check-label" htmlFor="terms">I agree to the terms of service</label>
          </div>
          
          <button type="submit" className="btn btn-primary">Create Account</button>
        </form>
        <p className="signin-link">Already a member? <Link to="/login">Login</Link></p>
        {
          
          err.length!==0 && <p className='mx-3 text-red-500 text-center fs-5'>{err}</p>
        
    }
      </div>
    

      <div className="register-container">
        <div className="register-card text-bg-dark">
          <div className="register-overlay"></div>
          <img src={x} className="register-card-img" alt="Logistics" />
          <div className="register-img-overlay">
            <h1 className="register-card-title">WELCOME TO DUPLICAXPERT</h1>
            <p className="card-text text-start display-6">
              Ensuring Originality in Every Project
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPrc;