import React, { useState, useEffect } from 'react';
import Main from "../partials/Main.js";
import { Helmet } from 'react-helmet-async';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../Loader.js';
import Cookies from 'js-cookie';

function Contact() {
  const [loading, setLoading] = useState(false);
  const userString = Cookies.get("user");
  const user = userString ? JSON.parse(userString) : null;
  const user_id = user?.id ?? null;
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [submittedName, setSubmittedName] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
    });


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const SendMessage = async () => {
    setLoading(true);

    if (!form.name) {
      toast.error("Name is required");
      setLoading(false);
      return;
    }
    if (!form.email) {
      toast.error("Email is required");
      setLoading(false);
      return;
    }
    if (!form.subject) {
      toast.error("Subject is required");
      setLoading(false);
      return;
    }
    if (!form.message) {
      toast.error("Message is required");
      setLoading(false);
      return;
    }


    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}sent-message`, {
        method: 'POST',
        headers:  {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          user_id: user_id,
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
        })
      });

      const data = await response.json();

       if (response.ok) {
        setSubmittedName(form.name);
         setForm({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        setLoading(false);
        toast.success("Sent message successfully!");
        setShowSuccessMessage(true);
      } else {
        setLoading(false);
        toast.error(data.message || "Error occured, Please try again later.");
      }
    } catch(error) {
        toast.error(error || "Error occured, Please try again later.");
    }
  }

  return (
    <>
      <Helmet>
        <title>Contact | My PDF Tools</title>
        <meta name="description" content="Contact us to report a problem or clarify any doubts." />
      </Helmet>
      <Main>

      <ToastContainer />

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70">
          <Loader />
        </div>
      )}

        <div className="min-h-screen bg-grey flex flex-col md:flex-row justify-between items-center px-6 md:px-16 py-12">
          
          {/* Left Section */}
          <div className="max-w-xl mb-10 md:mb-0 p-6">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 contact-title">Contact</h2>
            <p className="text-2xl text-gray-600">
              Contact us to report a problem, clarify any doubts about PDF Tools, or just find out more.
            </p>
          </div>

          {/* Right Section: Contact Form */}
          {!showSuccessMessage && (
            <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-lg shadow-md p-8">
              
              {/* Name and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Your Name*</label>
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="Your Name" 
                    value={form.name} 
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Your Email*</label>
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="Your Email" 
                    value={form.email} 
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-blue-500 focus:border-blue-500" required />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Subject*</label>
                <select 
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Choose a subject...</option>
                  <option value="bug">Report a Problem</option>
                  <option value="support">Technical Support</option>
                  <option value="billing">Billing</option>
                  <option value="feedback">General Feedback</option>
                </select>

              </div>

              {/* Message */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Message*</label>
                <textarea 
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Write a message"
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  required
                ></textarea>

              </div>

              {/* Submit */}
              <button type="submit" onClick={SendMessage} className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-4 rounded-lg transition">
                Send message
              </button>

          </div>
          )}

              {showSuccessMessage && (

                <div className="w-full max-w-xl bg-white border border-gray-200 rounded-lg shadow-md p-8">
                  <div className="block mb-1 text-md font-medium text-gray-700">
                    <p><b className="text-xl">Dear {submittedName},</b><br></br>
                      Thank you for contacting us, your message has been submitted. We will get back to you as soon as possible!</p>
                  </div>
                </div>

              )}
            

        </div>
      </Main>
    </>
  );
}

export default Contact;
