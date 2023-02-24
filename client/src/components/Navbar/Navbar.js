import React from "react";
import { Link } from "react-router-dom";

import "./Navbar.css";
const Navbar = () => {
  return (
    <nav>
      <div className="logo">
        <Link to="/" className="Navbar_Header">
          <p>
            One <span>Cloud.</span>
          </p>
        </Link>
      </div>
      <div className="Navbar__navbar">
        <ul>
          <Link to="/" className="Navbar__li">
            Home
          </Link>
          <Link to="/features" className="Navbar__li">
            Features
          </Link>
          <Link to="/about" className="Navbar__li">
            About
          </Link>
        </ul>
      </div>
      <Link to="/Dashboard" className="Navbar__button">
        Login
      </Link>
    </nav>
  );
};

export default Navbar;
