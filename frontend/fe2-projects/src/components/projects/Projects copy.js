// src/pages/Projects/Project.js
import React, { useState, useEffect, useRef } from 'react';
import './Project.css'; // Import the CSS for this page
import { useLocation } from 'react-router-dom';
import ProjectGrid from '../../components/ProjectGrid/ProjectGrid'; // Adjust path as needed

// Define backend URL (replace with your actual environment variable or config)
const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'; // Example default

function Projects() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]); // Holds the full list of projects matching the query
  const [loading, setLoading] = useState(false); // Tracks if a fetch is in progress
  const [initialLoadAttempted, setInitialLoadAttempted] = useState(false); // Tracks if the first fetch has been tried
  const location = useLocation(); // Gets location object for URL params

  // Simple debounce utility function
  const debounce = (func, delay) => {
    let timeoutId;
    const debouncedFunc = function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
    // Add a way to cancel the timeout if needed (optional)
    debouncedFunc.cancel = () => {
        clearTimeout(timeoutId);
    }
    return debouncedFunc;
  };

  // --- Core Data Fetching Function ---
  const fetchProjects = async (query) => {
    console.log(`Fetching projects for query: "${query}"`);
    setLoading(true);
    // Clear previous results when starting a new fetch (optional, depends on desired UX)
    // setFilteredProjects([]);

    try {
      const response = await fetch(`${backendURL}/searchForProject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Send an empty string if query is null/undefined/empty
        body: JSON.stringify({ query: query || "" }),
      });

      if (!response.ok) {
        // Handle non-successful HTTP responses
        const errorText = await response.text();
        console.error(`HTTP error! Status: ${response.status}`, errorText);
        throw new Error(`Search failed with status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response Received:", data);

      // Ensure the received data is an array before setting state
      if (Array.isArray(data)) {
        setFilteredProjects(data);
      } else {
        console.warn("API response was not an array:", data);
        setFilteredProjects([]); // Set to empty array if response format is wrong
      }

    } catch (error) {
      console.error('Error fetching projects:', error);
      setFilteredProjects([]); // Clear results on fetch error
      // Optionally, set an error state here to display a user-friendly message
    } finally {
      setLoading(false); // Stop loading indicator
      // Mark that the first attempt to load/search data has completed
      if (!initialLoadAttempted) {
        setInitialLoadAttempted(true);
      }
    }
  };

  // --- Debounced Fetch Function ---
  // Use useRef to keep the debounced function instance stable across re-renders
  const debouncedFetchProjects = useRef(debounce(fetchProjects, 400)).current; // 400ms delay

  // --- Effect for Initial Load & URL Query Handling ---
  useEffect(() => {
    const queryFromUrl = new URLSearchParams(location.search).get('query');

    if (queryFromUrl !== null) { // Check if query parameter exists, even if empty
      console.log("Initial load: Found query in URL:", queryFromUrl);
      setSearchQuery(queryFromUrl);
      // Perform initial search immediately (not debounced) based on URL
      fetchProjects(queryFromUrl);
    } else {
       // If no query in URL, decide what to do:
       // Option 1: Fetch all projects (or a default set) by sending empty query
       console.log("Initial load: No query in URL. Fetching default/all.");
       setSearchQuery(''); // Keep search box empty
       fetchProjects(''); // Fetch with empty query string

       // Option 2: Don't fetch anything until user searches
       // console.log("Initial load: No query in URL. Waiting for user search.");
       // setLoading(false);
       // setInitialLoadAttempted(true); // Mark as attempted, show "enter search" message
       // setFilteredProjects([]);
    }

    // Cleanup function for the debounced call
    return () => {
        debouncedFetchProjects.cancel(); // Cancel pending debounced call on unmount/re-run
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]); // Re-run only if the URL's search part changes

  // --- Event Handlers ---

  // Handle changes in the search input field
  const handleSearchChange = (event) => {
    const newQuery = event.target.value;
    setSearchQuery(newQuery);
    // Use the debounced fetch function while typing
    debouncedFetchProjects(newQuery);
  };

  // Handle form submission (e.g., pressing Enter or clicking Search)
  const handleSearchSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission page reload
    console.log("Form submitted, performing immediate search for:", searchQuery);
    // Cancel any pending debounced calls first
    debouncedFetchProjects.cancel();
    // Perform the search immediately
    fetchProjects(searchQuery);
  };

  // --- Render Logic ---
  return (
    // Use a specific class for the main page container
    <div className="projects-page">
      {/* Use Bootstrap container for centered, max-width content area */}
      <div className="container py-4"> {/* Add padding top/bottom */}

        {/* Page Header Section */}
        <div className="page-header text-center mb-4">
          <h1>PROJECTS</h1>
          <p className="lead text-muted">Find, Learn, and Inspire</p>
        </div>
        {/* Removed the <hr> as mb-4 provides spacing */}

        {/* Search Form Section */}
        <form className="search-form d-flex justify-content-center mb-5" role="search" onSubmit={handleSearchSubmit}>
          <input
            className="form-control form-control-lg me-2 shadow-sm" // Larger input, subtle shadow
            type="search"
            placeholder="Search by Title, Faculty, Domain, ID..." // More descriptive placeholder
            aria-label="Search Projects"
            value={searchQuery}
            onChange={handleSearchChange}
            style={{ maxWidth: '600px' }} // Limit search input width
          />
          <button className="btn btn-primary btn-lg shadow-sm" type="submit"> {/* Larger button */}
            Search
          </button>
        </form>

        {/* Project Grid or Loading/Message Area */}
        <div className="project-results-area">
          {loading && (
            // Loading Indicator
            <div className="text-center mt-5">
              <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className='mt-2 text-muted'>Loading Projects...</p>
            </div>
          )}

          {!loading && initialLoadAttempted && filteredProjects.length > 0 && (
            // Render the grid only if not loading, initial load done, and projects exist
            <ProjectGrid allProjectsData={filteredProjects} />
          )}

          {!loading && initialLoadAttempted && filteredProjects.length === 0 && (
             // Show "No results" only if not loading, initial load done, and no projects found
             <div className="text-center mt-5">
                 <p className="lead text-muted">No projects match your search criteria.</p>
                 {/* Optionally suggest trying different keywords */}
                 {searchQuery && <p className="text-muted">Try different keywords or broaden your search.</p>}
             </div>
          )}

          {/* Optional: Message before initial load attempt (if not fetching defaults) */}
          {/* {!loading && !initialLoadAttempted && (
             <div className="text-center mt-5">
                 <p className="lead text-muted">Enter a search term to find projects.</p>
             </div>
          )} */}
        </div>

      </div> {/* End .container */}
    </div> // End .projects-page
  );
}

export default Projects;