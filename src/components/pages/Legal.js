import React, { useState, useEffect } from 'react';
import Main from "../partials/Main.js";
import { Helmet } from 'react-helmet-async';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../Loader.js';
import Cookies from 'js-cookie';

function Legal() {
  const [loading, setLoading] = useState(false);
  const userString = Cookies.get("user");
  const user = userString ? JSON.parse(userString) : null;
  const user_id = user?.id ?? null;

  return (
    <>
      <Helmet>
        <title>Legal & Privacy | My PDF Tools</title>
        <meta name="description" content="Contact us to report a problem or clarify any doubts." />
      </Helmet>
      <Main>

      <ToastContainer />

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70">
          <Loader />
        </div>
      )}

        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 ">
          <div className="min-h-screen bg-grey flex justify-center items-center px-6 md:px-16 py-12">
            
            {/* Left Section */}
            <div class="min-h-screen max-w-8xl m-auto bg-white border border-gray-200 rounded-lg shadow-md px-6 md:px-16 py-12 space-y-12">
              {/*Legal Disclaimer */}
              <div class="w-full">
                <h2 class="text-4xl font-bold text-gray-900 mb-4 text-center">📄 Legal Disclaimer</h2>
                <p class="text-lg text-gray-600 mb-6">
                  <strong>Effective Date:</strong> July 7, 2025
                </p>
                <ul class="space-y-4 text-gray-700 text-base list-disc pl-5">
                  <li>
                    <strong>No Warranty:</strong> PDFTools is provided "as is" without warranties of any kind. We do not guarantee the accuracy, uptime, or reliability of the services.
                  </li>
                  <li>
                    <strong>User Responsibility:</strong> You are responsible for all content uploaded. Do not upload confidential, illegal, or copyrighted files.
                  </li>
                  <li>
                    <strong>Intellectual Property:</strong> All trademarks, designs, and content (excluding uploaded files) are the property of PDFTools.
                  </li>
                  <li>
                    <strong>Limitation of Liability:</strong> We are not liable for damages resulting from service use, including data loss or legal claims.
                  </li>
                  <li>
                    <strong>Third-party Services:</strong> We may use third-party services or APIs. We are not responsible for their behavior or reliability.
                  </li>
                </ul>
              </div>

              {/*Privacy Policy */}
              <div class="w-full">
                <h2 class="text-4xl font-bold text-gray-900 mb-4 text-center">🔐 Privacy Policy</h2>
                <p class="text-lg text-gray-600 mb-6">
                  <strong>Effective Date:</strong> July 7, 2025
                </p>
                <ul class="space-y-4 text-gray-700 text-base list-disc pl-5">
                  <li>
                    <strong>Data Collected:</strong> We may collect email, cookies, and temporary files only for improving service quality.
                  </li>
                  <li>
                    <strong>File Privacy:</strong> All uploaded files are encrypted during transfer and auto-deleted within an hour after processing.
                  </li>
                  <li>
                    <strong>Use of Data:</strong> We use data only for service delivery, performance monitoring, and communication.
                  </li>
                  <li>
                    <strong>Third-Party Sharing:</strong> We do not sell or share your data with third parties unless required by law.
                  </li>
                  <li>
                    <strong>Cookies:</strong> We use cookies for a better experience. Disabling them may affect functionality.
                  </li>
                  <li>
                    <strong>Your Rights:</strong> You may request data deletion or updates by contacting us at <a href="mailto:support@pdftools.com" class="text-blue-600 underline">support@pdftools.com</a>.
                  </li>
                  <li>
                    <strong>Policy Updates:</strong> We may update our terms, with changes reflected on this page.
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div class="w-full text-center pt-8 border-t border-gray-200">
                <p class="text-base text-gray-600">
                  📧 For legal or privacy concerns, contact us at <a href="mailto:support@pdftools.com" class="text-blue-600 underline">support@pdftools.com</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Main>
    </>
  );
}

export default Legal;
