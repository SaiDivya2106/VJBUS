// // import React, { useEffect, useState } from "react";
// // import { Link, useNavigate } from "react-router-dom";
// // import y from "../images/img3.png";
// // import "./Login.css";
// // import { useDispatch, useSelector } from "react-redux";
// // import { userThunk } from "../../REACT/SLICES/Userslice";
// // import { PRCThunk } from "../../REACT/SLICES/PRCslice";

// // function Login() {
// //   const dispatch = useDispatch();
// //   const navigate = useNavigate();
// //   const user = useSelector((state) => state.User);
// //   const Prc = useSelector((state) => state.PRC);
// //   const [err, setErr] = useState("");
// //   const dep = ["12", "05", "01", "02", "03", "04", "32"];
// //   const [prc, setPrc] = useState(false);
// //   //  console.log(Prc);
// //   // State for dynamic captcha
// //   const [captcha, setCaptcha] = useState("");
// //   const [formData, setFormData] = useState({
// //     ID: "",
// //     password: "",
// //     captchaInput: "",
// //   });

// //   // Function to generate a random captcha
// //   const generateCaptcha = () => {
// //     const chars =
// //       "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
// //     let result = "";
// //     for (let i = 0; i < 6; i++) {
// //       result += chars.charAt(Math.floor(Math.random() * chars.length));
// //     }
// //     setCaptcha(result);
// //   };

// //   useEffect(() => {
// //     generateCaptcha(); // Generate captcha on component mount
// //   }, []);

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData({
// //       ...formData,
// //       [name]: value,
// //     });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     // Validate inputs
// //     if (!formData.ID || !formData.password || !formData.captchaInput) {
// //       setErr("All fields are required.");
// //       return;
// //     }

// //     // Validate captcha
// //     if (formData.captchaInput !== captcha) {
// //       setErr("Incorrect captcha. Please try again.");
// //       generateCaptcha(); // Regenerate captcha on failure
// //       return;
// //     }

// //     // Dispatch login action
// //     if (dep.includes(formData.ID)) {
// //       dispatch(PRCThunk({ ID: formData.ID, password: formData.password }));
// //       setPrc(true);
// //     } else {
// //       dispatch(userThunk({ ID: formData.ID, password: formData.password }));
// //     }
// //   };

// //   useEffect(() => {
// //     if (user.errorOccured) {
// //       setErr(user.errorMessage);
// //     }

// //     if (!prc) {
// //       if (user.loginStatus) {
// //         if (user.currentUser.role === "faculty") {
// //           navigate("/fileupload");
// //         }
// //         if (user.currentUser.role === "student") {
// //           navigate("/");
// //         }
// //       }
// //     } else { 
// //       if (Prc.loginStatus===true) {
// //         console.log("whey want is happing")
// //         navigate('/reviewPhaseForPRC');
    

// //       }
// //       if (Prc.errorOccured) {
// //         setErr(Prc.errorMessage);
// //       }
// //     }
// //   }, [user, prc, navigate]);

// //   return (
// //     <div className="signup-container">
// //       {/* Left Side: Image */}
// //       <div className="login-container">
// //         <div className="login-card">
// //           <div className="login-overlay"></div>
// //           <img src={y} className="card-img" alt="Logistics" />
// //           <div className="login-img-overlay">
// //             <h1 className="login-title">WELCOME TO DUPLICAXPERT</h1>
// //             <p className="card-text">Keeping Projects Unique and Authentic</p>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Right Side: Form */}
// //       <div className="form1-container">
// //         <h2 className="text-center">Login</h2>
// //         <p className="text-center">Get ready to experience.</p>
// //         <form className="signup-form mx-auto text-start" onSubmit={handleSubmit}>
// //           <div className="form-group">
// //             <label htmlFor="ID">ID</label>
// //             <input
// //               type="text"
// //               id="ID"
// //               name="ID"
// //               placeholder="Enter your ID"
// //               value={formData.ID}
// //               onChange={handleChange}
// //             />
// //           </div>
// //           <div className="form-group">
// //             <label htmlFor="password">Password</label>
// //             <input
// //               type="password"
// //               id="password"
// //               name="password"
// //               placeholder="Enter your password"
// //               value={formData.password}
// //               onChange={handleChange}
// //             />
// //           </div>
// //           <div className="form-group captcha-group">
// //             <span className="captcha-code">{captcha}</span>
// //             <input
// //               type="text"
// //               id="captchaInput"
// //               name="captchaInput"
// //               placeholder="Enter captcha"
// //               value={formData.captchaInput}
// //               onChange={handleChange}
// //             />
// //           </div>
// //           {err && <p className="text-danger">{err}</p>}
// //           <button type="submit" className="btn-primary">
// //             Login
// //           </button>
// //         </form>
// //         <p className="signin-link">
// //           Not a member? <Link to="/register">Register</Link>
// //         </p>
// //       </div>
// //     </div>
// //   );
// // }

// // export default Login;
// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import y from "../images/img3.png";
// import "./Login.css"; // Updated CSS file for responsiveness
// import { useDispatch, useSelector } from "react-redux";
// import { userThunk } from "../../REACT/SLICES/Userslice";
// import { PRCThunk } from "../../REACT/SLICES/PRCslice";

// function Login() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const user = useSelector((state) => state.User);
//   const Prc = useSelector((state) => state.PRC);

//   // State variables
//   const [formData, setFormData] = useState({
//     ID: "",
//     password: "",
//     captchaInput: "",
//   });
//   const [captcha, setCaptcha] = useState("");
//   const [error, setError] = useState("");

//   // Department IDs
//   const dep = ["12", "05", "01", "02", "03", "04", "32"];

//   // Generate a random captcha
//   const generateCaptcha = () => {
//     const chars =
//       "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//     let result = "";
//     for (let i = 0; i < 6; i++) {
//       result += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     setCaptcha(result);
//   };

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate inputs
//     if (!formData.ID || !formData.password || !formData.captchaInput) {
//       setError("All fields are required.");
//       return;
//     }

//     // Validate captcha
//     if (formData.captchaInput !== captcha) {
//       setError("Incorrect captcha. Please try again.");
//       generateCaptcha(); // Regenerate captcha on failure
//       return;
//     }

//     // Dispatch login action based on department ID
//     if (dep.includes(formData.ID)) {
//       dispatch(PRCThunk({ ID: formData.ID, password: formData.password }));
//     } else {
//       dispatch(userThunk({ ID: formData.ID, password: formData.password }));
//     }
//   };

//   // Handle side effects (user or PRC login status)
//   useEffect(() => {
//     if (user.errorOccured) {
//       setError(user.errorMessage);
//     }

//     if (user.loginStatus) {
//       if (user.currentUser.role === "faculty") {
//         navigate("/fileupload");
//       } else if (user.currentUser.role === "student") {
//         navigate("/");
//       }
//     }
//   }, [user, navigate]);

//   useEffect(() => {
//     if (Prc.errorOccured) {
//       setError(Prc.errorMessage);
//     }

//     if (Prc.loginStatus) {
//       navigate("/reviewPhaseForPRC");
//     }
//   }, [Prc, navigate]);

//   // Generate captcha on component mount
//   useEffect(() => {
//     generateCaptcha();
//   }, []);

//   return (
//     <div className="signup-container">
//       {/* Left Side: Image */}
//       <div className="login-container">
//         <div className="login-card">
//           <div className="login-overlay"></div>
//           <img src={y} className="card-img" alt="Logistics" />
//           <div className="login-img-overlay">
//             <h1 className="login-title">WELCOME TO DUPLICAXPERT</h1>
//             <p className="card-text">Keeping Projects Unique and Authentic</p>
//           </div>
//         </div>
//       </div>

//       {/* Right Side: Form */}
//       <div className="form1-container">
//         <h2 className="text-center">Login</h2>
//         <p className="text-center">Get ready to experience.</p>
//         <form className="signup-form mx-auto text-start" onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="ID">ID</label>
//             <input
//               type="text"
//               id="ID"
//               name="ID"
//               placeholder="Enter your ID"
//               value={formData.ID}
//               onChange={handleChange}
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="password">Password</label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               placeholder="Enter your password"
//               value={formData.password}
//               onChange={handleChange}
//             />
//           </div>
//           <div className="form-group captcha-group">
//             <span className="captcha-code">{captcha}</span>
//             <input
//               type="text"
//               id="captchaInput"
//               name="captchaInput"
//               placeholder="Enter captcha"
//               value={formData.captchaInput}
//               onChange={handleChange}
//             />
//           </div>
//           {error && <p className="text-danger">{error}</p>}
//           <button type="submit" className="btn-primary">
//             Login
//           </button>
//         </form>
//         <p className="signin-link">
//           Not a member? <Link to="/register">Register</Link>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Login;
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import y from "../images/img3.png"; // Ensure this path is correct
import "./Login.css"; // Updated CSS file for responsiveness
import { useDispatch, useSelector } from "react-redux";
import { userThunk } from "../../REACT/SLICES/Userslice";
import { PRCThunk } from "../../REACT/SLICES/PRCslice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.User);
  const Prc = useSelector((state) => state.PRC);

  // State variables
  const [formData, setFormData] = useState({
    ID: "",
    password: "",
    captchaInput: "",
  });
  const [captcha, setCaptcha] = useState("");
  const [error, setError] = useState("");

  // Department IDs
  const dep = ["12", "05", "01", "02", "03", "04", "32"];

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

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!formData.ID || !formData.password || !formData.captchaInput) {
      setError("All fields are required.");
      return;
    }

    // Validate captcha
    if (formData.captchaInput !== captcha) {
      setError("Incorrect captcha. Please try again.");
      generateCaptcha(); // Regenerate captcha on failure
      return;
    }

    // Dispatch login action based on department ID
    if (dep.includes(formData.ID)) {
      
      dispatch(PRCThunk({ ID: formData.ID, password: formData.password }));
    } else {
      dispatch(userThunk({ ID: formData.ID, password: formData.password }));
    }
  };

  // Handle side effects (user or PRC login status)
  useEffect(() => {
    if (user.errorOccured) {
      setError(user.errorMessage);
    }

    if (user.loginStatus) {
      if (user.currentUser.role === "faculty") {
        navigate("/fileupload");
      } else if (user.currentUser.role === "student") {
        navigate("/");
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    if (Prc.errorOccured) {
      setError(Prc.errorMessage);
    }

    if (Prc.loginStatus) {
      navigate("/reviewPhaseForPRC");
    }
  }, [Prc, navigate]);

  // Generate captcha on component mount
  useEffect(() => {
    generateCaptcha();
  }, []);

  return (
    <div className="signup-container">
      {/* Left Side: Image */}
      <div className="login-container">
        <div className="login-card">
          <div className="login-overlay"></div>
          <img src={y} className="card-img" alt="Logistics" />
          <div className="login-img-overlay">
            <h1 className="login-title">WELCOME TO DUPLICAXPERT</h1>
            <p className="card-text">Keeping Projects Unique and Authentic</p>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="form1-container">
        <h2 className="text-center">Login</h2>
        <p className="text-center">Get ready to experience.</p>
        <form className="signup-form mx-auto text-start" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="ID">ID</label>
            <input
              type="text"
              id="ID"
              name="ID"
              placeholder="Enter your ID"
              value={formData.ID}
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
          <div className="form-group captcha-group">
            <span className="captcha-code">{captcha}</span>
            <input
              type="text"
              id="captchaInput"
              name="captchaInput"
              placeholder="Enter captcha"
              value={formData.captchaInput}
              onChange={handleChange}
            />
          </div>
          {error && <p className="text-danger">{error}</p>}
          <button type="submit" className="btn-primary">
            Login
          </button>
        </form>
        <p className="signin-link">
          Not a member? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;