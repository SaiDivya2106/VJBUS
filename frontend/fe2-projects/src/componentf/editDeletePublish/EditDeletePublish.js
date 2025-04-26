
import React, { useEffect, useState } from 'react';
import './EditDeletePublish.css';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const EditDeletePublish = () => {
  const [activeTab, setActiveTab] = useState("edit-delete");
  const [projects, setProjects] = useState([]);
  const [publishedProjects, setPublishedProjects] = useState([]);
  const [underReviewProjects, setUnderReviewProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editProject, setEditProject] = useState(null);
  const [disableActions, setDisableActions] = useState(false);
  const user = useSelector((state) => state.User);
  const navigate = useNavigate();
  const [len, setLen] = useState(0);
  const backendURL = process.env.REACT_APP_backend_url;

  // Fetch projects from the backend
  const fetchProjects = async () => {
    try {
      const token = sessionStorage.getItem('Token');
      const roll_id = user.currentUser.id;
      console.log(roll_id)

      const response = await axios.get(`${backendURL}/project/${roll_id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        withCredentials: true,
      });

      const projectData = Array.isArray(response.data) ? response.data : [];
      console.log(projectData);

      // Update state with the latest data
      setLen(projectData.length);
      setProjects(projectData.filter(project => project.status === 1 && project.done_review === 0 && project.publish === 0 && project.under_review === 0));
      setPublishedProjects(projectData.filter(project => project.publish === 'TRUE' && project.under_review === 'false'));
      setUnderReviewProjects(projectData.filter(project => project.under_review === 'true'));

      setLoading(false);
    } catch (error) {
      
      setError('Failed to load projects.');
      setLoading(false);
    }
  };
  const deleteStudentFromProject = async (faculty_id, project_id, student_id) => {
    try {
      const token = sessionStorage.getItem('Token');
     
  
      console.log('Deleting student with:', { faculty_id, project_id, student_id });
  
      const response = await axios.delete(
        `${backendURL}/faculty/${faculty_id}/project/${project_id}/student/${student_id}`,
        {
          headers: {
          'Content-Type': 'application/json'
          },
           withCredentials: true,
        },{}
      );
  
      console.log('Student deleted successfully:', response.data);
  
      // Refetch projects to update the UI
      // await fetchProjects();
    } catch (error) {
      console.error('Error deleting student:', error);
  
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request
        console.error('Error setting up the request:', error.message);
      }
  
      alert('Failed to delete student. Please check the console for details.');
    }
  };
  // Fetch projects when the component mounts or when the user changes
  useEffect(() => {
    fetchProjects();
  }, [user.currentUser.id]);

  // Delete a project
  const handleDelete = async (id) => {
    try {
      const token = sessionStorage.getItem('Token');
      const response = await axios.delete(`${backendURL}/delete_project/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }, withCredentials: true,
      });

      if (response.data.message === "Project deleted successfully!") {
        // Refetch projects after deletion
        await fetchProjects();
      }
    } catch (error) {
      console.error('Error deleting the project:', error);
    }
  };

  // Edit a project
  const handleEdit = (project) => {
    setEditProject(project);
  };

  // Save edited project
  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem('Token');
      await axios.put(`${backendURL}/update_project`, [editProject, user.currentUser], {
        headers: {
          'Content-Type': 'application/json',
         
        },        withCredentials: true,
      });

      // Refetch projects after editing
      await fetchProjects();
      setEditProject(null);
    } catch (error) {
      console.error('Error updating the project:', error);
      alert('Failed to update project.');
    }
  };

  // Handle project review
  const handleReview = async (project) => {
    try {
      const token = sessionStorage.getItem('Token');
      const currentUser = user.currentUser;
     

      setDisableActions(true);

      const res = await axios.post(
        `${backendURL}/under_review`,
        {
          under_review: true,
          currentUser: currentUser,
          project: project,
        },
        {
          headers: {
            'Content-Type': 'application/json',
           
          },  
          withCredentials: true,
        }
      );

      if (res.data.message === 'sent email wait for review!') {
        project['under_review'] = 'true';
        await axios.put(`${backendURL}/update_project`, [project, user.currentUser], {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        // Refetch projects after marking as under review
        await fetchProjects();
      }
    } catch (error) {
      console.error('Error marking the project as under review:', error);
      alert('Failed to mark the project as under review.');
    } finally {
      setDisableActions(false);
    }
  };

  // Navigate to the file upload page
  const handleAddClick = () => {
    navigate('/fileUpload');
  };

  // Navigate to the review page
  const handleViewReviews = (project) => {
    navigate(`/reviewPage/:${project['Project_id']}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="edit-delete-publish-dashboard">
      <h2 className="text-center text-2xl font-bold mb-6">PROJECTS</h2>
      <p className="p3">Total Projects: {len}</p>
      <div className="d-flex justify-content-between">
        <button className="add text-white bg-success" onClick={handleAddClick} disabled={disableActions}>
          ADD
        </button>
        <button className="research text-white bg-success" disabled={disableActions}>
          Research
        </button>
      </div>

      <div className="flex space-x-6 justify-center mb-6 mt-2">
        <button
          onClick={() => setActiveTab("edit-delete")}
          className={`text-lg text-decoration-none font-semibold ${activeTab === "edit-delete" ? "text-blue-600 underline" : "text-gray-700"}`}
        >
          Edit/Delete
        </button>
        <button
          onClick={() => setActiveTab("under-review")}
          className={`text-lg text-decoration-none font-semibold ${activeTab === "under-review" ? "text-blue-600 underline" : "text-gray-700"}`}
        >
          Under Review
        </button>
        <button
          onClick={() => setActiveTab("published-projects")}
          className={`text-lg text-decoration-none font-semibold ${activeTab === "published-projects" ? "text-blue-600 underline" : "text-gray-700"}`}
        >
          Published Projects
        </button>
      </div>

      <div className="bg-gray-100 p-6 rounded-md shadow-md">
        {activeTab === "edit-delete" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {projects.map((project) => (
              <div key={project.Project_id} className="project-card1 slide-in">
                <div className="project-info">
                  <h2 className="prot">
                    <strong>{project.title}</strong>
                  </h2>
                  <p className="p3">
                    <strong>Abstract:</strong> {project.abstract}
                  </p>
                  <p className="p3">
                    <strong>Requirements:</strong> {project.requirements}
                  </p>
                  <p className="p3">
                    <strong>Domain:</strong> {project.domain}
                  </p>
                  <p className="p3">
                    <strong>Department:</strong> {project.department}
                  </p>
                  <ul>
                    {project.students &&
                      project.students.map((student) => (
                        <li key={student.id}>
                          {student.name} - {student.email} (ID: {student.student_id})
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="buttonns">
                  <div className="project-actions1">
                    <button onClick={() => handleEdit(project)} className="edit-btn">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(project.Project_id)} className="delete-btn">
                      Delete
                    </button>
                  </div>
                  <div className="project-actions1">
                    <button onClick={() => handleReview(project)} className="publish-btn">
                      Review It
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "under-review" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {underReviewProjects.length > 0 ? (
              underReviewProjects.map((project) => (
                <div key={project.Project_id} className="project-card slide-in">
                  <div className="project-info reviews">
                    <h2 className="prot">{project.title}</h2>
                    {project.abstract && (
                      <p className="p3">
                        <strong>Abstract:</strong> {project.abstract}
                      </p>
                    )}
                    {project.requirements && (
                      <p className="p3">
                        <strong>Requirements:</strong> {project.requirements}
                      </p>
                    )}
                    {project.domain && (
                      <p className="p3">
                        <strong>Domain:</strong> {project.domain}
                      </p>
                    )}
                    {project.department && (
                      <p className="p3">
                        <strong>Department:</strong> {project.department}
                      </p>
                    )}
                    <button onClick={() => handleViewReviews(project)} className="button btn-success">
                      View Reviews
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <h4>No Projects Under Review</h4>
            )}
          </div>
        )}

        {activeTab === "published-projects" && (
          <div className="published-project-list">
            {publishedProjects.length > 0 ? (
              publishedProjects.map((project) => (
                <div key={project.Project_id} className="project-card">
                  <div className="project-info">
                    <h2>{project.title}</h2>
                    {project.abstract && (
                      <p className="p3">
                        <strong>Abstract:</strong> {project.abstract}
                      </p>
                    )}
                    {project.requirements && (
                      <p className="p3">
                        <strong>Requirements:</strong> {project.requirements}
                      </p>
                    )}
                    {project.domain && (
                      <p className="p3">
                        <strong>Domain:</strong> {project.domain}
                      </p>
                    )}
                    {project.department && (
                      <p className="p3">
                        <strong>Department:</strong> {project.department}
                      </p>
                    )}
                    {project.students && project.students.length > 0 ? (
                      <>
                        <p className="p3">
                          <strong>Students:</strong>
                        </p>
                        <ul>
                          {project.students.map((student) => (
                            <div className="flex gap-3 text-lg" key={student.id}>
                              <li>
                                {student.name} - {student.email} (ID: {student.student_id})
                              </li>
                              <button
                                className="bg-red-500 rounded-md p-2"
                                onClick={() =>
                                  deleteStudentFromProject(user.currentUser.id, project.Project_id, student.student_id)
                                }
                              >
                                Delete
                              </button>
                            </div>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <p className="p3">
                        <strong>Students:</strong> No students assigned
                      </p>
                    )}
                    <div className="ppbutton d-flex justify-content-between">
                      <button
                        className="view-reviews"
                        onClick={() => handleViewReviews(project)}
                        disabled={disableActions}
                      >
                        View Reviews
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <h4>No Published Projects</h4>
            )}
          </div>
        )}
      </div>

      <Modal show={!!editProject} onHide={() => setEditProject(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editProject && (
            <div className="project-edit-form">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  value={editProject.title}
                  onChange={(e) => setEditProject({ ...editProject, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Abstract</label>
                <input
                  type="text"
                  name="abstract"
                  className="form-control"
                  value={editProject.abstract}
                  onChange={(e) => setEditProject({ ...editProject, abstract: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Requirements</label>
                <input
                  type="text"
                  name="requirements"
                  className="form-control"
                  value={editProject.requirements}
                  onChange={(e) => setEditProject({ ...editProject, requirements: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Domain</label>
                <input
                  type="text"
                  name="domain"
                  className="form-control"
                  value={editProject.domain}
                  onChange={(e) => setEditProject({ ...editProject, domain: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  name="department"
                  className="form-control"
                  value={editProject.department}
                  onChange={(e) => setEditProject({ ...editProject, department: e.target.value })}
                />
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditProject(null)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditDeletePublish;