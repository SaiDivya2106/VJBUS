import React, { useState, useEffect } from "react";
import "./ReviewPhase1.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
function ReviewPhase1() {
  const [underReviewProjects, setUnderReviewProjects] = useState([]);
  const [reviewedProjects, setReviewedProjects] = useState([]);
  const currentUser = useSelector((state) => state.PRC.currentUser);
  const nav = useNavigate();
  let backendURL = process.env.REACT_APP_backend_url;
  useEffect(() => {
    const token = sessionStorage.getItem('Token');
    console.log(token)
    // console.log(token)
    // Fetch under-review projects
   axios.get(`${backendURL}/under_review_projects_department/${currentUser.department}`, {
      headers: {
        'Authorization': `Bearer ${token}` // Include the token in the Authorization header
      }
    }).then(res=>{
      console.log(res)
      const projectsUnderReview = res.data.filter(data => data.under_review === 'true');
      setUnderReviewProjects(projectsUnderReview);
      const projectsPublished = res.data.filter(data => data.publish === 'true');
      setReviewedProjects(projectsPublished);
    })
    .catch(err=>{
      console.log("error")
    })
    axios.get(`${backendURL}/reviewed_projects_departemnt/${currentUser.department}`)
      .then(response => {
        setReviewedProjects(response.data);
      })
      .catch(error => {
        console.error('Error fetching reviewed projects:', error);
      }); }, [currentUser.department]);

  const handleReviewNow = (projectId) => {
    nav(`/reviewPhase2/${projectId}`);
  };

  return (
    <div className="topp mx-auto my-8 p-4">
      <div className="welcome-container">
        <div className="phase1-overlay1">
          <div className="line">
            <p className="phase1-card-title para m-1">Welcome to Department of</p>
            <h1 className="phase1-card-title branch" style={{ fontSize: "2rem" }}>{currentUser?.department || "Engineering"}</h1>
          </div>
        </div>
      </div>
      
      <div className="phase1-details pt-4">
        <h2 className="review1 p-1 highlight title-underline"><b>UNDER-REVIEW PROJECTS</b></h2>
        <table className="project-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Project Title</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {underReviewProjects.map((project) => (
              <tr key={project.id} className="table-row">
                <td>{project.id}</td>
                <td>{project.title}</td>
                <td>
                  <button 
                    className="btn-review hover-effect"
                    onClick={() => handleReviewNow(project.id)}
                  >
                    Review Now
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <hr />
        <br></br>
        <h2 className="review1 p-1 highlight title-underline"><b>REVIEWED PROJECTS</b></h2>
        <table className="project-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Project Title</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {reviewedProjects.map((project) => (
              <tr key={project.id} className="table-row">
                <td>{project.id}</td>
                <td>{project.title}</td>
                <td>
                  <button className="btn-reviewed">Reviewed</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReviewPhase1;