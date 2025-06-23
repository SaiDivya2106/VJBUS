import React, { useState } from "react";
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
    githubIssue: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [warning, setWarning] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const baseUrl = process.env.REACT_APP_COMPLAINTS_APP_BE_URL;

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
        github_issue: formData.githubIssue || null,
      };

      const response = await axios.post(`${baseUrl}/user-api/add-complaint`, complaintData);

      if (response.status === 201) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate("/all-complaints");
        }, 3000);
        setFormData({ title: "", category: "", description: "", githubIssue: "" });
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

  return (
    <div className="complaint-container">
      <h2 className="headd">Register a Complaint</h2>

      <div className="user-info">
        <img src={user?.picture} alt="User Avatar" className="avatar" />
        <span className="username mt-2">{user?.name}</span>
      </div>

      <form onSubmit={handleSubmit} className="complaint-form">
        <label className="fs-6">Title:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter Title"
          required
        />

        <label className="fs-6">Tag:</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Select a category</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <label className="fs-6">Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Write description"
          required
        ></textarea>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Registering..." : "Register Complaint"}
        </button>
      </form>

      {warning && (
        <p className="warning text-danger" style={{ color: "red", fontWeight: "bold", marginTop: "10px" }}>
          ⚠️ {warning}
        </p>
      )}

      {message && <p className="message text-danger">{message}</p>}

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
