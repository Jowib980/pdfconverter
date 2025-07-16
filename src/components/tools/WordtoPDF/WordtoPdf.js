import React, { useState, useEffect } from 'react';
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
import SignupModal from '../../auth/SignupModal';
import LoginModal from '../../auth/LoginModal';
import { useConfig } from '../../../ConfigContext';
import PaymentModal from '../../auth/PaymentModal';
import FileLimitPrompt from '../../auth/FileLimitPrompt';
import VerifyOtpModal from '../../auth/VerifyOtpModal';

function WordtoPdf({ files = [] }) {
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
  const access_token = Cookies.get("access_token");
  const [error, setError] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
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

      if (files.length > 1 && !access_token) {
        setShowModal(true);
      }


      if (files.length > 1 && access_token) {
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
          const convertedCount = parseInt(currentUserDetails?.converted_documents_count ?? 0);

          if (!paymentDetails || paymentDetails.length === 0) {
            setShowPaymentModal(true);
          } else {
            const latestPayment = [...paymentDetails].sort(
              (a, b) => new Date(b.payment_date) - new Date(a.payment_date)
            )[0];

            if (latestPayment?.plan_type === 'Free') {
            
              if (convertedCount >= 10) {
                toast.error("You have reached the monthly limit for Free plan. Please upgrade.")
                setTimeout(() => {
                  navigate('/plans');
                }, 5000);
              } else {
                setShowPaymentModal(true);
              }
            } else if(latestPayment?.plan_type === 'Standard' && latestPayment?.transaction_status === 'completed') {
            
              if(convertedCount >= 100) {
                toast.error("You have reached the monthly limit for Free plan. Please upgrade.")
                setTimeout(() => {
                  navigate('/plans');
                }, 5000);
              } else {
                setShowPaymentModal(false);
              }
            } else {
              // Paid user
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
    if (totalFiles > 1 && !access_token) {
      setShowModal(true);
      return;
    }


      if (totalFiles > 1 && access_token) {
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
          const convertedCount = parseInt(currentUserDetails?.converted_documents_count ?? 0);

          if (!paymentDetails || paymentDetails.length === 0) {
            setShowPaymentModal(true);
          } else {
            const latestPayment = [...paymentDetails].sort(
              (a, b) => new Date(b.payment_date) - new Date(a.payment_date)
            )[0];

           if (latestPayment?.plan_type === 'Free') {
            
              if (convertedCount >= 10) {
                toast.error("You have reached the monthly limit for Free plan. Please upgrade.")
               setTimeout(() => {
                  navigate('/plans');
                }, 5000);
              } else {
                setShowPaymentModal(true);
              }
            } else if(latestPayment?.plan_type === 'Standard' && latestPayment?.transaction_status === 'completed') {
            
              if(convertedCount >= 100) {
                toast.error("You have reached the monthly limit for Free plan. Please upgrade.")
                setTimeout(() => {
                  navigate('/plans');
                }, 5000);
              } else {
                setShowPaymentModal(false);
              }
            } else {
              // Paid user
              setShowPaymentModal(false);
            }
          }
      }

    setSelectedFiles((prev) => [...prev, ...newFiles]);
    setConversionStatus((prev) => [...prev, ...new Array(newFiles.length).fill("⏳ Pending")]);
  
  };

const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

  const Convert = async () => {
    setShowLoginModal(false);
    setShowModal(false);
    setShowPaymentModal(false);

    if (!selectedFiles.length) {
      alert("Please add at least one .doc/.docx file.");
      return;
    }

    // Always allow 1 file without prompt
    if (selectedFiles.length === 1) {
      await convertFiles();
      return;
    }

    if (selectedFiles.length > 1 && !access_token) {
      setShowFileLimitPrompt(true);
      return;
    }

    if (selectedFiles.length > 1 && access_token) {
      let currentUserDetails = context?.currentUser;

      // Fallback to cookie if context is empty or invalid
      if (
        !currentUserDetails ||
        typeof currentUserDetails !== 'object' ||
        Array.isArray(currentUserDetails) ||
        Object.keys(currentUserDetails).length === 0
      ) {
        try {
          const cookieUser = Cookies.get('current_user');

          if (cookieUser) {
            const parsed = JSON.parse(decodeURIComponent(cookieUser));
            if (
              parsed &&
              typeof parsed === 'object' &&
              !Array.isArray(parsed) &&
              Object.keys(parsed).length > 0
            ) {
              currentUserDetails = parsed;
            }
          }
        } catch (error) {
          console.error("Error parsing current_user from cookies:", error);
        }
      }

          const paymentDetails = currentUserDetails?.payment_details;
          const convertedCount = parseInt(currentUserDetails?.converted_documents_count ?? 0);

          if (!paymentDetails || paymentDetails.length === 0) {
            setShowPaymentModal(true);
          } else {
            const latestPayment = [...paymentDetails].sort(
              (a, b) => new Date(b.payment_date) - new Date(a.payment_date)
            )[0];

           if (latestPayment?.plan_type === 'Free') {
            
              if (convertedCount >= 10) {
                toast.error("You have reached the monthly limit for Free plan. Please upgrade.")
                setTimeout(() => {
                  navigate('/plans');
                }, 5000);
              } else {
                setShowFileLimitPrompt(true);
              }
            } else if(latestPayment?.plan_type === 'Standard' && latestPayment?.transaction_status === 'completed') {
            
              if(convertedCount >= 100) {
                toast.error("You have reached the monthly limit for Free plan. Please upgrade.")
                setTimeout(() => {
                  navigate('/plans');
                }, 5000);
              } else {
                await convertFiles();
              }
            } else {
              // Paid user
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
    formData.append("file[]", file);
  });

  formData.append("user_id", user_id);

  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}convert-word`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (result && result.urls && result.token) {
      setConversionStatus("Done");
      navigate(`/download/${result.token}`);
    } else {
      toast.error("Failed conversion, please try again later.");
    }
  } catch (error) {
    setConversionStatus(selectedFiles.map(() => "❌ Error"));
    toast.error("Failed conversion, please try again later.");
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
        <title>Word to PDF | My PDF Tools</title>
      </Helmet>

    <div className="main">
      
       <ToastContainer />

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
       
      {error && (
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between selected-section min-h-screen mt-6 py-6">
          <div className="flex-1 flex justify-center items-center px-4">
            <a href="/">
              <button className="flex items-center gap-2 bg-red-600 text-white px-8 py-8 rounded-lg font-semibold shadow-md hover:bg-red-700 transition"><FaArrowLeft /> Go to Home</button>
            </a>
          </div>
        </div>
      )}

      {!showFileLimitPrompt && !isConverting && !conversionDone && (
          <>
          <div className="selected-section flex min-h-screen bg-gray-50">
            <div className="flex-1 flex flex-col justify-center items-center px-4 relative group scrollbar-red overflow-y-auto max-h-screen">
              
              {!showSidebar && (
                <div className="sidetool absolute -top-4 -right-4 z-20">
                  <div className="relative">
                    <label className="relative cursor-pointer">
                      <div className="bg-red-500 text-white rounded-full w-10 h-10 text-xl font-semibold shadow-lg hover:bg-red-600 flex items-center justify-center">
                        +
                      </div>
                      <input
                        type="file"
                        accept=".docx"
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
                      accept=".docx"
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
                    <div className="file_canvas">
                      <canvas width="127" height="180" className="docx docx word docx"></canvas>
                    </div>
                    <p className="text-xs text-gray-700 mt-2 text-center break-words">{file.name}</p>
                    <p className="text-xs text-blue-500 mt-1">{conversionStatus[index]}</p>
                  </div>
                ))}
              </div>
            </div>

          {/* sidebar*/}
            <div
              className={`bg-white border-l border-gray-200 flex flex-col justify-between transition-transform scrollbar-red overflow-y-auto max-h-screen duration-300 ease-in-outw-[300px] sm:w-[350px] fixed top-0 right-0 h-screen z-50 ${showSidebar ? 'translate-x-0 z-[1050]' : 'translate-x-full'} sm:relative sm:translate-x-0 sm:flex`}
            >
             
              {selectedFiles.length > 0 ? (
                <>
                  <div className="flex justify-between p-6 text-center border-b">
                    <h1 className="tool-heading text-xl font-semibold">Word to PDF</h1>
                    <div className="sm:hidden p-4 flex justify-end">
                    <button onClick={() => setShowSidebar(false)}>
                      <FaTimesCircle className="text-red-500 text-2xl" />
                    </button>
                  </div>
                  </div>

                  <div className="p-6">
                    <button
                      className="flex justify-center w-full py-3 px-3 rounded-lg text-lg font-semibold shadow-md transition-all duration-300 bg-red-500 text-white"
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
                  <div className="absolute inset-0 p-6 opacity-20 pointer-events-none">
                    <h1 className="text-xl font-semibold text-center tool-heading">Word to PDF</h1>
                    <div className="mt-4 text-center  bg-sky-50 p-4 rounded text-sm">
                      Please, select more PDF files by clicking again on ‘Select PDF files’.<br />
                      Select multiple files by maintaining pressed ‘Ctrl’
                    </div>
                  </div>

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
                  className="flex justify-center w-full py-3 px-3 rounded-lg text-lg font-semibold shadow-md transition-all duration-300 bg-red-500 text-white"
                  onClick={Convert}
                >
                  <span className="convert-button">Convert to PDF</span>
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
          <h1 className="section-title">Word file convert to PDF</h1>
            <h2 className="text-2xl font-semibold mb-4">Converting your Word files...</h2>
            <Loader />
          </div>
        )}
      
    </div>

        
    </>
  );
}

export default WordtoPdf;
