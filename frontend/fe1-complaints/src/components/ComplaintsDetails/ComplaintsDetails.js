import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./ComplaintsDetails.css";
import { HiOutlineThumbUp } from "react-icons/hi";
import { HiOutlineThumbDown } from "react-icons/hi";
import { IoMdSend} from "react-icons/io"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const ComplaintsDetails = () => {
  const { complaint_id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [status, setStatus] = useState("");
  const [newComment, setNewComment] = useState("");
  const baseUrl = process.env.REACT_APP_COMPLAINTS_APP_BE_URL;

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
     
      hour12: true,
    });
  };

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/admin-api/view-complaint/${complaint_id}`
        );
        const complaintData = response.data.complaint;
        setComplaint({
          ...complaintData,
          comments: complaintData.comments || [],
        });
        setStatus(complaintData.status);
      } catch (error) {
        console.error("Error fetching complaint details:", error);
      }
    };
    fetchComplaint();
  }, [complaint_id]);


  const handleStatusChange = async (e) => {
    const updatedStatus = e.target.value;
    setStatus(updatedStatus);

    try {
      await axios.put(
        `${baseUrl}/admin-api/update-status/${complaint_id}`,
        { status: updatedStatus }
      );
      setComplaint((prev) => ({ ...prev, status: updatedStatus }));
      toast.success(`Status updated to: ${updatedStatus}`, {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };


  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    const newCommentObj = {
      id: (complaint.comments.length || 0) + 1,
      date: new Date().toISOString(),
      text: newComment,
    };

    try {
      await axios.post(
        `${baseUrl}/admin-api/complaints/${complaint_id}/comment`,
        { comment: newCommentObj }
      );
      setComplaint((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), newCommentObj],
      }));
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComplaint = async () => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;

    try {
      await axios.delete(
        `${baseUrl}/admin-api/delete-complaint/${complaint_id}`
      );
      alert("Complaint has been deleted successfully.");
      navigate("/adminpage");
    } catch (error) {
      console.error("Error deleting complaint:", error);
    }
  };

  const handleBackClick = () => {
    navigate("/adminpage");
  };

  if (!complaint) {
    return <div className="container">Loading complaint details...</div>;
  }

  

  return (
    
    <div className="complaint-page">
      <ToastContainer /> 
      <div className="container">
      <button className="btn btn-outline-secondary mb-3" onClick={handleBackClick}>
          <i className="bi bi-arrow-left"></i> Back
        </button>
        <h1 className="page-title fs-1 fw-bold">Complaint Details</h1>
        <div className="d-flex justify-content-end align-items-center mb-4">
          <button className="btn btn-danger btn-sm" onClick={handleDeleteComplaint}>
            <i className="bi bi-trash3-fill me-1"></i> Delete Complaint
          </button>
        </div>
        <div className="card mb-4">
          <div className="card-body">
            <h1 className="h4 fw-bold">{complaint.title}</h1>
            <div className="complaint-meta mt-2">
              <span className="me-3">
                <i className="bi bi-calendar3 me-1"></i> {formatDate(complaint.timestamp)}
              </span>
              <span className="categoryb ">{complaint.category}</span>
              <div className="mb-1 ms-2 p-2 d-flex align-items-center">
          <HiOutlineThumbUp className="text-success fs-4 me-1" /> {complaint.likes}
          <span className="mx-1"></span>
          <HiOutlineThumbDown className="text-danger fs-4 ms-2 me-1" /> {complaint.dislikes}
        </div>

        

            </div>
            <p className="lead mt-3">{complaint.description}</p>
            <div className="mt-4 d-flex">
             
              <h6 className="mt-2 fw-2">Update Status:</h6>
              <span className="mx-2 "></span>
              <select className="form-select mb-3" value={status}  onChange={handleStatusChange}>
                <option value="Pending">🟡 Pending</option>
                <option value="Ongoing">🔵 Ongoing</option>
                <option value="Resolved">🟢 Resolved</option>
              </select>
            </div>
          </div>
        </div>
        <div className="card mb-4">
          <div className="card-body">
            <h3 className="h5 mb-3">Your Comments</h3>
            {complaint.comments.length > 0 ? (
              complaint.comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <small className="text-muted">{formatDate(comment.date)}</small>
                  <p className="mb-0">{comment.text}</p>
                </div>
              ))
            ) : (
              <p className="text-muted">No comments yet.</p>
            )}
            <div className="d-flex align-items-center">
  <textarea
    className="form-control flex-grow-1"
    placeholder="Add your comment here..."
    rows="2"
    style={{ height: "60px" }}  // Ensures same height as the button
    value={newComment}
    onChange={(e) => setNewComment(e.target.value)}
  ></textarea>
  
  <button 
    className="btn btn-primary btn-sm ms-2 mb-2 d-flex align-items-center justify-content-center"
    onClick={handleCommentSubmit}
    disabled={!newComment.trim()} 
    style={{ width: "60px", height: "60px" }}  
  >
    <IoMdSend className="text-white" size={30} />
  </button>
</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintsDetails;
