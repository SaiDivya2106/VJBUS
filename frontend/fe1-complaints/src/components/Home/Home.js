




//no 3 fid 1 grid

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaPlus } from "react-icons/fa";
// import { MdOutlineTextsms } from "react-icons/md";
// import {
//   Timer,
//   CheckCircle2,
//   ThumbsUp,
//   ThumbsDown,
//   Search,
//   Calendar,
//   Clock,
//   ChevronDown,
//   ChevronUp,
// } from "lucide-react";
// import axios from "axios";
// import { useAuth } from "../../Context/AuthContext";
// import "./Home.css";

// const CATEGORIES = [
//   "Infrastructure",
//   "Canteen",
//   "Examination",
//   "Fee Payments and Accounts",
//   "Boys Hostel",
//   "Girls Hostel",
//   "Hostel Food",
//   "Extracurricular and Events",
//   "Security",
//   "Sports",
//   "Housekeeping",
//   "Audio-Visual Equipment",
//   "Parking",
//   "Transport",
//   "Others",
// ];

// const STATUSES = ["Pending", "Ongoing", "Resolved"];

// const Home = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [userVotes, setUserVotes] = useState({});
//   const [categoryFilter, setCategoryFilter] = useState("");
  // const [statusFilter, setStatusFilter] = useState("");
  // const [search, setSearch] = useState("");
//   const [complaints, setComplaints] = useState([]);
//   const [expanded, setExpanded] = useState({});
//   const [expandedDescriptions, setExpandedDescriptions] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);

//   const baseUrl = process.env.REACT_APP_COMPLAINTS_APP_BE_URL;

//   useEffect(() => {
//     fetchComplaints();
//   }, [categoryFilter, statusFilter]);

//   const fetchComplaints = async () => {
//     setLoading(true);
//     setError(false);

//     try {
//       const url = `${baseUrl}/user-api/filter-complaints?category=${categoryFilter}&status=${statusFilter}`;
//       const response = await axios.get(url);
//       const data = response.data?.complaints || [];
//       setComplaints(data);

//       const votes = {};
//       data.forEach((complaint) => {
//         if (Array.isArray(complaint.votedUsers)) {
//           const userVote = complaint.votedUsers.find((v) => v.email === user?.email);
//           if (userVote) votes[complaint.complaint_id] = userVote.type;
//         }
//       });
//       setUserVotes(votes);
//     } catch (err) {
//       console.error("Error fetching complaints:", err);
//       setError(true);
//       setComplaints([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredComplaints = complaints.filter((complaint) =>
//     complaint.title.toLowerCase().includes(search.toLowerCase()) ||
//     complaint.description.toLowerCase().includes(search.toLowerCase())
//   );

//   const toggleUpdates = (id) => {
//     setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
//   };

//   const toggleDescription = (id) => {
//     setExpandedDescriptions((prev) => ({ ...prev, [id]: !prev[id] }));
//   };

//   const handleVote = async (id, type) => {
//     if (userVotes[id] === type) return;

//     try {
//       const url = `${baseUrl}/user-api/${type === "upvote" ? "like" : "dislike"}-complaint/${id}`;
//       await axios.post(url, { email: user?.email });
//       setUserVotes((prevVotes) => ({ ...prevVotes, [id]: type }));
//       fetchComplaints();
//     } catch (error) {
//       console.error("Error updating vote:", error.response?.data || error.message);
//     }
//   };

//   const formatDate = (timestamp) => {
//     if (!timestamp) return "Unknown Date";
//     return new Date(timestamp).toLocaleString("en-US", {
//       weekday: "short",
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const getTimeAgo = (isoString) => {
//     const now = new Date();
//     const past = new Date(isoString);
//     const diffInSeconds = Math.floor((now - past) / 1000);

//     const minutes = Math.floor(diffInSeconds / 60);
//     const hours = Math.floor(diffInSeconds / 3600);
//     const days = Math.floor(diffInSeconds / 86400);

//     if (diffInSeconds < 60) return "just now";
//     if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
//     if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
//     return `${days} day${days !== 1 ? "s" : ""} ago`;
//   };

//   return (
//     <div className="home-container-page">
//       <div className="homepage-container full-width-container">
        // <div className="header">
        //   <div className="search-container">
        //     <Search className="search-icon" size={20} />
        //     <input
        //       type="text"
        //       placeholder="Search complaints..."
        //       value={search}
        //       onChange={(e) => setSearch(e.target.value)}
        //       className="search-input"
        //     />
        //   </div>

        //   <select
        //     value={categoryFilter}
        //     onChange={(e) => setCategoryFilter(e.target.value)}
        //     className="filter-select"
        //   >
        //     <option value="">All Categories</option>
        //     {CATEGORIES.map((category) => (
        //       <option key={category} value={category}>
        //         {category}
        //       </option>
        //     ))}
        //   </select>

        //   <select
        //     value={statusFilter}
        //     onChange={(e) => setStatusFilter(e.target.value)}
        //     className="filter-select"
        //   >
        //     <option value="">All Status</option>
        //     {STATUSES.map((status) => (
        //       <option key={status} value={status}>
        //         {status}
        //       </option>
        //     ))}
        //   </select>
        // </div>

//         <div className="complaints-list">
//           {loading ? (
//             <div className="loading-container">
//               <div className="spinner" />
//               <p>Loading complaints...</p>
//             </div>
//           ) : error ? (
//             <div className="error-message">Failed to load complaints. Please check your connection.</div>
//           ) : filteredComplaints.length === 0 ? (
//             <p>No complaints found.</p>
//           ) : (
//             filteredComplaints.map((complaint) => (
//               <div key={complaint.complaint_id} className="complaint-card">
//                 <div className="card-header">
//                   <div className="date-info">
//                     <Calendar className="calendar-icon" size={18} />
//                     <span className="date">{formatDate(complaint.timestamp)}</span>
//                     <span className="text-muted ms-2 small">({getTimeAgo(complaint.timestamp)})</span>
//                   </div>

//                   <div className="voting-section">
//                     <button
//                       className={`vote-btn upvote ${userVotes[complaint.complaint_id] === "upvote" ? "voted" : ""}`}
//                       onClick={() => handleVote(complaint.complaint_id, "upvote")}
//                     >
//                       <ThumbsUp size={20} />
//                       <span className="vote-count">{complaint.likes}</span>
//                     </button>

//                     <button
//                       className={`vote-btn downvote ${userVotes[complaint.complaint_id] === "downvote" ? "voted" : ""}`}
//                       onClick={() => handleVote(complaint.complaint_id, "downvote")}
//                     >
//                       <ThumbsDown size={20} />
//                       <span className="vote-count">{complaint.dislikes}</span>
//                     </button>
//                   </div>
//                 </div>

//                 <div className="card-content">
//                   <h4>{complaint.title}</h4>
//                   <p>
//                     {expandedDescriptions[complaint.complaint_id]
//                       ? complaint.description
//                       : `${complaint.description.substring(0, 250)}${
//                           complaint.description.length > 250 ? "..." : ""
//                         }`}
//                     {complaint.description.length > 250 && (
//                       <span
//                         className="view-more-link"
//                         onClick={() => toggleDescription(complaint.complaint_id)}
//                       >
//                         {expandedDescriptions[complaint.complaint_id] ? " View Less" : " View More"}
//                       </span>
//                     )}
//                   </p>

//                   <div className="card-footer">
//                     <span className="category-tag">{complaint.category}</span>
//                     <span className={`status-badge ${complaint.status.toLowerCase()}`}>
//                       {complaint.status === "Resolved" ? (
//                         <CheckCircle2 size={18} />
//                       ) : (
//                         <Timer size={18} />
//                       )}
//                       {complaint.status}
//                     </span>
//                   </div>

//                   {complaint.comments && complaint.comments.length > 0 && (
//                     <button
//                       className={`admin-update-btn ${expanded[complaint.complaint_id] ? "expanded" : ""}`}
//                       onClick={() => toggleUpdates(complaint.complaint_id)}
//                     >
//                       {expanded[complaint.complaint_id] ? "Hide Admin Updates" : "Show Admin Updates"}
//                       {expanded[complaint.complaint_id] ? (
//                         <ChevronUp size={18} />
//                       ) : (
//                         <ChevronDown size={18} />
//                       )}
//                     </button>
//                   )}

//                   {expanded[complaint.complaint_id] && complaint.comments?.length > 0 && (
//                     <div className="admin-updates">
//                       <h3 className="updates-title">
//                         <MdOutlineTextsms /> Admin Updates:
//                       </h3>
//                       <div className="updates-list">
//                         {complaint.comments.map((comment) => (
//                           <div key={comment.id} className="update-item">
//                             <span className="update-text">{comment.text}</span>
//                             <span className="update-time">
//                               <Clock className="clock-icon" size={12} /> {formatDate(comment.date)}
//                             </span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         <button className="add-complaint-btn" onClick={() => navigate("/complaint-form")}>
//           <FaPlus className="plus-icon" /> Add Complaint
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Home;































import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ThumbsUp, ThumbsDown, ChevronDown, ChevronUp, Clock, CalendarDays, FileX } from "lucide-react";
import { FaPlus, FaCalendarAlt, FaUser } from "react-icons/fa";
import { MdOutlineTextsms } from "react-icons/md";
import { Card, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import './Home.css';


const CATEGORIES = [
  "Infrastructure", "Canteen", "Examination", "Fee Payments and Accounts", "Boys Hostel", "Girls Hostel",
  "Hostel Food", "Extracurricular and Events", "Security", "Sports", "Housekeeping", "Audio-Visual Equipment",
  "Parking", "Transport","Library","IT and Networking", "Others"
];

const STATUSES = ["Pending", "Ongoing", "Resolved"];

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [userVotes, setUserVotes] = useState({});
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);

  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  
  const baseUrl = process.env.REACT_APP_COMPLAINTS_APP_BE_URL;

  useEffect(() => {
    fetchComplaints();
  }, [categoryFilter, statusFilter]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const url = `${baseUrl}/user-api/filter-complaints?category=${categoryFilter}&status=${statusFilter}`;
      const token = localStorage.getItem("authToken");

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data?.complaints || [];
      setComplaints(data);

      // Track votes
      const votes = {};
      data.forEach((complaint) => {
        if (Array.isArray(complaint.votedUsers)) {
          const userVote = complaint.votedUsers.find(
            (v) => v.email === user?.email
          );
          if (userVote) votes[complaint.complaint_id] = userVote.vote;
        }
      });
      setUserVotes(votes);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown Date";
    const date = new Date(timestamp);
    return date.toDateString();
  };
  const toggleDescription = (complaintId) => {
  setExpandedDescriptions((prev) => ({
    ...prev,
    [complaintId]: !prev[complaintId],
  }));
};

  const handleVote = async (id, type) => {
    const prevVote = userVotes[id];
    try {
      const token = localStorage.getItem("authToken");
      const url = `${baseUrl}/user-api/${type === "upvote" ? "like" : "dislike"}-complaint/${id}`;
      await axios.post(url, { email: user?.email }, { headers: { Authorization: `Bearer ${token}` } });

      setUserVotes((prevVotes) => {
        if (prevVote === type) {
          const updatedVotes = { ...prevVotes };
          delete updatedVotes[id];
          return updatedVotes;
        } else {
          return { ...prevVotes, [id]: type };
        }
      });

      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) => {
          if (complaint.complaint_id !== id) return complaint;
          let likes = complaint.likes;
          let dislikes = complaint.dislikes;

          if (prevVote === "upvote") likes = Math.max(0, likes - 1);
          if (prevVote === "downvote") dislikes = Math.max(0, dislikes - 1);

          if (prevVote === type) {
            return { ...complaint, likes, dislikes };
          } else {
            if (type === "upvote") likes += 1;
            else dislikes += 1;
            return { ...complaint, likes, dislikes };
          }
        })
      );






      if (expandedCard && expandedCard.complaint_id === id) {
      let updatedLikes = expandedCard.likes;
      let updatedDislikes = expandedCard.dislikes;

      if (prevVote === "upvote") updatedLikes = Math.max(0, updatedLikes - 1);
      if (prevVote === "downvote") updatedDislikes = Math.max(0, updatedDislikes - 1);

      if (prevVote !== type) {
        if (type === "upvote") updatedLikes += 1;
        else updatedDislikes += 1;
      }

      setExpandedCard({
        ...expandedCard,
        likes: updatedLikes,
        dislikes: updatedDislikes,
      });
    }


    } catch (err) {
      console.error("Error updating vote:", err);
    }
  };
const getStatusBadge = (status) => {
  switch (status) {
    case "Pending": return <span className="status-pill status-pending">Pending</span>;
    case "Ongoing": return <span className="status-pill status-ongoing">Ongoing</span>;
    case "Resolved": return <span className="status-pill status-resolved">Resolved</span>;
    default: return null;
  }
};


  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.title.toLowerCase().includes(search.toLowerCase()) ||
      complaint.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter ? complaint.category === categoryFilter : true;
    const matchesStatus = statusFilter ? complaint.status === statusFilter : true;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <Container className="mt-5 home-container mb-2">
      {/* Filters + Search */}
      <div className="container mt-4 mb-4">
        <div className="d-flex flex-wrap justify-content-center gap-3">
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
            className="filter-select category-select"
          >
            <option value="">Categories</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-wrapper"><div className="spinner" /></div>
      ) : filteredComplaints.length === 0 ? (
        <div className="text-center text-muted mt-5 mb-5 fs-5 d-flex flex-column align-items-center">
          <FileX size={64} className="iconn mb-3 text-secondary" />
          <h5 className="text-dark fw-semibold">No complaints available</h5>
        </div>
      ) : (
        <div className={expandedCard ? "blurred-background" : ""}>
          <Row className="gx-4 gy-4">
            {filteredComplaints.map((complaint) => (
              <Col key={complaint.complaint_id} lg={4} md={6} sm={12}>
                <Card className="card-hover-effect p-3 glass-effect rounded-4 custom-card-container w-100 d-flex flex-column">
                  {/* {getStatusBadge(complaint.status)} */}
                    <div className="d-flex">
    {getStatusBadge(complaint.status)}
  </div>

                  <Card.Text className="mt-3 mb-0" style={{ fontSize: "0.9rem", fontWeight: "600", color: "#1e90ff" }}>
                    <span style={{
                      backgroundColor: "#e0f0ff",
                      color: "#1e90ff",
                      padding: "6px",
                      borderRadius: "10px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "28px",
                      height: "28px",
                      marginRight: "8px"
                    }}>
                      <FaCalendarAlt style={{ fontSize: "14px" }} />
                    </span>
                    {formatDate(complaint.timestamp)}
                  </Card.Text>

                  <Card.Title className="fw-bold text-dark mt-3 fs-4">{complaint.title}</Card.Title>
<Card.Text className="text-secondary mb-2">
  {expandedDescriptions[complaint.complaint_id]
    ? complaint.description
    : `${complaint.description.substring(0, 250)}${complaint.description.length > 250 ? "..." : ""}`}
  
  {complaint.description.length > 250 && (
    <span
      className="view-more-link ms-2"
      onClick={() => toggleDescription(complaint.complaint_id)}
      style={{ color: "#007bff", cursor: "pointer", fontWeight: 500 }}
    >
      {expandedDescriptions[complaint.complaint_id] ? "View Less" : "View More"}
    </span>
  )}
</Card.Text>

{/* 
                  <Card.Text className="text-secondary mb-2">
                    {complaint.description.split(" ").length > 18
                      ? complaint.description.split(" ").slice(0, 18).join(" ") + "..."
                      : complaint.description}
                  </Card.Text> */}

                  {complaint.comments && complaint.comments.length > 0 && (
                    <button className="admin-update-btn" onClick={() => setExpandedCard(complaint)}>
                      Show Admin Updates <ChevronDown size={18} />
                    </button>
                  )}

                  {/* Footer: category + votes */}
                  {/* <div className="mt-auto d-flex w-100 align-items-center pt-3 px-0">
                    <span className="category-tag px-3 py-1 rounded-pill me-auto">{complaint.category}</span>
                    <div className="d-flex align-items-center gap-2 ms-auto">
                      <button
                        className={`btnscolor d-flex align-items-center gap-1 px-3 py-2 rounded-pill shadow-sm border-0 ${
                          userVotes[complaint.complaint_id] === "upvote" ? "bg-success text-white" : "text-success"
                        }`}
                        onClick={() => handleVote(complaint.complaint_id, "upvote")}
                      >
                        <ThumbsUp />
                        {complaint.likes}
                      </button>
                      <button
                        className={`btnscolor d-flex align-items-center gap-1 px-3 py-2 rounded-pill shadow-sm border-0 ${
                          userVotes[complaint.complaint_id] === "downvote" ? "bg-danger text-white" : "text-danger"
                        }`}
                        onClick={() => handleVote(complaint.complaint_id, "downvote")}
                      >
                        <ThumbsDown />
                        {complaint.dislikes}
                      </button>
                    </div>
                  </div> */}
                  <div className="mt-auto d-flex w-100 align-items-center pt-2 px-0">
  <span className="category-tag px-2 py-1 rounded-pill me-auto" style={{ fontSize: "0.8rem" }}>
    {complaint.category}
  </span>
  <div className="d-flex align-items-center gap-3 ms-auto">
    <button
      className={`btnscolor d-flex align-items-center gap-1 px-2 py-1 rounded-pill shadow-sm border-0 ${
        userVotes[complaint.complaint_id] === "upvote" ? "bg-success text-white" : "text-success"
      }`}
      onClick={() => handleVote(complaint.complaint_id, "upvote")}
      style={{ fontSize: "1rem" }}
    >
      <ThumbsUp size={20} /> {/* smaller icon */}
      {complaint.likes}
    </button>

    <button
      className={`btnscolor d-flex align-items-center gap-1 px-2 py-1 rounded-pill shadow-sm border-0 ${
        userVotes[complaint.complaint_id] === "downvote" ? "bg-danger text-white" : "text-danger"
      }`}
      onClick={() => handleVote(complaint.complaint_id, "downvote")}
      style={{ fontSize: "1rem" }}
    >
      <ThumbsDown size={20} /> {/* smaller icon */}
      {complaint.dislikes}
    </button>
  </div>
</div>

                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* Floating expanded card */}
      {expandedCard && (
        <div className="overlay" onClick={() => setExpandedCard(null)}>
          <Card className="popup-card rounded-4 card-background-gradient" onClick={(e) => e.stopPropagation()}>

            <button className="close-btn" onClick={() => setExpandedCard(null)}>✕</button>
            {/* {getStatusBadge(expandedCard.status)} */}
              <div className="d-flex">
    {getStatusBadge(expandedCard.status)}
  </div>



             <Card.Text className="mt-3 mb-0" style={{ fontSize: "0.9rem", fontWeight: "600", color: "#1e90ff" }}>
                    <span style={{
                      backgroundColor: "#d4dbe2ff",
                      color: "#1e90ff",
                      padding: "6px",
                      borderRadius: "10px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "28px",
                      height: "28px",
                      marginRight: "8px"
                    }}>
                      <FaCalendarAlt style={{ fontSize: "14px" }} />
                    </span>
                    {formatDate(expandedCard.timestamp)}
                  </Card.Text>




            <Card.Title className="ctb fw-bold text-dark mt-3 fs-4">{expandedCard.title}</Card.Title>
            <Card.Text className=" text-dark mb-2">{expandedCard.description}</Card.Text>

            <div className="admin-updates">
              <h5><MdOutlineTextsms /> Admin Updates:</h5>
              {expandedCard.comments.map((comment) => (
                <div key={comment.id} className="update-entry mb-3 p-3" style={{ backgroundColor: "#f8f9fa", borderLeft: "4px solid purple", borderRadius: "10px" }}>
                  <div className="d-flex align-items-center mb-1">
                    <FaUser className="me-2 text-purple" size={18} />
                    <strong>{comment.email}</strong>
                  </div>
                  <div style={{ marginLeft: "1.8rem" }}>{comment.text}</div>


                                    
                </div>
              ))}
            </div>

            <div className="mt-auto d-flex w-100 align-items-center pt-2 px-0">
  <span className="category-tag px-2 py-1 rounded-pill me-auto" style={{ fontSize: "0.8rem" }}>
    {expandedCard.category}
  </span>
  <div className="d-flex align-items-center gap-3 ms-auto">
    <button
      className={`btnscolor d-flex align-items-center gap-1 px-2 py-1 rounded-pill shadow-sm border-0 ${
        userVotes[expandedCard.complaint_id] === "upvote" ? "bg-success text-white" : "text-success"
      }`}
      onClick={() => handleVote(expandedCard.complaint_id, "upvote")}
      style={{ fontSize: "1rem" }}
    >
      <ThumbsUp size={20} /> {/* smaller icon */}
      {expandedCard.likes}
    </button>

    <button
      className={`btnscolor d-flex align-items-center gap-1 px-2 py-1 rounded-pill shadow-sm border-0 ${
        userVotes[expandedCard.complaint_id] === "downvote" ? "bg-danger text-white" : "text-danger"
      }`}
      onClick={() => handleVote(expandedCard.complaint_id, "downvote")}
      style={{ fontSize: "1rem" }}
    >
      <ThumbsDown size={20} /> {/* smaller icon */}
      {expandedCard.dislikes}
    </button>
  </div>
</div>
          </Card>
        </div>
      )}

      <button className="add-complaint-btn" onClick={() => navigate("/complaint-form")}>
        <FaPlus className="plus-icon" /> Add Complaint
      </button>



      <div
        className="feedback-button"
        onClick={() =>
          window.open(
            "https://docs.google.com/forms/d/e/1FAIpQLSdpEmSGlS8hwIR58A3zW9vm9kTVBuhiONbA6zDjAixeMfELnw/viewform?usp=header",
            "_blank"
          )
        }
      >
        <MdOutlineTextsms size={20} />
        <span>Feedback</span>
      </div>


    </Container>
  );
};

export default Home;

