import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AdminAnalysis.css";
import { useAuth } from "../../Context/AuthContext";
import { FaCheckCircle, FaClock, FaExclamationCircle, FaChartLine, FaStar, FaTrophy, FaFire } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Register ChartJS components
ChartJS.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

const AdminAnalysis = () => {
  const baseUrl = process.env.REACT_APP_COMPLAINTS_APP_BE_URL;

  const [complaintsData, setComplaintsData] = useState({
    resolved: 0,
    pending: 0,
    ongoing: 0,
  });

  const { adminCategory } = useAuth();
  const [teamPerformance, setTeamPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      if (!adminCategory) return;

      try {
        const token = localStorage.getItem("authToken");
        setLoading(true);

        // 🔵 1️⃣ Fetch complaint count
        const countResponse = await axios.get(
          `${baseUrl}/admin-api/complaints-count/${adminCategory}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setComplaintsData(countResponse.data);

        // 🟣 2️⃣ Fetch team performance
        const teamResponse = await axios.get(
          `${baseUrl}/admin-api/team-performance/${adminCategory}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTeamPerformance(teamResponse.data);

      } catch (error) {
        console.error("Error fetching analysis data:", error);

        if (error.response && error.response.status === 401) {
          localStorage.removeItem("authToken");
          navigate("/complaints-website");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, [adminCategory, baseUrl]);

  // ✅ Chart Data with gradients
  const barData = (canvas) => {
    const ctx = canvas?.getContext("2d");

    const greenGradient = ctx
      ? ctx.createLinearGradient(0, 0, 0, 400)
      : "#00c853";
    if (ctx) {
      greenGradient.addColorStop(0, "#00e676");
      greenGradient.addColorStop(1, "#00c853");
    }

    const yellowGradient = ctx
      ? ctx.createLinearGradient(0, 0, 0, 400)
      : "#ff9800";
    if (ctx) {
      yellowGradient.addColorStop(0, "#ffca28");
      yellowGradient.addColorStop(1, "#ff9800");
    }

    const redGradient = ctx
      ? ctx.createLinearGradient(0, 0, 0, 400)
      : "#ff3d00";
    if (ctx) {
      redGradient.addColorStop(0, "#ff6e40");
      redGradient.addColorStop(1, "#ff3d00");
    }

    return {
      labels: ["Resolved", "Pending", "Ongoing"],
      datasets: [
        {
          label: "Number of Complaints",
          data: [
            complaintsData.resolved || 0,
            complaintsData.pending || 0,
            complaintsData.ongoing || 0,
          ],
          backgroundColor: [greenGradient, yellowGradient, redGradient],
          borderRadius: 15,
          barThickness: 70,
        },
      ],
    };
  };

  // ✅ Chart Options
  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        ticks: {
          color: "#fff",
          font: { size: 14, weight: "bold" },
        },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#bbb" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#222",
        titleColor: "#fff",
        bodyColor: "#ddd",
      },
    },
  };

  // Get top performer
  const topPerformer = teamPerformance.length > 0 
    ? teamPerformance.reduce((prev, current) => 
        (prev.completionRate > current.completionRate) ? prev : current
      )
    : null;

  if (loading) {
    return (
      <div className="statistics-page text-center">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-light mt-3">Loading team analytics...</p>
      </div>
    );
  }

  return (
    <div className="statistics-page text-center">
      <h2 className="text-center mb-4 fw-bold">📊 Request Analytics & Team Performance</h2>

      {/* Chart Section */}
      <div className="d-flex justify-content-center">
        <div className="chart-card">
          <h5 className="chart-title">
            <FaChartLine className="me-2" />
            Department Overview
          </h5>
          <p className="chart-subtitle">
            Interactive visualization of request resolution metrics
          </p>
          <div className="chart-container">
            <Bar data={barData()} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards mt-5 d-flex justify-content-center gap-4 flex-wrap">
        <div className="card-box total">
          <FaChartLine size={55} className="card-icon" />
          <h6 className="card-title1">TOTAL REQUESTS</h6>
          <div className="card-number">
            {complaintsData.resolved +
              complaintsData.pending +
              complaintsData.ongoing}
          </div>
        </div>

        <div className="card-box resolved">
          <FaCheckCircle size={55} className="card-icon" />
          <h6 className="card-title1">RESOLVED</h6>
          <div className="card-number">{complaintsData.resolved}</div>
        </div>

        <div className="card-box pending">
          <FaClock size={55} className="card-icon" />
          <h6 className="card-title1">PENDING</h6>
          <div className="card-number">{complaintsData.pending}</div>
        </div>

        <div className="card-box ongoing">
          <FaExclamationCircle size={55} className="card-icon" />
          <h6 className="card-title1">ONGOING</h6>
          <div className="card-number">{complaintsData.ongoing}</div>
        </div>
      </div>

      {/* Top Performer Card */}
      {topPerformer && (
        <div className="top-performer-card mt-5">
          <div className="top-performer-content">
            <FaTrophy className="trophy-icon" />
            <h4>⭐ Top Performer</h4>
            <p className="performer-name">{topPerformer.name}</p>
            <p className="performer-email">{topPerformer.email}</p>
            <div className="performer-stats">
              <div className="stat">
                <span className="stat-label">Efficiency</span>
                <span className="stat-value">{topPerformer.completionRate}%</span>
              </div>
              <div className="stat">
                <span className="stat-label">Completed</span>
                <span className="stat-value">{topPerformer.resolved}/{topPerformer.total}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Performance Section */}
      {/* <div className="team-section mt-5">
        <div className="team-header-section">
          <h3 className="team-title">👥 Team Member Performance</h3>
          <p className="team-subtitle">Detailed breakdown of each team member's work status</p>
        </div>

        {teamPerformance.length === 0 ? (
          <div className="no-team-message">
            <p>No team members assigned to this category yet.</p>
          </div>
        ) : (
          <div className="team-grid">
            {teamPerformance.map((member, index) => {
              const performanceLevel = member.completionRate >= 80 ? "excellent" : 
                                       member.completionRate >= 60 ? "good" : 
                                       member.completionRate >= 40 ? "average" : "needs-improvement";

              return (
                <div key={index} className={`team-card ${performanceLevel}`}>
                  <div className="team-card-header">
                    <div className="member-info">
                      <h5 className="member-name">{member.name}</h5>
                      <p className="member-email">{member.email}</p>
                    </div>
                    <div className={`performance-badge ${performanceLevel}`}>
                      {member.completionRate}%
                    </div>
                  </div>

                  <div className="progress-ring-container">
                    <svg className="progress-ring-svg" viewBox="0 0 100 100">
                      <circle className="progress-ring-bg" cx="50" cy="50" r="45" />
                      <circle 
                        className="progress-ring" 
                        cx="50" 
                        cy="50" 
                        r="45"
                        style={{
                          strokeDasharray: `${2 * Math.PI * 45}`,
                          strokeDashoffset: `${2 * Math.PI * 45 * (1 - member.completionRate / 100)}`
                        }}
                      />
                      <text x="50" y="55" className="progress-text" textAnchor="middle">
                        {member.completionRate}%
                      </text>
                    </svg>
                  </div>

                  <div className="team-stats-detailed">
                    <div className="stat-box resolved-stat">
                      <span className="stat-icon">✅</span>
                      <div className="stat-content">
                        <span className="stat-label">Resolved</span>
                        <span className="stat-value">{member.resolved}</span>
                      </div>
                    </div>
                    <div className="stat-box ongoing-stat">
                      <span className="stat-icon">🔄</span>
                      <div className="stat-content">
                        <span className="stat-label">Ongoing</span>
                        <span className="stat-value">{member.ongoing}</span>
                      </div>
                    </div>
                    <div className="stat-box pending-stat">
                      <span className="stat-icon">⏳</span>
                      <div className="stat-content">
                        <span className="stat-label">Pending</span>
                        <span className="stat-value">{member.pending}</span>
                      </div>
                    </div>
                    <div className="stat-box total-stat">
                      <span className="stat-icon">📊</span>
                      <div className="stat-content">
                        <span className="stat-label">Total</span>
                        <span className="stat-value">{member.total}</span>
                      </div>
                    </div>
                  </div>

                  <div className="progress mt-3">
                    <div
                      className={`progress-bar progress-${performanceLevel}`}
                      role="progressbar"
                      style={{ width: `${member.completionRate}%` }}
                      aria-valuenow={member.completionRate}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                    </div>
                  </div>

                  <div className="team-card-footer mt-3">
                    <span className="performance-text">
                      {member.completionRate >= 80 && "🌟 Excellent Performance"}
                      {member.completionRate >= 60 && member.completionRate < 80 && "👍 Good Work"}
                      {member.completionRate >= 40 && member.completionRate < 60 && "🎯 Average"}
                      {member.completionRate < 40 && "⚠️ Needs Improvement"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div> */}

    </div>
  );
};

export default AdminAnalysis;
