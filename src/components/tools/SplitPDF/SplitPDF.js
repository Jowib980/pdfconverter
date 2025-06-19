import React, { useState } from 'react';
import Header from '../../partials/Header.js';
import { FaGoogleDrive } from 'react-icons/fa';
import SplitGeneratedPDF from './SplitGeneratedPDF';

function SplitPDF() {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    console.log("Selected files:", files);
  };

  return (
    <div className="content">
      <Header />

      {selectedFiles.length > 0 ? (
        <SplitGeneratedPDF files={selectedFiles} />
      ) : (
        <div className="upload-section min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center px-4">
          <h1 className="tool-title text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            Split PDF file
          </h1>
          <h2 className="tool-subtitle text-gray-600 mb-6">
            Separate one page or a whole set for easy conversion into independent PDF files.
          </h2>

          <div className="flex items-center space-x-4 mb-2">
            <label className="bg-red-600 text-white px-8 py-4 rounded text-lg font-semibold cursor-pointer hover:bg-red-700 transition">
              Select PDF file
              <input
                type="file"
                accept=".pdf"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

        </div>
      )}
    </div>
  );
}

export default SplitPDF;
