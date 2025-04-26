// src/components/Pagination/Pagination.js
import React from 'react';
import './Pagination.css'; // Create this file for styling

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Don't render pagination if there's only one page or no pages
  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    onPageChange(currentPage + 1);
  };

  return (
    <nav aria-label="Project Pagination" className="d-flex justify-content-center mt-5 mb-4">
      <ul className="pagination">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={handlePrevious} disabled={currentPage === 1}>
            Previous
          </button>
        </li>
        {/* Simple page number display */}
        {/* Added d-none d-sm-block to hide page number on very small screens */}
        <li className="page-item disabled px-3 d-none d-sm-block">
            <span className="page-link text-dark">
                Page {currentPage} of {totalPages}
            </span>
        </li>
        {/* Can add clickable page numbers here if desired */}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={handleNext} disabled={currentPage === totalPages}>
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;