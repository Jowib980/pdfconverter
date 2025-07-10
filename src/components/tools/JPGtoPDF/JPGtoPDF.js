import React, { useState, useEffect, useRef } from 'react';
import Header from '../../partials/Header.js';
import { FaGoogleDrive, FaArrowCircleRight, FaLaptop, FaDownload, FaTimesCircle, FaArrowLeft, FaCog } from 'react-icons/fa';
import Loader from '../../Loader.js';
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import Cookies from 'js-cookie';

function JPGtoPDF({ files = [] }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [conversionStatus, setConversionStatus] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionDone, setConversionDone] = useState(false);
  const [convertedUrls, setConvertedUrls] = useState([]);
  const token = uuidv4();
  const navigate = useNavigate();
  const userString = Cookies.get("user");
  const user = userString ? JSON.parse(userString) : null;
  const user_id = user?.id ?? null;
  const [error, setError] = useState(false);
  const PageOrientation = [
    { value: 'portrait', label: 'Portrait' },
    { value: 'landscape', label: 'Landscape' },
  ];
  const PageMargin = [
    { value: '0', label: 'No Margin' },
    { value: '4', label: 'Small' },
    { value: '6', label: 'Big' },
  ];
  const [pageOrientation, setPageOrientation] = useState('portrait');
  const [pageMargin, setPageMargin] = useState('0');
  const [merge, setMerge] = useState(true);
  const [mergePage, setMergePage] = useState(true);

  const canvasRefs = useRef({});
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    if (files.length) {
      setSelectedFiles(files);
    }
  }, [files]);

  useEffect(() => {
  selectedFiles.forEach((file, index) => {
    const canvas = canvasRefs.current[index];
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let canvasWidth = canvas.width;
        let canvasHeight = canvas.height;

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Margins (converted to px, e.g., 4 = 4%)
        const marginPercent = parseInt(pageMargin, 10);
        const marginX = (canvasWidth * marginPercent) / 100;
        const marginY = (canvasHeight * marginPercent) / 100;

        let drawWidth = canvasWidth - 2 * marginX;
        let drawHeight = canvasHeight - 2 * marginY;

        // Maintain aspect ratio
        const imgRatio = img.width / img.height;
        const canvasRatio = drawWidth / drawHeight;

        if (imgRatio > canvasRatio) {
          // image is wider
          drawHeight = drawWidth / imgRatio;
        } else {
          // image is taller
          drawWidth = drawHeight * imgRatio;
        }

        const dx = (canvasWidth - drawWidth) / 2;
        const dy = (canvasHeight - drawHeight) / 2;

        if (pageOrientation === 'landscape') {
          // rotate canvas for landscape
          canvas.width = 127;  // Height becomes width after rotation
          canvas.height = 180; // Width becomes height after rotation

          ctx.save();
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate(Math.PI / 2);  // Rotate 90 degrees clockwise
          ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
          ctx.restore();

        } else {
          // normal portrait
          canvas.width = 127;
          canvas.height = 180;
          ctx.drawImage(img, dx, dy, drawWidth, drawHeight);
        }
      };
      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  });
}, [selectedFiles, pageOrientation, pageMargin]);




  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...newFiles]);
    setConversionStatus((prev) => [...prev, ...new Array(newFiles.length).fill("⏳ Pending")]);
  };

const Convert = async () => {
  if (!selectedFiles.length) {
    alert("Please add at least one .doc/.docx file.");
    return;
  }

  setIsConverting(true);
  setConversionDone(false);

  const updatedStatus = new Array(selectedFiles.length).fill("Converting...");
  setConversionStatus(updatedStatus);

  const formData = new FormData();

  selectedFiles.forEach((file) => {
    formData.append("file[]", file);
  
  });

  formData.append('user_id', user_id);
  formData.append('orientation', pageOrientation);
  formData.append('margin', pageMargin);
  formData.append('merge', merge ? '1' : '0');
  formData.append('mergePage', mergePage ? '1' : '0');


  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}convert-jpg`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json(); 
    console.log(result.urls);

    if(result && result.urls && result.token) {
      setConversionStatus('Done');
      navigate(`/download/${result.token}`);
    } else {
      toast.error('Failed conversion, Please try agian later');
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
    <>
     <Helmet>
        <title>JPG to PDF | My PDF Tools</title>
      </Helmet>

    <div className="main">
       <ToastContainer />
       
      {error && (
        <div className="selected-section flex min-h-screen bg-gray-50">
          <div className="flex-1 flex justify-center items-center px-4">
            <a href="/">
              <button className="flex items-center gap-2 bg-red-600 text-white px-8 py-8 rounded-lg font-semibold shadow-md hover:bg-red-700 transition"><FaArrowLeft /> Go to Home</button>
            </a>
          </div>
        </div>
      )}

      {/* Selected Files Section */}
      {!isConverting && !conversionDone && (
        <>
        <div className="selected-section flex min-h-screen bg-gray-50">
          <div className="flex-1 flex flex-col justify-center items-center px-4 relative group">
            
            {!showSidebar && (
            <div className="sidetool absolute -top-4 -right-4 z-20">
              <div className="relative">
                <label className="relative cursor-pointer">
                  <div className="bg-red-500 text-white rounded-full w-10 h-10 text-xl font-semibold shadow-lg hover:bg-red-600 flex items-center justify-center">
                    +
                  </div>
                  <input
                    type="file"
                    accept=".jpg"
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
          )}
 
            <div className={`upload-extra absolute mt-2 right-0 ${showSidebar ? 'hide-menu' : 'group-hover:flex'} flex-col gap-2 z-10`}>
              <div className="relative">
                <label className="relative cursor-pointer">
                  <div className="flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-full hover:bg-red-600 transition" title="Upload from device">
                    <FaLaptop />
                  </div>
                  <input
                    type="file"
                    accept=".jpg"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

               <button
                className="sm:hidden bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-700"
                title="Settings"
                onClick={() => setShowSidebar(true)}
              >
                <FaCog />
              </button>

              {/*<button className="flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-full hover:bg-red-600 transition" title="Upload from Google Drive">
                <FaGoogleDrive />
              </button>*/}
            </div>
          

            <div className="flex flex-wrap justify-center gap-4 mt-6">
              {selectedFiles.map((file, index) => (
                 <div key={index} className="bg-white p-4 rounded-xl shadow-lg flex flex-col items-center w-40 relative group">
                  <button
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveFile(index)}
                    title="Remove file"
                  >
                    <FaTimesCircle />
                  </button>
                {/* image preview */}
                  <div className="file_canvas">
                  <canvas
                    width="127"
                    height="180"
                    className="jpg-image"
                    ref={(el) => (canvasRefs.current[index] = el)}
                  ></canvas>

                    
                  </div>
                  <p className="text-xs text-gray-700 mt-2 text-center break-words">{file.name}</p>
                  <p className="text-xs text-blue-500 mt-1">{conversionStatus[index]}</p>
                </div>
              ))}
            </div>
          </div>

        {/* sidebar */}
          <div
              className={`
                bg-white border-l border-gray-200 flex flex-col justify-between transition-transform duration-300 ease-in-out
                w-[300px] sm:w-[350px]
                fixed top-0 right-0 h-screen z-50
                ${showSidebar ? 'translate-x-0' : 'translate-x-full'}
                sm:relative sm:translate-x-0 sm:flex
              `}
            >
              {/* Close Button for Mobile */}
              <div className="sm:hidden p-4 flex justify-end">
                <button onClick={() => setShowSidebar(false)}>
                  <FaTimesCircle className="text-red-500 text-2xl" />
                </button>
              </div>
            {selectedFiles.length > 0 ? (
              <>
            <div className="p-6 text-center border-b">
              <h1 className="tool-heading text-xl font-semibold">Image to PDF options</h1>
            </div>

            <div className="p-6">
              <label className="inline-flex items-center font-semibold text-lg mb-2">Page Orientation</label>
                <div className="flex gap-2">
                  {PageOrientation.map(({ value, label }) => (
                    <label key={value} className="inline-flex items-center">
                      <input
                        type="radio"
                        name="page_orientation"
                        value={value}
                        checked={pageOrientation === value}
                        onChange={(e) => setPageOrientation(e.target.value)}
                        className="form-radio text-blue-600"
                      />
                      <span className="ml-2">{label}</span>
                    </label>
                  ))}
                </div>
            </div>

             <div className="p-6">
              <label className="inline-flex items-center font-semibold text-lg mb-2">Margin</label>
                <div className="flex gap-2">
                  {PageMargin.map(({ value, label }) => (
                    <label key={value} className="inline-flex items-center">
                      <input
                        type="radio"
                        name="page_margin"
                        value={value}
                        checked={pageMargin === value}
                        onChange={(e) => setPageMargin(e.target.value)}
                        className="form-radio text-blue-600"
                      />
                      <span className="ml-2">{label}</span>
                    </label>
                  ))}
                </div>
            </div>

              <div className="p-6">
                <div className="flex gap-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="merge_pdf"
                        checked={merge}
                        onChange={(e) => setMerge(e.target.checked)}
                        className="form-radio text-blue-600"
                      />
                      <span className="ml-2">Merge all images in one PDF file</span>
                    </label>
                </div>
            </div>

              <div className="p-6">
                <div className="flex gap-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="merge_page"
                        checked={mergePage}
                        onChange={(e) => setMergePage(e.target.checked)}
                        className="form-radio text-blue-600"
                      />
                      <span className="ml-2">Merge all images in one Page</span>
                    </label>
                </div>
            </div>
            <div className="p-6">
              <button
                className="flex justify-center w-full py-3 rounded-lg text-lg font-semibold shadow-md transition-all duration-300 bg-red-500 text-white"
                onClick={Convert}
              >
                <span className="convert-button">Convert to PDF</span>
                <span className="arrow-icon ml-2">
                  <FaArrowCircleRight />
                </span>
              </button>
            </div>
            </>
            ) : (
              <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-gray-500">
                {/* Background faded content (same as full sidebar with lower opacity) */}
                <div className="absolute inset-0 p-6 opacity-20 pointer-events-none">
                  <h1 className="text-xl font-semibold text-center tool-heading">JPG to PDF</h1>
                  <div className="mt-4 text-center  bg-sky-50 p-4 rounded text-sm">
                    Please, select more PDF files by clicking again on ‘Select PDF files’.<br />
                    Select multiple files by maintaining pressed ‘Ctrl’
                  </div>
                  
                </div>

                {/* Overlay arrow + message */}
                <div className="relative z-10 text-center text-white">
                  <p className="font-semibold text-sm mb-2">No file selected.</p>
                  <div className="flex justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="75" height="66" viewBox="0 0 150 132">
                      <path fill="white" d="M0,0 C0,18.75 28.125,56.25 93.75,56.25 L93.75,18.75 L150,75 L93.75,131.25 L93.75,93.75 C42.0594727,93.75 0,51.6905273 0,0 Z" transform="rotate(-180 75 66)" />
                    </svg>
                  </div>
                  <p className="mt-2 text-white text-sm">Please add a file to activate options</p>
                </div>
              </div>

            )}
          </div>
        </div>


        <div className={`selected-section flex bg-gray-50 p-6 mobile-button ${showSidebar ? 'hide-menu' : ''}`}>
          <button
            className="flex justify-center w-full py-3 rounded-lg text-lg font-semibold shadow-md transition-all duration-300 bg-red-500 text-white"
            onClick={Convert}
          >
            <span className="convert-button">JPG to PDF</span>
            <span className="arrow-icon ml-2">
              <FaArrowCircleRight />
            </span>
          </button>
        </div>
        
        </>
      )}

      {/* Conversion Loader Section */}
      {isConverting && (
        <div className="conversion-section min-h-screen bg-gray-50 mt-4 py-20 flex flex-col items-center justify-center">
        <h1 className="section-title">JPG file convert to PDF</h1>
          <h2 className="text-2xl font-semibold mb-4">Converting your JPG files...</h2>
          <Loader />
        </div>
      )}

      
    </div>
    </>
  );
}

export default JPGtoPDF;
