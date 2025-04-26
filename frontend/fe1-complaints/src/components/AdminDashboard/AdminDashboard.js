import React, { useState } from "react";
import AdminPage from "../AdminPage/AdminPage"; // Complaints List Component
import Analysis from "../AdminAnalysis/AdminAnalysis"; // Analysis Component
import { useAuth } from "../../Context/AuthContext";

function AdminDashboard() {
    const { admin ,loginAsAdmin} = useAuth();
  const [activeTab, setActiveTab] = useState("complaints"); // Default: Complaints List
  console.log(admin)
  console.log(loginAsAdmin)

  return (
    <div className="p-5">
      {/* Tabs Navigation */}
      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "complaints" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("complaints")}
        >
          Complaints List
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "analysis" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("analysis")}
        >
          Analysis
        </button>
      </div>

      {/* Render Components Based on Selected Tab */}
      <div className="bg-white p-4 shadow rounded">
        {activeTab === "complaints" ? <AdminPage /> : <Analysis />}
      </div>
    </div>
  );
}

export default AdminDashboard;
