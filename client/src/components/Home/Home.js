import React from "react";
import Navbar from "../Navbar/Navbar";
import "./Home.css";
import Image from "../../images/landingpage.jpg";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="Home__content">
        <div className="Home__information">
          <div className="Home__tagline">Work Smarter with One Cloud</div>
          <div className="Home__tagline2">
            Store, share and access all your files in one platform.
          </div>
          <Link to="/register" className="Home__button">
            Get Started
          </Link>
        </div>
        <div className="Home__image">
          <img src={Image} alt="" />
        </div>
      </div>
    </>
  );
};

export default Home;
