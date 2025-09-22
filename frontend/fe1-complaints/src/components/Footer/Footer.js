import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Column 1: Website Title */}
        <div className="footer-column">
          <h5>THRIVE</h5>
          <p>Your go-to platform for reporting and resolving campus issues.</p>
        </div>

        {/* Column 2: Contact Info */}
        <div className="footer-column">
          <h5>Contact Us</h5>
          <p>Feel free to reach out for any queries or support.</p>
          <ul>
            <li>
              Email:{" "}
              <span className="highlight">
                administrativeofficer@vnrvjiet.in
              </span>
            </li>
            <li>Phone: +91-90471-11965</li>
          </ul>
        </div>
      </div>

      <hr className="footer-divider" />

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} THRIVE. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
