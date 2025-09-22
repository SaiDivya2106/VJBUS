import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import { Modal } from "react-bootstrap";
import { CheckCircleFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import "./ComplaintForm.css";
import { Send } from "react-bootstrap-icons";
import { PersonFill, TagFill, FileTextFill } from "react-bootstrap-icons";
import { ChevronDown, ChevronUp } from "react-bootstrap-icons";


const categoriesList = [
  { name: "Infrastructure", icon: "🏗" },
  { name: "Canteen", icon: "🍽" },
  { name: "Examination", icon: "📖" },
  { name: "Fee Payments and Accounts", icon: "💳" },
  { name: "Boys Hostel", icon: "🏠" },
  { name: "Girls Hostel", icon: "🏡" },
  { name: "Hostel Food", icon: "🍲" },
  { name: "Extracurricular and Events", icon: "🏆" },
  { name: "Security", icon: "🛡" },
  { name: "Sports", icon: "⚽" },
  { name: "Housekeeping", icon: "🧹" },
  { name: "Audio-Visual Equipment", icon: "🎥" },
  { name: "Parking", icon: "🚗" },
  { name: "Transport", icon: "🚌" },
  { name: "Library", icon: "📚" },            // added
  { name: "IT and Networking", icon: "💻" },  //added
  { name: "Others", icon: "📦" },
];

const ComplaintForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
  });
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [warning, setWarning] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const displayedCategories = showAll ? categoriesList : categoriesList.slice(0, 7);
  const baseUrl = process.env.REACT_APP_COMPLAINTS_APP_BE_URL;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleCategorySelect = (cat) => setFormData({ ...formData, category: cat });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setWarning("");

    if (!user) {
      setMessage("You must be logged in to submit a complaint.");
      setLoading(false);
      return;
    }

    try {
      const complaintData = {
        complaint_id: Date.now().toString(),
        title: formData.title,
        category: formData.category,
        description: formData.description,
        user_id: user?.email,
      };

      const token = localStorage.getItem("authToken");

      const response = await axios.post(
        `${baseUrl}/user-api/add-complaint`,
        complaintData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate("/all-complaints");
        }, 3000);
        setFormData({ title: "", category: "", description: "" });
      } else {
        setMessage("Failed to register complaint. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting complaint:", error.response?.data || error.message);

      if (error.response && error.response.status === 400) {
        setWarning(error.response.data.message);
      } else {
        setMessage(error.response?.data?.message || error.message);
      }
    }

    setLoading(false);
  };

   const headingStyle = {
    fontSize: "2.3rem",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "25px",
    fontFamily: "serif",
    color:"black",
  };

  const userInfoStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "25px",
  };

  const avatarStyle = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #007bff",

  };

const usernameStyle = {
  fontSize: "20px",
  color: "#dbe2eaff",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};


  const labelStyle = {
    fontWeight: "600",
    fontSize: "15px",
    marginBottom: "8px",
    color: "#f5eeeeff",
  };

const lightBlue = "#4da6ff";

  return (
    <div className="complaint-container">
      {/* <p className="title">Register Complaint</p>

      {user && (
        <div className="user-info">
          <img src={user.picture} alt="User Avatar" className="avatar" />
          <span className="username">{user.name}</span>
        </div>
      )} */}

        <h2 style={headingStyle}>Register a Complaint</h2>

      <form className="form" onSubmit={handleSubmit}>
                 

      <div style={userInfoStyle}>
        <img src={user?.picture} alt="User Avatar" style={avatarStyle} />
        {/* <span style={usernameStyle}>{user?.name}</span> */}
        <span style={{ fontSize: "20px", color: "#f9f3f3ff", fontFamily: "serif" }}>
  {user?.name}
</span>

      </div>
        <div className="input-group">
           <label style={labelStyle}>
  <span className="icon-circle">
    <PersonFill size={18} color={lightBlue} />
  </span>
  Complaint Title *
</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter a clear, descriptive title..."
            required
          />
        </div>

        <div className="input-group">
  {/* Label is in its own block */}
  <div className="category-label-wrapper">
    <label style={labelStyle}>
      <span className="icon-circle">
        <TagFill size={18} color={lightBlue} />
      </span>
      Category
    </label>
  </div>

  {/* Category grid comes below the label */}
  <div className="category-grid">
    {formData.category ? (
      <button
        type="button"
        className="category-btn active"
        onClick={() => setFormData({ ...formData, category: "" })}
      >
        <span className="icon">
          {categoriesList.find((cat) => cat.name === formData.category)?.icon}
        </span>
        <span>{formData.category}</span>
      </button>
    ) : (
      <>
        {displayedCategories.map((cat) => (
          <button
            key={cat.name}
            type="button"
            className={`category-btn ${
              formData.category === cat.name ? "active" : ""
            }`}
            onClick={() => handleCategorySelect(cat.name)}
          >
            <span className="icon">{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}

        <button
          type="button"
          className="category-btn more-btn"
          onClick={() => setShowAll(!showAll)}
        >
          <span className="icon-circle">
            {showAll ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </span>
          {showAll ? "Show Less" : "More Options"}
        </button>
      </>
    )}
  </div>
</div>




      


        <div className="input-group">
<label style={labelStyle}>
  <span className="icon-circle">
    <FileTextFill size={18} color={lightBlue} />
  </span>
  Detailed Description :
</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Please provide a comprehensive description of your issue..."
            rows="5"
            required
          />
        </div>
          {/* ⚠️ Complaint Warning Note */}
  {/* <p className="complaint-note mt-3">
  <i className="bi bi-exclamation-triangle-fill text-warning me-1"></i>
  False or invalid complaints are strictly prohibited.Only genuine issues will be considered.

</p> */}

<p className="complaint-note mt-3 d-flex align-items-center" style={{ marginLeft: '0', paddingLeft: '0' }}>
  <i className="bi bi-exclamation-triangle-fill text-warning me-2"></i>
  <span>False or invalid complaints are strictly prohibited. Only genuine issues will be considered.</span>
</p>



        <button type="submit" className="submit-btn" disabled={loading}>
          <Send style={{ marginRight: "8px", verticalAlign: "middle" }} size={18} color="#fff" />
          {loading ? "Submitting..." : "Register Complaint"}
        </button> 






        {/* {warning && <p className="form-warning mt-3">⚠ {warning}</p>} */}
        {warning && (
  <p className="form-warning mt-3  ml-2">
    <span className="text-danger ">⚠</span>{" "}
    
    <span className="text-white">{warning}</span>
  </p>
)}

        {message && <p className="form-message">{message}</p>}
      </form>

      <Modal show={showSuccess} onHide={() => setShowSuccess(false)} centered>
        <Modal.Body className="text-center p-5">
          <CheckCircleFill className="success-icon" />
          <h5 className="text-success">Complaint Registered Successfully!</h5>
        </Modal.Body>  
      </Modal>
    </div>
  );
};

export default ComplaintForm;




// import { useState } from "react";
//  import "./ComplaintForm.css";
//  import {
//   Building2,
//   Utensils,
//   BookOpen,
//   CreditCard,
//   Home,
//   Briefcase,
//   Shield,
//   Dumbbell,
//   Users,
//   Film,
//   Car,
//   Bus,
//   Book,
// } from "lucide-react";
// const ComplaintForm = () => {
//   const [category, setCategory] = useState(null);
//   const [showAll, setShowAll] = useState(false);


//   const categories = [
//   { name: "Infrastructure", icon: "🏗️" },
//   { name: "Canteen", icon: "🍽️" },
//   { name: "Examination", icon: "📖" },
//   { name: "Fee Payments and Accounts", icon: "💳" },
//   { name: "Boys Hostel", icon: "🏠" },
//   { name: "Girls Hostel", icon: "🏡" },
//   { name: "Hostel Food", icon: "🍲" },
//   { name: "Extracurricular and Events", icon: "🏆" }, 
//   { name: "Security", icon: "🛡️" },
//   { name: "Sports", icon: "⚽" },
//   { name: "Housekeeping", icon: "🧹" },
//   { name: "Audio-Visual Equipment", icon: "🎥" },
//   { name: "Parking", icon: "🚗" },
//   { name: "Transport", icon: "🚌" },
//   { name: "Others", icon: "📦" },
// ];

//   // Decide which categories to show
//   const displayedCategories = showAll ? categories : categories.slice(0, 7);

//   return (
//     <div className="complaint-container">
    
//       {/* Complaint Form */}
//       <form className="form ">
//         <p className="reg">Register Complaint</p>
//           <p>GURUMETKAL BHARATH</p>
//         {/* Complaint Title */}
//         <div className="input-group">
//           <label>Complaint Title *</label>
//           <input
//             type="text"
//             placeholder="Enter a clear, descriptive title..."
//           />
//         </div>

// <div className="input-group">
//       <label>Category *</label>
//       <div className="category-grid">
//         {displayedCategories.map((cat) => (
//           <button
//             key={cat.name}
//             type="button"
//             className={`category-btn ${category === cat.name ? "active" : ""}`}
//             onClick={() => setCategory(cat.name)}
//           >
//               <span className="icon">{cat.icon}</span>
//             <span>{cat.name}</span>
//           </button>
//         ))}

//         {/* Show More / Show Less card */}
//         <button
//           type="button"
//           className="category-btn more-btn"
//           onClick={() => setShowAll(!showAll)}
//         >
//           {showAll ? "Show Less" : "More Options"}
//         </button>
//       </div>
//     </div>


//         {/* Description */}
//         <div className="input-group">
//           <label>Detailed Description *</label>
//           <textarea
//             placeholder="Please provide a comprehensive description of your issue..."
//             rows="5"
//           ></textarea>
//         </div>

//         {/* Submit */}
//         <button type="submit" className="submit-btn">
//           Submit Complaint
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ComplaintForm;


