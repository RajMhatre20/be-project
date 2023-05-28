import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { FaPlus, FaDownload, FaTrash, FaFile } from "react-icons/fa";
import "./FileUpload.css";
import JSZip from 'jszip';



function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    // Fetch all files that belong to the user and store them in the state
    const fetchFiles = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/files/getmyfiles`,
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
    if (event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      document.getElementById("file").value = "";
    }
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

  //Function to compress file
  const compressFile = async (file) => {
    const zip = new JSZip();
    zip.file(file.name, file);
    const options = {
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 5,
      },
    };
    const compressedBlob = await zip.generateAsync(options);
    const compressedFile = new File([compressedBlob], `${file.name}.zip`, { type: 'application/zip' });
    return compressedFile;
  };

  // Function to handle file upload
  async function handleFileUpload() {
    const t= await compressFile(selectedFile);
    const hashValue = await calculateMD5(selectedFile);
    const formData = new FormData();
    formData.append("file", t);
    formData.append("hashValue", hashValue);
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/files/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });
    if (response.ok) {
      const data = await response.json();
      if(data.exists && files.find(o=>o.hashValue===hashValue)){
        console.log("File already exists");
        SetFileExists(true);
      }
      else{
        setFiles((prevFiles) => [...prevFiles, data.data]);
      }
    }  else {
      console.error("Failed to upload file");
    }
  }

  //Pop up Function
  const [fileExists,SetFileExists]=useState(false);
  const ShowPopup=()=>{
    useEffect(()=>{
      setTimeout(function() {
        SetFileExists(false)
           }, 3000);
         },
     [])
        
    return(
      <>
         {fileExists?<div className="popup">File Already Exist</div>:<></>} 
      </>
    )
  }


const decompressBlob = async (blob) => {
  const zip = new JSZip();
  const zipFile = await zip.loadAsync(blob);
  const files = Object.values(zipFile.files);
  const extractedFiles = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileData = await file.async('blob');
    extractedFiles.push(new File([fileData], file.name, { type: file.comment }));
  }

  return extractedFiles;
};

  // Function to handle file download
  async function handleFileDownload(fileId) {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/files/${fileId}/download`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.ok) {
      const blob = await response.blob();
      const file=await decompressBlob(blob);
      const url = window.URL.createObjectURL(file[0]);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${file[0].name}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      console.error("Failed to download file");
    }
  }

  // Function to handle file deletion
  async function handleFileDelete(fileId) {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/files/${fileId}`, {
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
  useEffect(() => {
    if (selectedFile) {
      handleFileUpload();
    }
    setSelectedFile(null);
  }, [selectedFile]);

  function humanFileSize(size) {
    var i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    return (
      (size / Math.pow(1024, i)).toFixed(2) * 1 +
      " " +
      ["B", "kB", "MB", "GB", "TB"][i]
    );
  }
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

              <label htmlFor="file" className="label1">
                <FaPlus />
              </label>
              <label htmlFor="file" className="label2">
                Add a file
              </label>
            </div>
            {/* <button type="submit">Upload</button> */}
          </form>
        </div>

        <ul className="file-wrapper">
          {files.map((file) => (
            <div className="file-card" key={file._id}>
              <div className="top-section">
                <button onClick={() => handleFileDownload(file._id)}>
                  <FaDownload size={30} />
                </button>
                <FaFile size={230} className="file-bg" />
                <h3>{file.fileName.slice(0,-4)}</h3>
              </div>
              
              
              <div className="bottom-section">
                <h5>{humanFileSize(file.fileSize)}</h5>
                <button onClick={() => handleFileDelete(file._id)}>
                  <FaTrash size={30} />
                </button>
              </div>
            </div>
          ))}
        </ul>
      </div>
      <ShowPopup/>
    </>
  );
}

export default FileUpload;
