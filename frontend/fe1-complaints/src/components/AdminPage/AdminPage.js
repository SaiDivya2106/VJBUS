// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { HiOutlineThumbUp, HiOutlineThumbDown } from "react-icons/hi";
// import { FaChartBar, FaEdit, FaCalendarAlt, FaClock, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
// import { Card, Button, Row, Col, Form } from "react-bootstrap";
// import { useAuth } from "../../Context/AuthContext";
// import "./AdminPage.css";

// const AdminPage = () => {
//   const navigate = useNavigate();
//   const { user, isAdmin, adminCategory } = useAuth(); 
//   const [complaints, setComplaints] = useState([]);
//   const [sortOption, setSortOption] = useState("default");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const baseUrl = process.env.REACT_APP_COMPLAINTS_APP_BE_URL;

//   useEffect(() => {
//     if (isAdmin && adminCategory) {
//       fetchComplaints(adminCategory, statusFilter);
//     }
//   }, [isAdmin, adminCategory, statusFilter]); 

//   const fetchComplaints = async (category, status) => {
//     try {
//       let url = `${baseUrl}/admin-api/filter-complaints?category=${category}`;
//       if (status !== "All") {
//         url += `&status=${status}`;
//       }
//       const response = await axios.get(url);
//       setComplaints(response.data.complaints);
//     } catch (error) {
//       console.error("Error fetching complaints:", error);
//     }
//   };

//   const handleSort = (option) => {
//     setSortOption(option);
//   };
//   useEffect(() => {
//     let sortedComplaints = [...complaints];
//     switch (sortOption) {
//       case "most-liked":
//         sortedComplaints.sort((a, b) => b.likes - a.likes);
//         break;
//       case "most-disliked":
//         sortedComplaints.sort((a, b) => b.dislikes - a.dislikes);
//         break;
//       default:
//         sortedComplaints.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
//     }
//     setComplaints(sortedComplaints);
//   }, [sortOption]);

//   const formatDate = (timestamp) => {
//     if (!timestamp) return "Unknown Date";
//     const date = new Date(timestamp);
//     return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
//   };
  
//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "Pending":
//         return <FaExclamationCircle className="text-warning" />;
//       case "Ongoing":
//         return <FaClock className="text-primary" />;
//       case "Resolved":
//         return <FaCheckCircle className="text-success" />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="container">
//       {/* Header Section */}
//       <div className="text-center mt-3 mb-4">
//         <h2 className="text-primary">
//           Admin Complaints Dashboard <sup className="text-muted">({adminCategory})</sup>
//         </h2>
//         <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3 mt-2">
//           <Form.Select
//             className="me-3"
//             value={sortOption}
//             onChange={(e) => handleSort(e.target.value)}
//             style={{ maxWidth: "160px" }}
//           >
//             <option value="default">Sort by: Latest</option>
//             <option value="most-liked">Most Liked</option>
//             <option value="most-disliked">Most Disliked</option>
//           </Form.Select>
          
//           <Form.Select
//             className="me-3"
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             style={{ maxWidth: "160px" }}
//           >
//             <option value="All">All Status</option>
//             <option value="Pending">Pending</option>
//             <option value="Ongoing">Ongoing</option>
//             <option value="Resolved">Resolved</option>
//           </Form.Select>

//           <Button
//             variant="outline-primary"
//             onClick={() => navigate("/admin-analysis")}
//             className="d-flex align-items-center"
//           >
//             <FaChartBar className="me-2" />
//             Analysis
//           </Button>
//         </div>
//       </div>

//       {/* Complaints List */}
//       {complaints.length > 0 ? (
//   <Row className="g-4">
//     {complaints.map((complaint) => (
//       <Col key={complaint.complaint_id} xs={12} sm={6} lg={4}>
//         <Card className="shadow-lg p-3 rounded glass-effect" style={{ height: "100%" }}>
//           <div className="d-flex justify-content-end">
//             <Button
//               variant="outline-secondary"
//               size="sm"
//               onClick={() => navigate(`/complaints-details/${complaint.complaint_id}`)}
//             >
//               <FaEdit style={{ fontSize: "1.5em" }} />
//             </Button>
//           </div>
//           <Card.Body>
//             <Card.Title className="fw-bold text-dark">{complaint.title}</Card.Title>
//             <Card.Text className="text-muted">
//               <FaCalendarAlt className="me-2" />
//               {formatDate(complaint.timestamp)}
//             </Card.Text>
//             <Card.Text>
//               {complaint.description.length > 100
//                 ? `${complaint.description.substring(0, 100)}...`
//                 : complaint.description}
//             </Card.Text>
//             <div className="d-flex justify-content-between align-items-center">
//               <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
//                 <div className="vote-display upvote" style={{ color: "green", display: "flex", alignItems: "center", gap: "5px" }}>
//                   <HiOutlineThumbUp size={20} />
//                   <span className="vote-count">{complaint.likes}</span>
//                 </div>
//                 <div className="vote-display downvote" style={{ color: "red", display: "flex", alignItems: "center", gap: "5px" }}>
//                   <HiOutlineThumbDown size={20} />
//                   <span className="vote-count">{complaint.dislikes}</span>
//                 </div>
//               </div>
//               <div className="d-flex align-items-center">
//                 {getStatusIcon(complaint.status)}
//                 <span className={`ms-2 fw-bold status-${complaint.status.toLowerCase()}`}>{complaint.status}</span>
//               </div>
//             </div>
//           </Card.Body>
//         </Card>
//       </Col>
//     ))}
//   </Row>
// ) : (
//   <div className="text-center mt-5">
//     <h4 className="text-muted">
//       <FaExclamationCircle className="me-2 text-warning" />
//       No complaints available 
//     </h4>
//   </div>
// )}
//     </div>
//   );
// };

// export default AdminPage;




import React, { useState, useEffect } from "react";
import { LuPencil } from "react-icons/lu";
import { FaSquarePollVertical } from "react-icons/fa6";


import { useNavigate } from "react-router-dom";
import { FaUserPen } from "react-icons/fa6";
import axios from "axios";
import {
  HiOutlineThumbUp,
  HiOutlineThumbDown,
} from "react-icons/hi";
import {
  FaEdit,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
} from "react-icons/fa";
import { Card, Button, Row, Col, Form } from "react-bootstrap";
import { useAuth } from "../../Context/AuthContext";
import "./AdminPage.css";

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, isAdmin, adminCategory } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [sortOption, setSortOption] = useState("default");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedCards, setExpandedCards] = useState({});
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
        sortedComplaints.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
    }
    setComplaints(sortedComplaints);
  }, [sortOption]);

const formatDate = (timestamp) => {
  if (!timestamp) return "Unknown Date";
  const date = new Date(timestamp);
  return date.toDateString();  // only shows the full date
};


  const toggleExpand = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <span className="status-pill status-pending">Pending</span>;
      case "Ongoing":
        return <span className="status-pill status-ongoing">Ongoing</span>;
      case "Resolved":
        return <span className="status-pill status-resolved">Resolved</span>;
      default:
        return null;
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="text-center mt-3 mb-4">
        <p className=" adminheading">
          Admin Complaints Dashboard <sup className="text-muted">({adminCategory})</sup>
        </p>
        <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3 mt-4">
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
            className="d-flex align-items-center no-hover-bg"
          >
            <FaSquarePollVertical size={20} color="#1e90ff"  className="me-2"/>


            Analysis
          </Button>
        </div>
      </div>

      {/* Complaints List */}
      {complaints.length > 0 ? (
        <Row className="g-4 pb-3">
          {complaints.map((complaint) => (
            <Col key={complaint.complaint_id} xs={12} sm={6} lg={4}>
              {/* <Card className=" shadow p-3 rounded-3 glass-effect mt-3" style={{ height: "100%" }}> */}

              <Card className="card-hover-effect p-3 glass-effect rounded-4 custom-card-container">
                {/* Status and Edit */}
                <div className="d-flex justify-content-between align-items-start">
                  {getStatusBadge(complaint.status)}
                  {/* <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => navigate(`/complaints-details/${complaint.complaint_id}`)}
                  >
                    <FaEdit />
                  </Button> */}

                <Button
                  className="custom-pencil-button"
                  onClick={() => navigate(`/complaints-details/${complaint.complaint_id}`)}
                >
                  {/* <LuPencil size={18} className="pencil-icon" /> */}
                  <FaUserPen size={28} className="pencil-icon" />
                </Button>




                </div>

                {/* Date */}
                {/* <Card.Text className="text-muted mt-3 mb-0" style={{ fontSize: "0.9rem" }}>
                  <FaCalendarAlt className="me-2" style={{ position: "relative", top: "-2px" }} />
                  {formatDate(complaint.timestamp)}
                </Card.Text> */}


                <Card.Text className=" mt-3 mb-0  "  style={{
    fontSize: "0.9rem",
    fontWeight: "600", // make it bolder
    color: "#1e90ff",   // dodger blue
    textShadow: "0 0 0.3px rgb(84, 152, 220)", // simulate thicker blue
  }}>
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
                  {formatDate(complaint.timestamp)}
                </Card.Text>



                {/* Title */}
                <Card.Title className="fw-bold text-dark mt-3">{complaint.title}</Card.Title>

                {/* Description */}
                <Card.Text className="text-secondary" style={{ minHeight: "80px" }}>
                  {complaint.description.split(" ").length > 40 ? (
                    <>
                      {expandedCards[complaint.complaint_id]
                        ? complaint.description
                        : complaint.description.split(" ").slice(0, 40).join(" ") + "..."}
                      <span
                        className="ms-2 text-secondary fw-semibold"
                        role="button"
                        onClick={() => toggleExpand(complaint.complaint_id)}
                      >
                        {expandedCards[complaint.complaint_id] ? "View less" : "View more"}
                      </span>
                    </>
                  ) : (
                    complaint.description
                  )}
                </Card.Text>

                {/* Bottom Info */}
                <div className="d-flex justify-content-between align-items-center">
                  {/* Likes / Dislikes */}
                  <div className="d-flex align-items-center gap-3 mt-2">
                    <span className="text-success d-flex align-items-center ">
                      <HiOutlineThumbUp className="me-1" size={20} />
                      {complaint.likes}
                    </span>
                    <span className="text-danger d-flex align-items-center ">
                      <HiOutlineThumbDown className="me-1" size={20} />
                      {complaint.dislikes}
                    </span>
                  </div>

                  {/* Category */}
                  {/* <span className="badge bg-light text-dark rounded-3 bold p-2 border">
                    {complaint.category}
                  </span> */}
                  <span className="category-tag1">{complaint.category}</span>
                </div>
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
