import React, { useState, useEffect } from 'react';
import Main from "../partials/Main.js";
import { Helmet } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import Loader from '../Loader.js';
import Cookies from 'js-cookie';

function ToolsDescription() {
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null); // for toggle
  const userString = Cookies.get("user");
  const user = userString ? JSON.parse(userString) : null;
  const user_id = user?.id ?? null;

  const ToolsData = [
    {
      tool: "Word to PDF",
      description: "Convert your Microsoft Word documents (DOC and DOCX) into universally compatible PDF files. This ensures your document formatting remains consistent across all devices and platforms, making it perfect for sharing or printing.",
    },
    {
      tool: "Excel to PDF",
      description: "Transform Excel spreadsheets (XLS and XLSX) into PDFs for easier viewing, sharing, and archiving. Maintain table layouts and data integrity without requiring Excel to open them.",
    },
    {
      tool: "HTML to PDF",
      description: "Convert webpages or raw HTML code into clean, printable PDF documents. Ideal for saving receipts, web pages, invoices, or dynamic content snapshots.",
    },
    {
      tool: " Merge PDF",
      description: "Combine multiple PDF files into a single, organized document. Control the page order and merge files easily for reports, portfolios, or contracts.",
    },
    {
      tool: "Split PDF",
      description: "Extract individual pages or ranges from a PDF file to create separate PDFs. Useful when you need to isolate chapters, forms, or specific document sections.",
    },
    {
      tool: "Rotate PDF",
      description: "Adjust the orientation of your PDF pages clockwise or counter-clockwise. Fix scanning errors or rotate specific pages in bulk with ease."
    },
    {
      tool: "JPG to PDF",
      description: "Quickly convert one or more JPG images into a single PDF file. Customize layout settings like orientation, page size, and margins to suit your needs."
    },
    {
      tool: "Watermark",
      description: "Add image or text watermarks to your PDF files. Customize font, size, color, transparency, and position to protect your documents from unauthorized use or branding."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Tools | My PDF Tools</title>
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
            <h2 className="text-4xl font-bold text-gray-900 text-center">Welcome to our user's guide</h2>
            <h2 className="text-2xl text-gray-600 text-center">Although we have tried to make it really simple, here is a short guidance to help you through the editing process.</h2>
            <dl className="space-y-4">
              {ToolsData.map((item, index) => (
                <div key={index} className="border rounded-lg">
                  <dt>
                    <button
                      type="button"
                      className="w-full flex justify-between items-center px-4 py-3 text-left font-medium text-gray-800 bg-gray-100 hover:bg-gray-200"
                    >
                      <span>{item.tool}</span>
                      
                    </button>
                  </dt>
                    <dd className="px-4 py-3 bg-white text-gray-700 border-t">{item.description}</dd>
                  
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Main>
    </>
  );
}

export default ToolsDescription;
