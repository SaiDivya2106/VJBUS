import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { MdOutlineTextsms } from "react-icons/md";
import {
  Timer,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  Search,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import "./Home.css";

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

const STATUSES = ["Pending", "Ongoing", "Resolved"];

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userVotes, setUserVotes] = useState({});
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const baseUrl = process.env.REACT_APP_COMPLAINTS_APP_BE_URL;

  useEffect(() => {
    fetchComplaints();
  }, [categoryFilter, statusFilter]);

  const fetchComplaints = async () => {
  setLoading(true);
  setError(false);

  try {
    const url = `${baseUrl}/user-api/filter-complaints?category=${categoryFilter}&status=${statusFilter}`;
    const response = await axios.get(url);
    const data = response.data?.complaints || [];
    setComplaints(data);

    const votes = {};
    data.forEach((complaint) => {
      if (Array.isArray(complaint.votedUsers)) {
        const userVote = complaint.votedUsers.find((v) => v.email === user?.email);
        if (userVote) votes[complaint.complaint_id] = userVote.type;
      }
    });
    setUserVotes(votes);
  } catch (err) {
    console.error("Error fetching complaints:", err);
    setError(true);
    setComplaints([]); // Optional: clear data on error
  } finally {
    setLoading(false);
  }
};


  const filteredComplaints = complaints.filter((complaint) =>
    complaint.title.toLowerCase().includes(search.toLowerCase()) ||
    complaint.description.toLowerCase().includes(search.toLowerCase())
  );

  const toggleUpdates = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleDescription = (id) => {
    setExpandedDescriptions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleVote = async (id, type) => {
    if (userVotes[id] === type) return;

    try {
      const url = `${baseUrl}/user-api/${type === "upvote" ? "like" : "dislike"}-complaint/${id}`;
      await axios.post(url, { email: user?.email });
      setUserVotes((prevVotes) => ({ ...prevVotes, [id]: type }));
      fetchComplaints();
    } catch (error) {
      console.error("Error updating vote:", error.response?.data || error.message);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown Date";
    return new Date(timestamp).toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="home-container-page">
      <div className="homepage-container container">
        <div className="header container">
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search complaints..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="complaints-list container">
          {loading ? (
  <div className="loading-container">
    <div className="spinner" />
    <p>Loading complaints...</p>
  </div>
) : error ? (
  <div className="error-message">Failed to load complaints. Please check your connection.</div>
) : filteredComplaints.length === 0 ? (
  <p>No complaints found.</p>
) : (
  filteredComplaints.map((complaint) => (
              <div key={complaint.complaint_id} className="complaint-card">
                <div className="card-header">
                  <div className="date-info">
                    <Calendar className="calendar-icon" size={18} />
                    <span className="date">{formatDate(complaint.timestamp)}</span>
                  </div>
                  <div className="voting-section">
                    <button
                      className={`vote-btn upvote ${userVotes[complaint.complaint_id] === "upvote" ? "voted" : ""}`}
                      onClick={() => handleVote(complaint.complaint_id, "upvote")}
                    >
                      <ThumbsUp size={20} />
                      <span className="vote-count">{complaint.likes}</span>
                    </button>
                    <button
                      className={`vote-btn downvote ${userVotes[complaint.complaint_id] === "downvote" ? "voted" : ""}`}
                      onClick={() => handleVote(complaint.complaint_id, "downvote")}
                    >
                      <ThumbsDown size={20} />
                      <span className="vote-count">{complaint.dislikes}</span>
                    </button>
                  </div>
                </div>

                <div className="card-content">
                  <h4>{complaint.title}</h4>
                  <p>
                    {expandedDescriptions[complaint.complaint_id]
                      ? complaint.description
                      : `${complaint.description.substring(0, 250)}${
                          complaint.description.length > 250 ? "..." : ""
                        }`}
                    {complaint.description.length > 250 && (
                      <span
                        className="view-more-link"
                        onClick={() => toggleDescription(complaint.complaint_id)}
                      >
                        {expandedDescriptions[complaint.complaint_id] ? " View Less" : " View More"}
                      </span>
                    )}
                  </p>

                  <div className="card-footer">
                    <span className="category-tag">{complaint.category}</span>
                    <span className={`status-badge ${complaint.status.toLowerCase()}`}>
                      {complaint.status === "Resolved" ? (
                        <CheckCircle2 size={18} />
                      ) : (
                        <Timer size={18} />
                      )}
                      {complaint.status}
                    </span>
                  </div>

                  {complaint.comments && complaint.comments.length > 0 && (
                    <button
                      className={`admin-update-btn ${expanded[complaint.complaint_id] ? "expanded" : ""}`}
                      onClick={() => toggleUpdates(complaint.complaint_id)}
                    >
                      {expanded[complaint.complaint_id] ? "Hide Admin Updates" : "Show Admin Updates"}
                      {expanded[complaint.complaint_id] ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </button>
                  )}

                  {expanded[complaint.complaint_id] && complaint.comments?.length > 0 && (
                    <div className="admin-updates">
                      <h3 className="updates-title">
                        <MdOutlineTextsms /> Admin Updates:
                      </h3>
                      <div className="updates-list">
                        {complaint.comments.map((comment) => (
                          <div key={comment.id} className="update-item">
                            <span className="update-text">{comment.text}</span>
                            <span className="update-time">
                              <Clock className="clock-icon" size={12} /> {formatDate(comment.date)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <button className="add-complaint-btn" onClick={() => navigate("/complaint-form")}>
          <FaPlus className="plus-icon" /> Add Complaint
        </button>
      </div>
    </div>
  );
};

export default Home;
