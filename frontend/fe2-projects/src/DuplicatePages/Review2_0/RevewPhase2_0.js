// import React, { useState } from 'react';
// import './RevewPhase2_0.css';
// import { useNavigate } from 'react-router-dom';
// import { Modal, Button } from 'react-bootstrap';
// import { v4 as uuidv4 } from 'uuid';
// import { useSelector } from 'react-redux';

// function ReviewPhase2_0() {
//   const nav = useNavigate();
//   const currentUser = useSelector((state) => state.PRC.currentUser);
//   const [showAddReview, setShowAddReview] = useState(false);
//   const [showEditReview, setShowEditReview] = useState(false);
  
//   const [project, setProject] = useState({
//     project_id: "123",
//     title: "Sample Project Title",
//     description: "This is a sample project description.",
//     staff_name: "Dr. John Doe",
//     department: "Computer Science",
//   });

//   const [reviews, setReviews] = useState([
//     { review_id: uuidv4(), review: "Great project!", rating: 5, faculty_name: "Prof. Smith" },
//     { review_id: uuidv4(), review: "Needs improvement.", rating: 3, faculty_name: "Dr. Brown" }
//   ]);

//   const [newReview, setNewReview] = useState({
//     review: '',
//     rating: '',
//     faculty_name: '',
//     review_id: uuidv4(),
//   });

//   const [editReview, setEditReview] = useState({
//     review: '',
//     rating: '',
//     faculty_name: '',
//     review_id: '',
//   });

//   const handleAddReview = () => {
//     setReviews([...reviews, newReview]);
//     setNewReview({ review: '', rating: '', faculty_name: '', review_id: uuidv4() });
//     setShowAddReview(false);
//   };

//   const handleEditReview = () => {
//     setReviews(reviews.map(r => (r.review_id === editReview.review_id ? editReview : r)));
//     setEditReview({ review: '', rating: '', faculty_name: '', review_id: '' });
//     setShowEditReview(false);
//   };

//   const handleDeleteReview = (reviewId) => {
//     setReviews(reviews.filter(r => r.review_id !== reviewId));
//   };

//   return (
//     <div className="mx-auto">
//       <div className="alt-welcome-container">
//         <p>Welcome to the Department of {currentUser?.department || 'Unknown'}</p>
//       </div>
      
//       <div className="rpage-details pt-4">
//         <h2 className="text-3xl font-bold mb-2">Title: {project.title}</h2>
//         <p className="text-lg font-medium text-gray-600 mb-4">by {project.staff_name}</p>
//         <div className="border-t border-gray-200 pt-2">
//           <h5 className="text-base leading-7 text-gray-800">{project.description}</h5>
//         </div>
//         <hr />

//         <h2 className='review p-1 mx-auto'>REVIEWS</h2>
//         {reviews.map((review) => (
//           <div key={review.review_id} className="review-card mt-6 p-4 rounded-lg shadow-lg">
//             <h4 className="font-bold text-xl">{review.faculty_name}</h4>
//             <p className="text-gray-700">{review.review}</p>
//             <span className="text-yellow-500">
//               {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
//             </span>
//             <div className="review-actions mt-4">
//               <Button variant="warning m-2" onClick={() => {
//                 setEditReview(review);
//                 setShowEditReview(true);
//               }}>Edit</Button>
//               <Button variant="danger m-2" onClick={() => handleDeleteReview(review.review_id)}>Delete</Button>
//             </div>
//           </div>
//         ))}

//         <Button className="mt-4 m-2" variant="secondary" onClick={() => setShowAddReview(true)}>Add Review</Button>
//       </div>

//       {/* Add Review Modal */}
//       <Modal show={showAddReview} onHide={() => setShowAddReview(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Add Review</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="form-group">
//             <label>Review</label>
//             <textarea className="form-control" value={newReview.review} onChange={(e) => setNewReview({ ...newReview, review: e.target.value })} />
//           </div>
//           <div className="form-group">
//             <label>Rating (1-5)</label>
//             <input type="number" className="form-control" min="1" max="5" value={newReview.rating} onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })} />
//           </div>
//           <div className="form-group">
//             <label>Faculty Name</label>
//             <input type="text" className="form-control" value={newReview.faculty_name} onChange={(e) => setNewReview({ ...newReview, faculty_name: e.target.value })} />
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowAddReview(false)}>Cancel</Button>
//           <Button variant="primary" onClick={handleAddReview}>Save</Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// }

// export default ReviewPhase2_0;
