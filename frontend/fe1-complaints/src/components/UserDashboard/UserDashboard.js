import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col, Modal } from "react-bootstrap";
import { FaPlus, FaCalendarAlt, FaUser, FaEdit } from "react-icons/fa";
import { MdOutlineTextsms } from "react-icons/md";
import { ThumbsUp, ThumbsDown, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import axios from "axios";
import { CheckCircleFill } from "react-bootstrap-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./UserDashboard.css";
import NoImageIcon from "../images/no-img-icon.png";
import { useRef } from "react";
import ReopenComplaintModal from "../ReopenComplaintModal/ReopenComplaintModal";





import { Reply } from "lucide-react";





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
  "Library",
  "IT and Networking",
  "Others",
];



const STATUSES = ["Pending", "Ongoing", "Resolved"];

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userEmail = user?.email;
  const [complaints, setComplaints] = useState([]);
  const [userVotes, setUserVotes] = useState({});
  const [expandedCard, setExpandedCard] = useState(null);
  const [editComplaint, setEditComplaint] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", category: "", location: "", connectionType: "", room_number: "", internet_speed: "", issue_duration: "", mobile_number: "" });
  const [editImage, setEditImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [editWarning, setEditWarning] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState(null);

  // Reply UI state for threaded replies
  const [openReply, setOpenReply] = useState(null);
  const [replyTexts, setReplyTexts] = useState({});

  const [showReopenModal, setShowReopenModal] = useState(false);
  const [selectedComplaintForReopen, setSelectedComplaintForReopen] = useState(null);
  const warningRef = useRef(null);
  const baseUrl = process.env.REACT_APP_COMPLAINTS_APP_BE_URL;

  const DEFAULT_IMAGE = NoImageIcon;

  useEffect(() => {
  if (editWarning && warningRef.current) {
    warningRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}, [editWarning]);

  useEffect(() => {
  if (!user?.email) return;

  const token = localStorage.getItem("authToken");

  axios
    .get(`${baseUrl}/user-api/view-complaints/${user.email}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      setComplaints(res.data.complaints || []);

      const votes = {};
      (res.data.complaints || []).forEach((complaint) => {
        if (Array.isArray(complaint.votedUsers)) {
          const userVote = complaint.votedUsers.find(
            (v) => v.email === user.email
          );
          if (userVote) votes[complaint.complaint_id] = userVote.vote;
        }
      });

      setUserVotes(votes);
    })
    .catch((err) => {
      console.error(err);

      // ⭐ Handle token expiry
      if (err.response && err.response.status === 401) {
        localStorage.removeItem("authToken"); // Remove invalid token
        navigate("/complaints-website");      // Redirect to login
      }
    });
}, [user]);






// const formatDateTime = (timestamp) => {
//   if (!timestamp) return "";

//   const date = new Date(timestamp);

//   const datePart = date.toLocaleDateString("en-US", {
//     month: "short",
//     day: "2-digit",
//     year: "numeric",
//   });

//   const timePart = date.toLocaleTimeString([], {
//     hour: "numeric",
//     minute: "2-digit",
//     hour12: true,
//   });

//   return `${datePart} ${timePart}`;
// };


const formatDateTime = (timestamp) => {
  if (!timestamp) return "";

  const date = new Date(timestamp);

  const datePart = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const timePart = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${datePart} ${timePart}`;
};










  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown Date";
    const date = new Date(timestamp);
    return date.toDateString();
  };

  // Reply helpers for threaded replies
  const handleReplyChange = (commentId, value) => {
    setReplyTexts((prev) => ({ ...prev, [commentId]: value }));
  };

  const handleReplySubmit = async (comment) => {
    const text = (replyTexts[comment.id] || "").trim();
    // if (!text) return toast.error("Reply cannot be empty");



    if (text.trim().length < 5) {
  return toast.error("Reply must be at least 5 characters or Please enter a meaningful reply");
}


    try {
      const token = localStorage.getItem("authToken");
      const url = `${baseUrl}/user-api/complaints/${expandedCard.complaint_id}/comment/${comment.id}/reply`;
      const res = await axios.post(url, { text }, { headers: { Authorization: `Bearer ${token}` } });

      if (res?.data?.complaint) {
        setExpandedCard(res.data.complaint);
        setReplyTexts((prev) => ({ ...prev, [comment.id]: "" }));
        setOpenReply(null);
        toast.success("Reply added successfully");
      } else {
        toast.info("Reply added, but failed to refresh comments");
      }
    } 
    // catch (err) {
    //   console.error("Error adding reply:", err);
    //   toast.error("Failed to add reply");
    // }

    catch (err) {
  console.error("Error adding reply:", err);
  toast.error(
    err.response?.data?.message || "Failed to add reply"
  );
}

  };

  const isITCategory = (category) => {
    if (!category) return false;
    const c = String(category).toLowerCase().replace(/&/g, "and").trim();
    if (c === "it") return true;
    if (c.includes("it") && c.includes("network")) return true;
    if (c.includes("it and networking") || c.includes("it networking") || c.includes("it/networking")) return true;
    return false;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1500 * 1024) {
        alert("File too large! Please upload ≤ 1.5MB.");
        return;
      }
      setEditImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleVote = async (id, type) => {
    const prevVote = userVotes[id];
    try {
      const token = localStorage.getItem("authToken");
      const url = `${baseUrl}/user-api/${type === "upvote" ? "like" : "dislike"}-complaint/${id}`;
      await axios.post(url, { email: user.email }, { headers: { Authorization: `Bearer ${token}` } });

      setUserVotes((prevVotes) => {
        if (prevVote === type) {
          const updatedVotes = { ...prevVotes };
          delete updatedVotes[id];
          return updatedVotes;
        } else {
          return { ...prevVotes, [id]: type };
        }
      });

      setComplaints((prev) =>
        prev.map((c) => {
          if (c.complaint_id !== id) return c;
          let likes = c.likes;
          let dislikes = c.dislikes;

          if (prevVote === "upvote") likes = Math.max(0, likes - 1);
          if (prevVote === "downvote") dislikes = Math.max(0, dislikes - 1);

          if (prevVote !== type) {
            if (type === "upvote") likes += 1;
            else dislikes += 1;
          }

          return { ...c, likes, dislikes };
        })
      );

      if (expandedCard?.complaint_id === id) {
        let likes = expandedCard.likes;
        let dislikes = expandedCard.dislikes;

        if (prevVote === "upvote") likes = Math.max(0, likes - 1);
        if (prevVote === "downvote") dislikes = Math.max(0, dislikes - 1);

        if (prevVote !== type) {
          if (type === "upvote") likes += 1;
          else dislikes += 1;
        }

        setExpandedCard({ ...expandedCard, likes, dislikes });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditComplaint = (complaint) => {
    setEditComplaint(complaint);
    const it = complaint.it_details || {};
    setEditForm({
      title: complaint.title,
      description: complaint.description,
      category: complaint.category,
      location: it.location || complaint.location || "",
      connectionType: it.connectionType || complaint.connectionType || "",
      room_number: it.room_number || complaint.room_number || "",
      internet_speed: it.internet_speed || complaint.internet_speed || "",
      issue_duration: it.issue_duration || complaint.issue_duration || "",
      mobile_number: it.mobile_number || complaint.mobile_number || "",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const removeEditImage = () => {
    setEditImage(null);
    setImagePreview(null);
    setEditComplaint((prev) => ({ ...prev, image: null }));
  };

  const submitEditComplaint = async () => {
    try {
      const title = editForm.title.trim();
      const description = editForm.description.trim();
      if (!title || !description) {
        setEditWarning("⚠ Title and description cannot be empty.");
        if (warningRef.current) {
        warningRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
        return;
      }

      const token = localStorage.getItem("authToken");
      let imageUrl = editComplaint.image;

      if (editImage) {
        const imgData = new FormData();
        imgData.append("file", editImage);
        imgData.append("upload_preset", "complaint_uploads");
        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dbsrpikci/image/upload",
          imgData
        );
        imageUrl = uploadRes.data.secure_url;
      }

      let updatedData = { ...editForm, image: imageUrl };
      if (isITCategory(editForm.category)) {
        updatedData = {
          ...updatedData,
          it_details: {
            location: editForm.location,
            connectionType: editForm.connectionType,
            room_number: editForm.room_number,
            internet_speed: editForm.internet_speed,
            issue_duration: editForm.issue_duration,
            mobile_number: editForm.mobile_number,
          },
        };
      }

      await axios.put(`${baseUrl}/user-api/edit-complaint/${editComplaint.complaint_id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setComplaints((prev) =>
        prev.map((c) => (c.complaint_id === editComplaint.complaint_id ? { ...c, ...updatedData } : c))
      );

      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);

      setEditComplaint(null);
      setEditImage(null);
      setImagePreview(null);
      setEditWarning("");
    } catch (err) {
      setEditWarning(err.response?.data?.message || "Error saving complaint");
    }
  };

  const handleDeleteComplaint = async (id) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`${baseUrl}/user-api/delete-complaint/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComplaints((prev) => prev.filter((c) => c.complaint_id !== id));
      setShowDeleteSuccess(true);
      setTimeout(() => setShowDeleteSuccess(false), 3000);
      if (expandedCard?.complaint_id === id) setExpandedCard(null);
      if (editComplaint?.complaint_id === id) setEditComplaint(null);
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <span className="status-pill status-pending">Pending</span>;
      case "Ongoing":
        return <span className="status-pill status-ongoing">Ongoing</span>;
      case "Resolved":
        return <span className="status-pill status-resolved">Resolved</span>;
      case "Reopened":
        return <span className="status-pill status-reopened">🔄 Reopened</span>;
      default:
        return null;
    }
  };

  return (
    <div className="user-dashboard-container">
      <div className="dashboard-container">
        <ToastContainer />
        <div className="page-heading text-center mb-4">
          <h1>VNRVJIET Support-Request Portal</h1>
          <p>Welcome to the platform where your voice matters!</p>
        </div>

        <div className="user-info d-flex align-items-center mb-4">
          <div className="user-avatar me-3">
            <img src={user?.picture} alt="Profile" className="rounded-circle" width={80} height={80} />
          </div>
          <div className="user-details">
            <h2>Welcome, {user?.name || "User"}</h2>
            <p><strong>Email:</strong> {userEmail}</p>
          </div>
        </div>

        <div className="my-complaints-heading mb-3">
          <h3>My Support-Requests</h3>
        </div>

        <Container className="mt-5 home-container mb-2">
          <Row className="gx-4 gy-4">
            {complaints.length === 0 ? (
              <div className="no-complaints-container">
                <h4 className="no-complaints-title">You haven't raised any complaints yet.</h4>
                <p className="no-complaints-sub">Have a concern? Speak up and let your voice be heard!</p>
                <button className="raise-btn" onClick={() => navigate("/complaint-form")}>+ Raise Issue</button>
              </div>
            ) : (
              complaints.map((complaint) => (
                <Col key={complaint.complaint_id} lg={4} md={6} sm={12}>
                  <Card className="card-hover-effect p-3 glass-effect rounded-4 custom-card-container d-flex flex-column">
                    {/* Complaint Image */}
                    <div className="position-relative complaint-image-wrapper mt-3 mb-2">
                      <div
                        className="d-flex flex-column align-items-center justify-content-center"
                        style={{ height: "180px", borderRadius: "10px" }}
                      >
                        {complaint.image ? (
                          <Card.Img
                            variant="top"
                            src={complaint.image}
                            alt="Complaint"
                            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px", cursor: "pointer" }}
                            onClick={() => { setModalImageSrc(complaint.image); setShowImageModal(true); }}
                          />
                        ) : (
                          <div
                            style={{
                              position: "relative",
                              width: "190px",
                              height: "190px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexDirection: "column",
                            }}
                          >
                            <img src={NoImageIcon} alt="No Image" style={{ width: "200px", height: "200px", opacity: 0.8, objectFit: "contain" }} />
                            <p style={{ position: "absolute", bottom: "15px", width: "100%", textAlign: "center", fontSize: "1rem", color: "#6c757d", fontWeight: 600, margin: 0 }}>No Image</p>
                          </div>
                        )}
                      </div>
                      <div className="status-overlay position-absolute" style={{ top: "8px", left: "8px", zIndex: 3 }}>
                        {/* STATUS OR FLAG BADGE */}
<div
  className="status-overlay position-absolute"
  style={{
    top: "4px",
    left: "-9px",
    zIndex: 2
  }}
>
  {!complaint.flagged?.isFlagged && getStatusBadge(complaint.status)}
</div>

                      </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-between" style={{ marginTop: "5px", marginBottom: "5px" }}>
                      <div className="d-flex align-items-center text-primary fw-semibold" style={{ fontSize: "0.9rem", marginBottom: 0 }}>
                        <span style={{ backgroundColor: "#e0f0ff", color: "#1e90ff", padding: "6px", borderRadius: "10px", display: "inline-flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px", marginRight: "8px" }}>
                          <FaCalendarAlt style={{ fontSize: "14px" }} />
                        </span>
                        {formatDate(complaint.timestamp)}


    {complaint.flagged?.isFlagged && (
      <span
        className="flagged-pill-row"
        onClick={() => setExpandedCard(complaint)}
      >
        🚩 Flagged
      </span>
    )}
                      </div>
                      {complaint.user_id === user?.email && complaint.status === "Pending" && (
                        <FaEdit size={24} className="edit-icon-purple" style={{ cursor: "pointer" }} onClick={() => handleEditComplaint(complaint)} />
                      )}
                    </div>

                    <Card.Title className="fw-bold text-dark fs-5" style={{ marginTop: "5px", marginBottom: "8px" }}>
                      {complaint.title}
                    </Card.Title>
                    <Card.Text className="text-secondary" style={{ marginTop: 0, marginBottom: "5px", color: "#495057", fontWeight: 500 }}>
                      {complaint.description.length > 200 ? `${complaint.description.substring(0, 200)}...` : complaint.description}
                      {complaint.description.length > 200 && (
                        <span className="view-more-link ms-2" onClick={() => setExpandedCard(complaint)} style={{ color: "#007bff", cursor: "pointer", fontWeight: 500 }}>View More</span>
                      )}
                    </Card.Text>

                    {(() => {
                      const isIt = isITCategory(complaint.category);
                      const it = complaint.it_details || {};
                      const itLocation = it.location;
                      const itConnection = it.connectionType;
                      const itRoom = it.room_number || complaint.room_number;
                      const itSpeed = it.internet_speed || complaint.internet_speed;
                      const itDuration = it.issue_duration || complaint.issue_duration;
                      const itMobile = it.mobile_number || complaint.mobile_number;
                      if (isIt && (itLocation || itConnection || itRoom || itSpeed || itDuration || itMobile)) {
                        return (
                          <div className="it-summary mb-2" style={{ color: "#495057", fontSize: "0.95rem" }}>
                            {/* compact: location & connection side-by-side */}
                            {(itLocation || itConnection) && (
                              <div className="d-flex align-items-center mb-1" style={{ gap: 12 }}>
                                {itLocation && (
                                  <div className="d-flex align-items-center">
                                    <span style={{ marginRight: 6 }}>📍</span>
                                    <small style={{ color: '#495057' }}>{itLocation}</small>
                                  </div>
                                )}
                                {itConnection && (
                                  <div className="d-flex align-items-center">
                                    <span style={{ marginRight: 6 }}>🔗</span>
                                    <small style={{ color: '#495057' }}>{itConnection}</small>
                                  </div>
                                )}
                              </div>
                            )}
                            {itRoom && (
                              <div className="d-flex align-items-center mb-1">
                                <span style={{ marginRight: 8 }}>🏷️</span>
                                <small><strong>Room:</strong> {itRoom}</small>
                              </div>
                            )}
                            {itSpeed && (
                              <div className="d-flex align-items-center mb-1">
                                <span style={{ marginRight: 8 }}>📶</span>
                                <small><strong>Internet Speed:</strong> {itSpeed}</small>
                              </div>
                            )}
                            {itDuration && (
                              <div className="d-flex align-items-center mb-1">
                                <span style={{ marginRight: 8 }}>⏱️</span>
                                <small><strong>Duration:</strong> {itDuration}</small>
                              </div>
                            )}
                            {itMobile && (
                              <div className="d-flex align-items-center mb-1">
                                <span style={{ marginRight: 8 }}>📞</span>
                                <small><strong>Mobile:</strong> {itMobile}</small>
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    })()}

                    {complaint.comments && complaint.comments.length > 0 && (
                      <button className="admin-update-btn" onClick={() => setExpandedCard(complaint)}>Show Admin Updates <ChevronDown size={18} /></button>
                    )}

                    {/* "Issue Not Fixed?" button for Resolved complaints */}
                    {/* {complaint.status === "Resolved" && (
                      <button 
                        className="btn btn-sm btn-outline-primary mt-2 w-100" 
                        onClick={() => {
                          setSelectedComplaintForReopen(complaint);
                          setShowReopenModal(true);
                        }}
                      >
                        ❓ Issue Not Fixed?
                      </button>
                    )} */}


{complaint.status === "Resolved" && (
  <button
    className="issue-not-fixed-attractive-btn"
    onClick={() => {
      setSelectedComplaintForReopen(complaint);
      setShowReopenModal(true);
    }}
  >
    <i className="bi bi-exclamation-circle issue-icon"></i>
    Issue Not Fixed?
  </button>
)}



                    {/* <div className="mt-auto d-flex w-100 align-items-center pt-2 px-0">
                      <span className="category-tag px-2 py-1 rounded-pill me-auto" style={{ fontSize: "0.8rem" }}>{complaint.category}</span>
                      <div className="d-flex align-items-center gap-3 ms-auto">
                        <button className={`btnscolor d-flex align-items-center gap-1 px-2 py-1 rounded-pill shadow-sm border-0 ${userVotes[complaint.complaint_id] === "upvote" ? "bg-success text-white" : "text-success"}`} onClick={() => handleVote(complaint.complaint_id, "upvote")} style={{ fontSize: "1rem" }}>
                          <ThumbsUp size={20} />{complaint.likes}
                        </button>
                        <button className={`btnscolor d-flex align-items-center gap-1 px-2 py-1 rounded-pill shadow-sm border-0 ${userVotes[complaint.complaint_id] === "downvote" ? "bg-danger text-white" : "text-danger"}`} onClick={() => handleVote(complaint.complaint_id, "downvote")} style={{ fontSize: "1rem" }}>
                          <ThumbsDown size={20} />{complaint.dislikes}
                        </button>
                      </div>
                    </div> */}
                    <div className="mt-auto d-flex w-100 align-items-center pt-2 px-0">
  <span className="category-tag px-2 py-1 rounded-pill me-auto" style={{ fontSize: "0.8rem" }}>
    {complaint.category}
  </span>
  <div className="d-flex align-items-center gap-3 ms-auto">
    <div className="d-flex align-items-center gap-1 text-success">
      <ThumbsUp size={20} /> <span>{complaint.likes}</span>
    </div>
    <div className="d-flex align-items-center gap-1 text-danger">
      <ThumbsDown size={20} /> <span>{complaint.dislikes}</span>
    </div>
  </div>
</div>

                  </Card>
                </Col>
              ))
            )}
          </Row>

          <button className="add-complaint-btn" onClick={() => navigate("/complaint-form")}>
            <FaPlus className="plus-icon" /> Add Support Request
          </button>
        </Container>

        {/* Expanded Card Modal */}
{/* Expanded Card Modal */}
{expandedCard && (
  <div className="overlay">
    <Card className="popup-card rounded-4 card-background-gradient p-4">
      {/* <button className="close-btn" onClick={() => setExpandedCard(null)}>✕</button> */}
      <button className="close-btn-inside-modalh" onClick={() => setExpandedCard(null)}>✕</button>


{/* FLAGGED OR STATUS */}
{/* {expandedCard.flagged?.isFlagged ? (
  <div
    className="flagged-alert-box"
    style={{
      background: "#ffe6e6",
      border: "1px solid #ff4d4d",
      padding: "12px",
      borderRadius: "10px",
      color: "#cc0000",
      marginBottom: "15px"
    }}
  >
    <strong style={{ fontSize: "1rem" }}>🚩 This request has been flagged</strong>
    <div style={{ marginTop: "8px" }}>
      <p style={{ marginBottom: "4px" }}>
        <strong>Reason:</strong> {expandedCard.flagged.reason}
      </p>
      {expandedCard.flagged.note && (
        <p style={{ marginBottom: "4px" }}>
          <strong>Note:</strong> {expandedCard.flagged.note}
        </p>
      )}
      <p style={{ marginBottom: "0px", fontSize: "0.9rem" }}>
        <strong>Flagged By:</strong> {expandedCard.flagged.flaggedBy}
      </p>
    </div>
  </div>
) : (
  <div className="mb-2">{getStatusBadge(expandedCard.status)}</div>
)} */}



{expandedCard.flagged?.isFlagged ? (
  <div className="flagged-container">

    <div className="flagged-title-row">
      <span className="flag-emoji">🚩</span>
      <h4 className="flagged-title-text">This request has been flagged</h4>
    </div>

    <p className="flagged-line">
      <strong>Reason:</strong> {expandedCard.flagged.reason}
    </p>

    {expandedCard.flagged.note && (
      <>
        <p className="flagged-line"><strong>Note:</strong></p>
        <div className="flag-note-box">{expandedCard.flagged.note}</div>
      </>
    )}

    <p className="flagged-line">
      <strong>Flagged By:</strong> {expandedCard.flagged.flaggedBy}
    </p>

  </div>
) : (
  <div className="mb-2">{getStatusBadge(expandedCard.status)}</div>
)}



      {/* Date */}
      <Card.Text className="mt-1 mb-2" style={{ fontSize: "0.9rem", fontWeight: 600, color: "#1e90ff" }}>
        <span
          style={{
            backgroundColor: "#d4dbe2ff",
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
        {formatDate(expandedCard.timestamp)}
      </Card.Text>

      {/* Title */}
      <Card.Title className="fw-bold text-dark mt-3 fs-4">{expandedCard.title}</Card.Title>

      {/* Description */}
      <Card.Text className="text-dark mb-3">{expandedCard.description}</Card.Text>

      {(() => {
        const isIt = isITCategory(expandedCard.category);
        const it = expandedCard.it_details || {};
        const itLocation = it.location;
        const itConnection = it.connectionType;
        const itRoom = it.room_number || expandedCard.room_number;
        const itSpeed = it.internet_speed || expandedCard.internet_speed;
        const itDuration = it.issue_duration || expandedCard.issue_duration;
        const itMobile = it.mobile_number || expandedCard.mobile_number;
        if (isIt && (itLocation || itConnection || itRoom || itSpeed || itDuration || itMobile)) {
          return (
            <div className="it-summary-popup mb-3" style={{ color: "#495057" }}>
              {itLocation && (
                <div className="d-flex align-items-center mb-1">
                  <span style={{ marginRight: 10 }}>📍</span>
                  <strong>Location:</strong>&nbsp; <span>{itLocation}</span>
                </div>
              )}
              {itConnection && (
                <div className="d-flex align-items-center mb-1">
                  <span style={{ marginRight: 10 }}>🔗</span>
                  <strong>Connection Type:</strong>&nbsp; <span>{itConnection}</span>
                </div>
              )}
              {itRoom && (
                <div className="d-flex align-items-center mb-1">
                  <span style={{ marginRight: 10 }}>🏷️</span>
                  <strong>Room:</strong>&nbsp; <span>{itRoom}</span>
                </div>
              )}
              {itSpeed && (
                <div className="d-flex align-items-center mb-1">
                  <span style={{ marginRight: 10 }}>📶</span>
                  <strong>Internet Speed:</strong>&nbsp; <span>{itSpeed}</span>
                </div>
              )}
              {itDuration && (
                <div className="d-flex align-items-center mb-1">
                  <span style={{ marginRight: 10 }}>⏱️</span>
                  <strong>Duration:</strong>&nbsp; <span>{itDuration}</span>
                </div>
              )}
              {itMobile && (
                <div className="d-flex align-items-center mb-1">
                  <span style={{ marginRight: 10 }}>📞</span>
                  <strong>Mobile:</strong>&nbsp; <span>{itMobile}</span>
                </div>
              )}
            </div>
          );
        }
        return null;
      })()}

      {/* Admin Updates */}
      <div className="admin-updates mb-3">
        <h5 className="mb-2">
          <MdOutlineTextsms className="me-2" /> Admin Updates:
        </h5>
        {expandedCard.comments && expandedCard.comments.length > 0 ? (
          expandedCard.comments.map((comment) => {
            const isStudent = comment.role === "student";
            const displayName = isStudent ? "Student" : (comment.email || "Admin");
            const borderColor = isStudent ? "#ff6b6b" : "purple";
            return (
              <div
                key={comment.id}
                className="update-entry mb-2 p-3"
                style={{ backgroundColor: "#f8f9fa", borderLeft: `4px solid ${borderColor}`, borderRadius: "10px" }}
              >
                <div className="d-flex align-items-center mb-1">
                  <FaUser className="me-2" size={18} style={{ color: borderColor }} />
                  <strong style={{ color: borderColor }}>{displayName}</strong>
                </div>
                <div style={{ marginLeft: "1.8rem" }}>{comment.text}</div>

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div style={{ marginLeft: "2.4rem", marginTop: "0.6rem" }}>
                    {comment.replies.map((r) => (
                      <div key={r.id} style={{ marginBottom: "0.5rem" }}>
                        <div className="reply-card" style={{ backgroundColor: "#fff", borderLeft: "3px solid #e9ecef", padding: "8px", borderRadius: "6px" }}>
                          {/* <div style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
                            <strong style={{ color: "#6c757d", fontSize: "0.9rem" }}>{r.role === "student" ? "Student" : (r.email || "User")}</strong>
                            <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: "#6c757d" }}>{formatDate(r.timestamp || r.date)}</span>
                          </div> */}



                          <div style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
  
  {/* Student icon */}
  {r.role === "student" && (
    <FaUser
      className="me-2"
      size={14}
      style={{ color: "#ff6b6b" }}
    />
  )}

  <strong
    style={{
      color: r.role === "student" ? "#ff6b6b" : "#6c757d",
      fontSize: "0.9rem"
    }}
  >
    {r.role === "student" ? "Student" : (r.email || "User")}
  </strong>

<span
  style={{
    marginLeft: "auto",
    fontSize: "0.75rem",
    color: "#6c757d"   // always grey
  }}
>
  {formatDateTime(r.timestamp || r.date)}
</span>

</div>





                          <div style={{ marginLeft: "0.8rem" }}>{r.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply UI for complaint owner when target comment is admin */}
                {comment.role === "admin" && userEmail === expandedCard.user_id && (
                  <div style={{ marginLeft: "1.8rem", marginTop: "0.5rem" }}>
                    {openReply === comment.id ? (
                      <div className="d-flex gap-2">
                        <textarea
                          className="form-control"
                          rows="2"
                          value={replyTexts[comment.id] || ""}
                          onChange={(e) => handleReplyChange(comment.id, e.target.value)}
                          placeholder="Write a reply..."
                        ></textarea>
                        <div className="d-flex flex-column gap-1 ms-2">
                          <button className="btn btn-primary btn-sm" onClick={() => handleReplySubmit(comment)}>Send</button>
                          <button className="btn btn-secondary btn-sm" onClick={() => { setOpenReply(null); setReplyTexts((prev) => ({ ...prev, [comment.id]: "" })); }}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button className="btn btn-link btn-sm" onClick={() => setOpenReply(comment.id)}>Reply</button>
                    )}
                  </div>
                )}

              </div>
            );
          })
        ) : (
          <p>No admin updates available.</p>
        )}
      </div>

      {/* Footer: category + votes */}
      
    </Card>
  </div>
)}


        {/* Edit Complaint Modal */}
{editComplaint && (
  <div className="overlay">
     
    <Card   style={{ position: "relative" }}
      className=" popup-card rounded-4 card-background-gradient p-3"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close button */}
      <button className="close-btn-inside-modalm fixed" onClick={() => setEditComplaint(null)}>✕</button>


      {/* Header with Delete */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h4 className="editheading mb-2 text-bold text-dark">Edit or delete your Complaint</h4>
        <button
          className="btn btn-danger btn-icon btn-sm delete-btn"
          onClick={() => handleDeleteComplaint(editComplaint.complaint_id)}
        >
          <i className="bi bi-trash"></i>
        </button>
      </div>

      {/* Form Fields */}
      <div className="form-group mb-2">
        <label className="form-label d-flex align-items-center">
          <span className="label-icon purple me-2">
            <i className="bi bi-info-lg"></i>
          </span>
          Title
        </label>
        <input
          type="text"
          name="title"
          className="form-control"
          value={editForm.title}
          onChange={handleEditChange}
        />
      </div>

      <div className="form-group mb-2">
        <label className="form-label d-flex align-items-center">
          <span className="label-icon dark-purple me-2">
            <i className="bi bi-card-text"></i>
          </span>
          Description
        </label>
        <textarea
          name="description"
          className="form-control"
          rows={4}
          value={editForm.description}
          onChange={handleEditChange}
        />
      </div>

      <div className="form-group mb-2">
        <label className="form-label d-flex align-items-center">
          <span className="label-icon orange me-2">
            <i className="bi bi-tag"></i>
          </span>
          Category
        </label>
        <select
          name="category"
          className="form-control"
          value={editForm.category}
          onChange={handleEditChange}
          disabled
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {isITCategory(editForm.category) && (
        <div className="it-edit-fields mb-2">
          <div className="form-group mb-2">
            <label className="form-label">Location</label>
            <select
              name="location"
              className="form-control"
              value={editForm.location}
              onChange={handleEditChange}
            >
              <option value="">-- Select Location --</option>
              <option value="Main Campus">Main Campus</option>
              <option value="Boys Hostel">Boys Hostel</option>
              <option value="Girls Hostel">Girls Hostel</option>
            </select>
          </div>

          {editForm.location && (
            <div className="form-group mb-2">
              <label className="form-label">Connection Type</label>
              <select
                name="connectionType"
                className="form-control"
                value={editForm.connectionType}
                onChange={handleEditChange}
              >
                <option value="">-- Select Connection --</option>
                <option value="WiFi">WiFi</option>
                <option value="LAN">LAN</option>
              </select>
            </div>
          )}

          {editForm.location && editForm.connectionType === "WiFi" && (editForm.location === "Boys Hostel" || editForm.location === "Girls Hostel") ? (
            <div style={{ padding: "12px", backgroundColor: "#fff3cd", border: "1px solid #ffc107", borderRadius: "4px", marginBottom: "15px", color: "#856404", marginTop: "10px" }}>
              <strong>⚠️ Warning:</strong> WiFi is not supported at hostels. Please use LAN or contact IT support for assistance.
            </div>
          ) : null}

          {!(editForm.location && editForm.connectionType === "WiFi" && (editForm.location === "Boys Hostel" || editForm.location === "Girls Hostel")) && (
            <>
              <div className="form-group mb-2">
                <label className="form-label">Room Number</label>
                <input
                  type="text"
                  name="room_number"
                  className="form-control"
                  value={editForm.room_number}
                  onChange={handleEditChange}
                />
              </div>

              <div className="form-group mb-2">
                <label className="form-label">Internet Speed</label>
                <input
                  type="text"
                  name="internet_speed"
                  className="form-control"
                  value={editForm.internet_speed}
                  onChange={handleEditChange}
                />
              </div>

              <div className="form-group mb-2">
                <label className="form-label">Issue Duration</label>
                <input
                  type="text"
                  name="issue_duration"
                  className="form-control"
                  value={editForm.issue_duration}
                  onChange={handleEditChange}
                />
              </div>

              <div className="form-group mb-2">
                <label className="form-label">Mobile Number</label>
                <input
                  type="tel"
                  name="mobile_number"
                  className="form-control"
                  value={editForm.mobile_number}
                  onChange={handleEditChange}
                />
              </div>
            </>
          )}
        </div>
      )}

      {/* Image Upload */}
      <div className="form-group mb-2">
        <label className="form-label d-flex align-items-center">
          <span className="label-icon blue me-2">
            <i className="bi bi-image"></i>
          </span>
          Update Image (Optional)
        </label>

        <div className="upload-box-wrapper">
          <div className="upload-box">

            {imagePreview || editComplaint.image ? (
              <div className="image-preview">
                <img
                  src={imagePreview || editComplaint.image}
                  alt="Preview"
                  onClick={() => {
                    setModalImageSrc(imagePreview || editComplaint.image);
                    setShowImageModal(true);
                  }}
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    maxHeight: "250px",
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                />
                <button type="button" className="remove-btn" onClick={removeEditImage}>
                  ×
                </button>
              </div>
            ) : (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  id="edit-file-upload"
                  style={{ display: "none" }}
                />
                <label htmlFor="edit-file-upload" className="upload-placeholder">
                  <div className="upload-icon">⬆</div>
                  <span className="upload-text">Upload Image</span>
                </label>
              </>
            )}

          </div>

          <p className="file-size-note text-dark">≤ 1.5MB</p>
        </div>
      </div>

      {/* {editWarning && (
        <div
          className="alert alert-warning text-center mb-3"
          style={{ borderRadius: "10px", fontWeight: 500 }}
        >
          ⚠ {editWarning}
        </div>
      )} */}

{editWarning && (
  <div
    ref={warningRef} // 👈 add this line
    className="alert alert-warning text-center mb-3"
    style={{ borderRadius: "10px", fontWeight: 500 }}
  >
    ⚠ {editWarning}
  </div>
)}

      {/* Save Button */}
      <div className="modal-footer mt-2 text-center">
        <button className="btn btn-primary save-btn" onClick={submitEditComplaint}>
          <i className="bi bi-save me-2"></i> Save Changes
        </button>
      </div>
    </Card>
  </div>
)}

<Modal
  show={showImageModal}
  onHide={() => setShowImageModal(false)}
  centered
  size="lg"
  contentClassName="bg-dark border-0"
  style={{ zIndex: 9999 }}
  backdropClassName="custom-image-backdrop"
>
  <Modal.Body
    className="p-0 d-flex justify-content-center align-items-center"
    style={{ backgroundColor: "rgba(0,0,0,0.9)" }}
  >
    <img
      src={modalImageSrc}
      alt="Full preview"
      style={{
        width: "auto",
        maxWidth: "80%",
        height: "auto",
        maxHeight: "65vh",
        borderRadius: "10px",
        objectFit: "contain",
        boxShadow: "0 0 15px rgba(0,0,0,0.5)",
      }}
    />
    <button
      onClick={() => setShowImageModal(false)}
      style={{
        position: "absolute",
        top: "15px",
        right: "20px",
        background: "rgba(255,255,255,0.2)",
        color: "white",
        border: "none",
        borderRadius: "50%",
        width: "35px",
        height: "35px",
        fontSize: "1.5rem",
        cursor: "pointer",
        zIndex: 10000,
      }}
    >
      ×
    </button>
  </Modal.Body>
</Modal>

<Modal
  show={showDeleteSuccess}
  onHide={() => setShowDeleteSuccess(false)}
  centered
>
  <Modal.Body className="text-center p-5">
    <CheckCircleFill size={50} color="green" className="mb-3" />
    <h5 className="text-success">Complaint Deleted Successfully!</h5>
  </Modal.Body>
</Modal>

<Modal
  show={showSaveSuccess}
  onHide={() => setShowSaveSuccess(false)}
  centered
>
  <Modal.Body className="text-center p-5">
    <CheckCircleFill size={50} color="green" className="mb-3" />
    <h5 className="text-success">Complaint Saved Successfully!</h5>
  </Modal.Body>
</Modal>

{/* Reopen Complaint Modal */}
<ReopenComplaintModal
  show={showReopenModal}
  onHide={() => setShowReopenModal(false)}
  complaintId={selectedComplaintForReopen?.complaint_id}
  userEmail={user?.email}
  baseUrl={baseUrl}
    onSuccess={() => {
      // Show success toast in the dashboard (so user sees it where they reopened)
      toast.success("Complaint reopened! Admins have been notified.", { position: "top-right", autoClose: 4000 });

      // Refresh complaints after reopening
      const token = localStorage.getItem("authToken");
      axios
        .get(`${baseUrl}/user-api/view-complaints/${user.email}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setComplaints(res.data.complaints || []);
        })
        .catch((err) => console.error(err));
    }}
/>

      </div>
    </div>
  );
};

export default UserDashboard;
