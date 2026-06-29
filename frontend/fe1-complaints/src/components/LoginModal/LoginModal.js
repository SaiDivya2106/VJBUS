import React, { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext"; // Adjust path if needed

const LoginModal = ({ isOpen, onClose }) => {
  const { loginWithSSO } = useAuth();
  const googleButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !window.google || !googleButtonRef.current) return;

    window.google.accounts.id.initialize({
      client_id: "522460567146-ubk3ojomopil8f68hl73jt1pj0jbbm68.apps.googleusercontent.com",
      callback: (response) => {
        loginWithSSO(response);
        onClose(); // Close modal after login
      },
      ux_mode: "popup",
      hosted_domain: "vnrvjiet.in", // optional: restrict to your domain
    });

    window.google.accounts.id.renderButton(googleButtonRef.current, {
      theme: "outline",
      size: "large",
    });
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content text-center">
        <h4 className="mb-4">Login with Google</h4>
        <div ref={googleButtonRef}></div>
        <button className="btn btn-danger mt-4" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default LoginModal;
