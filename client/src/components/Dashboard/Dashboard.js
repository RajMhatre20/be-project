import React from "react";
import FileUpload from "./File Upload/FileUpload";
import SidePanel from "./Side Panel/SidePanel";
import "./Dashboard.css";

function Dashboard() {
  // Render file upload form and file list
  return (
    <div id="dashboard">
      <SidePanel />
      <FileUpload />
    </div>
  );
}

export default Dashboard;
