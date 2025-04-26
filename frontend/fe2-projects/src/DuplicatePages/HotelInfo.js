import { useState } from "react";
import Edp from "./edp/Edp.js"
import ReviewPhase1 from "../componentf/reviewPhase1/ReviewPhase1.js";
import ReviewPhase2 from "../componentf/reviewPhase2/ReviewPhase2.js";
export default function HotelInfo() {
  const [activeTab, setActiveTab] = useState("hotelInside");

  return (
    <div className=" p-6">
      <h2 className="text-center text-2xl font-bold mb-6">Hotel Information</h2>

      {/* Navigation Links */}
      <div className="flex space-x-6 justify-center mb-6">
        <button
          onClick={() => setActiveTab("hotelInside")}
          className={`text-lg font-semibold ${activeTab === "hotelInside" ? "text-blue-600 underline" : "text-gray-700"}`}
        >
          Hotel Inside
        </button>
        <button
          onClick={() => setActiveTab("room101")}
          className={`text-lg font-semibold ${activeTab === "room101" ? "text-blue-600 underline" : "text-gray-700"}`}
        >
          Room 101
        </button>
        <button
          onClick={() => setActiveTab("room102")}
          className={`text-lg font-semibold ${activeTab === "room102" ? "text-blue-600 underline" : "text-gray-700"}`}
        >
          Room 102
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-gray-100 p-6 rounded-md shadow-md">
        {activeTab === "hotelInside" && (
          <Edp />
        )}

        {activeTab === "room101" && (
          <Edp />
        )}

        {activeTab === "room102" && (
          <Edp />
        )}
      </div>
    </div>
  );
}
