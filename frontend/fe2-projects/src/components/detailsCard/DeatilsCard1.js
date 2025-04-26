
import React from 'react';
import './DetailsCard1.css'; // We'll create/use this CSS file
import { useNavigate } from 'react-router-dom';

// Component accepts a 'data' object prop containing project details
function DetailsCard1({ data }) {
    const navigate = useNavigate();

    // Destructure data based on the fields used in your reference code
    // Provide default fallbacks for safety
    const {
        ProjectId, // Correct key based on console logs
        ProjectTitle = "Untitled Project",
        ProjectSupervisor = "N/A",
        Project_Type = "N/A", // Assuming this name based on reference
        Department = "N/A",
        AdditionalInfo // Access Domain from here if it exists
    } = data || {}; // Handle null/undefined data prop

    // Extract Year from ProjectId
    const Year = ProjectId ? ProjectId.substring(0, 4) : "N/A";

    // Extract Domain safely
    const Domain = AdditionalInfo?.Domain || null; // Use null if not present

    // Handle navigation
    const handleViewDetails = () => {
        if (ProjectId) {
             navigate(`/project/${ProjectId}`); // Navigate using the correct ID
        } else {
            console.warn("Cannot navigate: ProjectId is missing from data:", data);
        }
    };

    return (
        // Use the class name targeted by DetailsCard1.css
        <div className="details-card">
            <div className="card-content">
                {/* Display data fields based on reference layout */}
                <h3 className="card-title">{ProjectTitle}</h3>

                <p className="card-detail-item">
                    <strong>Faculty:</strong> {ProjectSupervisor}
                </p>
                <p className="card-detail-item">
                    <strong>Type:</strong> {Project_Type}
                </p>
                <p className="card-detail-item">
                    <strong>Department:</strong> {Department}
                </p>
                {/* Conditionally render Domain if it exists */}
                {Domain && (
                  <p className="card-detail-item">
                    <strong>Domain:</strong> {Domain}
                  </p>
                )}
                <p className="card-detail-item">
                    <strong>Year:</strong> {Year}
                </p>
                 <p className="card-detail-item">
                    <strong>Project ID:</strong> {ProjectId}
                </p>
{/* 
                <button onClick={handleViewDetails} className="card-button">
                    View Details
                </button> */}
            </div>
        </div>
    );
}

export default DetailsCard1;