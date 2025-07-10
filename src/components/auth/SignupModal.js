import React, { useEffect, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { Helmet } from 'react-helmet-async';
import Cookies from 'js-cookie';

function SignupModal({
  showModal,
  closeModal,
  setForm,
  form,
  handleChange,
  handleSubmit,
  handleLoginRedirect,
  paymentGateway,
  startRazorpayPayment,
}) {

	
	return (
		<div className="content">
			{showModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
		          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl scrollbar-red overflow-y-auto max-h-screen">
		            <div className='modal-header p-6'>
			            <button
			              className="absolute top-3 right-3 text-white hover:text-white text-4xl font-bold"
			              onClick={closeModal}
			            >
			              &times;
			            </button>

			            <h2 className="text-4xl font-semibold text-center text-yellow-600 mb-1">
			              Upgrade to Premium
			            </h2>
			           
		            </div>

		            <div className="flex flex-col gap-3 p-4 items-center">
		              <GoogleLogin
		                onSuccess={(credentialResponse) => {
		                  const decoded = jwtDecode(credentialResponse.credential);

		                  fetch(`${process.env.REACT_APP_BACKEND_API_URL}auth/google-login`, {
		                    method: 'POST',
		                    headers: {
		                      'Content-Type': 'application/json'
		                    },
		                    body: JSON.stringify({
		                      token: credentialResponse.credential
		                    })
		                  })
		                  .then(res => res.json())
		                  .then(data => {
		                    if (data.token) {
		                      localStorage.setItem("token", data.token);
		                      localStorage.setItem("user", JSON.stringify('data.user'));
		                      alert("Google Login Successful!");
		                    } else {
		                      alert("Google login failed.");
		                    }
		                  })
		                  .catch(err => {
		                    console.error("Google login error:", err);
		                  });
		                }}
		                onError={() => {
		                  alert("Google login failed.");
		                }}
		                width="100"
		                text="signup_with"
		                shape="rectangular"
		              />
		            </div>

		            <div className="space-y-3 mb-4 p-6">
		              <input
		                type="text"
		                name="name"
		                placeholder="Name"
		                value={form.name} 
		                onChange={handleChange}
		                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
		              />
		              <input
		                type="email"
		                name="email"
		                value={form.email} 
		                onChange={handleChange}
		                placeholder="Email"
		                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
		              />
		              <input
		                type="password"
		                name="password"
		                value={form.password}
		                onChange={handleChange}
		                placeholder="Password"
		                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
		              />

		              <input
		                type="password"
		                name="confirm_password"
		                value={form.confirm_password}
		                onChange={handleChange}
		                placeholder="Confirm Password"
		                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
		              />
		            </div>

		            <div className="p-4">
		            <button
		              onClick={handleSubmit}
		              className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 mb-3"
		            >
		              Sign up
		            </button>
		            </div>

		            <p className="text-sm text-center text-gray-600">
		              Already member?{' '}
		              <button className="text-red-600 hover:underline" onClick={handleLoginRedirect}>
		                Log in
		              </button>
		            </p>

		            <p className="text-xs text-center text-gray-500 mt-4">
		              By creating an account, you agree to iLovePDF{' '}
		              <span className="underline">Terms of Service</span> and{' '}
		              <span className="underline">Privacy Policy</span>.
		            </p>
		            <p className="text-xs text-center text-gray-500 mt-1">
		              Secure. Private. In your control.
		            </p>
		          </div>
		        </div>
			)}
		</div>
	);
}

export default SignupModal;