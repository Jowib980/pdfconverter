import React, { useState } from 'react';
import Header from '../../partials/Header.js';
import { FaGoogleDrive } from 'react-icons/fa';
import RotateGeneratedPDF from './RotateGeneratedPDF';
import { Helmet } from 'react-helmet-async';

function RotatePDF() {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    console.log("Selected files:", files);
  };

  return (
    <>

     <Helmet>
        <title>Rotate PDF | My PDF Tools</title>
      </Helmet>

    <div className="content">
      <Header />

      {selectedFiles.length > 0 ? (
        <RotateGeneratedPDF files={selectedFiles} />
      ) : (
        <div className="upload-section min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center px-4">
          <h1 className="tool-title text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            Rotate PDF file
          </h1>
          <h2 className="tool-subtitle text-gray-600 mb-6">
            Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!
          </h2>

          <div className="flex items-center space-x-4 mb-2">
            <label className="bg-red-600 text-white px-8 py-4 rounded text-lg font-semibold cursor-pointer hover:bg-red-700 transition">
              Select PDF files
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

export default RotatePDF;
