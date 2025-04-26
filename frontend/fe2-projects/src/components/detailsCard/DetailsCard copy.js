import React from 'react';
import './DetailsCard.css'; // Make sure this path is correct
import PercentageChart from '../PercentageChart/PercentageChart'; // Adjust path if needed

// Utility function to get nested values safely
const getNestedValue = (obj, path, defaultValue = 'N/A') => {
  const value = path.split('.').reduce((acc, part) => acc && acc[part], obj);
  return value !== undefined && value !== null ? value : defaultValue;
};

// Utility function to extract year from ProjectId
const getYear = (projectId) => {
  if (projectId && typeof projectId === 'string' && projectId.length >= 4) {
    return projectId.substring(0, 4);
  }
  return 'N/A';
};

const DetailsCard1 = ({ data = {}, score = 0 }) => {
  // Use destructuring for clarity
  const { ProjectSupervisor, ProjectTitle, Project_Type, Department, AdditionalInfo, ProjectId, Description } = data;

  return (
    <div className="project-box-vertical shadow-lg d-flex flex-column">
      {/* Project Details Section */}
      <div className="project-details-vertical">
        <h6 className="detail-item">
          <strong>Faculty:</strong> {getNestedValue(data, 'ProjectSupervisor')}
        </h6>
        <h6 className="detail-item">
          <strong>Project Title:</strong> {getNestedValue(data, 'ProjectTitle')}
        </h6>
        <h6 className="detail-item">
          <strong>Type:</strong> {getNestedValue(data, 'Project_Type')}
        </h6>
        <h6 className="detail-item">
          <strong>Department:</strong> {getNestedValue(data, 'Department')}
        </h6>
        {getNestedValue(data, 'AdditionalInfo.Domain', null) && (
          <h6 className="detail-item">
            <strong>Domain:</strong> {getNestedValue(data, 'AdditionalInfo.Domain')}
          </h6>
        )}
        <h6 className="detail-item">
          <strong>Year:</strong> {getYear(getNestedValue(data, 'ProjectId', null))}
        </h6>
        <h6 className="detail-item">
          <strong>Project ID:</strong> {getNestedValue(data, 'ProjectId')}
        </h6>
        {/* Add a description or tags section */}
        <p className="detail-item" style={{ fontSize: '12px', color: '#666' }}>
          <strong>Description:</strong> {getNestedValue(data, 'Description', 'No description available.')}
        </p>
      </div>

      {/* Chart Section - Pushed to the bottom */}
      <div className="chart-container-vertical mt-auto">
        <div className="percentage-chart-vertical">
          {/* Pass a smaller size prop to the PercentageChart component */}
          <PercentageChart percentage={Math.round(Number(score || 0) * 100)} size={40} /> {/* Smaller diameter */}
        </div>
        <p className="chart-label-vertical">
          <strong>Matching Percentage</strong>
        </p>
      </div>
    </div>
  );
};

export default DetailsCard1;