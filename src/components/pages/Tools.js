import React, { useState, useEffect } from 'react';

function Tools() {
  const [showModal, setShowModal] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [email, setEmail] = useState('');

  const tools = [
    {
      title: "Word to PDF",
      description: "Make DOC and DOCX files easy to read by converting them to PDF.",
      icon: "ico--wordpdf",
      link: "/word-to-pdf",
    },
    {
      title: "PowerPoint to PDF",
      description: "Make PPT and PPTX slideshows easy to view by converting them to PDF.",
      icon: "ico--powerpointpdf",
      link: "ppt-to-pdf",
    },
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
    {
      title: "Compress PDF",
      description: "Reduce PDF file size while retaining quality.",
      icon: "ico--compress",
      link: "compress-pdf",
    },
  ];

  useEffect(() => {
    const savedEmail = localStorage.getItem("user_email");
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
      
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user_email", email);
      
      console.log('Registered successfully:', data.user);
      setShowModal(false);
      window.location.href = selectedTool.link;
    } else {
      console.error("Registration failed:", data);
      alert("Registration failed: " + (data.message || "Unknown error"));
    }
  } catch (error) {
    console.error("Registration error:", error);
    alert("An error occurred during registration.");
  }
};

  return (
    <div className="content">
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
