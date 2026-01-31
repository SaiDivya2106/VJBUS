
import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import './ComplaintCategoryWithFlag.css'

const ComplaintCategoryWithFlag = ({ complaintId, complaint, onFlagged }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [optionalNote, setOptionalNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // loading state
  const { user } = useAuth(); // admin user

  // Restrict flag reasons to approved list
  const flagReasons = [
    "False or Misleading Information",
    "Irrelevant or Non-Complaint Content",
    "Individual-Specific Issue",
    "Other",
  ];

  // Check if the complaint is already flagged
  const isAlreadyFlagged =
    complaint?.flagged === true || complaint?.flagged?.isFlagged === true;
  const baseUrl = process.env.REACT_APP_COMPLAINTS_APP_BE_URL;

  const handleFlagSubmit = async () => {
    if (!selectedReason) return;

    try {
      setIsSubmitting(true); // start loading
      const token = localStorage.getItem("authToken"); // assuming your auth token
      const url = `${baseUrl}/admin-api/flag-complaint/${complaintId}`;

      // POST request to backend
      const response = await axios.post(
        url,
        {
          reason: selectedReason,
          note: optionalNote,
          flaggedBy: user.email, // admin email
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // if your backend verifies token
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Flag response:", response.data);

      // Reset modal and fields
      setShowModal(false);
      setSelectedReason("");
      setOptionalNote("");

      // Notify parent to update UI
      onFlagged?.();
    } catch (error) {
      console.error("Error flagging complaint:", error.response?.data || error.message);
    } finally {
      setIsSubmitting(false); // stop loading
    }
  };

  return (
    <div className="d-flex justify-content-between align-items-start position-relative">
      {/* Flag Button */}
      <Button
        variant={isAlreadyFlagged ? "secondary" : "danger"}
        size="sm"
        className="px-2 py-1 fw-semibold shadow-sm"
        style={{
          borderRadius: "8px",
          position: "absolute",
          top: "-8px",
          right: "-8px",
          fontSize: "0.8rem",
        }}
        onClick={() => !isAlreadyFlagged && setShowModal(true)}
        title={isAlreadyFlagged ? "Already flagged" : "Flag Complaint"}
        disabled={isAlreadyFlagged}
      >
        <i className="bi bi-flag-fill me-1"></i>
        {isAlreadyFlagged ? "Flagged" : "Flag"}
      </Button>

      {/* Flag Modal */}
      {/* <Modal show={showModal} onHide={() => setShowModal(false)} centered size="md">
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>
            <i className="bi bi-flag-fill me-2"></i> Flag Request
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Select Reason</Form.Label>
            <Form.Select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="shadow-sm"
            >
              <option value="">Choose a reason</option>
              {flagReasons.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label className="fw-semibold">Optional Note</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Add extra details (optional)"
              value={optionalNote}
              onChange={(e) => setOptionalNote(e.target.value)}
              className="shadow-sm"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleFlagSubmit}
            disabled={!selectedReason || isSubmitting}
          >
            {isSubmitting ? "Submitting…" : "Submit Flag"}
          </Button>
        </Modal.Footer>
      </Modal> */}


      {/* Flag Modal */}
      <Modal
  show={showModal}
  onHide={() => setShowModal(false)}
  centered
  size="md"
  dialogClassName="report-modal"
>

  {/* HEADER */}
  {/* <div className="report-header d-flex align-items-center justify-content-between">
    <div>
      <h5 className="report-title">
        <i className="bi bi-flag-fill me-2"></i> Report Issue
      </h5>
      <p className="report-subtitle">Help us improve content quality</p>
    </div>
    <i className="bi bi-x-lg report-close" onClick={() => setShowModal(false)}></i>
  </div> */}

<div className="report-header">
  <div className="header-left">
    <div className="report-icon">
      <i className="bi bi-flag-fill"></i>
    </div>

    <div>
      <h5 className="report-title">Report Issue</h5>
      <p className="report-subtitle">Help us improve content quality</p>
    </div>
  </div>

  <i className="bi bi-x-lg report-close" onClick={() => setShowModal(false)}></i>
</div>



  {/* BODY */}
  <div className="report-body">

    <label className="report-label">REASON FOR REPORT</label>
    <Form.Select
      value={selectedReason}
      onChange={(e) => setSelectedReason(e.target.value)}
      className="report-select "
    >
      <option value="" >Choose a reason</option>
      {flagReasons.map((reason) => (
        <option key={reason} value={reason}>
          {reason}
        </option>
      ))}
    </Form.Select>

    <label className="report-label mt-4">ADDITIONAL DETAILS</label>
    <Form.Control
      as="textarea"
      rows={3}
      placeholder="Provide context for your report..."
      value={optionalNote}
      onChange={(e) => setOptionalNote(e.target.value)}
      className="report-textarea"
    />
  </div>

  {/* FOOTER */}
  <div className="report-footer">
    <Button className="report-cancel" onClick={() => setShowModal(false)}>
      Cancel
    </Button>
    <Button
      className="report-submit"
      onClick={handleFlagSubmit}
      disabled={!selectedReason || isSubmitting}
    >
      {isSubmitting ? "Submitting…" : "Submit Report"}
    </Button>
  </div>
</Modal>


    </div>
  );
};

export default ComplaintCategoryWithFlag;





