import React, { useState, useEffect } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { FaThumbsUp, FaThumbsDown, FaUserCircle, FaGithub } from "react-icons/fa"; // Icons for upvote/downvote, avatar, and GitHub
import { useAuth } from "../../Context/AuthContext"; // Import the useAuth hook
import axios from "axios"; // For making HTTP requests
import "./UserDashboard.css"; // Import the CSS file
import { HiOutlineThumbUp } from "react-icons/hi";
import { HiOutlineThumbDown } from "react-icons/hi";
import { Clock, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate


const UserDashboard = () => {
  // Get user details from AuthContext
  const { user } = useAuth();
  const userEmail = user?.email; // Get the user's email from context


  const navigate = useNavigate(); 


  // Initialize state for complaints and user details
  const [complaints, setComplaints] = useState([]);
  const [expandedComplaint, setExpandedComplaint] = useState(null);
  const baseUrl = process.env.REACT_APP_COMPLAINTS_APP_BE_URL;

  // Fetch complaints based on the user's email
  useEffect(() => {
    if (userEmail) {
      axios
        .get(`${baseUrl}/user-api/view-complaints/${userEmail}`)
        .then((response) => {
          setComplaints(response.data.complaints);
        })
        .catch((error) => {
          console.error("Error fetching complaints:", error);
        });
    }
  }, [userEmail]); // Run the effect whenever the userEmail changes

  // Toggle visibility of the full description when clicked
  const handleExpand = (complaintId) => {
    setExpandedComplaint(expandedComplaint === complaintId ? null : complaintId);
  };

  // Function to format date & time
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString(); // Converts to readable format (adjustable as needed)
  };

  return (
    <div className="user-dashboard-container">
      <div className="dashboard-container">
        {/* Page Heading */}
        <div className="page-heading">
          <h1>VNRVJIET Complaint Portal</h1>
          <p>Welcome to the platform where your voice matters!</p>
        </div>

        {/* User Info Section */}
        <div className="user-info ">
          <div className="user-avatar">
            <img src={user?.picture} className="rounded-circle"/>
          </div>
          <div className="user-details">
            <h2>Welcome, {user?.name || "User"}</h2>
            <p><strong>Email:</strong> {userEmail}</p>
          </div>
        </div>

        {/* My Complaints Heading */}
        <div className="my-complaints-heading">
          <h3>My Complaints</h3>
        </div>

        {/* Complaints Section */}
        {complaints.length === 0 ? (
          <div className="no-complaints-message">
            <p>You haven't raised any complaints yet. Have a concern? Speak up and let your voice be heard!</p>
            <Button 
      className="raise-complaint-btn mt-3 px-4 py-2 fw-bold"
      onClick={() => navigate("/complaint-form")}
    >
      Raise a Complaint
    </Button>
          </div>
        ) : (
        <Row className="complaints-cards mx-1 ">
          {complaints.map((complaint) => (
            <Col key={complaint._id} className="mb-4">

              <Card className="complaint-card">
                <Card.Body>
                  {/* Status Badge at Top Right */}
                  <div className="status-badge">
  <div className={`status ${complaint.status.toLowerCase()} flex items-center gap-2`}>
    {complaint.status.toLowerCase() === "pending" || complaint.status.toLowerCase() === "ongoing" ? (
      <Clock size={14} className="cs" />
    ) : (
      <CheckCircle className="text-green-500  " size={16} />
    )}
    <span className=" ms-1 ">{complaint.status}</span>
  </div>
</div>

                  <Card.Title>{complaint.title}</Card.Title>
                  <Card.Subtitle className="mb-2.3 text-muted">
                    <span className="fw-bold fs-6">category:</span> {complaint.category}
                  </Card.Subtitle>

                  <div className="mb-1  p-2 d-flex align-items-center">
          <HiOutlineThumbUp className="tu text-success fs-4 " /> {complaint.likes}
          {/* <span className="mx-2"></span> */}
          <HiOutlineThumbDown className="td text-danger fs-4  " /> {complaint.dislikes}
        </div>


{/* 
<div className="mb-1 ms-2 p-2 d-flex align-items-center">
          <HiOutlineThumbUp className="text-success fs-4 me-1" /> {complaint.likes}
          <span className="mx-5"></span>
          <HiOutlineThumbDown className="text-danger fs-4 ms-2 me-1" /> {complaint.dislikes}
        </div> */}


                  {/* Show description, GitHub issue, and Admin Updates only if expanded */}
                  {expandedComplaint === complaint.complaint_id && (
                    <>
                      <Card.Text>
                        <strong>Description:</strong> {complaint.description}
                      </Card.Text>


                      {/* Admin Updates Section */}
                      <div className="admin-updates mt-3">
                        <h5 className="updates-title">Admin Updates:</h5>
                        <div className="updates-container">
                          {complaint.comments && complaint.comments.length > 0 ? (
                            complaint.comments.map((update) => (
                              <div key={update.id} className="update-entry">
                                <p className="update-text">{update.text}</p>
                                <span className="update-time">{formatDateTime(update.date)}</span>
                              </div>
                            ))
                          ) : (
                            <p className="no-updates">No updates yet.</p>
                          )}
                        </div>
                      </div>
                    </>
                  )}

<Button
  className="view-details-btn mt-3"
  
  onClick={() => handleExpand(complaint.complaint_id)}
>
  {expandedComplaint === complaint.complaint_id ? "Hide Details" : "View Details"}
</Button>


                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        )}</div>
    </div>
  );
};

export default UserDashboard;
