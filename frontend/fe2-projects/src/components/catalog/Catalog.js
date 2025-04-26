
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Catalog.css';
// *** Import the updated DetailsCard1 component ***
import DetailsCard1 from '../detailsCard/DeatilsCard1'; // Adjust path if necessary
import Pagination from '../../AllCorrectPages/Pagination/Pagination';

let backendURL = process.env.REACT_APP_backend_url ;

const Catalog = () => {
  // --- State and Logic (Keep as previously defined) ---
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filters, setFilters] = useState({ Type: '', Department: '', Year: '' });
  const [departments, setDepartments] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const projectsPerPage = 9;
  const mtechDepartments = [ 'CE-SE', 'CE-HE', 'CE-GTE', 'EE-PE', 'EE-PS', 'ME-CC', 'ME-AMS', 'EE-ES', 'EE-VLSI', 'CSE-SE', 'CSE-CNIS', 'EIE', 'CSE' ];
  const btechDepartments = [ 'IT', 'CSE', 'ECE', 'ME', 'EIE', 'CE', 'EEE', 'AIML' ];

  useEffect(() => {
    setDepartments(filters.Type === 'MTech-Major' ? mtechDepartments : filters.Type === 'BTech-Major' ? btechDepartments : []);
    if (filters.Department) { setFilters(prev => ({ ...prev, Department: '' })); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.Type]);

  const handleChange = (e) => { const { name, value } = e.target; setFilters(prev => ({ ...prev, [name]: value })); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSearchPerformed(true);
    setCurrentPage(1);
    setLoading(true);
    setError('');
    setFilteredProjects([]);
    try {
      const response = await axios.post(`${backendURL}/filter`, { query: filters }, { headers: { 'Content-Type': 'application/json' }});
      setFilteredProjects(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching data: ", err);
      setError('Failed to fetch projects. Please check network or try again.');
      setFilteredProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = Array.isArray(filteredProjects) ? filteredProjects.slice(indexOfFirstProject, indexOfLastProject) : [];
  const totalPages = Array.isArray(filteredProjects) ? Math.ceil(filteredProjects.length / projectsPerPage) : 0;
  const paginate = (pageNumber) => { if (pageNumber > 0 && pageNumber <= totalPages) { setCurrentPage(pageNumber); window.scrollTo(0, 0); } };

  return (
    <div className="catalog-page-container">
        {/* Filter Card Section (Keep as is) */}
        <div className="catalog-filter-card">
            {/* ... h1, p, form ... */}
             <h1 className="catalog-title">Catalog</h1>
            <p className="catalog-subtitle">Your Inspiration Starts Here</p>
            <form onSubmit={handleSubmit} className="catalog-form">
                <div className="filter-item">
                  <select name="Type" value={filters.Type} onChange={handleChange} className="catalog-select">
                    <option value="">Select Type</option>
                    <option value="BTech-Major">BTech-Major</option>
                    <option value="MTech-Major">MTech-Major</option>
                  </select>
                </div>
                <div className="filter-item">
                  <select name="Department" value={filters.Department} onChange={handleChange} disabled={!filters.Type} className="catalog-select">
                    <option value="">Select Department</option>
                    {departments.map((dept) => ( <option key={dept} value={dept}>{dept}</option> ))}
                  </select>
                </div>
                <div className="filter-item">
                  <select name="Year" value={filters.Year} onChange={handleChange} className="catalog-select">
                    <option value="">Select Year</option>
                    {[2024, 2023, 2022, 2021, 2020].map((year) => ( <option key={year} value={year}>{year}</option> ))}
                  </select>
                </div>
                <div className="filter-item">
                  <button type="submit" disabled={loading} className="catalog-button">
                    {loading ? 'Filtering...' : 'Filter'}
                  </button>
                </div>
            </form>
        </div>

        {/* --- Results Display Area --- */}
        <div className="catalog-results-area">
            {loading && <div className="catalog-loading">Loading projects...</div>}
            {error && <div className="catalog-error">{error}</div>}
            {searchPerformed && !loading && !error && (
                <>
                    {filteredProjects.length === 0 ? (
                        <div className="catalog-no-results">No projects found matching your criteria.</div>
                    ) : (
                        <>
                            {totalPages > 1 && ( <Pagination projectsPerPage={projectsPerPage} totalProjects={filteredProjects.length} paginate={paginate} currentPage={currentPage} /> )}

                            {/* --- USE THE UPDATED DetailsCard1 --- */}
                            <div className="project-list-grid">
                                {currentProjects.map((project) => (
                                    // Ensure ProjectId is the correct unique key
                                    <DetailsCard1 key={project.ProjectId} data={project} />
                                ))}
                            </div>

                            {totalPages > 1 && ( <Pagination projectsPerPage={projectsPerPage} totalProjects={filteredProjects.length} paginate={paginate} currentPage={currentPage} /> )}
                        </>
                    )}
                </>
            )}
        </div>
    </div>
  );
};

export default Catalog;