import React, { useState, useEffect } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { HiOutlineThumbUp, HiOutlineThumbDown } from "react-icons/hi";
import { Clock, CalendarDays, ChevronDown, ChevronUp } from "lucide-react";
import { FaPlus, FaCalendarAlt, FaExclamationCircle,FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import axios from "axios";
import { MdOutlineTextsms } from "react-icons/md";
import "./UserDashboard.css";

const UserDashboard = () => {
  const { user } = useAuth();
  const userEmail = user?.email;
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [expandedCards, setExpandedCards] = useState({});

  const baseUrl = process.env.REACT_APP_COMPLAINTS_APP_BE_URL;
  const DEFAULT_IMAGE = "https://static.vecteezy.com/system/resources/previews/007/719/637/non_2x/no-camera-or-no-photo-allowed-sign-the-flat-icon-crossed-out-good-for-icon-sticker-message-flat-design-with-grey-color-vector.jpg";


useEffect(() => {
  if (userEmail) {
    // Get token from localStorage
    const token = localStorage.getItem("authToken");

    axios
      .get(`${baseUrl}/user-api/view-complaints/${userEmail}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to headers
        },
      })
      .then((response) => {
        setComplaints(response.data.complaints);
      })
      .catch((error) => {
        console.error("Error fetching complaints:", error);
      });
  }
}, [userEmail]);


  const toggleExpand = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return "Date not available";
    const date = new Date(isoString);
    return isNaN(date.getTime())
      ? "Invalid date"
      : date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
  };

  return (
    <div className="user-dashboard-container">
      <div className="dashboard-container">
        <div className="page-heading text-center">
          <h1>VNRVJIET Complaint Portal</h1>
          <p>Welcome to the platform where your voice matters!</p>
        </div>

        <div className="user-info mb-4">
          <div className="user-avatar">
            <img src={user?.picture} alt="Profile" className="rounded-circle" />
          </div>
          <div className="user-details">
            <h2>Welcome, {user?.name || "User"}</h2>
            <p><strong>Email:</strong> {userEmail}</p>
          </div>
        </div>

        <div className="my-complaints-heading mb-3">
          <h3>My Complaints</h3>
        </div>

        {complaints.length === 0 ? (
          <div className="no-complaints-message text-center">
            <p>You haven't raised any complaints yet. Have a concern? Speak up and let your voice be heard!</p>
            <Button className="raise-complaint-btn mt-3 px-4 py-2 fw-bold" onClick={() => navigate("/complaint-form")}>
              Raise a Complaint
            </Button>
          </div>
        ) : (
          <Row className="gx-4 gy-4">
            {complaints.map((complaint) => (
              <Col key={complaint._id} xs={12} sm={6} lg={4}>
                <Card className=" rounded-4 complaint-card">
                  <Card.Body className="d-flex flex-column">
{/* Complaint image with status overlay (same as Home) */}
<div className="complaint-image-wrapper mt-2 mb-3">
  <Card.Img
    variant="top"
    src={complaint.image || DEFAULT_IMAGE}
    alt="complaint"
    className="complaint-image rounded-3"
    style={{ maxHeight: "200px", objectFit: "cover", width: "100%" }}
  />
  <div className="status-overlay">
    <span className={`status-pill ${complaint.status.toLowerCase()}`}>
      {complaint.status}
    </span>
  </div>
</div>


{/* Date line below status */}
<div className="d-flex align-items-center text-muted small mb-3 mt-2">
  <span
    style={{
      backgroundColor: "#e0f0ff",
      color: "#1e90ff",
      padding: "6px",
      borderRadius: "10px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "28px",
      height: "28px",
      marginRight: "8px",
    }}
  >
    <FaCalendarAlt style={{ fontSize: "14px" }} />
  </span>
    <span style={{ color: "#1e90ff", fontWeight: "700" }}>
    {formatDateTime(complaint.createdAt || complaint.date || complaint.timestamp || complaint.created_on)}
  </span>
</div>


                    <h5 className="fw-bold mb-2">{complaint.title}</h5>

                    <Card.Text className="text-secondary mb-2">
                      {complaint.description.split(" ").length > 20 ? (
                        <>
                          {expandedCards[complaint.complaint_id]
                            ? complaint.description
                            : complaint.description.split(" ").slice(0, 20).join(" ") + "..."}
                          <span
                            className="ms-2 text-primary"
                            style={{ cursor: "pointer" }}
                            onClick={() => toggleExpand(complaint.complaint_id)}
                          >
                            {expandedCards[complaint.complaint_id] ? "View less" : "View more"}
                          </span>
                        </>
                      ) : (
                        complaint.description
                      )}
                    </Card.Text>

                    {complaint.comments?.length > 0 && (
                      <button
                        className={`admin-toggle-btn mt-2 ${
                          expandedCards[complaint.complaint_id] ? "hide-updates-btn" : "show-updates-btn"
                        }`}
                        onClick={() => toggleExpand(complaint.complaint_id)}
                      >
                        Admin Updates
                        {expandedCards[complaint.complaint_id] ? (
                          <ChevronUp size={16} className="ms-1" />
                        ) : (
                          <ChevronDown size={16} className="ms-1" />
                        )}
                      </button>
                    )}

                    {expandedCards[complaint.complaint_id] && (
                      <div className="admin-updates mt-3">
                        <h6 className="d-flex align-items-center">
                          <MdOutlineTextsms className="me-2 text-secondary" size={18} /> Admin Updates
                        </h6>
                        <div className="updates-container">
                          {complaint.comments.map((update, index) => (
<div key={index} className="update-entry">
  <div className="d-flex justify-content-between align-items-start flex-wrap">
    
    {/* EMAIL + ICON */}
    <div className="d-flex align-items-center mb-1">
      <FaUser className="me-2 text-purple" size={18} />
      <div>
        <strong style={{ fontSize: "14px" }}>{update.email}</strong>
      </div>
    </div>

    {/* TIME */}
    <div className="update-time d-flex align-items-center ms-auto">
      <Clock size={14} className="me-1 text-muted" />
      <small>{formatDateTime(update.date)}</small>
    </div>
  </div>

  {/* TEXT (own line) */}
  <div className="mt-1 ps-4">
    <p className="update-text mb-1">{update.text}</p>
  </div>
</div>

                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-auto d-flex justify-content-between align-items-center pt-3">
                      <div className="d-flex align-items-center gap-3">
                        <span className="text-success d-flex align-items-center">
                          <HiOutlineThumbUp className="me-1" size={20} />
                          {complaint.likes}
                        </span>
                        <span className="text-danger d-flex align-items-center">
                          <HiOutlineThumbDown className="me-1" size={20} />
                          {complaint.dislikes}
                        </span>
                      </div>
                      <span className="category-tag1">{complaint.category}</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        <div className="text-center mt-4">
              <button className="add-complaint-btn" onClick={() => navigate("/complaint-form")}>
          <FaPlus className="plus-icon" /> Add Complaint
        </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
