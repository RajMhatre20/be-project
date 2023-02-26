import React from "react";
// import { Navigate, useNavigate } from "react-router-dom";
// import RequireAuth from "../RequireAuth";
// import CryptoJS from "crypto-js";
import FileUpload from "./File Upload/FileUpload";
import SidePanel from "./Side Panel/SidePanel";
import "./Dashboard.css";

const token = localStorage.getItem("token");
// console.log(token);

function Dashboard() {
  // Render file upload form and file list
  return (
    <div div id="dashboard">
      <SidePanel />
      <FileUpload />
    </div>
  );
}

export default Dashboard;
