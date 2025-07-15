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
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import Cookies from 'js-cookie';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

function MergedPDF({ files = [] }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [conversionStatus, setConversionStatus] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionDone, setConversionDone] = useState(false);
  const [convertedUrls, setConvertedUrls] = useState([]);
  const token = uuidv4();
  const navigate = useNavigate();
  const userString = Cookies.get("current_user");
  const user = userString ? JSON.parse(userString) : null;
  const user_id = user?.id ?? null;
  const [error, setError] = useState(false);

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
    if (canvas) {
      renderPdfThumbnail(file, canvas);
    }
  });
}, [selectedFiles]);


  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...newFiles]);
    setConversionStatus((prev) => [...prev, ...new Array(newFiles.length).fill("⏳ Pending")]);
  };


const renderPdfThumbnail = async (file, canvas) => {
  if (!file || !canvas) return;

  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

  const fileReader = new FileReader();

  fileReader.onload = async function () {
    const typedarray = new Uint8Array(this.result);

    try {
      const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
      const page = await pdf.getPage(1); // Only first page

      const viewport = page.getViewport({ scale: 0.5 });

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderContext = {
        canvasContext: context,
        viewport,
      };

      const renderTask = page.render(renderContext);
      await renderTask.promise;
    } catch (error) {
      console.error("Failed to render PDF preview", error);
    }
  };

  fileReader.readAsArrayBuffer(file);
};



  const Convert = async () => {
    if (selectedFiles.length < 2) {
      toast.error("Please add atleast two files.");
      return;
    }

    setIsConverting(true);
    setConversionDone(false);

    const updatedStatus = new Array(selectedFiles.length).fill("Converting...");
    setConversionStatus(updatedStatus);

    const formData = new FormData();

    selectedFiles.forEach((file) => {
      formData.append("pdf_files[]", file);
    });

    formData.append('user_id', user_id);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}merge`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log(result.token);

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
  <>
    <Helmet>
      <title>Merge PDF | My PDF Tools</title>
    </Helmet>

    <div className="main">
      <ToastContainer />

      {/* Error State */}
      {error && (
        <div className="selected-section flex min-h-screen bg-gray-50">
          <div className="flex-1 flex justify-center items-center px-4">
            <a href="/">
              <button className="flex items-center gap-2 bg-red-600 text-white px-8 py-8 rounded-lg font-semibold shadow-md hover:bg-red-700 transition">
                <FaArrowLeft /> Go to Home
              </button>
            </a>
          </div>
        </div>
      )}

      {/* File Selection + Preview */}
      {!isConverting && !conversionDone && (
        <>
        <div className="selected-section flex min-h-screen bg-gray-50">
          {/* Left Section */}
          <div className="flex-1 flex flex-col justify-center items-center px-4 relative group">
            {!showSidebar && (
            <div className="sidetool absolute -top-4 -right-4 z-20">
              <div className="relative">
                <label className="relative cursor-pointer">
                  <div className="bg-red-500 text-white rounded-full w-10 h-10 text-xl font-semibold shadow-lg hover:bg-red-600 flex items-center justify-center">+</div>
                  <input type="file" accept=".pdf" multiple className="hidden" onChange={handleFileChange} />
                </label>
                <span className="file-count absolute -top-2 -left-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {selectedFiles.length}
                </span>
              </div>
            </div>

            )}

            {/* Upload Extra (Laptop & Drive) */}
            <div className={`upload-extra absolute mt-2 right-0 ${showSidebar ? 'hide-menu' : 'group-hover:flex'} flex-col gap-2 z-10`}>
              <div className="relative">
                <label className="relative cursor-pointer">
                  <div className="flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-full hover:bg-red-600 transition" title="Upload from device">
                    <FaLaptop />
                  </div>
                  <input type="file" accept=".pdf" multiple className="hidden" onChange={handleFileChange} />
                </label>
              </div>

               <button
                className="sm:hidden bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-700"
                title="Settings"
                onClick={() => setShowSidebar(true)}
              >
                <FaCog />
              </button>
              {/* <button className="flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-full hover:bg-red-600 transition" title="Upload from Google Drive">
                <FaGoogleDrive />
              </button> 
            */}
            </div>

            {/* PDF Previews */}
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
                  <div className="file_canvas">
                   
                  <>
                   {renderPdfThumbnail ? (

                  <canvas
                    ref={(ref) => {
                      if (ref) {
                        canvasRefs.current[index] = ref;
                      }
                    }}
                    className="w-full border"
                  />

                    ): (
                     <canvas width="127" height="180" className="pdf"></canvas>

                    )}
                   
                  </>
                  </div>

                  <p className="text-xs text-gray-700 mt-2 text-center break-words">{file.name}</p>
                  <p className="text-xs text-blue-500 mt-1">{conversionStatus[index]}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
            <div
              className={`
                bg-white border-l border-gray-200 flex flex-col justify-between transition-transform duration-300 ease-in-out
                w-[300px] sm:w-[350px]
                fixed top-0 right-0 h-screen z-50
                ${showSidebar ? 'translate-x-0 z-[1050]' : 'translate-x-full'}
                sm:relative sm:translate-x-0 sm:flex
                scrollbar-red overflow-y-auto max-h-screen
              `}
            >
              
            {selectedFiles.length > 0 ? (
              <>
                <div className="flex justify-between p-6 text-center border-b">
                  <h1 className="tool-heading text-xl font-semibold">Merge PDF</h1>

                  <div className="sm:hidden p-4 flex justify-end">
                    <button onClick={() => setShowSidebar(false)}>
                      <FaTimesCircle className="text-red-500 text-2xl" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="option__panel__content">
                    <div className="info multiple bg-sky-100 p-4 rounded text-sm text-gray-600">
                      Please, select more PDF files by clicking again on ‘Select PDF files’.<br />
                      Select multiple files by maintaining pressed ‘Ctrl’
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <button
                    className="flex justify-center w-full bg-red-600 text-white py-3 px-3 rounded-lg text-lg font-semibold shadow-md hover:bg-red-700 transition-all duration-300"
                    onClick={Convert}
                  >
                    <span className="convert-button">Merge PDF</span>
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
                  <h1 className="text-xl font-semibold text-center tool-heading">Merge PDF</h1>
                  <div className="mt-4 text-center  bg-sky-50 p-4 rounded text-sm">
                    Please, select more PDF files by clicking again on ‘Select PDF files’.<br />
                    Select multiple files by maintaining pressed ‘Ctrl’
                  </div>
                  
                </div>

                {/* Overlay arrow + message */}
                <div className="relative z-10 text-center text-white">
                  <div className="sm:hidden p-4 flex justify-center">
                    <button onClick={() => setShowSidebar(false)}>
                      <FaTimesCircle className="text-white text-4xl" />
                    </button>
                  </div>
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
            <span className="convert-button">Merge PDF</span>
            <span className="arrow-icon ml-2">
              <FaArrowCircleRight />
            </span>
          </button>
        </div>
        
        </>
      )}

      {/* Loading State */}
      {isConverting && (
        <div className="conversion-section min-h-screen bg-gray-50 mt-4 py-20 flex flex-col items-center justify-center">
          <h1 className="section-title">Merge PDF</h1>
          <h2 className="text-2xl font-semibold mb-4">Merging PDF files...</h2>
          <Loader />
        </div>
      )}
    </div>
  </>
);

}

export default MergedPDF;
