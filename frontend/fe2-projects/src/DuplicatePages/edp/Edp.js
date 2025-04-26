// import React, { useEffect, useState } from 'react';
// import './edp.css';
// import { useSelector } from 'react-redux';
// import { Modal, Button } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';

// const Edp = () => {
//   const [projects, setProjects] = useState([
//     {
//       Project_id: 1,
//       title: 'Project A',
//       abstract: 'This is the abstract for Project A.',
//       requirements: 'Requirements for Project A.',
//       domain: 'Domain A',
//       department: 'Department A',
//       students: [
//         { id: 101, name: 'Student 1', role: 'Leader' },
//         { id: 102, name: 'Student 2', role: 'Member' },
//       ],
//       status: 'TRUE',
//       done_review: 'FALSE',
//       publish: 'FALSE',
//       under_review: 'false',
//     },
//     {
//       Project_id: 2,
//       title: 'Project B',
//       abstract: 'This is the abstract for Project B.',
//       requirements: 'Requirements for Project B.',
//       domain: 'Domain B',
//       department: 'Department B',
//       students: [
//         { id: 201, name: 'Student 3', role: 'Leader' },
//         { id: 202, name: 'Student 4', role: 'Member' },
//       ],
//       status: 'TRUE',
//       done_review: 'FALSE',
//       publish: 'FALSE',
//       under_review: 'false',
//     },
//   ]);

//   const [len, setLen] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [editProject, setEditProject] = useState(null);
//   const [isAnimating, setIsAnimating] = useState(false);
//   const user = useSelector((state) => state.User);
//   const navigate = useNavigate();

//   useEffect(() => {
//     setLoading(true);
//     setTimeout(() => {
//       setLen(projects.length);
//       setLoading(false);
//     }, 1000);
//   }, [projects]);

//   const handleDelete = (id) => {
//     setProjects(projects.filter((project) => project.Project_id !== id));
//   };

//   const handleEdit = (project) => {
//     setEditProject(project);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setEditProject((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSave = () => {
//     setProjects((prevProjects) =>
//       prevProjects.map((project) =>
//         project.Project_id === editProject.Project_id ? editProject : project
//       )
//     );
//     setEditProject(null);
//   };

//   const handleAddClick = () => {
//     setIsAnimating(true);
//     setTimeout(() => {
//       navigate('/fileUpload');
//       setIsAnimating(false);
//     }, 300);
//   };

//   const handleViewReviews = (project) => {
//     navigate(`/reviewPage/${project['Project_id']}`);
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div className="edit-delete-publish-dashboard">
//         <div  className="edp1">
     

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//   {projects.map((project) => (
//     <div key={project.Project_id} className="project-card slide-in">
//       <div classNtext-decoration-noneame="project-info">
//         <h2 className="prot">{project.title}</h2>
//         <p className="p3">
//           <strong>Abstract:</strong> {project.abstract}
//         </p>
      
//         <p className="p3">
//           <strong>Requirements:</strong> {project.requirements}
//         </p>
//         <p className="p3">
//           <strong>Domain:</strong> {project.domain}
//         </p>
//         <p className="p3">
//           <strong>Department:</strong> {project.department}
//         </p>
//         <ul>
//           {project.students &&
//             project.students.map((student) => (
//               <li key={student.id}>
//                 {student.name} - {student.role} (ID: {student.id})
//               </li>
//             ))}
//         </ul>
//       </div>
//       <div className="project-actions">
//         <button onClick={() => handleEdit(project)} className="edit-btn">
//           Edit
//         </button>
//         <button onClick={() => handleDelete(project.Project_id)} className="delete-btn">
//           Delete
//         </button>
//         <button onClick={() => handleViewReviews(project)} className="btn-success">
//           View Reviews
//         </button>
//       </div>
//     </div>
//   ))}
// </div>


//       {editProject && (
//         <Modal show={Boolean(editProject)} onHide={() => setEditProject(null)}>
//           <Modal.Header closeButton>
//             <Modal.Title>Edit Project</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <form>
//               <div>
//                 <label>Title:</label>
//                 <input type="text" name="title" value={editProject.title} onChange={handleChange} />
//               </div>
//               <div>
//                 <label>Abstract:</label>
//                 <textarea name="abstract" value={editProject.abstract} onChange={handleChange} />
//               </div>
//               <div>
//                 <label>Requirements:</label>
//                 <textarea name="requirements" value={editProject.requirements} onChange={handleChange} />
//               </div>
//               <div>
//                 <label>Domain:</label>
//                 <input type="text" name="domain" value={editProject.domain} onChange={handleChange} />
//               </div>
//               <div>
//                 <label>Department:</label>
//                 <input type="text" name="department" value={editProject.department} onChange={handleChange} />
//               </div>
//               {/* Include other fields as necessary */}
//             </form>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={() => setEditProject(null)}>
//               Close
//             </Button>
//             <Button variant="primary" onClick={handleSave}>
//               Save Changes
//             </Button>
//           </Modal.Footer>
//         </Modal>
//       )}
//       </div>
//     </div>
//   );
// };

// export default Edp;
