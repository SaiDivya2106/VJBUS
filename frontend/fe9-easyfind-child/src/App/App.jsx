import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import GoogleLoginButton from "../components/GoogleLoginButton";
import Layout from "../components/Layout";
import Dashboard from "../components/UserHome";
import SetPassword from "../components/SetPassword";
import UserProfile from "../components/UserProfile";
import ReportItem from "../components/ReportItem";
import SearchItem from "../components/SearchItem";
import NotifyLostItem from "../components/NotifyLostItem";

// function ProtectedRoute({ children }) {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!user) {
//     return <Navigate to="/login" />;
//   }

//   return children;
// }

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* <Route path="/login" element={<GoogleLoginButton />} /> */}
          {/* <Route path="/set-password" element={<ProtectedRoute><SetPassword /></ProtectedRoute>} /> */}

          {/* <Route path="/dashboard" element={<ProtectedRoute><Layout /></ProtectedRoute>}> */}
          <Route path="/dashboard" element={<Layout />}>

            
            <Route index element={<Dashboard />} />
            <Route path="user-profile" element={<UserProfile />} />
            <Route path="report-item" element={<ReportItem />} />
            <Route path="search-item" element={<SearchItem />} />
            <Route path="lost-item" element={<NotifyLostItem />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
