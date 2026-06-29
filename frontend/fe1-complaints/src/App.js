import React from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import Home from './components/Home/Home';
import RootLayout from './RootLayout';
import ComplaintForm from './components/ComplaintForm/ComplaintForm';
import AdminPage from './components/AdminPage/AdminPage';
import LandingPage from './components/LandingPage/LandingPage';
import ComplaintsDetails from './components/ComplaintsDetails/ComplaintsDetails';
import UserDashboard from './components/UserDashboard/UserDashboard';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import AdminAnalysis from './components/AdminAnalysis/AdminAnalysis';
import UserAnalysis from './components/UserAnalysis/UserAnalysis';
import SuperAdminDashboard from './components/SuperAdminDashboard/SuperAdminDashboard'
import AssistantDashboard from './components/AssistantDashboard/AssistantDashboard';
function App() {
  let router = createBrowserRouter([
    {
      path: '',
      element: <RootLayout />,
      children: [
        { path: 'all-complaints', element: <Home /> },

        { path: 'complaints-website', element: <LandingPage /> },
        { path: 'complaint-form', element: <ComplaintForm /> },
        { path: 'adminpage', element: <AdminPage /> },
        { path: 'admin-analysis', element: <AdminAnalysis /> },
        { path: 'user-analysis', element: <UserAnalysis /> },
        { path: 'my-complaints', element: <UserDashboard /> },
        {
          path: 'complaints-details/:complaint_id', // ✅ Moved outside AdminPage
          element: <ComplaintsDetails />
        },
        {
          path: '', element: <Navigate to="all-complaints" />

        }, {
          path: '/superadmin-dashboard', element: <SuperAdminDashboard />
        }, {
          path: '/assistant-dashboard', element: <AssistantDashboard />
        }

      ]
    }
  ]);


  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
