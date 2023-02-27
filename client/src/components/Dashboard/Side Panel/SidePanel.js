import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaFile,
  FaFolder,
  FaFolderMinus,
  FaFolderPlus,
  FaStar,
  FaTrash,
} from "react-icons/fa";
import "./SidePanel.css";

function SidePanel() {
  const sidePanelList = [
    {
      title: "My Cloud",
      href: "/my-cloud",
      icon: <FaFolder />,
    },
    {
      title: "Shared",
      href: "/shared",
      icon: <FaFolderPlus />,
    },
    {
      title: "All Files",
      href: "/all-files",
      icon: <FaFile />,
    },
    {
      title: "Favourites",
      href: "/favourites",
      icon: <FaStar />,
    },
    {
      title: "Private Files",
      href: "/private-files",
      icon: <FaFolderMinus />,
    },
    {
      title: "Deleted Files",
      href: "/deleted-files",
      icon: <FaTrash />,
    },
  ];

  const sidePanelList2 = [
    {
      title: "Help & Support",
      href: "javascript:;",
      icon: <FaFolder />,
    },
    {
      title: "Log out",
      href: "javascript:;",
      icon: <FaFolderPlus />,
    },
  ];

  //logout
  const navigate = useNavigate();
  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }
  return (
    <div id="side-panel">
      <div className="sidepanel__header">
        <div className="logo">
          <Link to="/" className="Navbar_Header">
            <p style={{ color: "#ddd" }}>
              One <span>Cloud.</span>
            </p>
          </Link>
        </div>
      </div>
      <ul className="tabs">
        {sidePanelList.map((e) => {
          return (
            <a href="#" className="list-item">
              <div className="list-icon">{e.icon}</div>
              <li className="list-text" key={e.title}>
                {e.title}
              </li>
            </a>
          );
        })}
      </ul>
      <ul className="tabs">
        {sidePanelList2.map((e) => {
          return (
            <a
              href={e.href}
              className="list-item"
              onClick={e.title === "Log out" && logout}
            >
              <div className="list-icon">{e.icon}</div>
              <li className="list-text" key={e.title}>
                {e.title}
              </li>
            </a>
          );
        })}
      </ul>
    </div>
  );
}

export default SidePanel;
