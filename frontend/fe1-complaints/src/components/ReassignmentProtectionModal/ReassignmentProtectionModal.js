import React from "react";
import { Modal, Button } from "react-bootstrap";
import { IoWarning } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import "./ReassignmentProtectionModal.css";

const ReassignmentProtectionModal = ({
  show,
  complaint,
  currentAssistant,
  assignedAssistant,
  onClose,
}) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    onClose();
    navigate("/assistant-dashboard");
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal show={show} onHide={handleCancel} centered>
      <Modal.Header closeButton className="reassignment-header">
        <IoWarning className="warning-icon" />
        <Modal.Title>Complaint Reassigned</Modal.Title>
      </Modal.Header>
      <Modal.Body className="reassignment-body">
        <div className="reassignment-content">
          <p className="reassignment-message">
            <strong>This complaint has been reassigned!</strong>
          </p>
          <p className="reassignment-details">
            This complaint is no longer assigned to you. It has been reassigned
            to:
          </p>
          <div className="assigned-to-box">
            <strong>{assignedAssistant || "Another Assistant"}</strong>
          </div>
          <p className="reassignment-note">
            You can no longer edit or change the status of this complaint. Please
            contact the administrator if you have questions.
          </p>
          {complaint && (
            <div className="complaint-info">
              <p>
                <strong>Complaint ID:</strong> {complaint.complaint_id}
              </p>
              <p>
                <strong>Title:</strong> {complaint.title}
              </p>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className="reassignment-footer">
        <Button variant="secondary" onClick={handleCancel}>
          Close
        </Button>
        <Button variant="primary" onClick={handleGoBack}>
          Go to Dashboard
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReassignmentProtectionModal;
