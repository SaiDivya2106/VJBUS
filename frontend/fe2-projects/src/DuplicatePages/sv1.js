import React, { useState, useEffect } from "react";
import axios from "axios";

function SV1() {
  const [projects, setProjects] = useState([]);
  const [staticData, setStaticData] = useState([
    {
      Project_id: "1",
      title: "AI-Based Chatbot",
      abstract: "A chatbot using NLP techniques.",
      requirements: "Python, TensorFlow",
      staff_name: "Dr. John Doe",
      domain: "Artificial Intelligence",
      department: "Computer Science",
      done_review: "TRUE",
      status: "TRUE",
      publish: "TRUE",
      under_review: "FALSE",
    },
    {
      Project_id: "2",
      title: "Blockchain Voting System",
      abstract: "Secure voting system using blockchain.",
      requirements: "Node.js, Solidity",
      staff_name: "Dr. Jane Smith",
      domain: "Blockchain",
      department: "Information Technology",
      done_review: "TRUE",
      status: "TRUE",
      publish: "TRUE",
      under_review: "FALSE",
    },
  ]);

  const API_BASE_URL = "http://localhost:5000"; // Backend server URL

  const fetchPublishedProjects = async () => {
    try {
      console.log("Fetching published projects...");
      const response = await axios.post(`${API_BASE_URL}/projects_published`, {
        department: "Computer Science",
      });
      console.log("Response from backend:", response.data);
      if (response.data && response.data.length > 0) {
        setProjects(response.data);
      } else {
        console.log("No projects found. Using static data.");
        setProjects(staticData); // Fallback to static data
      }
    } catch (error) {
      console.error("Error fetching published projects:", error);
      setProjects(staticData); // Fallback to static data
    }
  };

  useEffect(() => {
    fetchPublishedProjects(); // Fetch published projects
  }, []);

  return (
    <div className="container">
      <h1>Published Projects</h1>
      {projects.length > 0 ? (
        <div className="project-list">
          {projects.map((project, index) => (
            <div key={index} className="project-card">
              <h2>{project.title}</h2>
              <p><strong>Abstract:</strong> {project.abstract || "N/A"}</p>
              <p><strong>Requirements:</strong> {project.requirements || "N/A"}</p>
              <p><strong>Faculty Name:</strong> {project.staff_name || "N/A"}</p>
              <p><strong>Domain:</strong> {project.domain || "N/A"}</p>
              <p><strong>Department:</strong> {project.department || "N/A"}</p>
              <p><strong>Status:</strong> {project.status === "TRUE" ? "Active" : "Inactive"}</p>
              <p><strong>Published:</strong> {project.publish === "TRUE" ? "Yes" : "No"}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No projects available.</p>
      )}
    </div>
  );
}

export default SV1;