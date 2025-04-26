// import axios from 'axios';
// import React, { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';

// import { useNavigate } from 'react-router-dom';
// const OTP = () => {
//   let backend = process.env.REACT_APP_backend_url;
//   const [otp, setOtp] = useState(new Array(6).fill(""));
//   const [timeLeft, setTimeLeft] = useState(300); // 5 minutes = 300 seconds
//   const location=useLocation()
//     const navi=useNavigate()
// //   console.log(location.state)
//   // Timer logic
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   // Handle OTP input change
//   const handleChange = (element, index) => {
//     if (isNaN(element.value)) return false;

//     const newOtp = [...otp];
//     newOtp[index] = element.value;
//     setOtp(newOtp);

//     // Focus next input field
//     if (element.nextSibling && element.value !== "") {
//       element.nextSibling.focus();
//     }

//     // Check if OTP is complete
//     if (newOtp.join("").length === 6) {
//       handleSubmit(newOtp.join(""));
//     }
//   };

//   // Submit OTP to backend
//   const handleSubmit = async (otp) => {

//     try {
//         console.log(otp)
//       const response = await axios.post(`${backend}/register_check1`,{'otp':otp,'data':location.state}, {
        
//         headers: {
//           'Content-Type': 'application/json',
//         }
        
//       });
//         console.log(response)
//       if (response.data.message="User registered successfully!") {
//         navi('/login');
//         console.log("OTP verified successfully:");
//         // Handle success (e.g., navigate to another page)
//       } else {
//         console.log("OTP verification failed.");
//         // Handle error (e.g., show error message)
//       }
//     } catch (error) {
//       console.error("Error sending OTP to the server:", error);
//     }
//   };

//   return (
//     <div style={{ textAlign: 'center', marginTop: '50px' }}>
//       <h2 className='p-1 m-3'>Enter OTP</h2>
//       {otp.map((data, index) => {
//         return (
//           <input
//             key={index}
//             type="text"
//             name="otp"
//             maxLength="1"
//             value={data}
//             onChange={(e) => handleChange(e.target, index)}
//             onFocus={(e) => e.target.select()}
//             style={{
//               width: '40px',
//               height: '40px',
//               margin: '0 10px',
//               textAlign: 'center',
//               fontSize: '20px',
//             }}
//           />
//         );
//       })}
//       <div style={{ marginTop: '20px' }}>
//         {timeLeft > 0 ? (
//           <p>Time Remaining: {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}</p>
//         ) : (
//           <p>Time Expired</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default OTP;
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Timer, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

const OTP = () => {
  const backend = process.env.REACT_APP_backend_url;
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(300);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (e, index) => {
    if (isNaN(e.target.value)) return;
    
    setError("");
    const newOtp = [...otp];
    newOtp[index] = e.target.value;
    setOtp(newOtp);

    if (e.target.nextSibling && e.target.value !== "") {
      e.target.nextSibling.focus();
    }

    if (newOtp.join("").length === 6) {
      handleSubmit(newOtp.join(""));
    }
  };

  const handleSubmit = async (otpValue) => {
    setLoading(true);
    setError("");
    try {
      console.log(location.state)
      const response = await axios.post(`${backend}/register_check`, 
        { otp: otpValue, data: location.state },
        { headers: { 'Content-Type': 'application/json' }}
      );

      if (response.data.message === "User registered successfully!") {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError("Invalid OTP. Please try again.");
        setOtp(Array(6).fill(""));
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setOtp(Array(6).fill(""));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      e.target.previousSibling?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center mb-6">
          <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-center text-gray-800 flex-1 pr-5">
            Verify Your Email
          </h2>
        </div>

        <p className="text-gray-600 text-center mb-8">
          We've sent a verification code to your email address
        </p>

        <div className="flex justify-center gap-2 mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={(e) => e.target.select()}
              className={`w-12 h-12 border-2 rounded-lg text-center text-xl font-semibold
                ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                ${success ? 'border-green-300 bg-green-50' : ''}
                focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200
                transition-all duration-200`}
              disabled={loading || success || timeLeft === 0}
            />
          ))}
        </div>

        <div className="text-center">
          {timeLeft > 0 ? (
            <div className="flex items-center justify-center text-gray-600 gap-2">
              <Timer className="w-5 h-5" />
              <span>{Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}</span>
            </div>
          ) : (
            <p className="text-red-500 flex items-center justify-center gap-2">
              <AlertCircle className="w-5 h-5" /> Code expired
            </p>
          )}

          {error && (
            <p className="mt-4 text-red-500 flex items-center justify-center gap-2">
              <AlertCircle className="w-5 h-5" /> {error}
            </p>
          )}

          {success && (
            <p className="mt-4 text-green-500 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> Verification successful!
            </p>
          )}

          {timeLeft === 0 && (
            <button
              className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors duration-200"
              onClick={() => {
                setTimeLeft(300);
                setOtp(Array(6).fill(""));
                setError("");
              }}
            >
              Resend Code
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OTP;