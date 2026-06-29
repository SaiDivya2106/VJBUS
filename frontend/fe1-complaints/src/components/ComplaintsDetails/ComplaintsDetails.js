import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./ComplaintsDetails.css";
import { HiOutlineThumbUp, HiOutlineThumbDown } from "react-icons/hi";
import { IoMdSend } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BiCategoryAlt } from "react-icons/bi";
import { FaDoorOpen } from "react-icons/fa";
import { FiWifi, FiClock } from "react-icons/fi";
import { IoMdCall } from "react-icons/io";
import { useAuth } from "../../Context/AuthContext";
import ComplaintCategoryWithFlag from "../ComplaintCategoryWithFlag/ComplaintCategoryWithFlag";
import { isExperimental } from "../../utils/isExperimental";
import ReassignmentProtectionModal from "../ReassignmentProtectionModal/ReassignmentProtectionModal";
import { FaUser } from "react-icons/fa";





const ComplaintsDetails = () => {
  const { complaint_id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [status, setStatus] = useState("");
  const [newComment, setNewComment] = useState("");
  const { user, isAssistant } = useAuth();
  const baseUrl = process.env.REACT_APP_COMPLAINTS_APP_BE_URL;
  const [showReassignmentModal, setShowReassignmentModal] = useState(false);
  const [reassignmentCheck, setReassignmentCheck] = useState({ isReassigned: false, currentUser: null, assignedTo: null });

  // determine if complaint is flagged (used to disable updates)
  const isFlagged = complaint?.flagged === true || complaint?.flagged?.isFlagged === true;
  
  // ✅ Check if complaint is reassigned to another assistant (for current assistant user)
  // const isReassignedToOther = isAssistant && complaint?.assignedAssistant && complaint.assignedAssistant !== user?.email;
  


const isReassigned =
  isAssistant &&
  complaint?.assignedAssistant &&
  complaint.assignedAssistant !== user?.email;
const isTakenBack =
  isAssistant && !complaint?.assignedAssistant;


const isNotAllowed = isTakenBack || isReassigned;




  // Track expanded replies per comment (Complaint Details page)
  const [expandedReplies, setExpandedReplies] = useState({});



  // const formatDate = (isoString) => {
  //   const date = new Date(isoString);
  //   return date.toLocaleString("en-US", {
  //     weekday: "long",
  //     year: "numeric",
  //     month: "long",
  //     day: "numeric",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     hour12: true,
  //   });
  // };
  const toggleReplies = (commentId) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };



const visibleComments = complaint?.comments?.filter(
  (c) =>
    c.text &&
    !c.text.includes("[Assistant Update]") &&
    !c.text.toLowerCase().includes("updated status to")
) || [];





  const formatDate = (timestamp) => {
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


  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const token = localStorage.getItem("authToken");

        const response = await axios.get(
          `${baseUrl}/admin-api/view-complaint/${complaint_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const complaintData = response.data.complaint;
        setComplaint({
          ...complaintData,
          comments: complaintData.comments || [],
        });
        setStatus(complaintData.status);
        
        // ✅ Check if complaint has been reassigned after loading
        // if (isAssistant && complaintData.assignedAssistant && complaintData.assignedAssistant !== user?.email) {
        //   setReassignmentCheck({
        //     isReassigned: true,
        //     currentUser: user?.email,
        //     assignedTo: complaintData.assignedAssistant
        //   });
        //   setShowReassignmentModal(true);
        // }



        if (isAssistant) {
  if (!complaintData.assignedAssistant) {
    toast.error("This complaint was taken back by Admin.");
  } else if (complaintData.assignedAssistant !== user?.email) {
    toast.error(
      `This complaint is now assigned to ${complaintData.assignedAssistant}.`
    );
  }
}
      } catch (error) {
        console.error("Error fetching complaint details:", error);
      }
    };
    fetchComplaint();
  }, [complaint_id, isAssistant, user?.email]);

  const handleStatusChange = async (e) => {
    const updatedStatus = e.target.value;
    setStatus(updatedStatus);

    if (!user || !user.email) {
      toast.error("User email missing. Please login again.");
      return;
    }

    // ✅ Check if complaint is reassigned (for assistants only)
    if (isAssistant && complaint?.assignedAssistant && complaint.assignedAssistant !== user.email) {
      setReassignmentCheck({
        isReassigned: true,
        currentUser: user.email,
        assignedTo: complaint.assignedAssistant
      });
      setShowReassignmentModal(true);
      setStatus(complaint.status); // Reset status dropdown
      return;
    }

    try {
      const token = localStorage.getItem("authToken");

      // ✅ Use different API for Assistant
      if (isAssistant) {
        await axios.put(
          `${baseUrl}/admin-api/update-complaint-status-assistant`,
          {
            complaintId: complaint_id,
            status: updatedStatus,
            assistantEmail: user.email,
            remarks: `Status updated to ${updatedStatus} by assistant` // Default remark
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Admin API
        await axios.put(
          `${baseUrl}/admin-api/update-status/${complaint_id}`,
          { status: updatedStatus, adminEmail: user.email },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setComplaint((prev) => ({ ...prev, status: updatedStatus }));
      toast.success(`Status updated to: ${updatedStatus}`);
      if (isExperimental) toast.info("📧 Demo: Status update email simulated.");
    } catch (error) {
      console.error("Error updating status:", error);
      
      // ✅ Handle specific case when complaint is reassigned to someone else
      if (error.response?.status === 403 && error.response?.data?.message === "Complaint not assigned to you") {
        // Fetch latest complaint data to get current assignee
        try {
          const token = localStorage.getItem("authToken");
          const response = await axios.get(
            `${baseUrl}/admin-api/view-complaint/${complaint_id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const updatedComplaint = response.data.complaint;
          
          setReassignmentCheck({
            isReassigned: true,
            currentUser: user.email,
            assignedTo: updatedComplaint.assignedAssistant || "Unknown"
          });
          setShowReassignmentModal(true);
          setStatus(complaint.status); // Reset status to original
        } catch (fetchError) {
          console.error("Error fetching updated complaint:", fetchError);
          toast.error("This complaint has been reassigned to another assistant.");
        }
      } else {
        toast.error("Failed to update status. You may not be assigned to this complaint.");
      }
    }
  };

  const handleCategoryChange = async (e) => {
    const newCategory = e.target.value;

    if (newCategory === complaint.category) {
      toast.info("Please select a different category");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to move this complaint to ${newCategory}?`
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");

      await axios.put(
        `${baseUrl}/admin-api/change-category/${complaint_id}`,
        {
          newCategory,
          adminEmail: user.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComplaint((prev) => ({ ...prev, category: newCategory }));
      toast.success(`Complaint moved to ${newCategory}.`);
      // Category change might not trigger email in backend currently, but if it did:
      // if (isExperimental) toast.info("📧 Demo: Email simulated.");
    } catch (error) {
      console.error("Error changing category:", error);
      toast.error("Failed to change category.");
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    
    // ✅ Check if complaint is reassigned before allowing comment
    if (isNotAllowed) {
      setReassignmentCheck({
        isReassigned: true,
        currentUser: user.email,
        assignedTo: complaint.assignedAssistant
      });
      setShowReassignmentModal(true);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");

      await axios.post(
        `${baseUrl}/admin-api/complaints/${complaint_id}/comment`,
        {
          text: newComment,
          adminEmail: user.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComplaint((prev) => ({
        ...prev,
        comments: [
          ...(prev.comments || []),
          {
            id: new Date().getTime(),
            text: newComment,
            date: new Date().toISOString(),
            email: user.email,
          },
        ],
      }));

      setNewComment("");
      if (isExperimental) toast.info("📧 Demo: New comment email simulated.");
    } catch (error) {
      console.error("Error adding comment:", error);
      // ✅ Handle specific case when complaint is reassigned
      if (error.response?.status === 403) {
        toast.error("You cannot add comments. This complaint has been reassigned to another assistant.");
        // Fetch latest data to get current assignee
        try {
          const token = localStorage.getItem("authToken");
          const response = await axios.get(
            `${baseUrl}/admin-api/view-complaint/${complaint_id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const updatedComplaint = response.data.complaint;
          
          setReassignmentCheck({
            isReassigned: true,
            currentUser: user.email,
            assignedTo: updatedComplaint.assignedAssistant || "Unknown"
          });
          setShowReassignmentModal(true);
        } catch (fetchError) {
          console.error("Error fetching updated complaint:", fetchError);
        }
      } else {
        toast.error("Failed to add comment.");
      }
    }
  };

  const handleDeleteComplaint = async () => {
    if (!window.confirm("Are you sure you want to delete this complaint?"))
      return;

    try {
      const token = localStorage.getItem("authToken");

      if (!user || !user.email) {
        toast.error("Admin email missing. Please login again.");
        return;
      }

      await axios.delete(`${baseUrl}/admin-api/delete-complaint/${complaint_id}`, {
        data: { adminEmail: user.email },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Complaint deleted successfully.");
      if (isExperimental) alert("📧 Demo: Deletion email simulated.");
      navigate("/adminpage");
    } catch (error) {
      console.error("Error deleting complaint:", error);
    }
  };

  const handleBackClick = () => navigate("/adminpage");

  // IT details fallbacks
  const itLocation = complaint?.it_details?.location;
  const itConnection = complaint?.it_details?.connectionType;
  const itRoom = complaint?.it_details?.room_number || complaint?.room_number;
  const itSpeed = complaint?.it_details?.internet_speed || complaint?.internet_speed;
  const itDuration = complaint?.it_details?.issue_duration || complaint?.issue_duration;
  const itMobile = complaint?.it_details?.mobile_number || complaint?.mobile_number;

  if (!complaint) return <div className="container">Loading complaint...</div>;

  return (
    <div className="complaint-page">
      <ToastContainer />
      <div className="container">

        <button className="btn btn-outline-primary mb-3 mt-3" onClick={handleBackClick}>
          <i className="bi bi-arrow-left"></i> Back
        </button>

        <div className="complaint-header-wrapper d-flex justify-content-between align-items-center mt-4 mb-3 px-2">
          <h1 className="page-title fs-2 fw-bold mb-0">Request Details</h1>
          {!isAssistant && (
            <button className="btn btn-danger delete-icon-btn" onClick={handleDeleteComplaint}>
              <i className="bi bi-trash3-fill"></i>
            </button>
          )}
        </div>

        {/* MAIN SECTION */}
        <div className="content-section">

          <div className="top-row d-flex justify-content-between align-items-center position-relative">
            <span className="categoryb">
              <BiCategoryAlt size={18} /> {complaint.category}
            </span>

            <div className="engagement-box d-flex gap-3">
              <div className="likes d-flex align-items-center gap-1">
                <HiOutlineThumbUp size={24} /> {complaint.likes}
              </div>
              <div className="dislikes d-flex align-items-center gap-1">
                <HiOutlineThumbDown size={24} /> {complaint.dislikes}
              </div>
            </div>

            {/* <div
              className="position-absolute"
              style={{ top: "10px", right: "10px", zIndex: 10 }}
            >
              <ComplaintCategoryWithFlag
                complaintId={complaint.complaint_id}
                baseUrl={baseUrl}
                complaint={complaint}
                user={user}
                onFlagged={() => toast.success("Complaint flagged!")}
                disabled={isFlagged}
              />
            </div> */}
            <div
              className="position-absolute"
              style={{ top: "10px", right: "10px", zIndex: 10 }}
            >
              {complaint?.flagged?.isFlagged ? (
                <span className="flagged-badge-red">
                  <i className="bi bi-flag-fill"></i>
                  Flagged
                </span>
              ) : (
                <ComplaintCategoryWithFlag
                  complaintId={complaint.complaint_id}
                  baseUrl={baseUrl}
                  complaint={complaint}
                  user={user}
                  onFlagged={() => {
                    toast.success("Complaint flagged!");
                    if (isExperimental) toast.info("📧 Demo: Flag email simulated.");
                  }}
                />
              )}
            </div>

          </div>

          <h1 className="h4 fw-bold">{complaint.title}</h1>

          <div className="complaint-meta mt-2">
            <span className="me-3">
              <i className="bi bi-calendar3 me-1"></i>
              {formatDate(complaint.timestamp)}
            </span>
          </div>

          <p className="mt-2 description-text">{complaint.description}</p>

          {/* IT Details Section - Show only for IT and Networking category */}
          {complaint.category === "IT and Networking" && complaint.it_details && (
            <div className="it-details-section mt-4 p-4" style={{
              backgroundColor: "#f8f9ff",
              borderLeft: "4px solid #4c63d2",
              borderRadius: "8px"
            }}>
              <h5 className="fw-bold mb-3" style={{ color: "#4c63d2" }}>
                <FiWifi size={20} className="me-2" style={{ display: "inline" }} />
                IT & Networking Details
              </h5>
              <div className="row">
                {complaint.it_details.location && (
                  <div className="col-md-6 mb-2">
                    <strong className="text-muted">📍 Location:</strong>
                    <p className="ms-3">{complaint.it_details.location}</p>
                  </div>
                )}
                {complaint.it_details.connectionType && (
                  <div className="col-md-6 mb-2">
                    <strong className="text-muted">🔗 Connection Type:</strong>
                    <p className="ms-3">{complaint.it_details.connectionType}</p>
                  </div>
                )}
                {complaint.it_details.room_number && (
                  <div className="col-md-6 mb-2">
                    <strong className="text-muted">🏷️ Room Number:</strong>
                    <p className="ms-3">{complaint.it_details.room_number}</p>
                  </div>
                )}
                {complaint.it_details.internet_speed && (
                  <div className="col-md-6 mb-2">
                    <strong className="text-muted">📶 Internet Speed:</strong>
                    <p className="ms-3">{complaint.it_details.internet_speed}</p>
                  </div>
                )}
                {complaint.it_details.mobile_number && (
                  <div className="col-md-6 mb-2">
                    <strong className="text-muted">📞 Mobile Number:</strong>
                    <p className="ms-3">{complaint.it_details.mobile_number}</p>
                  </div>
                )}
                {complaint.it_details.issue_duration && (
                  <div className="col-md-6 mb-2">
                    <strong className="text-muted">⏱️ Issue Duration:</strong>
                    <p className="ms-3">{complaint.it_details.issue_duration}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ⭐ FIXED - STATUS LEFT, CATEGORY RIGHT WITH LABELS */}
          <div className="d-flex justify-content-between align-items-start mt-4 flex-wrap">

            {/* LEFT SIDE - STATUS */}
            <div className="form-css status-box" style={{ minWidth: "240px" }}>
              <label className="form-label fw-bold mb-1">Update Status</label>
              <select
                className={`form-select ${status.toLowerCase()}-status`}
                value={status}
                onChange={handleStatusChange}
                // disabled={isFlagged || isReassignedToOther}

                disabled={isFlagged || isNotAllowed}
                title={isNotAllowed ? "This complaint has been reassigned to another assistant" : ""}
              >
                <option value="Pending">⏳ Pending</option>
                <option value="Ongoing">🔄 Ongoing</option>
                <option value="Resolved">✅ Resolved</option>
              </select>
            </div>

            {/* RIGHT SIDE - CATEGORY */}
            <div className="category-box" style={{ minWidth: "280px" }}>
              <label className="form-label fw-bold mb-1">Change Category(reassign/escalate)</label>
              <select
                className="form-select"
                value={complaint.category}
                onChange={handleCategoryChange}
                // disabled={isFlagged || isReassignedToOther}

                disabled={isFlagged || isNotAllowed}
                title={isNotAllowed ? "This complaint has been reassigned to another assistant" : ""}
              >
                <option value={complaint.category}>{complaint.category} (current)</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Canteen">Canteen</option>
                <option value="Examination">Examination</option>
                <option value="Fee Payments and Accounts">Fee Payments and Accounts</option>
                <option value="Boys Hostel">Boys Hostel</option>
                <option value="Girls Hostel">Girls Hostel</option>
                <option value="Hostel Food">Hostel Food</option>
                <option value="Extracurricular and Events">Extracurricular and Events</option>
                <option value="Security">Security</option>
                <option value="Sports">Sports</option>
                <option value="Housekeeping">Housekeeping</option>
                <option value="Audio-Visual Equipment">Audio-Visual Equipment</option>
                <option value="Parking">Parking</option>
                <option value="Transport">Transport</option>
                <option value="Library">Library</option>
                <option value="IT and Networking">IT and Networking</option>
                <option value="Others">Others</option>
              </select>
            </div>

          </div>


          <hr className="mt-4" />

          {/* COMMENTS TIMELINE */}
<h3 className="comment-heading">
  <i className="bi bi-chat-left-dots-fill"></i> Timeline ({visibleComments.length})
</h3>

<div className="comments-container">
  {visibleComments.length > 0 ? (
    <div className="timeline">
      {visibleComments.map((c, index) => {


                  // Determine display name and styling based on role
                  const isStudent = c.role === "student";
                  const displayName = isStudent ? "Student" : (c.email || "Admin");
                  const roleIcon = isStudent ? "🎓" : "👨‍💼";
                  const roleColor = isStudent ? "#ff6b6b" : "#4c63d2";
                  const roleBgColor = isStudent ? "#ffe0e0" : "#e8f0ff";

                  return (
                    <div key={c.id || index} className="timeline-item">
                      {/* Timeline dot and connector */}
                      <div className="timeline-marker" style={{ borderColor: roleColor, backgroundColor: roleColor }}>
                        {roleIcon}
                      </div>
                      {index < visibleComments.length
- 1 && <div className="timeline-line" style={{ borderLeftColor: roleColor }}></div>}

                      {/* Comment card */}
                      <div className="timeline-content">
                        <div className="comment-card" style={{ borderLeftColor: roleColor, backgroundColor: roleBgColor }}>
                          {/* <div className="comment-header">
                            <span className="comment-role" style={{ color: roleColor, fontWeight: "700" }}>
                              {displayName}
                            </span>
                            <span className="comment-date">
                              {formatDate(c.timestamp || c.date)}
                            </span>
                          </div> */}



                          <div className="comment-header">
                            <div className="comment-author">
                              <FaUser
                                size={16}
                                className="me-2"
                                style={{ color: c.role === "student" ? "#ff6b6b" : "#7b1fa2" }}
                              />
                              <span
                                style={{
                                  color: c.role === "student" ? "#ff6b6b" : "#7b1fa2",
                                  fontWeight: 700,
                                }}
                              >
                                {c.role === "student" ? "Student" : c.email}
                              </span>
                            </div>

                            <span className="comment-date">
                              {formatDate(c.timestamp || c.date)}
                            </span>
                          </div>





                          <div className="comment-body">{c.text}</div>

                          {/* Replies (threaded under this comment) */}
                          {c.replies && c.replies.length > 0 && (
                            <div style={{ marginLeft: "2.4rem", marginTop: "0.6rem" }}>
                              {(expandedReplies[c.id]
                                ? c.replies
                                : c.replies.slice(0, 2)
                              ).map((r) => (
                                <div
                                  key={r.id}
                                  style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: "10px",
                                    marginBottom: "10px",
                                  }}
                                >
                                  <span
                                    style={{
                                      color: "#ff6b6b",
                                      fontSize: "1.3rem",
                                      marginTop: "14px",
                                    }}
                                  >
                                    ↳
                                  </span>

                                  <div
                                    style={{
                                      backgroundColor: "#f6f8fa",
                                      borderLeft: "3px solid #e2e2e2",
                                      padding: "10px 12px",
                                      borderRadius: "10px",
                                      flex: 1,
                                    }}
                                  >
                                    <strong
                                      style={{
                                        color: "#ff6b6b",
                                        fontSize: "0.9rem",
                                      }}
                                    >
                                      Student
                                    </strong>

                                    <div style={{ fontSize: "0.95rem" }}>{r.text}</div>
                                  </div>
                                </div>
                              ))}

                              {/* 🔽 View More / View Less Replies */}
                              {c.replies.length > 2 && (
                                <div
                                  onClick={() => toggleReplies(c.id)}
                                  style={{
                                    marginLeft: "2.6rem",
                                    marginTop: "6px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    cursor: "pointer",
                                    color: "#527dfd",   // 💜 purple
                                    fontSize: "1rem",
                                    userSelect: "none",
                                    background: "transparent", // 🔑 important
                                  }}
                                >
                                  {/* ✅ Plain arrow — NO background */}
                                  <span
                                    style={{
                                      color: "#6188ff",
                                      fontSize: "1.2rem",
                                      marginTop: "2px",
                                    }}
                                  >
                                    ⤶
                                  </span>



                                  <span>
                                    {expandedReplies[c.id]
                                      ? "View less replies"
                                      : `View more replies (${c.replies.length - 2})`}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted">No comments yet.</p>
            )}

            <div className="d-flex align-items-center mt-3">
              <textarea
                className="form-control flex-grow-1"
                placeholder={isNotAllowed ? "This complaint has been reassigned to another assistant" : "Add your comment..."}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows="2"
                disabled={isNotAllowed}
              ></textarea>

              <button
                className="btn btn-primary btn-sm ms-2 d-flex align-items-center justify-content-center"
                onClick={handleCommentSubmit}
                disabled={!newComment.trim() || isNotAllowed}
                title={isNotAllowed? "You cannot add comments as this complaint has been reassigned" : ""}
                style={{ width: "60px", height: "60px" }}
              >
                <IoMdSend size={28} className="text-white" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Reassignment Protection Modal */}
      <ReassignmentProtectionModal
        show={showReassignmentModal}
        complaint={complaint}
        currentAssistant={reassignmentCheck.currentUser}
        assignedAssistant={reassignmentCheck.assignedTo}
        onClose={() => setShowReassignmentModal(false)}
      />

      <ToastContainer autoClose={3000} position="bottom-right" />
    </div>
  );
};

export default ComplaintsDetails;
