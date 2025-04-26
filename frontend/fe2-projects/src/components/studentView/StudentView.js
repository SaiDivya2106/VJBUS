import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './StudentView1.css'; // Ensure you update this file for styles

let backendURL = process.env.REACT_APP_backend_url;

const StudentView = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null); // State for selected project
  const studentId = useSelector((state) => state.User.currentUser.id);
  const department = useSelector((state) => state.User.currentUser.department);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = sessionStorage.getItem('Token');
        setLoading(true);
        setError(null);

        const response = await axios.post(
          `${backendURL}/projects_published`,
          [department,studentId],
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        setProjects(response.data[0]);
        if(response.data[1].length>0)
          {setSelectedProject(response.data[1])}
       
        setLoading(false);
      } catch (err) {
        setError('Failed to load projects. Please try again later.');
        setLoading(false);
      }

    };
    fetchProjects();
    
  }, [department]);

  const handleInterestedClick = async (project) => {
    

    const data = {
      facultyId: project[1],
      studentId: studentId,
      projectId: project[0],
    };

    try {
      const token = sessionStorage.getItem('Token');

      const res = await axios.post(
        `${backendURL}/add_student_to_project`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log('Response:', res.data);
      if (res.data.error) {
        alert(res.data.error);
      } else {
        setShowCongrats(true);
        setTimeout(() => setShowCongrats(false), 5000);
      }
    } catch (error) {
      console.error('Error adding student to project:', error);
    }
  };

  return (
    <div className="student-view-container">
    <h1 className="text-center p-2 m-1 text-3xl font-bold relative border-4 border-purple-500 rounded-lg border-purple-500 shadow-md before:absolute before:inset-0 before:rounded-lg before:border-4 before:border-cyan-400 before:blur-md before:opacity-50 animate-pulse">
  Available Projects
</h1>

      {loading && (
        <div className="student-view-loader">
          <div className="student-view-spinner"></div>
          <p>Loading projects...</p>
        </div>
      )}
      {error && (
        <div className="student-view-error">
          <p>{error}</p>
        </div>
      )}
      {!loading && !error && (
        <div className="student-view-grid">
          {projects.length > 0 ? (
            projects.map((project) => (
              <div key={project[1]} className="student-view-card">
                <div className="student-view-card-header">
                  <h2>{project[2]}</h2>
                  <span className={`student-view-status ${project[10]}`}>
                    PUBLISHED
                  </span>
                </div>
                <div className="student-view-card-body">
                  <p>
                    <strong>Abstract:</strong> {project[3]}
                  </p>
                  <p>
                    <strong>Requirements:</strong> {project[4]}
                  </p>
                </div>
                <div className="student-view-card-footer">
                  <button
                    className="student-view-interested-btn"
                    onClick={() => handleInterestedClick(project)}
                  >
                    I am Interested
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="student-view-no-projects">No projects available at the moment.</p>
          )}
        </div>
      )}

      {/* Display Selected Project Details */}
      {selectedProject && (
        <div className="selected-project-details">
          <h2>Selected Project Details</h2>
          <p><strong>Title:</strong> {selectedProject[2]}</p>
          <p><strong>Abstract:</strong> {selectedProject[3]}</p>
          <p><strong>Requirements:</strong> {selectedProject[5]}</p>
        </div>
      )}

      {/* Congratulatory Message */}
      {showCongrats && (
        <div className="congrats-overlay">
          <div className="congrats-message">
            <h2>Congratulations!</h2>
            <p>You have successfully joined the project!</p>
          </div>
          <div className="petal-animation">
            {[...Array(50)].map((_, index) => (
              <div
                key={index}
                className="petal"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${Math.random() * 5 + 8}s`,
                }}
              ></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentView;