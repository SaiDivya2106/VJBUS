import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, Tooltip, Legend, CategoryScale, LinearScale } from "chart.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AdminAnalysis.css";
import { useAuth } from "../../Context/AuthContext";
import {useNavigate} from "react-router-dom"

ChartJS.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

const AdminAnalysis = () => {
  const baseUrl = process.env.REACT_APP_COMPLAINTS_APP_BE_URL;
  
  // State to store complaint counts
  const [complaintsData, setComplaintsData] = useState({
    resolved: 0,
    pending: 0,
    ongoing: 0,
  });

  const { adminCategory } = useAuth(); // ✅ Get adminCategory from AuthContext
  console.log("Admin Category:", adminCategory);

  // Fetch complaint counts from backend
  useEffect(() => {
    const fetchComplaintCounts = async () => {
      if (adminCategory) {
        try {
          console.log("Fetching complaints for category:", adminCategory);
          const response = await axios.get(`${baseUrl}/admin-api/complaints-count/${adminCategory}`);
          setComplaintsData(response.data);
        } catch (error) {
          console.error("Error fetching complaint counts:", error);
        }
      }
    };

    if (adminCategory) {
      fetchComplaintCounts();
    }
  }, [adminCategory]);

  // Bar Chart Data
  const barData = {
    labels: ["Resolved", "Pending", "Ongoing"],
    datasets: [
      {
        label: "Number of Complaints",
        data: [complaintsData.resolved, complaintsData.pending, complaintsData.ongoing],
        backgroundColor: ["#28a745", "#ffc107", "#17a2b8"],
        borderRadius: 5,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1, 
          precision: 0, 
        },
      },
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            size: 14,
          },
        },
      },
    },
  };
  

  return (
    <div className="statistics-page  text-center">
      <h2 className="text-center mb-4 fw-bold">Admin Complaint Statistics 📊</h2>

      {/* Centered Bar Chart */}
      <div className="d-flex justify-content-center">
        <div className="chart-card" style={{ width: "600px" }}>
          <h5 className="chart-title">Complaints Overview</h5>
          <div className="chart-container">
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="summary-section mt-4">
        <h4 className="summary-title">
          📌 Total Complaints: {complaintsData.resolved + complaintsData.pending + complaintsData.ongoing}
        </h4>
        <div>✅ Resolved: {complaintsData.resolved}</div>
        <div>⚠ Pending: {complaintsData.pending}</div>
        <div>🔄 Ongoing: {complaintsData.ongoing}</div>
      </div>
    </div>
  );
};

export default AdminAnalysis;
