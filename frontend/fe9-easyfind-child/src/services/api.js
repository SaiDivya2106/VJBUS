import axios from 'axios';
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: import.meta.env.VITE_EASYFIND_BACKEND_URL || 'https://easyfind.vjstartup.com/ef-be/'
});

// ✅ Use token from cookies instead of localStorage
api.interceptors.request.use((config) => {
  const token = Cookies.get('token'); 
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ Redirect unauthorized users to SuperApp instead of local login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token');
      Cookies.remove('user');
      window.location.href = 'https://superapp.vnrzone.site/';
    }
    return Promise.reject(error);
  }
);

// ✅ Fetch user profile from backend
const fetchUserProfile = async () => {
  const response = await api.get('/api/profile');
  return response.data;
};

// ✅ Logout function (removes cookies & redirects)
const logout = () => {
  Cookies.remove('token');
  Cookies.remove('user');
  window.location.href = 'https://superapp.vnrzone.site/';
};

// ✅ API calls for lost & found items
const submitFoundItem = async (itemData) => {
  try {
    const response = await api.post('/api/items/found', itemData);
    return response.data;
  } catch (error) {
    console.error('Error submitting found item:', error);
    throw error;
  }
};

const submitLostItem = async (itemData) => {
  try {
    const response = await api.post('/api/items/lost', itemData);
    return response.data;
  } catch (error) {
    console.error('Error submitting lost item:', error);
    throw error;
  }
};

const fetchFoundItems = async () => {
  try {
    const response = await api.get('/api/items/found');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch found items:', error);
    throw error;
  }
};

const fetchLostItems = async () => {
  try {
    const response = await api.get('/api/items/lost');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch lost items:', error);
    throw error;
  }
};

// ✅ Fetch reported items using email prefix (roll number)
const fetchReportedItems = async (user) => {
  try {
    if (!user?.email) throw new Error("User email is required");
    
    // Extract roll number from email
    const atIndex = user.email.indexOf('@');
    if (atIndex === -1) throw new Error("Invalid email format");
    
    const rollNo = user.email.substring(0, atIndex);

    const response = await api.get(`/api/items/reported/${rollNo}`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch reported items:", err);
    throw err;
  }
};

export {
  fetchUserProfile,
  logout,
  submitFoundItem,
  submitLostItem,
  fetchFoundItems,
  fetchLostItems,
  fetchReportedItems,
};
