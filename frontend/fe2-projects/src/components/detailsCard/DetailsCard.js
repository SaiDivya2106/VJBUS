import React from 'react';
import './DetailsCard.css';
import PercentageChart from '../PercentageChart/PercentageChart';

const DetailsCard1 = ({ data, score }) => {
  return (
    <div className="project-box shadow-lg container">
      <div className="row">
        {/* Project Details Section */}
        <div className="col-md-8 project-details">
          <h5 className="text-start m-1 p-2">
            <strong>Faculty:</strong> {data?.ProjectSupervisor || 'N/A'}
          </h5>
          <h5 className="text-start m-1 p-2">
            <strong>Project Title:</strong> {data?.ProjectTitle || 'N/A'}
          </h5>
          <h5 className="text-start m-1 p-2">
            <strong>Type:</strong> {data?.Project_Type || 'N/A'}
          </h5>
          <h5 className="text-start m-1 p-2">
            <strong>Department:</strong> {data?.Department || 'N/A'}
          </h5>

          {/* Conditional check for AdditionalInfo.Domain */}
          {data?.AdditionalInfo?.Domain && (
            <h5 className="text-start m-1 p-2">
              <strong>Domain:</strong> {data.AdditionalInfo.Domain}
            </h5>
          )}

          {/* Ensure ProjectId exists before accessing substring */}
          <h5 className="text-start m-1 p-2">
            <strong>Year:</strong> {data?.ProjectId ? data.ProjectId.substring(0, 4) : 'N/A'}
          </h5>
          <h5 className="text-start m-1 p-2">
            <strong>Project ID:</strong> {data?.ProjectId || 'N/A'}
          </h5>
        </div>

        {/* Chart Section */}
        <div className="col-md-4 chart-container text-center">
          <div className="percentage-chart">
            <PercentageChart percentage={(score || 0) * 100} />
          </div>
          <p className="text-center m-1 p-2">
            <strong>Matching Percentage</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DetailsCard1;
