import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';

const UnderReview = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editProject, setEditProject] = useState(null);
  const user = useSelector((state) => state.User);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = sessionStorage.getItem('Token');
        const roll_id = user.currentUser.id;

        const response = await axios.get(`http://172.16.22.127:5000/project/${roll_id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log(response);
        setProjects(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching the projects:', error);
        setError('Failed to load projects.');
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user.currentUser.id]);

  const handleDelete = async (id) => {
    const token = sessionStorage.getItem('Token');
    try {
      const response = await axios.delete(`http://172.16.22.127:5000/delete_project/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.data.message === "Project deleted successfully!") {
        setProjects(projects.filter(project => project.Project_id !== id));
      }
    } catch (error) {
      console.error('Error deleting the project:', error);
      alert('Failed to delete project.');
    }
  };

  const handleEdit = (project) => {
    setEditProject(project);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem('Token');
      await axios.put(`http://172.16.22.127:5000/update_project`, editProject, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.Project_id === editProject.Project_id ? editProject : project
        )
      );
      setEditProject(null);
    } catch (error) {
      console.error('Error updating the project:', error);
      alert('Failed to update project.');
    }
  };

  const handleTogglePublish = (id) => {
    const project = projects.find((proj) => proj.Project_id === id);
    if (project.publish === 'Unpublished') {
      if (window.confirm('Once published, you cannot edit this project. Do you wish to continue?')) {
        setProjects(
          projects.map((project) =>
            project.Project_id === id ? { ...project, publish: 'Published' } : project
          )
        );
        alert('Project has been published and can no longer be edited.');
      }
    } else {
      alert('This project is already published.');
    }
  };

  const handleAddProject = (project) => {
    // Logic to add a new project or duplicate an existing one
    const newProject = {
      ...project,
      Project_id: projects.length + 1, // Temporary ID, assuming the new project gets a unique ID from the backend
      title: `${project.title} (Copy)`, // Just an example of duplicating the title
    };
    setProjects([...projects, newProject]);
    alert('Project added successfully!');
  };

  const handleResearchProject = (project) => {
    // Logic to handle the research functionality, e.g., navigating to a detailed view
    alert(`Researching project: ${project.title}`);
    // Here you can redirect to another page or open a modal with detailed information
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="edit-delete-publish-dashboard">
      <h1>My Projects</h1>
      <p className='p3'>Total Projects: {projects.length}</p>
      <div className="project-list">
        {projects.map((project) => (
          <div key={project.Project_id} className="project-card">
            <div className="project-info">
              <h2>{project.title}</h2>
              <p className='p3'><strong>Abstract:</strong> {project.abstract}</p>
              <p className='p3'><strong>Requirements:</strong> {project.requirements}</p>
              <p className='p3'><strong>Domain:</strong> {project.domain}</p>
              <p className='p3'><strong>Department:</strong> {project.department}</p>
              <p className='p3'><strong>Students:</strong></p>
              <ul>
                {project.students && project.students.map((student) => (
                  <li key={student.id}>
                    {student.name} - {student.role} (ID: {student.id})
                  </li>
                ))}
              </ul>
            </div>
            <div className="project-actions">
              <button className="add-btn" onClick={() => handleAddProject(project)}>Add</button>
              <button className="research-btn" onClick={() => handleResearchProject(project)}>Research</button>
            </div>
          </div>
        ))}
      </div>

      {/* Bootstrap Modal for Editing Project */}
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
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Abstract</label>
                <input
                  type="text"
                  name="abstract"
                  className="form-control"
                  value={editProject.abstract}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Requirements</label>
                <input
                  type="text"
                  name="requirements"
                  className="form-control"
                  value={editProject.requirements}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Domain</label>
                <input
                  type="text"
                  name="domain"
                  className="form-control"
                  value={editProject.domain}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  name="department"
                  className="form-control"
                  value={editProject.department}
                  onChange={handleChange}
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

export default UnderReview;
