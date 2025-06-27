import React, { useEffect, useState } from 'react';
import Header from '../../partials/Header.js';
import { useParams } from 'react-router-dom';
import { FaDownload, FaArrowLeft } from 'react-icons/fa';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { Helmet } from 'react-helmet-async';

function DownloadPdf() {
  const [urls, setUrls] = useState([]);
  const { token } = useParams();


  useEffect(() => {
  fetch(`${process.env.REACT_APP_BACKEND_API_URL}fetch-download/${token}`)
    .then(res => res.json())
    .then(data => {
      if (data && data.urls) setUrls(data.urls);
      else setUrls([]);
    });
}, [token]);



  const handleDownload = () => {
    const downloadUrl = `${process.env.REACT_APP_BACKEND_API_URL}download-file/${token}`;
    window.location.href = downloadUrl;
  };

  const Back = () => {
    window.history.back();
  }

  return (
    <>
     <Helmet>
        <title>Download PDF | My PDF Tools</title>
      </Helmet>

    <div className="content">
      <Header />
      <div className="download-section min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gray-50 mt-4 py-20">
        <h2 className="text-2xl font-semibold mb-4">Your file has been ready to download..</h2>
        <div className="flex items-center ">
        	<span className="back-button" onClick={Back}><FaArrowLeft /></span>
	        {urls.length > 0 ? (
	        	
	          <button
	            className="flex items-center gap-2 bg-red-600 text-white px-8 py-8 rounded-lg font-semibold shadow-md hover:bg-red-700 transition"
	            onClick={handleDownload}
	          >
	            <FaDownload /> Download PDF{urls.length > 1 ? "s (ZIP)" : ""}
	          </button>
	        ) : (
	          <p className="text-red-600 font-semibold">This download link has expired.</p>
	        )}
        </div>
      </div>
    </div>

    </>
  );
}

export default DownloadPdf;
