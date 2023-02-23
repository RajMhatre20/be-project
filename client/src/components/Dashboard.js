import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import RequireAuth from "./RequireAuth";
import CryptoJS from "crypto-js";

const token = localStorage.getItem("token");
// console.log(token);

function Dashboard() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    // Fetch all files that belong to the user and store them in the state
    const fetchFiles = async () => {
      const response = await fetch(
        "http://localhost:5000/api/files/getmyfiles",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      setFiles(data.data);
    };
    fetchFiles();
  }, []);

  // Function to handle file selection
  function handleFileSelect(event) {
    setSelectedFile(event.target.files[0]);
  }

  //md5 algorithm to hash the file
  const calculateMD5 = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => {
        const fileWordArray = CryptoJS.lib.WordArray.create(reader.result);
        const hash = CryptoJS.MD5(fileWordArray);
        resolve(hash.toString());
      };
      reader.onerror = reject;
    });
  };

  // Function to handle file upload
  async function handleFileUpload(event) {
    event.preventDefault();

    const hashValue = await calculateMD5(selectedFile);
    const formData = new FormData();

    formData.append("file", selectedFile);
    formData.append("hashValue", hashValue);

    const response = await fetch("http://localhost:5000/api/files/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });
    console.log(response);
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      setFiles((prevFiles) => [...prevFiles, data.data]);
    } else {
      console.error("Failed to upload file");
    }
  }

  // Function to handle file download
  async function handleFileDownload(fileId) {
    const response = await fetch(
      `http://localhost:5000/api/files/${fileId}/download`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const rsp = await fetch(`http://localhost:5000/api/files/${fileId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await rsp.json();
    console.log(data);
    if (response.ok && rsp.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data.data.fileName}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      console.error("Failed to download file");
    }
  }

  // Function to handle file deletion
  async function handleFileDelete(fileId) {
    const response = await fetch(`http://localhost:5000/api/files/${fileId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.ok) {
      setFiles((prevFiles) => prevFiles.filter((file) => file._id !== fileId));
    } else {
      console.error("Failed to delete file");
    }
  }

  //logout
  const navigate = useNavigate();
  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  // Render file upload form and file list
  return (
    <>
      <div>
        <h2>Upload File</h2>
        <form onSubmit={handleFileUpload}>
          <input type="file" name="file" onChange={handleFileSelect} />
          <button type="submit">Upload</button>
        </form>

        <h2>Files</h2>
        <ul>
          {files.map((file) => (
            <li key={file._id}>
              {file.fileName}
              <button onClick={() => handleFileDownload(file._id)}>
                Download
              </button>
              <button onClick={() => handleFileDelete(file._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      <button onClick={logout}>Logout</button>
    </>
  );
}

export default Dashboard;
