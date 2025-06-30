import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import { Modal } from "react-bootstrap";
import { CheckCircleFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import "./ComplaintForm.css";

const CATEGORIES = [
  "Infrastructure",
  "Canteen",
  "Examination",
  "Fee Payments and Accounts",
  "Boys Hostel",
  "Girls Hostel",
  "Hostel Food",
  "Extracurricular and Events",
  "Security",
  "Sports",
  "Housekeeping",
  "Audio-Visual Equipment",
  "Parking",
  "Transport",
  "Others",
];

const ComplaintForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [warning, setWarning] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 992);

  const baseUrl = process.env.REACT_APP_COMPLAINTS_APP_BE_URL;

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 992);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

      const response = await axios.post(`${baseUrl}/user-api/add-complaint`, complaintData);

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

  // Styles
  const cardStyle = {
    maxWidth: "520px",
    margin: "100px auto 60px auto",
    padding: "30px",
    borderRadius: "20px",
    background: "#fff",
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    fontFamily: "'Segoe UI', sans-serif",
    width: "90%",
  };

  const headingStyle = {
    fontSize: "24px",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "20px",
    fontFamily: "serif",
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
    fontSize: "16px",
    fontWeight: "600",
    color: "#2c3e50",
  };

  const labelStyle = {
    fontWeight: "600",
    fontSize: "14px",
    marginBottom: "4px",
    color: "#333",
  };

  const inputStyle = {
    padding: "10px",
    fontSize: "14px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    backgroundColor: "#f8f8f8",
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box",
  };

  const twoColumn = {
    display: "flex",
    flexDirection: isDesktop ? "row" : "column",
    gap: "12px",
    marginBottom: "10px",
    flexWrap: "wrap",
  };

 const titleFieldStyle = {
  flex: isDesktop ? "3 1 0%" : "1 1 100%", // 3 parts
  minWidth: "0",
};

const categoryFieldStyle = {
  flex: isDesktop ? "2 1 0%" : "1 1 100%", // 2 parts
  minWidth: "0",
};


  const buttonStyle = {
    marginTop: "20px",
    width: "100%",
    padding: "12px",
    borderRadius: "30px",
    fontSize: "15px",
    fontWeight: "bold",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
    transition: "0.3s",
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: "100px",
    resize: "vertical",
  };

  return (
    <div style={cardStyle}>
      <h2 style={headingStyle}>Register a Complaint</h2>

      <div style={userInfoStyle}>
        <img src={user?.picture} alt="User Avatar" style={avatarStyle} />
        <span style={usernameStyle}>{user?.name}</span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="complaint-form"
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <div style={twoColumn}>
          <div style={titleFieldStyle}>
            <label style={labelStyle}>Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Short title"
              style={inputStyle}
              required
            />
          </div>

          <div style={categoryFieldStyle}>
            <label style={labelStyle}>Category:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={inputStyle}
              required
            >
              <option value="">Select...</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label style={labelStyle}>Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Explain the issue clearly..."
          style={textareaStyle}
          required
        ></textarea>

        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? "Submitting..." : "Register Complaint"}
        </button>
      </form>

      {warning && (
        <p
          style={{
            color: "red",
            fontWeight: "bold",
            marginTop: "10px",
            textAlign: "center",
          }}
        >
          ⚠️ {warning}
        </p>
      )}

      {message && (
        <p style={{ color: "red", textAlign: "center", marginTop: "10px" }}>
          {message}
        </p>
      )}

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








