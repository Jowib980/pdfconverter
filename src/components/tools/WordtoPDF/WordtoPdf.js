import React, { useState, useEffect } from 'react';
import Header from '../../partials/Header.js';
import { FaGoogleDrive, FaArrowCircleRight, FaLaptop } from 'react-icons/fa';

function WordtoPdf({ files = [] }) {
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Initialize with files from props
  useEffect(() => {
    if (files.length) {
      setSelectedFiles(files);
    }
  }, [files]);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  return (
    <div className="content">
      <Header />
      <div className="selected-section flex min-h-screen bg-gray-50 mt-4 py-6">
        {/* Left Section - File Preview */}
        <div className="flex-1 flex flex-col justify-center items-center px-4 relative group">
          {/* Floating Add Button */}
          <div className="sidetool absolute -top-4 -right-4 z-20">
            <div className="relative">
              <label className="relative cursor-pointer">
                <div className="bg-red-500 text-white rounded-full w-10 h-10 text-xl font-semibold shadow-lg hover:bg-red-600 flex items-center justify-center">
                  +
                </div>
                <input
                  type="file"
                  accept=".doc,.docx"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>

              {/* File count */}
              <span className="file-count absolute -top-2 -left-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {selectedFiles.length}
              </span>
            </div>
          </div>

          {/* Upload Dropdown */}
          <div className="upload-extra absolute mt-2 right-0 hidden group-hover:flex flex-col gap-2 z-10">
            <div className="relative">
              <label className="relative cursor-pointer">
              <div
                className="flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                title="Upload from device"
              >
                <FaLaptop />
              </div>
              <input
                  type="file"
                  accept=".doc,.docx"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            <button
              className="flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
              title="Upload from Google Drive"
            >
              <FaGoogleDrive />
            </button>
          </div>

          {/* File Previews */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-xl shadow-lg flex flex-col items-center w-40"
              >
                
	            <div className="file_canvas">
		             <canvas id="cover-o_1iu0oi0uc5bpp87siv14l91uf2b" width="127" height="180" class="docx docx  word docx"></canvas>
	            </div>
                <p className="text-xs text-gray-700 mt-2 text-center break-words">
                  {file.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section - Convert Panel */}
        <div className="w-[350px] bg-white border-l border-gray-200 flex flex-col justify-between">
          <div className="p-6 text-center border-b">
            <h1 className="tool-heading text-xl font-semibold">Word to PDF</h1>
          </div>
          <div className="p-6">
            <button className="flex justify-center w-full bg-red-600 text-white py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-red-700 transition-all duration-300">
              <span className="convert-button">Convert to PDF</span>
              <span className="arrow-icon ml-2">
                <FaArrowCircleRight />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WordtoPdf;
