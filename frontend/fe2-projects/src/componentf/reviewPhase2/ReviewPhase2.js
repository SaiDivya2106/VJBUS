import React, { useState, useEffect } from 'react';
import './RevewPhase2.css';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
function ReviewPhase2() {
  const [project, setProject] = useState({});
  const [reviews, setReviews] = useState([]);
  const nav=useNavigate()
  const currentUser = useSelector((state) => state.PRC.currentUser);
  const [showAddReview, setShowAddReview] = useState(false);
  const [showEditReview, setShowEditReview] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false); // State for publish confirmation modal
  const [editReview, setEditReview] = useState({
    title: '',
    review: '',
    rating: '',
    faculty_name: '',
    review_id: ''
  });
  // const currentUser = useSelector((state) => state.PRC.currentUser);
  const [newReview, setNewReview] = useState({ title: '', review: '', rating: '', faculty_name: '', review_id: uuidv4() });
  const [projectId, setProjectId] = useState(null);
  
  const location = useLocation();
  let backendURL = process.env.REACT_APP_backend_url;
  useEffect(() => {
    const fetchProject = async () => {
      const path = location.pathname;
      const id = path.slice(14);
      setProjectId(id);

      try {
        const token = sessionStorage.getItem('Token');
        const response = await axios.get(`${backendURL}/get_review/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        console.log(response.data.reviews)
        setProject(response.data.project[0]);
        setReviews(response.data.reviews);
        // setNewReview({title:response.data.project[0]['title'],review:'',rating:'',faculty_name:''})
        console.log(response.data.reviews)
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };
    fetchProject();
  }, [location]);

  const handleAddReview = async () => {
    console.log(project)
   console.log(newReview)
    try {
      const token = sessionStorage.getItem('Token');
      const res = await axios.post(`${backendURL}/add_review`, {
        'project_id': project.project_id,
        'department': project['department'],
        ...newReview
      }, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      console.log(res)
      setReviews([...reviews, res.data.newReview]); // Adjust based on response structure
      setNewReview({ title: '', review: '', rating: '', faculty_name: '', review_id: uuidv4() }); // Reset newReview
      setShowAddReview(false);
      console.log([...reviews, res.data.newReview[0]])
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const handleEditReview = async () => {
    console.log(editReview)
    try {
      const token = sessionStorage.getItem('Token');
      console.log(editReview)
      await axios.put(`${backendURL}/edit_review`, {
        project_id: project.project_id,
        department: project.department,
        review_id: editReview.review_id, // Use the review ID for identifying the review
        title: project.title, // Adjust based on actual data format
        review: editReview.review,
        rating: editReview.rating,
        faculty_name: editReview.faculty_name
      }, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setReviews(reviews.map(r => (r[0] === editReview[0] ? editReview : r)));
      setEditReview({
        title: '',
        review: '',
        rating: '',
        faculty_name: '',
        review_id: ''
      });
      setShowEditReview(false);
    } catch (error) {
      console.error('Error editing review:', error);
    }
  };

  const handleDeleteReview = async (review) => {
    try {
      const token = sessionStorage.getItem('Token');
      const { project_id, department, review_id } = review;

      await axios.delete(`${backendURL}/delete_review`, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: {
          project_id: review[0],
          department: review[1],
          review_id: review[2]
        }
      });

      // Remove the review from the state
      setReviews(reviews.filter(r => r[2] !== review_id));
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handlePublishProject = async () => {
    try {
      const token = sessionStorage.getItem('Token');
      await axios.get(`${backendURL}/publish_project/${projectId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      alert('Project has been published.');
      nav('/reviewPhaseForPRC')
    } catch (error) {
      console.error('Error publishing project:', error);
    }
  };

  const convertArrayToObject = (array) => {
    console.log(array)
    return {
      title: project.title,
      review: array[3],
      review_id: array[2],
      rating: array[4],
      faculty_name: array[5]
    };
  };

  return (
    <div className="mx-auto">
      <div className="alt-welcome-container">
      
         
            <p className=''>Welcome to Department of {currentUser.department}</p>
            <h1 className="rpage-card-title branch"></h1>
        
      </div>
{/* card for project */}
      <div className="rpage-detaand comments html and cssils pt-4">
        <h2 className="pt text-3xl font-bold mb-2">Title: {project['title']}</h2>
        <p className="pt text-lg font-medium text-gray-600 mb-4">by {project['staff_name']}</p>
        <div className="border-t border-gray-200 pt-2">
          <h5 className="pt text-base leading-7 text-gray-800">
            {project.description}
          </h5>
        </div>

        <hr />

        <h2 className='review p-1 mx-auto'>REVIEWS</h2>

        {reviews.map((review, index) => (
          <div key={index} className="review-card mt-6 p-4 rounded-lg shadow-lg">
            <div className="reviewer-details flex">
              <div>
                <h4 className="font-bold text-xl">{review[5]}</h4> {/* Reviewer Name */}
                <p className="txt name1 text-gray-500">Posted on {/* Add date if available */}</p>
              </div>
            </div>
            <div className="review-content mt-4">
              <p className="txt text-gray-700">
                {review[3]} {/* Review Content */}
              </p>
            </div>
            <div className="rating mt-4">
              <span className="text-yellow-500">
                {'★'.repeat(review[4])}{'☆'.repeat(5 - Number(review[4]))} {/* Rating */}
              </span>
            </div>
            <div className="review-actions mt-4">
              <Button variant="warning m-2" onClick={() => {
                const reviewObject = convertArrayToObject(review);
                setEditReview(reviewObject);
                setShowEditReview(true);
                console.log(reviewObject);
              }}>Edit</Button>
              <Button variant="danger m-2" onClick={() => handleDeleteReview(review)}>Delete</Button>
            </div>
          </div>
        ))}

        <Button className="mt-4 m-2" variant="secondary" onClick={() => setShowAddReview(true)}>Add Review</Button>
        <Button className="mt-4 m-2" variant="primary" onClick={() => setShowPublishConfirm(true)}>Publish Project</Button>
      </div>

      {/* Add Review Modal */}
      <Modal show={showAddReview} onHide={() => setShowAddReview(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="project-edit-form">
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                className="form-control"
                value={project.title}
                onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Review</label>
              <textarea
                name="review"
                className="form-control"
                value={newReview.review}
                onChange={(e) => setNewReview({ ...newReview, review: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Rating (1-5)</label>
              <input
                type="number"
                name="rating"
                className="form-control"
                min="1"
                max="5"
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Faculty Name</label>
              <input
                type="text"
                name="faculty_name"
                className="form-control"
                value={newReview.faculty_name}
                onChange={(e) => setNewReview({ ...newReview, faculty_name: e.target.value })}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddReview(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddReview}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Review Modal */}
      <Modal show={showEditReview} onHide={() => setShowEditReview(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{color:"black"}}>Edit Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="project-edit-form">
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                className="form-control"
                value={editReview.title}
                onChange={(e) => setEditReview({ ...editReview, title: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Review</label>
              <textarea
                name="review"
                className="form-control"
                value={editReview.review}
                onChange={(e) => setEditReview({ ...editReview, review: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Rating (1-5)</label>
              <input
                type="number"
                name="rating"
                className="form-control"
                min="1"
                max="5"
                value={editReview.rating}
                onChange={(e) => setEditReview({ ...editReview, rating: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Faculty Name</label>
              <input
                type="text"
                name="faculty_name"
                className="form-control"
                value={editReview.faculty_name}
                onChange={(e) => setEditReview({ ...editReview, faculty_name: e.target.value })}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditReview(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditReview}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Publish Confirmation Modal */}
      <Modal show={showPublishConfirm} onHide={() => setShowPublishConfirm(false)} centered>
      <Modal.Header closeButton>
  <h4 className="text-black p-3">Confirm Publish</h4>
</Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to publish this project? This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPublishConfirm(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handlePublishProject}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ReviewPhase2;
