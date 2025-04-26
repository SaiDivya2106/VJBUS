import React, { useState, useEffect, useCallback } from "react";
import { fetchFoundItems } from "../services/api";
import stringSimilarity from "string-similarity"; 

const categories = [
  "ID Card/Student Card",
  "Keys",
  "Calculator",
  "Earbuds/Headphones",
  "Mobile / Laptop",
  "Water Bottle/Tumbler",
  "USB Drive",
  "Wallet/Purse",
  "Watch",
  "Sunglasses/Eyeglasses",
  "Other"
];

const SearchItem = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTab, setActiveTab] = useState("verified");

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchFoundItems();
      setItems(response || []);
      setError("");
    } catch (error) {
      setError("Error fetching items. Please try again.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const getStatusBadgeClass = (status) => {
    return {
      verified: "bg-green-100 text-green-800",
      claimed: "bg-blue-100 text-blue-800",
    }[status] || "bg-gray-100 text-gray-800";
  };

  const filteredItems = items
    .filter((item) => {
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      
      const matchesStatus = item.status === activeTab;
      // console.log(item.itemName,item.description);
      return matchesCategory && matchesStatus;
    })
    .map((item) => ({
      ...item,
      similarity: searchQuery
        ? stringSimilarity.compareTwoStrings(
            searchQuery.toLowerCase(),
            (item.description || "").toLowerCase()
          )
        : 1, 
    }))
    .filter((item) => item.similarity >= 0 || searchQuery.trim() === "")
    .sort((a, b) => b.similarity - a.similarity);

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6 bg-gradient-to-br from-blue-100 to-gray-100">
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Search Found Items
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Browse through items found on campus
        </p>
      </div>

      <div className="max-w-7xl mx-auto space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Search items..."
              value={searchQuery}
              onChange={handleSearch}
            />
            <svg
              className="w-5 h-5 absolute left-3 top-3.5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <select
            className="w-full sm:w-64 px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {["verified", "claimed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {tab === "verified" ? "Verified Items" : "Claimed Items"}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-lg shadow-sm">
                <div className="aspect-square bg-gray-200 rounded-t-lg" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredItems.map((item) => (
              <div key={item._id} className="bg-white group relative rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="aspect-square relative">
                  <img
                    src={item.image?.url || "/placeholder.jpg"}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 left-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusBadgeClass(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">{item.itemName}</h3>
                  {item.code && (
                    <p className="text-xs text-gray-700 mb-1">Code: {item.code}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-blue-600 font-medium">
                      {item.category}
                    </span>
                  </div>
                </div>
                <button className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur rounded-full shadow-sm hover:bg-white transition-opacity opacity-0 group-hover:opacity-100">
                  <svg
                    className="w-4 h-4 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No {activeTab} items found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchItem;
