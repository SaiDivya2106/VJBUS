import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./App.css";

// Layouts
import RootLayout from "./AllCorrectPages/rootLayout/RootLayout";

// Pages
import Home from "./AllCorrectPages/home/Home";
import Register from "./AllCorrectPages/register/Register";
import Login from "./AllCorrectPages/login/Login";
import OTP from "./AllCorrectPages/OTP/OTP";
import Credits from "./AllCorrectPages/credits/Credits";
import Error from "./error/Error";
import Projects from "./components/projects/Projects";
// Components
import { useEffect,useState } from "react";
import { useDispatch } from "react-redux";
import FileUpload from "./componentf/fileUpload/FileUpload";
import EditDeletePublish from "./componentf/editDeletePublish/EditDeletePublish";
import ProjectTitles from "./componentf/projectTitles/ProjectTitles";
import StudentView from "./components/studentView/StudentView";
import Catalog from "./components/catalog/Catalog";
import ReviewPage from "./componentf/reviewPage/ReviewPage";
import ReviewPhaseDemp from "./DuplicatePages/ReviewPhase2_0";
import ReviewPhaseDemp1 from "./DuplicatePages/ReviewPhase1_2_0";
import UnderReview from "./componentf/UnderReviewUnderPublish/UnderReview";
import RegisterPrc from "./componentP/registerPrc/RegisterPrc";
import HotelInfo from "./DuplicatePages/HotelInfo";
import SV1 from "./DuplicatePages/sv1";
import {checkAuthThunk} from "./REACT/SLICES/Userslice";
import {PRCcheckAuthThunk} from "./REACT/SLICES/PRCslice";




// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const loginStatus = useSelector((state) => state.User.loginStatus);
  const [isReady, setIsReady] = useState(false);
  const currentUser = useSelector((state) => state.User.currentUser);
  // Check when the currentUser state has been populated
  console.log(currentUser);
  useEffect(() => {
    if (currentUser) {
      setIsReady(true);
    }
  }, [currentUser]); // Run when currentUser state changes

  if (!isReady) {
    // Optionally, render a loading spinner or placeholder
    return <div>Loading...</div>;
  }

  return loginStatus ? children : <Error/>;
};
const PRCProtectedRoute = ({ children }) => {
  const currentUser = useSelector((state) => state.PRC.currentUser);
  const loginStatus = useSelector((state) => state.PRC.loginStatus);
  const [isReady, setIsReady] = useState(false);
  console.log(currentUser);
  // Check when the currentUser state has been populated
  useEffect(() => {
    if (currentUser) {
      setIsReady(true);
    }
  }, [currentUser]); // Run when currentUser state changes

  if (!isReady) {
    // Optionally, render a loading spinner or placeholder
    return <div>Loading...</div>;
  }
  return loginStatus ? children : <Error></Error>;
};
const FacultyProtectedRoute = ({ children }) => {
  const currentUser = useSelector((state) => state.User.currentUser);

  const [isReady, setIsReady] = useState(false);

  // Check when the currentUser state has been populated
  useEffect(() => {
    if (currentUser) {
      setIsReady(true);
    }
  }, [currentUser]); // Run when currentUser state changes

  if (!isReady) {
    // Optionally, render a loading spinner or placeholder
    return <div>Loading...</div>;
  }

  return currentUser?.role === 'faculty' ? children : <Error />;
};

function App() {
  const user = useSelector((state) => state.User);
  const prcUser = useSelector((state) => state.PRC);
  const dispatch = useDispatch();
  useEffect(() => {
   
    dispatch(checkAuthThunk(user));
    
    dispatch(PRCcheckAuthThunk(prcUser));
    
    console.log(user,prcUser)
}, []);
  const browserRouter = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <Error />,
      children: [
        { path: "", element: <Home /> },
        { path: "register", element: <Register /> },
        { path: "login", element: <Login /> },
        { path: "otp", element: <OTP /> },
        { path: "Credits", element: <Credits /> },


        {
          path: "filtered",
          element: (
           
              <Catalog />
           
          ),
        },
        {
          path: "projects",
          element: (
           
              <Projects />
           
          ),
        },
        {
          path: "fileUpload",
          element: (
            <FacultyProtectedRoute>
              <FileUpload />
            </FacultyProtectedRoute>
          ),
        },
        {
          path: "projectTitles",
          element: (
            <ProtectedRoute>
              <ProjectTitles />
            </ProtectedRoute>
          ),
        },
        {
          path: "editDeletePublish",
          element: (
            <FacultyProtectedRoute>
              <EditDeletePublish />
            </FacultyProtectedRoute>
          ),
        },
        {
          path: "studentview",
          element: (
            <ProtectedRoute>
              <StudentView />
            </ProtectedRoute>
          ),
        },
        {
          path: "reviewPage/:Project_id",
          element: (
            <ProtectedRoute>
              <ReviewPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "reviewPhase2/:Project_id",
          element: (
            <PRCProtectedRoute>
              <ReviewPhaseDemp />
            </PRCProtectedRoute>
          ),
        },
        {
          path: "UnderReview",
          element: (
            <ProtectedRoute>
              <UnderReview />
            </ProtectedRoute>
          ),
        },
        {
          path: "RegisterPrc",
          element: (
         
              <RegisterPrc />
      
          ),
        },
        {
          path: "dashboard",
          element: (
            <ProtectedRoute>
              <HotelInfo />
            </ProtectedRoute>
          ),
        },
      
        {
          path: "reviewPhaseForPRC",
          element: (
            <PRCProtectedRoute>
              <ReviewPhaseDemp1 />
            </PRCProtectedRoute>
          ),
        },
        {
          path: "sv1",
          element: (
            <ProtectedRoute>
              <SV1 />
            </ProtectedRoute>
          ),
        },
      ]
    }
  ]);

  return (
    <div className="App">
      <RouterProvider router={browserRouter} />
    </div>
  );
}

export default App;



// import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import './App.css';

// // Layouts
// import RootLayout from './AllCorrectPages/rootLayout/RootLayout';

// // Pages
// import Home from './AllCorrectPages/home/Home';
// import Register from './AllCorrectPages/register/Register';
// import Login from './AllCorrectPages/login/Login';
// import OTP from './AllCorrectPages/OTP/OTP';
// import Credits from './AllCorrectPages/credits/Credits';
// import Error from './error/Error';

// // Components
// import FileUpload from './componentf/fileUpload/FileUpload';
// import EditDeletePublish from './componentf/editDeletePublish/EditDeletePublish';
// import ProjectTitles from './componentf/projectTitles/ProjectTitles';
// import StudentView from './components/studentView/StudentView';
// import Catalog from './components/catalog/Catalog';
// import ReviewPage from './componentf/reviewPage/ReviewPage';

// import ReviewPhase2 from './componentf/reviewPhase2/ReviewPhase2';
// import UnderReview from './componentf/UnderReviewUnderPublish/UnderReview';
// import RegisterPrc from './componentP/registerPrc/RegisterPrc';


// // Duplicate Pages (if needed)
// import HotelInfo from './DuplicatePages/HotelInfo';
// import ReviewPhaseDemp from './DuplicatePages/ReviewPhase2_0';
// import ReviewPhaseDemp1 from './DuplicatePages/ReviewPhase1_2_0';
// import SV1 from './DuplicatePages/sv1'

// // Navigation Demo
// import Navigationdemo from './componentf/navigation1/Navigation1';

// import { useNavigate } from 'react-router-dom';

// function ProtectedRoute({ children }) {
//   const loginStatus = useSelector((state) => state.user.loginStatus);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!loginStatus) {
//       navigate("/login"); // Redirect to login if not authenticated
//     }
//   }, [loginStatus, navigate]);

//   return loginStatus ? children : null; // Render only if logged in
// }

// function App() {


//   const browserRouter = createBrowserRouter([
//     {
//       path: '/',
//       element: <RootLayout />,
//       errorElement: <Error />,
//       children: [
//         { path: '', element: <Home /> },
//         { path: 'projects', element: <HotelInfo /> },
//         { path: 'filtered', element: <Catalog /> },
//         { path: 'register', element: <Register /> },
//         { path: 'login', element: <Login /> },
//         { path: 'otp', element: <OTP /> },
//         { path: 'fileUpload', element: <FileUpload /> },
//         { path: 'projectTitles', element: <ProjectTitles /> },
//         { path: 'catalog', element: <Catalog /> },
//         { path: 'editDeletePublish', element: <EditDeletePublish /> },
//         { path: 'studentview', element: <StudentView /> },
//         { path: 'reviewPage/:Project_id', element: <ReviewPage /> },
//         { path: 'reviewPhase2/:Project_id', element: <ReviewPhaseDemp /> },
//         { path: 'UnderReview', element: <UnderReview /> },
//         { path: 'RegisterPrc', element: <RegisterPrc /> },
//         { path: 'dashboard', element: <HotelInfo /> },
//         { path: 'Credits', element: <Credits /> },
//         { path: 'reviewPhase2', element: <ReviewPhaseDemp /> },
//         { path: 'reviewPhase1', element: <ReviewPhaseDemp1 /> },
//         { path: 'sv1', element: <SV1 /> },
//       ],
//     },
//     {
//       path: 'navigationDemo',
//       element: <Navigationdemo />,
//     },
//   ]);

//   return (
//     <div className="App">
//       <RouterProvider router={browserRouter} />
//     </div>
//   );
// }

// export default App;
