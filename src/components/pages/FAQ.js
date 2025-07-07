import React, { useState, useEffect } from 'react';
import Main from "../partials/Main.js";
import { Helmet } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import Loader from '../Loader.js';
import Cookies from 'js-cookie';

function FAQ() {
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null); // for toggle
  const userString = Cookies.get("user");
  const user = userString ? JSON.parse(userString) : null;
  const user_id = user?.id ?? null;

  const toggleFAQ = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const faqData = [
    {
      question: "What is PDFTools?",
      answer: "PDFTools is a free online platform that lets you convert, merge, split, rotate, and watermark PDF documents easily.",
    },
    {
      question: "Is PDFTools free to use?",
      answer: "Yes! Most tools on PDFTools are free to use. Some advanced features may require a subscription or one-time payment in the future.",
    },
    {
      question: "Do you store my uploaded files?",
      answer: "No, your uploaded files are processed temporarily and automatically deleted from our servers shortly after processing—usually within 30 minutes.",
    },
    {
      question: "Is my data secure on PDFTools?",
      answer: "Yes, all files are processed securely using HTTPS and automatically deleted after processing.",
    },
    {
      question: "Do I need to install anything?",
      answer: "No, PDFTools is 100% web-based. Just upload, convert, and download.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>FAQ | My PDF Tools</title>
        <meta name="description" content="Contact us to report a problem or clarify any doubts." />
      </Helmet>
      <Main>
        <ToastContainer />
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70">
            <Loader />
          </div>
        )}

        <div className="min-h-screen bg-grey flex justify-center items-center px-6 md:px-16 py-12">
          <div className="max-w-4xl w-full bg-white border border-gray-200 rounded-lg shadow-md px-6 md:px-12 py-10 space-y-8">
            <h2 className="text-4xl font-bold text-gray-900 text-center">❓ Frequently Asked Questions (FAQs)</h2>
            <dl className="space-y-4">
              {faqData.map((item, index) => (
                <div key={index} className="border rounded-lg">
                  <dt>
                    <button
                      type="button"
                      onClick={() => toggleFAQ(index)}
                      className="w-full flex justify-between items-center px-4 py-3 text-left font-medium text-gray-800 bg-gray-100 hover:bg-gray-200"
                    >
                      <span>{item.question}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className={`w-5 h-5 transition-transform duration-200 ${
                          activeIndex === index ? 'rotate-180' : ''
                        }`}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>
                  </dt>
                  {activeIndex === index && (
                    <dd className="px-4 py-3 bg-white text-gray-700 border-t">{item.answer}</dd>
                  )}
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Main>
    </>
  );
}

export default FAQ;
