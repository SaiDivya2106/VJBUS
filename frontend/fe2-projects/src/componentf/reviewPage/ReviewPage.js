import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./ReviewPage.css";

function ReviewPage() {
  const [project, setProject] = useState({});
  const [reviews, setReviews] = useState([]);
  const location = useLocation();
  const currentUser = useSelector((state) => state.PRC.currentUser);

  let backendURL = process.env.REACT_APP_backend_url;

  useEffect(() => {
    const fetchProject = async () => {
      const path = location.pathname;
      const id = path.slice(13);
      console.log(path,id)
      try {
        const token = sessionStorage.getItem("Token");
        const response = await axios.get(`${backendURL}/get_review/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProject(response.data.project[0]);
        setReviews(response.data.reviews);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };
    fetchProject();
  }, [location]);

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
          <div key={review[0]} className="review-card">
            <h3 className="review-faculty-name">{review[5]}</h3>
            <p className="review-text">{review[3]}</p>
            <p className="review-rating">{"★".repeat(review[4])}{"☆".repeat(5 - review[4])}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewPage;




// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './ReviewPage.css';
// import { useSelector } from 'react-redux';
// import { useLocation } from 'react-router-dom';
// function ReviewPage() {
//   const [project, setProject] = useState([]);
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const user = useSelector((state) => state.User);
//   const location=useLocation()
//     console.log(location)
//   useEffect(() => {
//     // Replace <project_id> with the actual project ID or pass it dynamically
//      // Example project ID
//       const Project_id=location.pathname.slice(13,)
//     // Fetch project details
//     const fetchProject = async () => {
//       try {
        
//           const Token=sessionStorage.getItem('Token')
//           const response = await axios.get(`http://10.45.22.113:5000/get_review/${Project_id}`,
//             {
//               headers:
//               {
//                 'Authorization': `Bearer ${Token}`,
//               }
  
//             }
//           );
//           // const projectData = Array.isArray(response.data.project) ? response.data.project : [];
//         console.log(response.data.reviews)
//         setProject(response.data.project[0]);
//         setReviews(response.data.reviews);
//         // Fetch reviews after project details are fetched
//         // await fetchReviews(Project_id);
//       } catch (error) {
//         console.error('Error fetching project data:', error);
//       }
//       console.log(project,reviews)
//     };

//     // Fetch reviews
//     // const fetchReviews = async (projectId) => {
//     //   try {
//     //     const Token=sessionStorage.getItem('Token')
//     //     const response = await axios.get(`http://10.45.22.113:5000/get_review/${projectId}`,
//     //       {
//     //         headers:
//     //         {
//     //           'Authorization': `Bearer ${Token}`,
//     //         }

//     //       }
//     //     );
//     //     console.log(response)
//     //     setReviews(response.data);
//     //     setLoading(false);
//     //   } catch (error) {
//     //     console.error('Error fetching reviews data:', error);
//     //   }
//     // };

//     fetchProject();
//   }, []);

//   if (loading) {
//     console.log(project,reviews)
//     return <div>Loading...</div>;
//   }

//   if (!project) {
//     return <div>No project found</div>;
//   }
  

//   return (
//     <div className="mx-auto my-8 p-4">
//       <div className="welcome1-container">
//         <div className="rpage-overlay">
//           <div className='line'>
//             <p className='rpage-card-title para'>Welcome to Departmet of</p>
//             <h1 className="rpage-card-title branch">INFORMATION TECHNOLOGY</h1>
//           </div>
//         </div>
//       </div>

//       <div className="rpage-details pt-4">
//         <h2 className="pt text-3xl font-bold mb-2">Title: {project['title']}</h2>
//         <p className="pt text-lg font-medium text-gray-600 mb-4">by {user.currentUser.name}</p>
//         <div className="border-t border-gray-200 pt-2">
//           <h5 className="pt text-base leading-7 text-gray-800">
//             {project.description}
//           </h5>
//         </div>

//         <hr />

//         <h2 className='review p-1 mx-auto'>REVIEWS</h2>

//         {reviews.map((review, index) => (
//       <div key={index} className="review-card mt-6 p-4 rounded-lg shadow-lg">
//         <div className="reviewer-details flex">
//           {/* Optionally include reviewer image */}
//           <div>
//             <h4 className="font-bold text-xl">{review[5]}</h4> {/* Reviewer Name */}
//             <p className="txt name1 text-gray-500">Posted on {/* Add date if available */}</p>
//           </div>
//         </div>
//         <div className="review-content mt-4">
//           <p className="txt text-gray-700">
//             {review[3]} {/* Review Content */}
//           </p>
//         </div>
//         <div className="rating mt-4">
//           <span className="text-yellow-500">
//             {'★'.repeat(review[4])}{'☆'.repeat(5 - review[4])} {/* Rating */}
//           </span>
//         </div>
//       </div>
//     ))}

//       </div>
//     </div>
//   );
// }

// export default ReviewPage;
