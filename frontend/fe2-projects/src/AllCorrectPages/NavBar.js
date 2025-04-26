import React, { useState } from "react";
import a from "../AllCorrectPages/images/duplica.png";
import "./NavBar.css";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { resetState } from "../REACT/SLICES/Userslice";
import { resetState1 } from "../REACT/SLICES/PRCslice";
import { useNavigate } from "react-router-dom";
import { logoutThunk } from "../REACT/SLICES/Userslice";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navLinks = {
    Home: "/",
    Catalog: "/filtered",
    Contact: "/credits",
  };
  const NormalUser = useSelector((state) => state.User);
  const Prc_User = useSelector((state) => state.PRC.loginStatus);
  const isLoggedIn = NormalUser.loginStatus;

  let Role = "";
  if (NormalUser.currentUser) {
    Role = NormalUser.currentUser.role;
  }

  const handleLogout = () => {
    dispatch(logoutThunk());
    dispatch(resetState1());
    navigate("/login");
  };

  return (
    <div className="navbar-container">
      {/* Navbar Container */}
      <div className="navbar flex justify-between items-center w-full p-2">
        {/* Logo and Navigation Links Section in Single Div */}
        <div className="navbar-left flex justify-between items-center w-full md:w-auto">
          {/* Logo Section */}
          <div className="logo-section flex items-center gap-2">
            <img src={a} className="img11" alt="Logo" height="35px" width="35px" />
            <p className="text-white font-semibold">DuplicaXpert</p>
          </div>

          {/* Navigation Links */}
          <div className="desktop-nav hidden md:flex items-center gap-5 ml-10">
            <ul className="nav-links flex gap-5">
              {Object.entries(navLinks).map(([label, url], index) => (
                <li key={index} className="relative group">
                  <a className="text-white p-0.5" href={url}>
                    {label}
                  </a>
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                </li>
              ))}
            </ul>

            {/* Conditional Rendering: Login/Register or Logout */}
            {isLoggedIn ? (
              <>
                {Role === "student" && (
                  <li className="relative group list-style-none">
                    <a className="text-white p-0.5" href="/studentview">
                      ProjectPanel
                    </a>
                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                  </li>
                )}
                {Role === "faculty" && (
                  <ul className="hidden md:flex items-center gap-5">
                    <li className="relative group">
                      <a className="text-white p-0.5" href="/fileupload">
                        IdeaUpload
                      </a>
                      <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                    </li>
                    <li className="relative group">
                      <a className="text-white p-0.5" href="/editDeletePublish">
                        ProjectManager
                      </a>
                      <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                    </li>
                  </ul>
                )}

                {Prc_User && (
                  <li className="relative group list-style-none">
                    <a className="text-white p-0.5" href="/">
                      ReviewBoard
                    </a>
                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                  </li>
                )}

                <button
                  onClick={handleLogout}
                  className="text-white px-3 py-1 bg-red-600 rounded-md hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-3">
                <Link
                  to="/login"
                  className="text-white px-3 py-1 bg-blue-600 rounded-md hover:bg-blue-700 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-white px-3 py-1 bg-green-600 rounded-md hover:bg-green-700 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu with Sliding Animation */}
      <div
        className={`mobile-nav absolute top-12 right-0 w-[250px] h-screen bg-white p-5 shadow-lg transition-all duration-500 ease-in-out ${
          isOpen ? "clip-path-[inset(0%_0%_0%_0%)] opacity-100 z-50" : "clip-path-[inset(0%_100%_0%_0%)] hidden z-0"
        }`}
      >
        <ul className="flex flex-col gap-5 text-center">
          {Object.entries(navLinks).map(([label, url], index) => (
            <li key={index} className="relative group">
              <a className="text-lg" href={url}>
                {label}
              </a>
              <span className="absolute left-1/2 bottom-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-1/2"></span>
            </li>
          ))}
        </ul>

        {/* Conditional Rendering: Login/Register or Logout (Mobile) */}
        <div className="text-center mt-5 flex flex-col gap-5">
          {isLoggedIn ? (
            <>
              {Role === "student" && (
                <ul className="flex flex-col gap-5 text-center">
                  <li className="relative group list-style-none">
                    <a className="text-lg" href="/studentview">
                      ProjectPanel
                    </a>
                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                  </li>
                </ul>
              )}
              {Role === "faculty" && (
                <ul className="flex flex-col gap-5 text-center">
                  <li className="relative group">
                    <a className="text-lg" href="/fileupload">
                      IdeaUpload
                    </a>
                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                  </li>
                  <li className="relative group">
                    <a className="text-lg" href="/editDeletePublish">
                      ProjectManager
                    </a>
                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                  </li>
                </ul>
              )}
              {Prc_User && (
                <ul className="flex flex-col gap-5 text-center">
                  <li className="relative group list-style-none">
                    <a className="text-lg" href="/student-view">
                      ReviewBoard
                    </a>
                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                  </li>
                </ul>
              )}
              <button
                onClick={handleLogout}
                className="text-white px-3 py-1 bg-red-600 rounded-md hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                to="/login"
                className="text-white px-3 py-1 bg-blue-600 rounded-md hover:bg-blue-700 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-white px-3 py-1 bg-green-600 rounded-md hover:bg-green-700 transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NavBar;
