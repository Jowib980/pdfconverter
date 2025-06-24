import React, { useState, useEffect } from 'react';
import Header from '../../partials/Header.js';
import { FaGoogleDrive, FaArrowCircleRight, FaLaptop, FaDownload, FaCheck, FaTimesCircle } from 'react-icons/fa';
import Loader from '../../Loader.js';
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

function CompressedPDF({ files = [] }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [conversionStatus, setConversionStatus] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionDone, setConversionDone] = useState(false);
  const [convertedUrls, setConvertedUrls] = useState([]);
  const token = uuidv4();
  const navigate = useNavigate();
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const user_id = user?.id ?? null;
  const [error, setError] = useState(false);

  useEffect(() => {
    if (files.length) {
      setSelectedFiles(files);
    }
  }, [files]);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...newFiles]);
    setConversionStatus((prev) => [...prev, ...new Array(newFiles.length).fill("⏳ Pending")]);
  };

  const Convert = async () => {
    if (!selectedFiles.length) {
      alert("Please add at least one .html file.");
      return;
    }

    setIsConverting(true);
    setConversionDone(false);

    const updatedStatus = new Array(selectedFiles.length).fill("Converting...");
    setConversionStatus(updatedStatus);

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("pdf_file", file);
    });

    formData.append('user_id', user_id);


    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}compress-pdf`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result && result.token) {
        setConversionStatus('Done');
        navigate(`/download/${result.token}`);
      } else {
        setConversionStatus(selectedFiles.map(() => "❌ Failed"));
        toast.error('Failed conversion, Please try agian later');
        setError(true);
      }
    } catch (error) {
      setConversionStatus(selectedFiles.map(() => "❌ Error"));
      toast.error('Failed conversion, Please try agian later');
      setError(true);
    }

    setIsConverting(false);
    setConversionDone(true);

  };

const handleRemoveFile = (indexToRemove) => {
  setSelectedFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
  setConversionStatus((prev) => prev.filter((_, i) => i !== indexToRemove));
};



  return (
    <div className="content">
      <Header />

      <ToastContainer />

      {error && (
        <div className="selected-section flex min-h-screen bg-gray-50 mt-4 py-6">
          <div className="flex-1 flex justify-center items-center px-4">
            <a href="/">
              <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-4 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Go to Home</button>
            </a>
          </div>
        </div>
      )}

      {/* Selected Files Section */}
      {!isConverting && !conversionDone && (
        <div className="selected-section flex min-h-screen bg-gray-50 mt-4 py-6">
          <div className="flex-1 flex flex-col justify-center items-center px-4 relative group">
            <div className="sidetool absolute -top-4 -right-4 z-20">
              <div className="relative">
                <label className="relative cursor-pointer">
                  <div className="bg-red-500 text-white rounded-full w-10 h-10 text-xl font-semibold shadow-lg hover:bg-red-600 flex items-center justify-center">
                    +
                  </div>
                  <input
                    type="file"
                    accept=".pdf"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                <span className="file-count absolute -top-2 -left-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {selectedFiles.length}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mt-6">
              {selectedFiles.map((file, index) => (
                <div key={index} 
                  className="bg-white p-4 rounded-xl shadow-lg flex flex-col items-center w-40 relative group"
                   title={`Size: ${(file.size / 1024).toFixed(2)} KB`}
                  >
                  <button
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveFile(index)}
                    title="Remove file"
                  >
                    <FaTimesCircle />
                  </button>
                  <div className="file_canvas">
                    <canvas width="127" height="180" className="pdf"></canvas>
                  </div>
                  <p className="text-xs text-gray-700 mt-2 text-center break-words">{file.name}</p>
                  <p className="text-xs text-blue-500 mt-1">{conversionStatus[index]}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="w-[350px] bg-white border-l border-gray-200 flex flex-col justify-between">
            <div className="p-6 text-center border-b">
              <h1 className="tool-heading text-xl font-semibold">Compress PDF</h1>
            </div>
            
            <div className="p-6">
              <button
                className="flex justify-center w-full bg-red-600 text-white py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-red-700 transition-all duration-300"
                onClick={Convert}
              >
                <span className="convert-button">Compress PDF</span>
                <span className="arrow-icon ml-2">
                  <FaArrowCircleRight />
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Conversion Loader Section */}
      {isConverting && (
        <div className="conversion-section min-h-screen bg-gray-50 mt-4 py-20 flex flex-col items-center justify-center">
        <h1 className="section-title">Split PDF</h1>
          <h2 className="text-2xl font-semibold mb-4">Spliting PDF file...</h2>
          <Loader />
        </div>
      )}

    </div>
  );
}

export default CompressedPDF;
