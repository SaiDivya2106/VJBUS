import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { HiOutlineThumbUp, HiOutlineThumbDown } from "react-icons/hi";
import { FaChartBar, FaEdit, FaCalendarAlt, FaClock, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { Card, Button, Row, Col, Form } from "react-bootstrap";
import { useAuth } from "../../Context/AuthContext";
import "./AdminPage.css";

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, isAdmin, adminCategory } = useAuth(); 
  const [complaints, setComplaints] = useState([]);
  const [sortOption, setSortOption] = useState("default");
  const [statusFilter, setStatusFilter] = useState("All");
  const baseUrl = process.env.REACT_APP_COMPLAINTS_APP_BE_URL;

  useEffect(() => {
    if (isAdmin && adminCategory) {
      fetchComplaints(adminCategory, statusFilter);
    }
  }, [isAdmin, adminCategory, statusFilter]); 

  const fetchComplaints = async (category, status) => {
    try {
      let url = `${baseUrl}/admin-api/filter-complaints?category=${category}`;
      if (status !== "All") {
        url += `&status=${status}`;
      }
      const response = await axios.get(url);
      setComplaints(response.data.complaints);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  const handleSort = (option) => {
    setSortOption(option);
  };

  useEffect(() => {
    let sortedComplaints = [...complaints];
    switch (sortOption) {
      case "most-liked":
        sortedComplaints.sort((a, b) => b.likes - a.likes);
        break;
      case "most-disliked":
        sortedComplaints.sort((a, b) => b.dislikes - a.dislikes);
        break;
      default:
        sortedComplaints.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
    setComplaints(sortedComplaints);
  }, [sortOption]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown Date";
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <FaExclamationCircle className="text-warning" />;
      case "Ongoing":
        return <FaClock className="text-primary" />;
      case "Resolved":
        return <FaCheckCircle className="text-success" />;
      default:
        return null;
    }
  };

  return (
    <div className="container">
      {/* Header Section */}
      <div className="text-center mt-3 mb-4">
        <h2 className="text-primary">
          Admin Complaints Dashboard <sup className="text-muted">({adminCategory})</sup>
        </h2>
        <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3 mt-2">
          <Form.Select
            className="me-3"
            value={sortOption}
            onChange={(e) => handleSort(e.target.value)}
            style={{ maxWidth: "160px" }}
          >
            <option value="default">Sort by: Latest</option>
            <option value="most-liked">Most Liked</option>
            <option value="most-disliked">Most Disliked</option>
          </Form.Select>
          
          <Form.Select
            className="me-3"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ maxWidth: "160px" }}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Resolved">Resolved</option>
          </Form.Select>

          <Button
            variant="outline-primary"
            onClick={() => navigate("/admin-analysis")}
            className="d-flex align-items-center"
          >
            <FaChartBar className="me-2" />
            Analysis
          </Button>
        </div>
      </div>

      {/* Complaints List */}
      {complaints.length > 0 ? (
  <Row className="g-4">
    {complaints.map((complaint) => (
      <Col key={complaint.complaint_id} xs={12} sm={6} lg={4}>
        <Card className="shadow-lg p-3 rounded glass-effect" style={{ height: "100%" }}>
          <div className="d-flex justify-content-end">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => navigate(`/complaints-details/${complaint.complaint_id}`)}
            >
              <FaEdit style={{ fontSize: "1.5em" }} />
            </Button>
          </div>
          <Card.Body>
            <Card.Title className="fw-bold text-dark">{complaint.title}</Card.Title>
            <Card.Text className="text-muted">
              <FaCalendarAlt className="me-2" />
              {formatDate(complaint.timestamp)}
            </Card.Text>
            <Card.Text>
              {complaint.description.length > 100
                ? `${complaint.description.substring(0, 100)}...`
                : complaint.description}
            </Card.Text>
            <div className="d-flex justify-content-between align-items-center">
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <div className="vote-display upvote" style={{ color: "green", display: "flex", alignItems: "center", gap: "5px" }}>
                  <HiOutlineThumbUp size={20} />
                  <span className="vote-count">{complaint.likes}</span>
                </div>
                <div className="vote-display downvote" style={{ color: "red", display: "flex", alignItems: "center", gap: "5px" }}>
                  <HiOutlineThumbDown size={20} />
                  <span className="vote-count">{complaint.dislikes}</span>
                </div>
              </div>
              <div className="d-flex align-items-center">
                {getStatusIcon(complaint.status)}
                <span className={`ms-2 fw-bold status-${complaint.status.toLowerCase()}`}>{complaint.status}</span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    ))}
  </Row>
) : (
  <div className="text-center mt-5">
    <h4 className="text-muted">
      <FaExclamationCircle className="me-2 text-warning" />
      No complaints available 
    </h4>
  </div>
)}
    </div>
  );
};

export default AdminPage;
