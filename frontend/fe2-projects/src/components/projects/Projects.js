import React, { useState, useEffect } from 'react';
import './Project.css';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import DetailsCard1 from '../detailsCard/DetailsCard';

let backendURL = process.env.REACT_APP_backend_url;

function Projects() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9); // Set the number of items per page
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search).get('query');
    if (query) {
      setSearchQuery(query);
      searchProjects(query);
    }
  }, [location.search]);

  function searchProjects(query) {
    setLoading(true);

    fetch(`${backendURL}/searchForProject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    })
      .then(response => response.json())
      .then(data => {
        console.log("API Response:", data);
        setFilteredProjects(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  }

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    searchProjects(query);
  };

  // Pagination Logic
  const indexOfLastProject = currentPage * itemsPerPage;
  const indexOfFirstProject = indexOfLastProject - itemsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="projects-container">
      <div className="container-fluid">
        <div className="box1 p-2 text-dark">
          <h1 className="text-center">PROJECTS</h1>
          <p className="text-center">Find, Learn, and Inspire</p>
        </div>
        <hr className="hrr" />
        <form className="form d-flex justify-content-center" role="search" onSubmit={e => e.preventDefault()}>
          <input
            className="form-control me-2 shadow"
            type="search"
            placeholder="Enter Title"
            aria-label="Search"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button className="btn btn-success shadow" type="submit">Search</button>
        </form>
        <div className="project-list mt-4">
          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : currentProjects.length > 0 ? (
            <div className="row">
              {currentProjects.map((project, index) => (
                <div key={index} className="col-md-4">
                  <DetailsCard1
                    data={project.project}  // ✅ Pass nested data object
                    score={project.score || 0}  // ✅ Ensure score is handled
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center">No projects found</p>
          )}
        </div>
        <div className="pagination-controls text-center">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn btn-secondary"
          >
            Prev
          </button>
          <span className="mx-2">
            Page {currentPage} of {Math.ceil(filteredProjects.length / itemsPerPage)}
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredProjects.length / itemsPerPage)}
            className="btn btn-secondary"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Projects;
