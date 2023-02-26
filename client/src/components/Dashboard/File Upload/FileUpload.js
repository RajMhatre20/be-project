import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import { FaPlus } from "react-icons/fa";
import "./FileUpload.css";

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);
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
    console.log(fileUploaded);
    setSelectedFile(event.target.files[0]);
    setFileUploaded(!fileUploaded);
    console.log(fileUploaded);
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
    // event.preventDefault();

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

  useEffect(() => {
    handleFileUpload();
  }, [fileUploaded]);

  return (
    <>
      <div id="file-upload">
        <div className="navbar">
          <form onSubmit={handleFileUpload} className="form">
            <div className="add-a-file">
              <input
                type="file"
                id="file"
                name="file"
                className="add-file"
                onChange={handleFileSelect}
              />

              <label for="file" className="label1">
                <FaPlus />
              </label>
              <label for="file" className="label2">
                Add a file
              </label>
            </div>
            {/* <button type="submit">Upload</button> */}
          </form>
        </div>

        <h2>Upload File</h2>

        <h2>Files</h2>
        <ul>
          {files.map((file) => (
            <div className="file-card">
              <li key={file._id} className="list-item">
                {file.fileName}
                <button onClick={() => handleFileDownload(file._id)}>
                  Download
                </button>
                <button onClick={() => handleFileDelete(file._id)}>
                  Delete
                </button>
              </li>
            </div>
          ))}
        </ul>
      </div>
    </>
  );
}

export default FileUpload;
