import React, { useState, useEffect, useRef } from 'react';
import Header from '../../partials/Header.js';
import { FaGoogleDrive, FaArrowCircleRight, FaLaptop, FaDownload, FaTimesCircle, FaTrash, FaArrowLeft, FaCog } from 'react-icons/fa';
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
import SignupModal from '../../auth/SignupModal';
import LoginModal from '../../auth/LoginModal';
import { useConfig } from '../../../ConfigContext';
import PaymentModal from '../../auth/PaymentModal';
import FileLimitPrompt from '../../auth/FileLimitPrompt';
import VerifyOtpModal from '../../auth/VerifyOtpModal';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;


function AddWatermark({ files = [] }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [conversionStatus, setConversionStatus] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionDone, setConversionDone] = useState(false);
  const [convertedUrls, setConvertedUrls] = useState([]);
  const token = uuidv4();
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  
  const userString = Cookies.get("current_user");
  const user = userString ? JSON.parse(userString) : null;
  const user_id = user?.id ?? null;
  const access_token = Cookies.get("access_token");
  const watermarkOptions = [
    { value: 'text', label: 'Place Text' },
    { value: 'image', label: 'Place Image' },
  ];

  const [watermark, setWatermark] = useState('text');
  const [watermarkPosition, setWatermarkPosition] = useState('text');
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [isMosaic, setIsMosaic] = useState(null);
  const [selectedTransparency, setSelectedTransparency] = useState('0');
  const [selectedRotation, setSelectedRotation] = useState('0');
  const [selectedLayer, setSelectedLayer] = useState('over');
  const [showSidebar, setShowSidebar] = useState(false);

  const canvasRefs = useRef({});
  const [formdata, setFormdata] = useState({
    watermark_text: '',
    watermark_image: '',
  });

  const [showModal, setShowModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showFileLimitPrompt, setShowFileLimitPrompt] = useState(false);
  const [form, setForm] = useState({
      name: '',
      email: '',
      password: '',
      confirm_password: '',
    });
  const context = useConfig();
  const login = context?.login;
  const register = context?.register;
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");


  useEffect(() => {

    if(context?.currentUser?.message === "Invalid or expired token") {
      toast.error("Expired session. Please login to continue");
      navigate('/login');
    }

    if (files.length) {
      setSelectedFiles(files);

      if (files.length > 2 && !access_token) {
        setShowModal(true);
        setShowPaymentModal(false);
      }

      if (files.length > 2 && access_token) {
        let currentUserDetails = context?.currentUser;

        // Fallback to cookie if context is empty or invalid
        if (!currentUserDetails || typeof currentUserDetails !== 'object' || Array.isArray(currentUserDetails) || Object.keys(currentUserDetails).length === 0) {
          try {
            const cookieUser = Cookies.get('current_user');
            console.log("Raw cookie:", cookieUser);

            if (cookieUser) {
              const parsed = JSON.parse(decodeURIComponent(cookieUser));

              // Check if it's a non-empty object
              if (
                parsed &&
                typeof parsed === 'object' &&
                !Array.isArray(parsed) &&
                Object.keys(parsed).length > 0
              ) {
                currentUserDetails = parsed;
              } else {
                currentUserDetails = null;
              }
            }
          } catch (error) {
            console.error("Error parsing current_user from cookies:", error);
            currentUserDetails = null;
          }
        }

        const paymentDetails = currentUserDetails?.payment_details;
        const convertedCount = currentUserDetails?.converted_documents_count;

        if (!paymentDetails || paymentDetails.length === 0) {
          setShowPaymentModal(true);
        } else {
          const latestPayment = [...paymentDetails].sort(
            (a, b) => new Date(b.payment_date) - new Date(a.payment_date)
          )[0];

          if(latestPayment?.plan_type === 'Free') {
            if(convertedCount >= 10) {
              toast.error("You have reached the monthly limit for Free plan. Please upgrade");
              setTimeout(() => {
                navigate('/plans');
              }, 5000);
            } else {
              setShowPaymentModal(true);
            }
          } else if(latestPayment?.plan_type === 'Standard' && latestPayment?.transaction_status === 'completed') {
            if(convertedCount >= 100) {
              toast.error("You have reached the monthly limit for Standard plan. Please upgrade");
              setTimeout(() => {
                navigate('/plans');
              }, 5000);
            } else {
              setShowPaymentModal(true);
            }
          } else {
            setShowPaymentModal(false);
          }
        }
      }

    }
  }, [files, access_token]);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);

    const totalFiles = selectedFiles.length + newFiles.length;

    // If total exceeds 1 and user not logged in, block and show modal
    if (totalFiles > 2 && !access_token) {
      setShowModal(true);
      return;
    }

      if (totalFiles > 2 && access_token) {
        let currentUserDetails = context?.currentUser;

          // Fallback to cookie if context is empty or invalid
          if (!currentUserDetails || typeof currentUserDetails !== 'object' || Array.isArray(currentUserDetails) || Object.keys(currentUserDetails).length === 0) {
            try {
              const cookieUser = Cookies.get('current_user');

              if (cookieUser) {
                const parsed = JSON.parse(decodeURIComponent(cookieUser));

                // Check if it's a non-empty object
                if (
                  parsed &&
                  typeof parsed === 'object' &&
                  !Array.isArray(parsed) &&
                  Object.keys(parsed).length > 0
                ) {
                  currentUserDetails = parsed;
                } else {
                  currentUserDetails = null;
                }
              }
            } catch (error) {
              console.error("Error parsing current_user from cookies:", error);
              currentUserDetails = null;
            }
          }

          const paymentDetails = currentUserDetails?.payment_details;
          const convertedCount = currentUserDetails?.converted_documents_count;

          if (!paymentDetails || paymentDetails.length === 0) {
            setShowPaymentModal(true);
          } else {
            const latestPayment = [...paymentDetails].sort(
              (a, b) => new Date(b.payment_date) - new Date(a.payment_date)
            )[0];

            if(latestPayment?.plan_type === 'Free') {
              if(convertedCount >= 10) {
                toast.error("You have reached the monthly limit for Free plan. Please upgrade");
                setTimeout(() => {
                  navigate('/plans');
                }, 5000);
              } else {
                setShowPaymentModal(true);
              }
            } else if(latestPayment?.plan_type === 'Standard' && latestPayment?.transaction_status === 'completed') {
              if(convertedCount >= 100) {
                toast.error("You have reached the monthly limit for Standard plan. Please upgrade");
                setTimeout(() => {
                  navigate('/plans');
                }, 5000);
              } else {
                setShowPaymentModal(false);
              }
            } else {
              setShowPaymentModal(false);
            }
          }
      }


    setSelectedFiles((prev) => [...prev, ...newFiles]);
    setConversionStatus((prev) => [...prev, ...new Array(newFiles.length).fill("⏳ Pending")]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const closeModal = () => {
    setShowModal(false);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
  };

  const closeFileLimitPrompt = () => {
    setShowFileLimitPrompt(false);
  };


  const handleLoginRedirect = () => {
    setShowModal(false);
    setShowLoginModal(true);
  }

  const handleSignupRedirect = () => {
    setShowModal(true);
    setShowLoginModal(false);
  }



  const handleSubmit = async () => {
    try {
      const message = await register(form.name, form.email, form.password, form.confirm_password);
      toast.success(message);
      setShowModal(false);
      setRegisteredEmail(form.email); // Save email for OTP
      setShowOtpModal(true);
    } catch (error) {
      console.log("❌ Caught error in handleSubmit:", error.message); // ADD THIS
      toast.error(error.message || "Something went wrong");
    }
  };


  const handleLogin = async () => {
    try {
      const message = await login(form.email, form.password);
      toast.success(message);
      setShowLoginModal(false);
    } catch (err) {
      toast.error(err.message);
      setShowLoginModal(false);
    }
  };


  const watermarkPositions = [
    { value: 'top-left' },
    { value: 'top-center' },
    { value: 'top-right' },
    { value: 'middle-left' },
    { value: 'center' },
    { value: 'middle-right' },
    { value: 'bottom-left' },
    { value: 'bottom-center' },
    { value: 'bottom-right' },
  ];


  const watermarkTransparency = [
    { value: '0', label: 'No transparency' },
    { value: '75', label: '75%' },
    { value: '50', label: "50%" },
    { value: '25', label: "25%" },
  ];


  const watermarkRotations = [
    { value: '0', label: 'Do not rotate' },
    { value: '45', label: '45 degrees' },
    { value: '90', label: '90 degrees' },
    { value: '180', label: '180 degrees' },
    { value: '270', label: '270 degrees' },
  ];

  const watermarkLayer = [
    { value: 'over', label: 'Over the PDF content' },
    // { value: 'below', label: 'Below the PDF content' },
  ];

  
  useEffect(() => {
    selectedFiles.forEach((file, index) => {
      const canvas = canvasRefs.current[index];
      if (canvas) {
        renderPdfThumbnail(file, canvas, watermark, watermarkPosition, isMosaic);
      }
    });
  }, [watermark, watermarkPosition, isMosaic, selectedFiles]);


  const renderPdfThumbnail = async (file, canvas, watermark, position, mosaic) => {
    if (!file || !canvas) return;

    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    const fileReader = new FileReader();

    fileReader.onload = async function () {
      const typedarray = new Uint8Array(this.result);

      try {
        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale: 0.5 });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
          canvasContext: context,
          viewport,
        };

        await page.render(renderContext).promise;

        // Watermark dot
        const dotSize = 30;
        const drawDot = (x, y) => {
          context.beginPath();
          context.arc(x, y, dotSize / 2, 0, 2 * Math.PI);
          context.fillStyle = 'rgba(255, 0, 0, 0.7)';
          context.fill();
        };

        // Position map
        const positions = {
          'top-left': [0.1, 0.1],
          'top-center': [0.5, 0.1],
          'top-right': [0.9, 0.1],
          'middle-left': [0.1, 0.5],
          'center': [0.5, 0.5],
          'middle-right': [0.9, 0.5],
          'bottom-left': [0.1, 0.9],
          'bottom-center': [0.5, 0.9],
          'bottom-right': [0.9, 0.9],
        };

        if (mosaic) {
          Object.values(positions).forEach(([x, y]) => {
            drawDot(x * canvas.width, y * canvas.height);
          });
        } else if (positions[position]) {
          const [x, y] = positions[position];
          drawDot(x * canvas.width, y * canvas.height);
        }

      } catch (error) {
        console.error("Failed to render PDF preview", error);
      }
    };

    fileReader.readAsArrayBuffer(file);
  };


const Convert = async () => {
    setShowLoginModal(false);
    setShowModal(false);
    setShowPaymentModal(false);
  if (!selectedFiles.length) {
    alert("Please add at least one .doc/.docx file.");
    return;
  }

  // Always allow 2 file without prompt
  if (selectedFiles.length <= 2) {
    await convertFiles();
    return;
  }

  if(selectedFiles.length > 2 && !access_token) {
      setShowFileLimitPrompt(true);
      return;
    }

   if (selectedFiles.length > 2 && access_token) {
      let currentUserDetails = context?.currentUser;

        // Fallback to cookie if context is empty or invalid
        if (!currentUserDetails || typeof currentUserDetails !== 'object' || Array.isArray(currentUserDetails) || Object.keys(currentUserDetails).length === 0) {
          try {
            const cookieUser = Cookies.get('current_user');

            if (cookieUser) {
              const parsed = JSON.parse(decodeURIComponent(cookieUser));

              // Check if it's a non-empty object
              if (
                parsed &&
                typeof parsed === 'object' &&
                !Array.isArray(parsed) &&
                Object.keys(parsed).length > 0
              ) {
                currentUserDetails = parsed;
              } else {
                currentUserDetails = null;
              }
            }
          } catch (error) {
            console.error("Error parsing current_user from cookies:", error);
            currentUserDetails = null;
          }
        }

        const paymentDetails = currentUserDetails?.payment_details;
        const convertedCount = currentUserDetails?.converted_documents_count;

        if (!paymentDetails || paymentDetails.length === 0) {
          setShowFileLimitPrompt(true);
        } else {
          const latestPayment = [...paymentDetails].sort(
            (a, b) => new Date(b.payment_date) - new Date(a.payment_date)
          )[0];

          if(latestPayment?.plan_type === 'Free') {
            if(convertedCount >= 10) {
              toast.error("You have reached the monthly limit for Free plan. Please upgrade");
              setTimeout(() => {
                navigate('/plans');
              }, 5000);
            } else {
              setShowFileLimitPrompt(true);
            }
          } else if(latestPayment?.plan_type === 'Standard' && latestPayment?.transaction_status === 'completed') {
            if(convertedCount >= 100) {
              toast.error("You have reached the monthly limit for Standard plan. Please upgrade");
              setTimeout(() => {
                navigate('/plans');
              }, 5000);
            } else {
              await convertFiles();
            }
          } else {
            await convertFiles();
          }
        }
    }
};



const convertFiles = async () => {
  setShowFileLimitPrompt(false);
  setIsConverting(true);
  setConversionDone(false);
  setShowPaymentModal(false);

  const updatedStatus = new Array(selectedFiles.length).fill("Converting...");
    setConversionStatus(updatedStatus);

    const formData = new FormData();

    selectedFiles.forEach((file) => {
      formData.append("pdf_file[]", file);
    });

    formData.append('user_id', user_id);
    formData.append('watermark_text', formdata.watermark_text);

    formData.append('watermark_type', watermark);
    formData.append('watermark_position', watermarkPosition);
    formData.append('mosaic', isMosaic ? 1 : 0);
    // formData.append('transparency', selectedTransparency);
    formData.append('rotation', selectedRotation);
    // formData.append('layer', selectedLayer);

    if (watermark === 'image' && formdata.watermark_image) {
      formData.append('watermark_image', formdata.watermark_image);
    }

  
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}watermark`, {
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
      console.error("Conversion error:", error);
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

  setSelectedFileIndex(0);
};


  return (
    <>

     <Helmet>
        <title>Watermark | My PDF Tools</title>
      </Helmet>

    <div className="main">

        {showModal && (

          <SignupModal
            showModal={showModal}
            setForm={setForm}
            form={form}
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            handleLoginRedirect={handleLoginRedirect}
            closeModal={closeModal}
          />
        )}

         {showOtpModal && (
          <VerifyOtpModal
            email={registeredEmail}
            onSuccess={() => {
              toast.success("Verified and logged in");
              setShowOtpModal(false);
            }}
          />
        )}

        {showLoginModal && (
          <LoginModal
            showLoginModal={showLoginModal}
            setForm={setForm}
            form={form}
            handleLogin={handleLogin}
            handleChange={handleChange}
            handleSignupRedirect={handleSignupRedirect}
            closeLoginModal={closeLoginModal}
          />
        )}


        {showPaymentModal && (
          <PaymentModal
            showPaymentModal={showPaymentModal}
            closePaymentModal={closePaymentModal}
          />
        )}


        {showFileLimitPrompt && (
          <FileLimitPrompt
            showFileLimitPrompt={showFileLimitPrompt}
            closeFileLimitPrompt={closeFileLimitPrompt}
            selectedFiles={selectedFiles}
            onContinuePremium={() => {
              closeFileLimitPrompt();
              setShowPaymentModal(true);
            }}
            onContinueFree={() => {
              closeFileLimitPrompt();
              setSelectedFiles(selectedFiles.slice(0, 1)); // Keep only 1 file
            }}
          />
        )}

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
      {!showFileLimitPrompt && !isConverting && !conversionDone && (
          <>
          <div className="selected-section flex min-h-screen bg-gray-50">
            <div className="flex-1 flex flex-col justify-center items-center px-4 relative group overflow-y-auto max-h-screen scrollbar-red">
              {!showSidebar && (
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
              )}

               <div className={`upload-extra absolute mt-2 right-0 ${showSidebar ? 'hide-menu' : 'group-hover:flex'} flex-col gap-2 z-10`}>
              <button
                className="sm:hidden bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-700"
                title="Settings"
                onClick={() => setShowSidebar(true)}
              >
                <FaCog />
              </button>
              </div>


              {selectedFiles.length > 0 && (
                <div className="flex justify-between bg-white p-2 rounded-xl shadow-lg">
                  <select
                    name="file_name"
                    className="w-full max-w-[250px] truncate text-ellipsis whitespace-nowrap overflow-hidden text-sm text-gray-700 bg-transparent focus:outline-none"
                    value={selectedFileIndex}
                    onChange={(e) => setSelectedFileIndex(Number(e.target.value))}
                  >
                    {selectedFiles.map((file, index) => (
                      <option key={index} value={index}>
                        {file.name}
                      </option>
                    ))}
                  </select>

                  <div
                    className="delete p-2 cursor-pointer"
                    onClick={() => handleRemoveFile(selectedFileIndex)}
                  >
                    <FaTrash />
                  </div>
                </div>
              )}

              <div className="flex flex-wrap justify-center gap-4 mt-6">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-xl shadow-lg w-[180px]"
                  >
                    <div className="file_canvas py-2">
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
                        ) : (
                          <canvas width="127" height="180" className="pdf"></canvas>
                        )}
                      </>
                    </div>
                    <p className="text-xs text-gray-700 mt-2 text-center break-words">
                      {file.name}
                    </p>
                    <p className="text-xs text-blue-500 mt-1">
                      {conversionStatus[index]}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* sidebar*/}
          <div
            className={`
              bg-white border-l border-gray-200 flex flex-col justify-between transition-transform duration-300 ease-in-out
              w-[300px] sm:w-[350px]
              fixed top-0 right-0 h-screen z-50
              ${showSidebar ? 'translate-x-0 z-[1050]' : 'translate-x-full'}
              sm:relative sm:translate-x-0 sm:flex scrollbar-red overflow-y-auto max-h-screen
            `}
          >
            
              {selectedFiles.length > 0 ? (
                <>
                  <div className="flex justify-between p-6 text-center border-b">
                    <h1 className="tool-heading text-xl font-semibold">
                      Watermark options
                    </h1>
                    <div className="sm:hidden p-4 flex justify-end">
                      <button onClick={() => setShowSidebar(false)}>
                        <FaTimesCircle className="text-red-500 text-2xl" />
                      </button>
                    </div>
                  </div>
                  {/* options section */}
                  <div className="p-6">
                    <div className="flex gap-2">
                      {watermarkOptions.map(({ value, label }) => (
                        <label key={value} className="inline-flex items-center">
                          <input
                            type="radio"
                            name="watermark"
                            value={value}
                            checked={watermark === value}
                            onChange={(e) => setWatermark(e.target.value)}
                            className="form-radio text-blue-600"
                          />
                          <span className="ml-2">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {watermark === "text" ? (
                    <div className="p-6">
                      <div className="flex flex-col gap-2">
                        <label className="inline-flex items-center font-semibold">
                          Text:
                        </label>
                        <input
                          type="text"
                          name="watermark_text"
                          placeholder="Enter watermark"
                          value={formdata.watermark_text}
                          onChange={handleChange}
                          className=" w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="p-6">
                      <div className="flex flex-col gap-2">
                        <label className="inline-flex items-center font-semibold">
                          Choose Image:
                        </label>
                        <input
                          type="file"
                          name="watermark_image"
                          accept=".jpg,.jpeg,.png,.gif"
                          onChange={(e) =>
                            setFormdata({
                              ...formdata,
                              watermark_image: e.target.files[0], // ✅ store File directly
                            })
                          }
                        />
                      </div>
                    </div>
                  )}

                  {/* options section */}

                  {/* position section */}

                  <div className="p-6">
                    <label className="block font-semibold mb-2">Position:</label>
                    <div className="flex justify-start">
                      <div className="grid grid-cols-3 gap-0 w-28 h-28 border border-gray-300">
                        {watermarkPositions.map(({ value }) => (
                          <label
                            key={value}
                            className={`flex justify-center items-center w-full h-full border border-gray-200 hover:bg-gray-100 cursor-pointer
                                ${
                                  watermarkPosition === value
                                    ? "bg-red-50"
                                    : "bg-transparent"
                                }`}
                          >
                            <input
                              type="radio"
                              name="watermark_position"
                              value={value}
                              checked={watermarkPosition === value}
                              onChange={(e) => setWatermarkPosition(e.target.value)}
                              className="sr-only"
                            />
                            <span
                              className={`w-4 h-4 rounded-full ${
                                watermarkPosition === value
                                  ? "bg-red-500"
                                  : "bg-transparent border border-gray-400"
                              }`}
                            ></span>
                          </label>
                        ))}
                      </div>

                      <div className="m-6"></div>

                      <div className="mt-2 flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="mosaic"
                          checked={isMosaic}
                          onChange={() => setIsMosaic(!isMosaic)}
                          className="form-checkbox"
                        />
                        <label htmlFor="mosaic">Mosaic</label>
                      </div>
                    </div>
                  </div>

                  {/* position section */}

                  {/* transparency & rotation section */}

                  <div className="p-6 flex justify-between">
                    {/*<div className="left-section">
                      <label className="block font-semibold mb-2">
                        Transparency:
                      </label>
                        <div className="border border-gray-300 rounded p-2">
                          <select
                            name="watermark_transparency"
                            className="flex-1"
                            value={selectedTransparency}
                            onChange={(e) => setSelectedTransparency(e.target.value)}
                          >
                            {watermarkTransparency.map(({ value, label }) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </div>
                    </div>*/}

                      <div className="right-section">
                        <label className="block font-semibold mb-2">Rotation:</label>
                        
                          <div className="border border-gray-300 rounded p-2">
                            <select
                              name="watermark_transparency"
                              className="flex-1"
                              value={selectedRotation}
                              onChange={(e) =>
                                setSelectedRotation(e.target.value)
                              }
                            >
                              {watermarkRotations.map(({ value, label }) => (
                                <option key={value} value={value}>
                                  {label}
                                </option>
                              ))}
                            </select>
                          </div> 
                      </div>
                  </div>

                  {/* transparency & rotation section */}


                  <div className="p-6">
                   <label className="block font-semibold mb-2">
                      Layer
                    </label>
                    <div className="flex gap-2">
                      {watermarkLayer.map(({ value, label }) => (
                        <label key={value} className="inline-flex items-center">
                          <input
                            type="radio"
                            name="watermark"
                            value={value}
                            checked={selectedLayer === value}
                            onChange={(e) => setSelectedLayer(e.target.value)}
                            className="form-radio text-blue-600"
                          />
                          <span className="ml-2">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="p-6">
                    <button
                      className="flex justify-center w-full bg-red-600 text-white py-3 px-3 rounded-lg text-lg font-semibold shadow-md hover:bg-red-700 transition-all duration-300"
                      onClick={Convert}
                    >
                      <span className="convert-button">Add Watermark</span>
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
                    <h1 className="text-xl font-semibold text-center tool-heading">
                      Watermark
                    </h1>
                    <div className="mt-4 text-center  bg-sky-50 p-4 rounded text-sm">
                      Please, select more PDF files by clicking again on ‘Select PDF
                      files’.
                      <br />
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="75"
                        height="66"
                        viewBox="0 0 150 132"
                      >
                        <path
                          fill="white"
                          d="M0,0 C0,18.75 28.125,56.25 93.75,56.25 L93.75,18.75 L150,75 L93.75,131.25 L93.75,93.75 C42.0594727,93.75 0,51.6905273 0,0 Z"
                          transform="rotate(-180 75 66)"
                        />
                      </svg>
                    </div>
                    <p className="mt-2 text-white text-sm">
                      Please add a file to activate options
                    </p>
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
            <span className="convert-button">Add Watermark</span>
            <span className="arrow-icon ml-2">
              <FaArrowCircleRight />
            </span>
          </button>
        </div>
        
        </>
        )
      }


      {/* Conversion Loader Section */}
      {isConverting && (
        <div className="conversion-section min-h-screen bg-gray-50 mt-4 py-20 flex flex-col items-center justify-center">
        <h1 className="section-title">Adding Watermark...</h1>
          <Loader />
        </div>
      )}

    </div>

    </>
  );
}

export default AddWatermark;
