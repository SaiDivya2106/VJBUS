import { useState, useEffect } from "react";
import axios from "axios";

function ManageItems() {
  const [items, setItems] = useState([]);
  const [searchCode, setSearchCode] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [view, setView] = useState("pending");
  const [expandedItem, setExpandedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [backendError, setBackendError] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedItemForVerification, setSelectedItemForVerification] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_EASYFIND_BACKEND_URL}/api/items/admin/found`, {
          withCredentials: true,
        });
        // Sort items by reportedDate in descending order
        const sortedItems = response.data.sort((a, b) => 
          new Date(b.reportedDate) - new Date(a.reportedDate)
        );
        setItems(sortedItems);
      } catch (error) {
        console.error("Error fetching items:", error);
        setBackendError("Failed to load items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingStatus(true);
    setErrorMessage("");
    setBackendError("");
    setIsSuccess(false);

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_EASYFIND_BACKEND_URL}/api/items/admin/updatestatus`,
        { id, status: newStatus },
        {
          withCredentials: true,
        }
      );
      
      setItems(items.map(item => (item._id === id ? { ...item, status: newStatus } : item)));
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      let errorMsg = "An unexpected error occurred. Please try again.";
      
      if (error.response) {
        if (error.response.data.errors) {
          errorMsg = Object.values(error.response.data.errors)
            .map(err => err.message)
            .join(', ');
        } else {
          errorMsg = error.response.data.message || "Server error occurred";
        }
      } else if (error.request) {
        errorMsg = "No response from server. Please check your connection.";
      }
      
      setBackendError(errorMsg);
      setTimeout(() => setBackendError(""), 5000);
    } finally {
      setUpdatingStatus(false);
      setShowImageModal(false);
    }
  };

  const handleVerifyClick = (item) => {
    setSelectedItemForVerification(item);
    setShowImageModal(true);
  };

  const filteredItems = items.filter(item =>
    (searchCode ? item.code.includes(searchCode) : true) &&
    (searchCategory ? item.category.toLowerCase().includes(searchCategory.toLowerCase()) : true) &&
    (view === "pending" ? item.status === "pending" : item.status === "verified")
  );

  return (
    <div className="container mx-auto p-4">
      <h3 className="text-2xl font-bold mb-6">Approve Items</h3>

      {isSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-4">
          ✅ Status updated successfully!
        </div>
      )}
      
      {backendError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
          ❌ Error: {backendError}
        </div>
      )}

      <div className="flex space-x-4 mb-4">
        <button 
          className={`px-4 py-2 rounded-md ${
            view === "pending" 
              ? "bg-blue-500 text-white" 
              : "bg-gray-200 hover:bg-gray-300"
          }`} 
          onClick={() => setView("pending")}
        >
          Pending Items
        </button>
        <button 
          className={`px-4 py-2 rounded-md ${
            view === "verified" 
              ? "bg-blue-500 text-white" 
              : "bg-gray-200 hover:bg-gray-300"
          }`} 
          onClick={() => setView("verified")}
        >
          Verified Items
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Code"
          className="border px-3 py-2 rounded-md flex-1 min-w-[200px]"
          onChange={(e) => setSearchCode(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by Category"
          className="border px-3 py-2 rounded-md flex-1 min-w-[200px]"
          onChange={(e) => setSearchCategory(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        filteredItems.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No items available</p>
        ) : (
          <ul className="space-y-4">
            {filteredItems.map((item) => (
              <li 
                key={item._id} 
                className="p-4 border rounded-md shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="font-semibold text-lg">
                      {item.itemName} <span className="text-sm text-gray-600">(Code: {item.code})</span>
                    </p>
                    <p className="text-sm text-gray-600">Category: {item.category}</p>
                    <p className={`text-sm font-semibold ${
                      item.status === "pending" ? "text-yellow-600" : "text-blue-600"
                    }`}>
                      Status: {item.status.toUpperCase()}
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    {item.status === "pending" && (
                      <button 
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleVerifyClick(item);
                        }}
                        disabled={updatingStatus}
                      >
                        Verify
                      </button>
                    )}
                    {item.status === "verified" && (
                      <button 
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleStatusChange(item._id, "pending"); 
                        }}
                        disabled={updatingStatus}
                      >
                        {updatingStatus ? "Updating..." : "Undo (Pending)"}
                      </button>
                    )}
                  </div>
                </div>

                {expandedItem === item._id && (
                  <div className="mt-4 pt-4 border-t">
                    {item.image?.url && (
                      <img
                        src={item.image.url}
                        alt={item.itemName}
                        className="max-w-[200px] h-auto rounded-md mb-3 border"
                      />
                    )}
                    <p className="text-sm text-gray-600">Description: {item.description}</p>
                    <p className="text-sm text-gray-600">Location Found: {item.foundLocation}</p>
                    <p className="text-sm text-gray-600">
                      Reported Date: {new Date(item.reportedDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">Reporter ID: {item.reporterRollNo}</p>

                  </div>
                )}
                <button
                  className="mt-2 text-sm text-blue-500 hover:text-blue-600"
                  onClick={() => setExpandedItem(expandedItem === item._id ? null : item._id)}
                >
                  {expandedItem === item._id ? "Show Less" : "Show More"}
                </button>
              </li>
            ))}
          </ul>
        )
      )}

      {showImageModal && selectedItemForVerification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-xl font-bold mb-4">Verify Item: {selectedItemForVerification.itemName}</h3>
            <img
              src={selectedItemForVerification.image.url}
              alt={selectedItemForVerification.itemName}
              className="w-full h-auto rounded-md mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                onClick={() => setShowImageModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                onClick={() => handleStatusChange(selectedItemForVerification._id, "verified")}
                disabled={updatingStatus}
              >
                {updatingStatus ? "Verifying..." : "Confirm Verification"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageItems;