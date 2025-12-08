import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import { Modal } from "react-bootstrap";
import {
  CheckCircleFill,
  Send,
  PersonFill,
  TagFill,
  FileTextFill,
  ImageFill,
  ChevronDown,
  ChevronUp,
  ExclamationTriangleFill, // for error icon
} from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import "./ComplaintForm.css";

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
  { name: "Library", icon: "📚" },
  { name: "IT and Networking", icon: "💻" },
  { name: "Others", icon: "📦" },
];

const ComplaintForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    room_number: "",
    internet_speed: "",
    mobile_number: "",
    issue_duration: "",
  });



  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [warning, setWarning] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSizeError, setShowSizeError] = useState(false); // NEW state for size error modal

  // Image upload state
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const displayedCategories = showAll ? categoriesList : categoriesList.slice(0, 7);
  const baseUrl = process.env.REACT_APP_COMPLAINTS_APP_BE_URL;

  const normalizedCategory = typeof formData.category === "string" ? formData.category.trim().toLowerCase() : "";
  const isITCategory = [
    "it and networking",
    "it & networking",
    "it networking",
    "it/networking",
  ].includes(normalizedCategory);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCategorySelect = (cat) => {
    // when category changes, reset IT-specific fields
    setFormData({
      ...formData,
      category: cat,
      room_number: "",
      internet_speed: "",
      mobile_number: "",
      issue_duration: "",
    });
    setShowAll(false); // collapse after selecting
  };

  // Handle image selection with size validation
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 15000 * 1024) {
        setShowSizeError(true); // show popup modal
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
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
      let imageUrl = null;

      // ✅ Upload image to Cloudinary if user selected one
      if (image) {
        const imgData = new FormData();
        imgData.append("file", image);
        imgData.append("upload_preset", "complaint_uploads"); // your Cloudinary preset

        const uploadRes = await axios.post(
          `https://api.cloudinary.com/v1_1/dbsrpikci/image/upload`,
          imgData
        );

        imageUrl = uploadRes.data.secure_url; // ✅ Cloudinary hosted image
      }

      // determine if category is IT & Networking (match frontend label)
      const normalizedCategory = typeof formData.category === "string" ? formData.category.trim().toLowerCase() : "";
      const isITCategory = [
        "it and networking",
        "it & networking",
        "it networking",
        "it/networking",
        "it and networking",
      ].includes(normalizedCategory);

      // client-side validation for IT fields
      if (isITCategory) {
        if (
          !formData.room_number ||
          !formData.internet_speed ||
          !formData.mobile_number ||
          !formData.issue_duration
        ) {
          setWarning("Please fill all IT & Networking fields: Room, Internet Speed, Mobile Number and Issue Duration.");
          setLoading(false);
          return;
        }
      }

      const complaintData = {
        complaint_id: Date.now().toString(),
        title: formData.title,
        category: formData.category,
        description: formData.description,
        user_id: user?.email,
        image: imageUrl, // ✅ store Cloudinary URL
        // include IT-specific fields only when the selected category is IT
        ...(isITCategory
          ? {
              room_number: formData.room_number,
              internet_speed: formData.internet_speed,
              mobile_number: formData.mobile_number,
              issue_duration: formData.issue_duration,
            }
          : {}),
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
        setFormData({ title: "", category: "", description: "", room_number: "", internet_speed: "", mobile_number: "", issue_duration: "" });
        setImage(null);
        setImagePreview(null);
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
    color: "black",
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

  const labelStyle = {
    fontWeight: "600",
    fontSize: "15px",
    marginBottom: "8px",
    color: "#f5eeeeff",
  };

  const lightBlue = "#4da6ff";

  return (
    <div className="complaint-container">
      <h2 style={headingStyle}>Register a Complaint</h2>

      <form className="form" onSubmit={handleSubmit}>
        {/* User info */}
        <div style={userInfoStyle}>
          <img
            src={user?.picture || "/default-avatar.png"}
            alt="User Avatar"
            style={avatarStyle}
          />
          <span style={{ fontSize: "20px", color: "#f9f3f3ff", fontFamily: "serif" }}>
            {user?.name}
          </span>
        </div>

        {/* Title */}
        <div className="input-group">
          <label style={labelStyle}>
            {/* <span className="icon-circle">
              <PersonFill size={18} color={lightBlue} />
            </span> */}
          <span className="label-icon purple me-2">
            <i className="bi bi-info-lg"></i>
          </span>
            {" "}
            Request Title *
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

        {/* Category */}
        <div className="input-group">
          <div className="category-label-wrapper">
            <label style={labelStyle}>
              {/* <span className="icon-circle">
                <TagFill size={18} color={lightBlue} />
              </span> */}
            <span className="label-icon orange me-2">
              <i className="bi bi-tag"></i>
            </span>
              {" "}
              Category
            </label>
          </div>
          <div className="category-grid">
            {/* {formData.category ? (
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
            ) : ( */}




            {formData.category ? (
  <div className="category-btn active selected-category-card">
    <span className="icon">
      {categoriesList.find((c) => c.name === formData.category)?.icon}
    </span>
    <span className="cat-name">{formData.category}</span>

    {/* Close button INSIDE card */}
    <button
      type="button"
      className="close-btn-inside"
      onClick={() => {
        setFormData({ ...formData, category: "" });
        setShowAll(true);
      }}
    >
      ×
    </button>
  </div>
) : (



              <>
                {displayedCategories.map((cat) => (
                  <button
                    key={cat.name}
                    type="button"
                    className={`category-btn ${formData.category === cat.name ? "active" : ""}`}
                    onClick={() => handleCategorySelect(cat.name)}
                  >
                    <span className="icon">{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
                {/* <button
                  type="button"
                  className="category-btn more-btn"
                  onClick={() => setShowAll(!showAll)}
                >
                  <span className="icon-circle">
                    {showAll ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </span>
                  {showAll ? "Show Less" : "More Options"}
                </button> */}



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

        {/* Description */}
        <div className="input-group">
          <label style={labelStyle}>
            {/* <span className="icon-circle">
              <FileTextFill size={18} color={lightBlue} />
            </span> */}
          <span className="label-icon dark-purple me-2">
            <i className="bi bi-card-text"></i>
          </span>
            {" "}
            Detailed Description *
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

        {/* IT & Networking additional fields (shown only when category is IT) */}
        {isITCategory && (
          <div className="it-fields">
            <div className="input-group">
              <label style={labelStyle}>Room Number *</label>
              <input
                type="text"
                name="room_number"
                value={formData.room_number || ""}
                onChange={handleChange}
                placeholder="e.g. B-204 or Lab-A"
                required
              />
            </div>

            <div className="input-group">
              <label style={labelStyle}>Internet Speed *</label>
              <input
                type="text"
                name="internet_speed"
                value={formData.internet_speed || ""}
                onChange={handleChange}
                placeholder="e.g. 0.5 Mbps or 10 Mbps"
                required
              />
            </div>

            <div className="input-group">
              <label style={labelStyle}>Mobile Number *</label>
              <input
                type="tel"
                name="mobile_number"
                value={formData.mobile_number || ""}
                onChange={handleChange}
                placeholder="e.g. 9876543210"
                required
              />
            </div>

            <div className="input-group">
              <label style={labelStyle}>Issue Duration *</label>
              <input
                type="text"
                name="issue_duration"
                value={formData.issue_duration || ""}
                onChange={handleChange}
                placeholder="e.g. 2 hours, since yesterday"
                required
              />
            </div>
          </div>
        )}

        {/* Image Upload */}
        <div className="input-group image-upload-container">
          <div className="upload-label">
            <label>
              {/* <span className="icon-circle">
                <ImageFill size={18} color={lightBlue} />
              </span> */}
          <span className="label-icon blue me-2">
            <i className="bi bi-image"></i>
          </span>
              {" "}
              Upload Image (Optional)
            </label>
          </div>

          <div className="upload-box-wrapper">
            <div className="upload-box">
              {!imagePreview ? (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input"
                    id="file-upload"
                    style={{ display: "none" }}
                  />
                  <label htmlFor="file-upload" className="upload-placeholder">
                    <div className="upload-icon">
                      ⬆️
                      <div className="upload-line"></div>
                    </div>
                    <span className="upload-text">Upload Image</span>
                  </label>
                </>
              ) : (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
            <p className="file-size-note m-2">Preferred size: ≤ 1.5MB</p>
          </div>
        </div>

        {/* <p className="complaint-note mt-3 d-flex  ">
          <i className="bi bi-exclamation-triangle-fill text-warning"></i>
          <span className="warningred">
            False or invalid requests are strictly prohibited. Only genuine issues will be considered.
          </span>
        </p> */}
<p className="complaint-note mt-3 d-flex align-items-start no-padding-left">
  <i className="bi bi-exclamation-triangle-fill text-warning"></i>
  <span className="warningred ms-2">
    False or invalid requests are strictly prohibited. Only genuine issues will be considered.
  </span>
</p>



        {/* Submit */}
        <button type="submit" className="submit-btn" disabled={loading}>
          <Send style={{ marginRight: "8px", verticalAlign: "middle" }} size={18} color="#fff" />
          {loading ? "Submitting..." : "Register Request"}
        </button>

        {warning && (
          <p className="form-warning mt-3">
            <span className="text-danger">⚠</span>{" "}
            <span className="text-white">{warning}</span>
          </p>
        )}
        {message && <p className="form-message">{message}</p>}
      </form>

      {/* ✅ Success Modal */}
      <Modal show={showSuccess} onHide={() => setShowSuccess(false)} centered>
        <Modal.Body className="text-center p-5">
          <CheckCircleFill className="success-icon" />
          <h5 className="text-success">Request Registered Successfully!</h5>
        </Modal.Body>
      </Modal>

      {/* ❌ File Size Error Modal */}
      <Modal show={showSizeError} onHide={() => setShowSizeError(false)} centered>
        <Modal.Body className="text-center p-5">
          <ExclamationTriangleFill className="text-danger" size={50} />
          <h5 className="text-danger mt-3">File Too Large!</h5>
          <p>Please upload an image ≤ 1.5MB and try again.</p>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ComplaintForm;
