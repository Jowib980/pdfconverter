import React, { useState } from 'react';
import Header from '../../partials/Header.js';
import { FaGoogleDrive } from 'react-icons/fa';
import CompressedPDF from './CompressedPDF';
import { Helmet } from 'react-helmet-async';

function CompressPDF() {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    console.log("Selected files:", files);
  };

  return (
    <>

     <Helmet>
        <title>Compress PDF | My PDF Tools</title>
      </Helmet>

    <div className="content">
      <Header />

      {selectedFiles.length > 0 ? (
        <CompressedPDF files={selectedFiles} />
      ) : (
        <div className="upload-section min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center px-4">
          <h1 className="tool-title text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            Compress PDF file
          </h1>
          <h2 className="tool-subtitle text-gray-600 mb-6">
            Reduce file size while optimizing for maximal PDF quality.
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

    </>
  );
}

export default CompressPDF;
