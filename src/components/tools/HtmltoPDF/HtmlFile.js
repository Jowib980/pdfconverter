import React, { useState } from 'react';
import Header from '../../partials/Header.js';
import HtmltoPDF from './HtmltoPDF';
import { Helmet } from 'react-helmet-async';

function HtmlFile() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showModal, setShowModal] = useState(true);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [form, setForm] = useState({ html_url: '' });
  const [htmlType, setHtmlType] = useState('');
  const [loading, setLoading] = useState(false);
  const [pdfLinks, setPdfLinks] = useState([]);
  const [url, setUrl] = useState([]);
  const [startConversion, setStartConversion] = useState(false);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setStartConversion(true);
  };


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (e) => {
    setHtmlType(e.target.value);
  };

  const handleSubmit = () => {
    if (htmlType === 'url') {
      setShowUrlModal(true);
    } else if (htmlType === 'file') {
      document.getElementById('htmlFileInput').click();
    }
    setShowModal(false);
  };

  const handleUrlChange = () => {
    if (form.html_url.trim() !== '') {
      setUrl(form.html_url.trim());
      setShowUrlModal(false);
      setStartConversion(true);
    }
  };

  return (
    <>
      <Helmet>
        <title>HTML to PDF | My PDF Tools</title>
      </Helmet>

      <div className="content">
        <Header />

        {startConversion? (
          <HtmltoPDF files={selectedFiles} url={url} />
        ) : (
          <>
            <div className="upload-section min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center px-4">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">HTML to PDF</h1>
              <h2 className="text-gray-600 mb-6">Convert web pages to PDF documents with high accuracy</h2>

              <div className="flex items-center space-x-4 mb-2">
                <label
                  htmlFor="htmlFileInput"
                  className="bg-red-600 text-white px-8 py-4 rounded text-lg font-semibold cursor-pointer hover:bg-red-700 transition"
                >
                  Add Html
                </label>
                <input
                  id="htmlFileInput"
                  type="file"
                  accept=".html"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />

                <button
                  onClick={() => setShowModal(true)}
                  className="bg-yellow-600 text-white px-6 py-4 rounded text-lg font-semibold hover:bg-yellow-700 transition"
                >
                  Choose Type
                </button>
              </div>

              {/* Display PDF links */}
              {pdfLinks.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-2">Converted PDFs:</h3>
                  <ul className="list-disc list-inside">
                    {pdfLinks.map((url, index) => (
                      <li key={index}>
                        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                          Download PDF {index + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal for choosing type */}
            {showModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-6">
                  <h2 className="text-2xl font-semibold text-center text-yellow-600">Choose HTML Type</h2>

                  <div className="space-y-4">
                    <label className="block">
                      <input
                        type="radio"
                        name="htmlType"
                        value="url"
                        checked={htmlType === 'url'}
                        onChange={handleTypeChange}
                        className="mr-2"
                      />
                      URL
                    </label>

                    <label className="block">
                      <input
                        type="radio"
                        name="htmlType"
                        value="file"
                        checked={htmlType === 'file'}
                        onChange={handleTypeChange}
                        className="mr-2"
                      />
                      File
                    </label>
                  </div>

                  <button
                    onClick={handleSubmit}
                    className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}

            {/* Modal for URL input */}
            {showUrlModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                  <button
                    className="absolute top-3 right-3 text-gray-700 text-2xl font-bold"
                    onClick={() => setShowUrlModal(false)}
                  >
                    &times;
                  </button>

                  <h2 className="text-2xl font-semibold text-yellow-600 text-center mb-4">Enter URL</h2>

                  <input
                    type="url"
                    name="html_url"
                    placeholder="https://example.com"
                    value={form.html_url}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
                  />

                  <button
                    onClick={handleUrlChange}
                    className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default HtmlFile;
