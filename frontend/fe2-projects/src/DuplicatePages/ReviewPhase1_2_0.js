import React, { useState, useEffect } from "react";
import "./ReviewPhase1_2_0.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ReviewPhase1_2_0() {
  const [underReviewProjects, setUnderReviewProjects] = useState([]);
  const [reviewedProjects, setReviewedProjects] = useState([]);
  const currentUser = useSelector((state) => state.PRC.currentUser);
  const nav = useNavigate();
  const backendURL = process.env.REACT_APP_backend_url;

  useEffect(() => {
    const token = sessionStorage.getItem("Token");

    // Fetch under-review projects
    axios
      .get(`${backendURL}/under_review_projects_department/${currentUser.department}`, {
        headers: { Authorization: `Bearer ${token}` }, withCredentials: true
      })
      .then((res) => {
        
        const projectsUnderReview = res.data.filter((data) => data.under_review === "true");
        setUnderReviewProjects(projectsUnderReview);
      })
      .catch((err) => console.error("Error fetching under-review projects:", err));

    // Fetch reviewed projects
    axios
      .get(`${backendURL}/published_projects/${currentUser.department}`, {
        headers: { Authorization: `Bearer ${token}` }, withCredentials: true
      },{ withCredentials: true })
      .then((res) => {
       
        setReviewedProjects(res.data);
      })
      .catch((err) => console.error("Error fetching reviewed projects:", err));
  }, [currentUser.department]);

  const handleReviewNow = (projectId) => {
    nav(`/reviewPhase2/${projectId}`);
  };

  return (
    <div className="container mx-auto my-8 p-4">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="overlay">
          <div className="welcome-content">
            <p className="welcome-text">Welcome to Department of</p>
            <h1 className="department-name">{currentUser?.department || "Engineering"}</h1>
          </div>
        </div>
      </div>

      {/* Project Details Section */}
      <div className="project-details">
        {/* Under-Review Projects */}
        <section className="project-section">
          <h2 className="section-title">UNDER-REVIEW PROJECTS</h2>
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
                    <button className="btn-review" onClick={() => handleReviewNow(project.id)}>
                      Review Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Reviewed Projects */}
        <section className="project-section">
          <h2 className="section-title">REVIEWED PROJECTS</h2>
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
        </section>
      </div>
    </div>
  );
}

export default ReviewPhase1_2_0;

// import React, { useState } from "react";
    // import "./ReviewPhase1_2_0.css";

    // function ReviewPhase1_2_0() {
    // // Static data for under-review projects
    // const [underReviewProjects, setUnderReviewProjects] = useState([
    //     {
    //     id: 1,
    //     title: "Project Alpha",
    //     under_review: "true",
    //     },
    //     {
    //     id: 2,
    //     title: "Project Beta",
    //     under_review: "true",
    //     },
    //     {
    //     id: 3,
    //     title: "Project Gamma",
    //     under_review: "true",
    //     },
    // ]);

    // // Static data for reviewed projects
    // const [reviewedProjects, setReviewedProjects] = useState([
    //     {
    //     id: 4,
    //     title: "Project Delta",
    //     publish: "true",
    //     },
    //     {
    //     id: 5,
    //     title: "Project Epsilon",
    //     publish: "true",
    //     },
    //     {
    //     id: 6,
    //     title: "Project Zeta",
    //     publish: "true",
    //     },
    // ]);

    // const currentUser = {
    //     department: "Computer Science", // Static user department
    // };

    // const nav = (path) => {
    //     console.log(`Navigating to: ${path}`);
    //     // Simulate navigation (replace with actual navigation logic if needed)
    // };

    // const handleReviewNow = (projectId) => {
    //     nav(`/reviewPhase2/${projectId}`);
    // };

    // return (
    //     <div className="container mx-auto my-8 p-4">
    //     {/* Welcome Banner */}
    //     <div className="welcome-banner">
    //         <div className="overlay">
    //         <div className="welcome-content">
    //             <p className="welcome-text">Welcome to Department of</p>
    //             <h1 className="department-name">{currentUser?.department || "Engineering"}</h1>
    //         </div>
    //         </div>
    //     </div>

    //     {/* Project Details Section */}
    //     <div className="project-details">
    //         {/* Under-Review Projects */}
    //         <section className="project-section">
    //         <h2 className="section-title">UNDER-REVIEW PROJECTS</h2>
    //         <table className="project-table">
    //             <thead>
    //             <tr>
    //                 <th>ID</th>
    //                 <th>Project Title</th>
    //                 <th>Action</th>
    //             </tr>
    //             </thead>
    //             <tbody>
    //             {underReviewProjects.map((project) => (
    //                 <tr key={project.id} className="table-row">
    //                 <td>{project.id}</td>
    //                 <td>{project.title}</td>
    //                 <td>
    //                     <button
    //                     className="btn-review"
    //                     onClick={() => handleReviewNow(project.id)}
    //                     >
    //                     Review Now
    //                     </button>
    //                 </td>
    //                 </tr>
    //             ))}
    //             </tbody>
    //         </table>
    //         </section>

    //         {/* Reviewed Projects */}
    //         <section className="project-section">
    //         <h2 className="section-title">REVIEWED PROJECTS</h2>
    //         <table className="project-table">
    //             <thead>
    //             <tr>
    //                 <th>ID</th>
    //                 <th>Project Title</th>
    //                 <th>Status</th>
    //             </tr>
    //             </thead>
    //             <tbody>
    //             {reviewedProjects.map((project) => (
    //                 <tr key={project.id} className="table-row">
    //                 <td>{project.id}</td>
    //                 <td>{project.title}</td>
    //                 <td>
    //                     <button className="btn-reviewed">Reviewed</button>
    //                 </td>
    //                 </tr>
    //             ))}
    //             </tbody>
    //         </table>
    //         </section>
    //     </div>
    //     </div>
    // );
    // }

    // export default ReviewPhase1_2_0;