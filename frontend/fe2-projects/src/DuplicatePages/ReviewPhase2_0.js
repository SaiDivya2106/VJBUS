import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Modal, Button } from 'react-bootstrap';
import "./ReviewPhase2_0.css";

function ReviewPhase2_0() {
  const [project, setProject] = useState({});
  const [reviews, setReviews] = useState([]);
  const nav = useNavigate();
  const location = useLocation();
  const currentUser = useSelector((state) => state.PRC.currentUser);
  const [projectId, setProjectId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [newReview, setNewReview] = useState({ faculty_name: "", review: "", rating: 1 });
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);

  let backendURL = process.env.REACT_APP_backend_url;

  useEffect(() => {
    const fetchProject = async () => {
      const path = location.pathname;
      const id = path.slice(14);
      setProjectId(id);

      try {
        const token = sessionStorage.getItem("Token");
        const response = await axios.get(`${backendURL}/get_review/${id}`, {
          headers: { Authorization: `Bearer ${token}` }, withCredentials: true
        });
        setProject(response.data.project[0]);
        setReviews(response.data.reviews);
        console.log("response", response.data.reviews);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };
    fetchProject();
  }, [location]);

  const handleAddReview = async () => {
    try {
      const token = sessionStorage.getItem("Token");
      const res = await axios.post(`${backendURL}/add_review`, {
        project_id: project.project_id,
        department: project.department,
        ...newReview
      }, {
        headers: { Authorization: `Bearer ${token}` }, withCredentials: true
      });
      setReviews([...reviews, res.data.newReview]);
      setNewReview({ faculty_name: "", review: "", rating: 1 });
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  const handleEditReview = async () => {
    try {
      console.log("Editing review:", editingReview);
      const token = sessionStorage.getItem("Token");
      await axios.put(`${backendURL}/edit_review`, {
        project_id: project.project_id,
        department: project.department,
        review_id: editingReview.review_id,
        ...editingReview
      }, {
        headers: { Authorization: `Bearer ${token}` }, withCredentials: true
      });
      setReviews(reviews.map(r => (r.review_id === editingReview.review_id ? editingReview : r)));
      setShowEditModal(false);
      setEditingReview(null);
    } catch (error) {
      console.error("Error editing review:", error);
    }
  };

  const handleDeleteReview = async (review_id) => {
    try {
      const token = sessionStorage.getItem("Token");
      await axios.delete(`${backendURL}/delete_review/${review_id}`, {
        
        
        withCredentials: true
      });
      setReviews(reviews.filter(r => r.review_id !== review_id));
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handlePublishProject = async () => {
    try {
      const token = sessionStorage.getItem("Token");
      await axios.get(`${backendURL}/publish_project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      alert("Project has been published.");
      nav("/reviewPhaseForPRC");
    } catch (error) {
      console.error("Error publishing project:", error);
    }
  };

  return (
    <div className="review-phase-container">
      <div className="alt-welcome-container">
        <h1>Welcome to the Department of {currentUser?.department || "Unknown"}</h1>
      </div>
      <div className="rpage-details">
        <h1 className="project-title">{project.title}</h1>
        <p className="project-author">by {project.staff_name}</p>
        <p className="project-description">{project.abstract}</p>
        <h2 className="reviews-heading">REVIEWS</h2>

        {reviews.map((review) => (
          <div key={review[2]} className="review-card">
            <h3 className="review-faculty-name">{review[5]}</h3>
            <p className="review-text">{review[3]}</p>
            <p className="review-rating">{"★".repeat(review[4])}{"☆".repeat(5 - review.rating)}</p>
            <div className="review-actions">
              <button className="edit-button" onClick={() => {
                setEditingReview({
                  review_id: review[2],
                  faculty_name: review[5],
                  review: review[3],
                  rating: review[4]
                });
                setShowEditModal(true);
              }}>
                <FaEdit /> Edit
              </button>
              <button className="delete-button" onClick={() => handleDeleteReview(review[2])}>
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}

        <button className="add-review-button" onClick={() => setShowAddModal(true)}>Add Review</button>
        <Button className="mt-4 m-2" variant="primary" onClick={() => setShowPublishConfirm(true)}>Publish Project</Button>
      </div>

      {/* Add Review Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add a New Review</h3>
            <input type="text" placeholder="Faculty Name" value={newReview.faculty_name}
              onChange={(e) => setNewReview({ ...newReview, faculty_name: e.target.value })} />
            <textarea placeholder="Write your review here..." value={newReview.review}
              onChange={(e) => setNewReview({ ...newReview, review: e.target.value })} />
            <div className="rating-input">
              <label>Rating:</label>
              <select value={newReview.rating} onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}>
                {[1, 2, 3, 4, 5].map((num) => <option key={num} value={num}>{num}</option>)}
              </select>
            </div>
            <div className="modal-actions">
              <button className="submit-button" onClick={handleAddReview}>Submit</button>
              <button className="cancel-button" onClick={() => setShowAddModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Review Modal */}
      {showEditModal && editingReview && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Review</h3>
            <input type="text" placeholder="Faculty Name" value={editingReview.faculty_name}
              onChange={(e) => setEditingReview({ ...editingReview, faculty_name: e.target.value })} />
            <textarea placeholder="Write your review here..." value={editingReview.review}
              onChange={(e) => setEditingReview({ ...editingReview, review: e.target.value })} />
            <div className="rating-input">
              <label>Rating:</label>
              <select value={editingReview.rating} onChange={(e) => setEditingReview({ ...editingReview, rating: parseInt(e.target.value) })}>
                {[1, 2, 3, 4, 5].map((num) => <option key={num} value={num}>{num}</option>)}
              </select>
            </div>
            <div className="modal-actions">
              <button className="submit-button" onClick={handleEditReview}>Update</button>
              <button className="cancel-button" onClick={() => { setShowEditModal(false); setEditingReview(null); }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Publish Confirmation Modal */}
      <Modal show={showPublishConfirm} onHide={() => setShowPublishConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Publish</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to publish this project? This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPublishConfirm(false)}>Cancel</Button>
          <Button variant="primary" onClick={handlePublishProject}>Confirm</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ReviewPhase2_0;




// // import React, { useState } from "react";
// // import "./ReviewPhase2_0.css";
// // import { useNavigate } from "react-router-dom";
// // import { FaEdit, FaTrash, FaUpload } from "react-icons/fa"; // Icons for actions

// // function ReviewPhase2_0() {
// //   const nav = useNavigate();
// //   const currentUser = { department: "Computer Science" }; // Simulated user data
// //   const [project, setProject] = useState({
// //     project_id: "123",
// //     title: "Sample Project Title",
// //     description: "This is a sample project description.",
// //     staff_name: "Dr. John Doe",
// //     department: "Computer Science",
// //   });
// //   const [reviews, setReviews] = useState([
// //     {
// //       review_id: "1",
// //       review: "Great project!",
// //       rating: 5,
// //       faculty_name: "Prof. Smith",
// //     },
// //     {
// //       review_id: "2",
// //       review: "Needs improvement.",
// //       rating: 3,
// //       faculty_name: "Dr. Brown",
// //     },
// //   ]);

// //   const handleDeleteReview = (reviewId) => {
// //     setReviews(reviews.filter((r) => r.review_id !== reviewId));
// //   };

// //   const handlePublishProject = () => {
// //     alert("Project has been published.");
// //     nav("/reviewPhase1");
// //   };

// //   return (
// //     <div className="review-phase-container">
// //       {/* Welcome Banner */}
// //       <div className="alt-welcome-container">
// //         <h1>Welcome to the Department of {currentUser?.department || "Unknown"}</h1>
// //       </div>

// //       {/* Project Details */}
// //       <div className="rpage-details">
// //         <h1 className="project-title">{project.title}</h1>
// //         <p className="project-author">by {project.staff_name}</p>
// //         <p className="project-description">{project.description}</p>

// //         {/* Reviews Section */}
// //         <h2 className="reviews-heading">REVIEWS</h2>
// //         {reviews.map((review) => (
// //           <div key={review.review_id} className="review-card">
// //             <h3 className="review-faculty-name">{review.faculty_name}</h3>
// //             <p className="review-text">{review.review}</p>
// //             <p className="review-rating">
// //               {"★".repeat(review.rating)}
// //               {"☆".repeat(5 - review.rating)}
// //             </p>

// //             {/* Action Buttons */}
// //             <div className="review-actions">
// //               {/* Edit Button */}
// //               <button className="edit-button">
// //                 <FaEdit /> Edit
// //               </button>

// //               {/* Delete Button */}
// //               <button
// //                 className="delete-button"
// //                 onClick={() => handleDeleteReview(review.review_id)}
// //               >
// //                 <FaTrash /> Delete
// //               </button>

// //               {/* Publish Button */}
// //               <button className="publish-button" onClick={handlePublishProject}>
// //                 <FaUpload /> Publish
// //               </button>
// //             </div>
// //           </div>
// //         ))}

// //         {/* Add Review Button */}
// //         <button className="add-review-button">
// //           Add Review
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// // export default ReviewPhase2_0;
// import React, { useState } from "react";
// import "./ReviewPhase2_0.css";
// import { useNavigate } from "react-router-dom";
// import { FaEdit, FaTrash, FaUpload } from "react-icons/fa"; // Icons for actions

// function ReviewPhase2_0() {
//   const nav = useNavigate();
//   const currentUser = { department: "Computer Science" }; // Simulated user data
//   const [project, setProject] = useState({
//     project_id: "123",
//     title: "Sample Project Title",
//     description: "This is a sample project description.",
//     staff_name: "Dr. John Doe",
//     department: "Computer Science",
//   });
//   const [reviews, setReviews] = useState([
//     {
//       review_id: "1",
//       review: "Great project!",
//       rating: 5,
//       faculty_name: "Prof. Smith",
//     },
//     {
//       review_id: "2",
//       review: "Needs improvement.",
//       rating: 3,
//       faculty_name: "Dr. Brown",
//     },
//   ]);
//   const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
//   const [editingReviewId, setEditingReviewId] = useState(null); // Track which review is being edited
//   const [newReview, setNewReview] = useState({
//     faculty_name: "",
//     review: "",
//     rating: 5, // Default rating
//   });

//   const handleDeleteReview = (reviewId) => {
//     setReviews(reviews.filter((r) => r.review_id !== reviewId));
//   };

//   const handlePublishProject = () => {
//     alert("Project has been published.");
//     nav("/reviewPhase1");
//   };

//   const handleAddReview = () => {
//     if (!newReview.faculty_name || !newReview.review) {
//       alert("Please fill in all fields.");
//       return;
//     }

//     const newReviewWithId = {
//       review_id: (reviews.length + 1).toString(), // Generate a unique ID
//       ...newReview,
//     };

//     setReviews([...reviews, newReviewWithId]);
//     setNewReview({ faculty_name: "", review: "", rating: 5 }); // Reset form
//     setIsModalOpen(false); // Close the modal after submission
//   };

//   const handleEditReview = () => {
//     if (!newReview.faculty_name || !newReview.review) {
//       alert("Please fill in all fields.");
//       return;
//     }

//     const updatedReviews = reviews.map((review) =>
//       review.review_id === editingReviewId ? { ...review, ...newReview } : review
//     );

//     setReviews(updatedReviews);
//     setNewReview({ faculty_name: "", review: "", rating: 5 }); // Reset form
//     setEditingReviewId(null); // Exit edit mode
//     setIsModalOpen(false); // Close the modal after submission
//   };

//   const openEditModal = (review) => {
//     setNewReview({
//       faculty_name: review.faculty_name,
//       review: review.review,
//       rating: review.rating,
//     });
//     setEditingReviewId(review.review_id);
//     setIsModalOpen(true);
//   };

//   return (
//     <div className="review-phase-container">
//       {/* Welcome Banner */}
//       <div className="alt-welcome-container">
//         <h1>Welcome to the Department of {currentUser?.department || "Unknown"}</h1>
//       </div>
//       {/* Project Details */}
//       <div className="rpage-details">
//         <h1 className="project-title">{project.title}</h1>
//         <p className="project-author">by {project.staff_name}</p>
//         <p className="project-description">{project.description}</p>
//         {/* Reviews Section */}
//         <h2 className="reviews-heading">REVIEWS</h2>
//         {reviews.map((review) => (
//           <div key={review.review_id} className="review-card">
//             <h3 className="review-faculty-name">{review.faculty_name}</h3>
//             <p className="review-text">{review.review}</p>
//             <p className="review-rating">
//               {"★".repeat(review.rating)}
//               {"☆".repeat(5 - review.rating)}
//             </p>
//             {/* Action Buttons */}
//             <div className="review-actions">
//               {/* Edit Button */}
//               <button className="edit-button" onClick={() => openEditModal(review)}>
//                 <FaEdit /> Edit
//               </button>
//               {/* Delete Button */}
//               <button
//                 className="delete-button"
//                 onClick={() => handleDeleteReview(review.review_id)}
//               >
//                 <FaTrash /> Delete
//               </button>
//               {/* Publish Button */}
//               <button className="publish-button" onClick={handlePublishProject}>
//                 <FaUpload /> Publish
//               </button>
//             </div>
//           </div>
//         ))}
//         {/* Add Review Button */}
//         <button className="add-review-button" onClick={() => setIsModalOpen(true)}>
//           Add Review
//         </button>
//       </div>

//       {/* Modal Pop-Up */}
//       {isModalOpen && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <h3>{editingReviewId ? "Edit Review" : "Add a New Review"}</h3>
//             <input
//               type="text"
//               placeholder="Faculty Name"
//               value={newReview.faculty_name}
//               onChange={(e) =>
//                 setNewReview({ ...newReview, faculty_name: e.target.value })
//               }
//             />
//             <textarea
//               placeholder="Write your review here..."
//               value={newReview.review}
//               onChange={(e) =>
//                 setNewReview({ ...newReview, review: e.target.value })
//               }
//             />
//             <div className="rating-input">
//               <label>Rating:</label>
//               <select
//                 value={newReview.rating}
//                 onChange={(e) =>
//                   setNewReview({ ...newReview, rating: parseInt(e.target.value) })
//                 }
//               >
//                 {[1, 2, 3, 4, 5].map((num) => (
//                   <option key={num} value={num}>
//                     {num}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="modal-actions">
//               <button
//                 className="submit-button"
//                 onClick={editingReviewId ? handleEditReview : handleAddReview}
//               >
//                 {editingReviewId ? "Update" : "Submit"}
//               </button>
//               <button className="cancel-button" onClick={() => setIsModalOpen(false)}>
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ReviewPhase2_0;