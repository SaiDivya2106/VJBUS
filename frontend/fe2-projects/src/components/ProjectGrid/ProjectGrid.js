// src/components/ProjectGrid/ProjectGrid.js
import React, { useState, useEffect } from 'react';
import DetailsCard1 from '../detailsCard/DetailsCard'; // Adjust path
import Pagination from '../Pagination/Pagination';     // Adjust path
import './ProjectGrid.css';

// Set items per page (Adjust as needed, 8-10 is the range)
const ITEMS_PER_PAGE = 9;

const ProjectGrid = ({ allProjectsData = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 if the project data changes (e.g., after a new search)
  useEffect(() => {
      setCurrentPage(1);
  }, [allProjectsData]);

  // Calculate total pages
  const totalPages = Math.ceil(allProjectsData.length / ITEMS_PER_PAGE);

  // Calculate the items to display on the current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = allProjectsData.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      const gridElement = document.querySelector('.project-grid');
      if (gridElement) {
          gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
           window.scrollTo(0, 0);
      }
    }
  };

  // Don't render the grid itself if there are no items to display on the current page
  if (currentItems.length === 0 && allProjectsData.length > 0) {
       return null;
  }

  return (
    <div className="project-grid">
      {/* Bootstrap Row with responsive columns */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
        {currentItems.map((projectData) => (
          <div
            key={projectData?.project?.ProjectId || `project-${Math.random()}`}
            className="col d-flex align-items-stretch"
          >
            {/* Pass the nested 'project' object and 'score' */}
            <DetailsCard1
              data={projectData.project}  // Pass the nested project object
              score={projectData.score}   // Pass the score
            />
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default ProjectGrid;
