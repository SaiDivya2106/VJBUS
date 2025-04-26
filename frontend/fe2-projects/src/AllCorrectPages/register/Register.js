// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './Register.css';
// import x from '../images/img2.png';

// function Register() {
//   let backendURL = process.env.REACT_APP_backend_url;
  
//   const [formData, setFormData] = useState({
//     id: '',
//     username: '',
//     name: '',
//     email: '',
//     password: '',
//     role: '', // Default role to 'student'
//     department: '', // Default department to null
//     agreeToTerms: false
//   });
//   const [err,setErr]=useState('')

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === 'checkbox' ? checked : value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const dataToSend = {
//       id: formData.id,
     
//       name: formData.name,
//       email: formData.email,
//       password: formData.password,
//       role: formData.role,
//       department: formData.department
//     };
//      console.log(dataToSend,"me")
//     const url = `${backendURL}/register`; // Updated URL

//     try {
//       const response = await axios.post(url, dataToSend, {
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });
//       console.log(response.data);
//       if(response.data.message==='otp required and is valid for 5 minutes'){
      
//       navigate('/otp',{state:[response.data,dataToSend]}); // Redirect to home page
//       }
//       else{
//         setErr(response.data.error)
//       }
//     } catch (error) {
//       console.error(`Error submitting data: ${error.message}`);
//       setErr(error.message)
//       // handle error (e.g., display an error message)
//     }
//   };

//   return (
//     <div className="signup-container">
//       <div className="form2-container">
//         <h2 className='text-center'>Sign up</h2>
//         <p className='reg'>Register as a member to experience.</p>
//         <form className="signup-form mx-auto text-start" onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label className='p-2' htmlFor="id">ID</label>
//             <input type="text" className="form-control" id="id" name="id" placeholder="ID" value={formData.id} onChange={handleChange} />
//           </div>
        
//           <div className="form-group">
//             <label className='p-2' htmlFor="name">Name</label>
//             <input type="text" className="form-control" id="name" name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
//           </div>
//           <div className="form-group">
//             <label className='p-2' htmlFor="email">Email</label>
//             <input type="email" className="form-control" id="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
//           </div>
//           <div className="form-group•••••••••••">
//             <label className='p-2' htmlFor="password">Password</label>
//             <input type="password" className="form-control" id="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
//           </div>
//           <div className="form-group">
//             <label className='p-2' htmlFor="role">Role</label>
//             <select className="form-control" id="role" name="role" value={formData.role} onChange={handleChange}>
//             <option value="" disabled>Select Role</option>            
//               <option value="student">Student</option>
//               <option value="faculty">Faculty</option>
//             </select>
//           </div>
//           <div className="form-group">
//             <label className='p-2' htmlFor="department">Department</label>
//             <select className="form-control" id="department" name="department" value={formData.department} onChange={handleChange}>
//               <option value="" disabled>Select Department</option>
//               <option value="CE">CE</option>
//               <option value="EEE">EEE</option>
//               <option value="ECE">ECE</option>
//               <option value="ME">ME</option>
//               <option value="CSE">CSE</option>
//               <option value="CS-AIML">CS-AIML</option>
//               <option value="CS-DS">CS-DS</option>
//               <option value="CS-IOT">CS-IOT</option>
//               <option value="CS-CyS">CS-CyS</option>
//               <option value="AI & DS">AI & DS</option>
//               <option value="CSBS">CSBS</option>
//               <option value="EIE">EIE</option>
//               <option value="IT">IT</option>
//               <option value="AE">AE</option>
//             </select>
//           </div>
//           <div className="form-check">
//             <input type="checkbox" className="form-check-input" id="terms" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} />
//             <label className="form-check-label" htmlFor="terms">I agree to the terms of service</label>
//           </div>
//           <button type="submit" className="btn btn-primary login">Create Account</button>
//         </form>
//         <p className="signin-link">Already a member? <Link to="/login">Login</Link></p>
//       </div>
//       {
          
//             err.length!==0 && <p className='mx-3'>{err}</p>
          
//       }

//       <div className="register-container">
//         <div className="register-card text-bg-dark">
//           <div className="register-overlay"></div>
//           <img src={x} className="register-card-img" alt="Logistics" />
//           <div className="register-img-overlay">
//             <h1 className="register-card-title">WELCOME TO DUPLICAXPERT</h1>
//             <p className="card-text text-start display-6">
//               Ensuring Originality in Every Project
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Register;
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import x from "../images/img2.png";
import "./Register.css";

function Register() {
  const backendURL = process.env.REACT_APP_backend_url;

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    role: "", // Default role to 'student'
    department: "", // Default department to null
    agreeToTerms: false,
    captchaInput: "",
  });

  const [captcha, setCaptcha] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  // Generate a random captcha
  const generateCaptcha = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
  };

  useEffect(() => {
    generateCaptcha(); // Generate captcha on component mount
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (
      !formData.id ||
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.role ||
      !formData.department ||
      !formData.agreeToTerms
    ) {
      setErr("All fields are required.");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErr("Please enter a valid email address.");
      return;
    }

    // Validate captcha
    if (formData.captchaInput !== captcha) {
      setErr("Incorrect captcha. Please try again.");
      generateCaptcha(); // Regenerate captcha on failure
      return;
    }

    // Submit data to backend
    const dataToSend = {
      id: formData.id,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      department: formData.department,
    };

    try {
      const response = await axios.post(`${backendURL}/register`, dataToSend, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.message === "otp required and is valid for 5 minutes") {
        
        navigate("/otp", { state: [response.data, dataToSend] });
      } else {
        setErr(response.data.error || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error(`Error submitting data: ${error.message}`);
      setErr(error.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      {/* Left Side: Form */}
      <div className="form2-container">
        <h2 className="text-center">Sign up</h2>
        <p className="reg text-center">Register as a member to experience.</p>
        <form className="signup-form mx-auto text-start" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="id">ID</label>
            <input
              type="text"
              id="id"
              name="id"
              placeholder="Enter your ID"
              value={formData.id}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select Role
              </option>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="department">Department</label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select Department
              </option>
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

          {/* Captcha */}
          <div className="form-group captcha-group">
            <span className="captcha-code">{captcha}</span>
            <input
              type="text"
              id="captchaInput"
              name="captchaInput"
              placeholder="Enter captcha"
              value={formData.captchaInput}
              onChange={handleChange}
              className="captcha-input"
            />
          </div>

          {/* Checkbox */}
          <div className="form-check">
            <input
              type="checkbox"
              id="terms"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
            />
            <label htmlFor="terms">I agree to the terms of service</label>
          </div>

          {/* Error Message */}
          {err && <p className="text-danger">{err}</p>}

          {/* Submit Button */}
          <button type="submit" className="btn-primary">
            Create Account
          </button>
        </form>
        <p className="signin-link">
          Already a member? <Link to="/login">Login</Link>
        </p>
      </div>

      {/* Right Side: Image */}
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

export default Register;