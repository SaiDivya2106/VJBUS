import React from "react";
import { Link } from "react-router-dom"; // For internal navigation

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 pt-4">
      <div className="container mx-auto">
        <div className="row ">
          {/* Column 1: Website Title */}
          <div className="col-md-4 me-5">
            <h5>THRIVE</h5>
            <p>Your go-to platform for reporting and resolving campus issues.</p>
          </div>

         

          {/* Column 3: Contact Info */}
          <div className="col-md-4 mx-5">
            <h5>Contact Us</h5>
            <p>Feel free to reach out for any queries or support.</p>
            <ul className="list-unstyled">
              <li>Email:  postbox@vnrvjiet.ac.in</li>
              <li>Phone: 91-040-230427 58/59/60</li>
            </ul>
          </div>
        </div>
        <hr />
        <div className="text-center">
          <p>&copy; {new Date().getFullYear()} THRIVE. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
