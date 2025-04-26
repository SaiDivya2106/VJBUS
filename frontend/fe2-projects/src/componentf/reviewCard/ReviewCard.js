import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ReviewCard = ({ projectTitle, description, reviewer, rating }) => {
  return (
    <div className="card1 shadow-sm mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
      <div className="card-body1">
        <h5 className="card-title1 text-primary">{projectTitle}</h5>
        <p className="card-text1 text-muted">{description}</p>
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-secondary">Reviewed by: {reviewer}</small>
          <div>
            {[...Array(5)].map((star, i) => (
              <i
                key={i}
                className={`bi bi-star${i < rating ? '-fill text-warning' : ' text-muted'}`}
                style={{ fontSize: '1.2rem' }}
              ></i>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
