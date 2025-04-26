import React, { useState, useEffect, useRef } from 'react';
import { submitFoundItem } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

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

const ReportItem = ({ onItemReported }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    foundLocation: '',
    category: '',
    reportedDate: ''
  });
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  useEffect(() => {
    if (isCameraActive) {
      startCamera();
      return () => stopCamera();
    }
  }, [isCameraActive]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      setStatus("Camera access denied. Please allow camera permissions.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, width, height);
    
    canvas.toBlob(blob => {
      const file = new File([blob], `capture-${Date.now()}.jpg`, { 
        type: 'image/jpeg' 
      });
      handleImageChange(file);
      setIsCameraActive(false);
    }, 'image/jpeg', 0.9);
  };

  const handleImageChange = (fileOrEvent) => {
    let file;
    if (fileOrEvent instanceof File) {
      file = fileOrEvent;
    } else {
      file = fileOrEvent.target.files[0];
    }
    
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setStatus("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setStatus("Image too large (max 5MB)");
      return;
    }

    setStatus('');
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setFormData({ itemName: '', description: '', foundLocation: '', category: '', reportedDate: '' });
    setImage(null);
    setImagePreview(null);
    setStatus('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    
    if (!image) {
      setStatus('Please upload an image.');
      return;
    }

    const currentDate = new Date().toISOString().split('T')[0];
    if (formData.reportedDate > currentDate) {
      setStatus("Date Found cannot be in the future");
      return;
    }

    setLoading(true);
    try {
      const index = user.email?.indexOf('@');
      const rollNo = user.email.substring(0, index);
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      data.append('reporterRollNo', rollNo);
      data.append('image', image);

      const response = await submitFoundItem(data);
      if (response.success) {
        resetForm();
        setSuccessMessage('Item successfully reported!');
        setTimeout(() => {
          setSuccessMessage('');
          onItemReported?.(response.item);
          navigate('/');
        }, 2000);
      } else {
        throw new Error(response.message || 'Failed to report item');
      }
    } catch (error) {
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gradient-to-br from-blue-50 to-indigo-50  p-4">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-lg">
        {status && <p className="text-red-600 mb-3">{status}</p>}
        {successMessage && <p className="text-green-600 mb-3">{successMessage}</p>}
        <h2 className="text-2xl font-semibold text-center mb-4 text-blue-700">
          Report Found Item
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            placeholder="Item Name"
            className="border rounded-lg p-3 w-full shadow-sm focus:ring-2 focus:ring-blue-500"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            rows="3"
            className="border rounded-lg p-3 w-full shadow-sm focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
          <input
            type="text"
            name="foundLocation"
            value={formData.foundLocation}
            onChange={handleChange}
            placeholder="Found Location"
            className="border rounded-lg p-3 w-full shadow-sm focus:ring-2 focus:ring-blue-500"
            required
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border rounded-lg p-3 w-full shadow-sm focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <div className="relative w-full">
              <input
                type="date"
                 name="reportedDate"
                 value={formData.reportedDate || ""}
                onChange={handleChange}
                className="border rounded-lg p-3 w-full shadow-sm focus:ring-2 focus:ring-blue-500 peer"
                required
              />
          {!formData.reportedDate && (
        <span className="absolute left-3 top-3 text-gray-400 peer-focus:hidden">
            Select a date
        </span>
         )}
        </div>
          
          <div className="flex gap-2">
            <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              📁 Upload Image
            </label>
            <button
              type="button"
              onClick={() => {
                setStatus('');
                setIsCameraActive(true);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              📷 Use Camera
            </button>
          </div>

          {imagePreview && (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-32 w-32 object-contain border rounded-md cursor-pointer hover:opacity-80"
              />
            </div>
          )}

          <button
            type="submit"
            className={`bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105 ${loading ? 'opacity-50' : ''}`}
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Submit'}
          </button>
        </form>

        {isCameraActive && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full aspect-video rounded-lg"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={captureImage}
                  className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100"
                >
                  📸 Capture
                </button>
                <button
                  onClick={() => setIsCameraActive(false)}
                  className="p-3 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600"
                >
                  ✕ Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportItem;