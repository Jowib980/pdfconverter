import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Loader from '../Loader.js';
import { ToastContainer, toast } from 'react-toastify';

function Tools() {
  const [showModal, setShowModal] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const tools = [
    {
      title: "Word to PDF",
      description: "Make DOC and DOCX files easy to read by converting them to PDF.",
      icon: "ico--wordpdf",
      link: "/word-to-pdf",
    },
    // {
    //   title: "PowerPoint to PDF",
    //   description: "Make PPT and PPTX slideshows easy to view by converting them to PDF.",
    //   icon: "ico--powerpointpdf",
    //   link: "ppt-to-pdf",
    // },
    {
      title: "Excel to PDF",
      description: "Make EXCEL spreadsheets easy to read by converting them to PDF.",
      icon: "ico--excelpdf",
      link: "excel-to-pdf",
    },
    {
      title: "HTML to PDF",
      description: "Convert webpages in HTML to PDF.",
      icon: "ico--htmlpdf",
      link: "html-to-pdf",
    },
    {
      title: "Merge PDF",
      description: "Combine PDFs in the order you want.",
      icon: "ico--merge",
      link: "merge-pdf",
    },
    { 
      title: "Split PDF",
      description: "Separate pages into individual PDF files.",
      icon: "ico--split",
      link: "split-pdf",
    },
    // {
    //   title: "Compress PDF",
    //   description: "Reduce PDF file size while retaining quality.",
    //   icon: "ico--compress",
    //   link: "compress-pdf",
    // },
    {
      title: "Rotate PDF",
      description: "Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!",
      icon: "ico--rotate",
      link: "rotate-pdf",
    },
    {
      title: "JPG to PDF",
      description: "Convert JPG images to PDF in seconds. Easily adjust orientation and margins.",
      icon: "ico--jpgpdf",
      link: "jpg-to-pdf",
    },
    {
      title: "Watermark",
      description: "Stamp an image or text over your PDF in seconds. Choose the typography, transparency and position.",
      icon: "ico--watermark",
      link: "watermark",
    },
  ];

  useEffect(() => {
    const savedEmail = Cookies.get("user_email");
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const openTool = (tool) => {
    console.log(email);
    if (!email) {
      setSelectedTool(tool);
      setShowModal(true);
    } else {
      window.location.href = tool.link;
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEmail('');
  };

  const handleSubmit = async () => {
    setShowModal(false);
    setLoading(true);
  if (!email.trim()) return;

  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        name: email,
        email: email,
        password: '12345678',
        password_confirmation: '12345678',
      })
    });

    const data = await response.json();

    if (response.ok) {
      
      Cookies.set("user", JSON.stringify(data.user), { expires: 30 });
      Cookies.set("access_token", data.access_token, { expires: 30 });
      Cookies.set("user_email", email, { expires: 30 });
      
      console.log('Registered successfully:', data.user);
      setShowModal(false);
      setLoading(false);
      window.location.href = selectedTool.link;
    } else {
      setLoading(true);
       const emailError = data?.email?.[0];
        if (emailError === "The email has already been taken.") {
          const response = await fetch(` ${process.env.REACT_APP_BACKEND_API_URL}login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            email: email,
            password: '12345678',
          })
        });

        const data = await response.json();

        if (response.ok) {
          
          console.log("Login successfully!");
          Cookies.set("token", data.access_token, { expires: 30 });
          Cookies.set("user", JSON.stringify(data.user), { expires: 30 });
          Cookies.set("user_email", email, { expires: 30 });
          setShowModal(false);
          setLoading(false);
          window.location.href = selectedTool.link;
          
        } else {
          setLoading(false);
          toast.error("An error occurred. Please try again later.");
          console.log(data.message || "Login failed.");
        }
      }
    }
  } catch (error) {
    console.error("Registration error:", error);
    toast.error("An error occurred during registration.");
  }
};

  return (
    <div className="content">
    <ToastContainer />

    {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70">
          <Loader />
        </div>
    )}


      <div className="p-4">
        <h1 className="home-title text-center font-bold py-4">
          Every tool you need to work with PDFs in one place
        </h1>
        <h2 className="home-subtitle text-center">Every tool you need to use PDFs, at your fingertips. All are 100% FREE and easy to use! Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-4 m-4">
        {tools.map((tool, index) => (
          <a href="#" ><div
            key={index}
            onClick={() => openTool(tool)}
            className="tool-div bg-white rounded-xl shadow-md hover:shadow-lg p-6 transition-all duration-300"
          >
            <div className="text-4xl mb-3">
              <i className={`ico ${tool.icon}`}></i>
            </div>
            <h3 className="font-bold text-xl text-slate-800 mb-2">{tool.title}</h3>
            <p className="text-sm text-slate-600">{tool.description}</p>
          </div>
          </a>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={closeModal}
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Enter your email for {selectedTool?.title}
            </h2>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tools;
