import React, { useEffect, useState } from 'react';
import Header from '../../partials/Header.js';
import { useParams } from 'react-router-dom';
import { FaDownload, FaArrowLeft } from 'react-icons/fa';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

function DownloadPdf() {
  const { token } = useParams();
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(token);
    if (stored) {
      setUrls(JSON.parse(stored));
    }
  }, [token]);

  const handleDownload = async () => {
    if (urls.length === 1) {
      const response = await fetch(urls[0]);
      const blob = await response.blob();
      saveAs(blob, 'converted_file.pdf');
    } else {
      const zip = new JSZip();
      for (let i = 0; i < urls.length; i++) {
        const res = await fetch(urls[i]);
        const blob = await res.blob();
        zip.file(`converted_file_${i + 1}.pdf`, blob);
      }
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "converted_pdfs.zip");
    }
  };

  return (
    <div className="content">
      <Header />
      <div className="download-section min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gray-50 mt-4 py-20">
        <h2 className="text-2xl font-semibold mb-4">WORD file(s) has been converted to PDF</h2>
        <div className="flex items-center ">
        	<span className="back-button"><a href="/word-to-pdf"><FaArrowLeft /></a></span>
	        {urls.length > 0 ? (
	        	
	          <button
	            className="flex items-center gap-2 bg-red-600 text-white px-8 py-8 rounded-lg font-semibold shadow-md hover:bg-red-700 transition"
	            onClick={handleDownload}
	          >
	            <FaDownload /> Download PDF{urls.length > 1 ? "s (ZIP)" : ""}
	          </button>
	        ) : (
	          <p>Invalid or expired token.</p>
	        )}
        </div>
      </div>
    </div>
  );
}

export default DownloadPdf;
