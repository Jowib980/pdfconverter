import React, { useState } from 'react';
import Header from '../../partials/Header.js';
import { FaGoogleDrive } from 'react-icons/fa';
import JPGtoPDF from './JPGtoPDF';
import { Helmet } from 'react-helmet-async';

function JpgFile() {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    // console.log("Selected files:", files);
  };

  return (
    <>

      <Helmet>
        <title>JPG to PDF | My PDF Tools</title>
      </Helmet>


    <div className="content">
      <Header />

      {selectedFiles.length > 0 ? (
        <JPGtoPDF files={selectedFiles} />
      ) : (
        <div className="upload-section min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center px-4">
          <h1 className="tool-title text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            JPG to PDF
          </h1>
          <h2 className="tool-subtitle text-gray-600 mb-6">
            Convert JPG images to PDF in seconds. Easily adjust orientation and margins.
          </h2>

          <div className="flex items-center space-x-4 mb-2">
            <label className="bg-red-600 text-white px-8 py-4 rounded text-lg font-semibold cursor-pointer hover:bg-red-700 transition">
              Select JPG images
              <input
                type="file"
                accept=".jpg"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {/* <button className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition">
              <FaGoogleDrive />
            </button>
            */}
          </div>

           
        </div>
      )}
    </div>

    </>
  );
}

export default JpgFile;
