import React, { useEffect, useState } from 'react';
import loginImg from '../../assets/images/login.png'; // Your right-side illustration
import { FaFacebook, FaGoogle, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../Loader.js';
import { Helmet } from 'react-helmet-async';
import Cookies from 'js-cookie';

function Signup() {
const navigate = useNavigate();
const [loading, setLoading] = useState(false);
const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
  });

const token = Cookies.get("access_token");

  useEffect(() => {
    if(token) {
      Cookies.remove('access_token');
      Cookies.remove('user');
    }
  })


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    setLoading(true);
    e.preventDefault();

    if (form.password !== form.confirm_password) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(` ${process.env.REACT_APP_BACKEND_API_URL}register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          password_confirmation: form.confirm_password
        })
      });

      const data = await response.json();

      if (response.ok) {
        setLoading(false);
        toast.success("Otp Sent to your registered mail. Please verify to continue!");
        const email =form.email;
        navigate('/verify-otp', { state : { email } });
      } else {
        setLoading(false);
        toast.error(data.message || "Registration failed.");
      }
    } catch (error) {
      toast.error("Signup error:", error);
      setLoading(false);
    }
  };

  return (
    <>

       <Helmet>
        <title>Signup | My PDF Tools</title>
      </Helmet>

    <div className="min-h-screen flex items-center justify-center bg-white">

    <ToastContainer />

    {loading ? (

      <Loader />
      ): (

      <div className="grid grid-cols-1 md:grid-cols-12 w-full max-w-6xl bg-white shadow-lg rounded-lg overflow-hidden">
        
        {/* Left Panel - Form (7/12) */}
        <div className="md:col-span-7 px-8 py-12 flex flex-col justify-center items-center">
          <img src="" alt="PDFTOOLS" className="mb-4" />
          <h2 className="text-2xl font-bold text-center mb-6">Create new account</h2>

          {/* Social Buttons */}
          <div className="flex space-x-3 w-full max-w-sm mb-6 justify-center">
            {/* <a
              href="/auth/auth?authclient=facebook"
              className="flex items-center justify-center bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-800 transition w-32"
            >
              <FaFacebook className="mr-2" /> Facebook
            </a> */}
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
                    navigate('/');
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

            {/* <a
              href="/auth/auth?authclient=sso"
              className="flex items-center justify-center border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition w-32"
            >
              <FaUser className="mr-2" /> SSO
            </a> */}
          </div>

          {/* Login Form */}
          <form action="/login" method="post" className="w-full max-w-sm space-y-4">
	          <div className="relative">
	              <span className="absolute top-3 left-3 text-gray-400">
	                <FaUser />
	              </span>
	              <input
	                type="text"
	                name="name"
	                placeholder="Name"
                  value={form.name} 
                  onChange={handleChange}
	                className="pl-10 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500"
	              />
	            </div>
	            <div className="relative">
	              <span className="absolute top-3 left-3 text-gray-400">
	                <FaEnvelope />
	              </span>
	              <input
	                type="text"
	                name="email"
	                placeholder="Email"
                  value={form.email} onChange={handleChange}
	                className="pl-10 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500"
	              />
	            </div>

	            <div className="relative">
	              <span className="absolute top-3 left-3 text-gray-400">
	                <FaLock />
	              </span>
	              <input
	                type="password"
	                name="password"
	                placeholder="Password"
                  value={form.password} onChange={handleChange}
	                className="pl-10 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500"
	              />
	            </div>

              <div className="relative">
                <span className="absolute top-3 left-3 text-gray-400">
                  <FaLock />
                </span>
                <input
                  type="password"
                  name="confirm_password"
                  placeholder="Confirm Password"
                  value={form.confirm_password} onChange={handleChange}
                  className="pl-10 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
              onClick={handleSignup}
            >
              Signup
            </button>

            <p className="text-center text-sm mt-4">
              Already member? {' '}
              <Link to="/login" className="text-red-600 font-medium hover:underline font-semibold">
                <u>Log in</u>
              </Link>
            </p>

            <p className="text-center text-sm mt-4">
            	By creating an account, you agree to PDFTools <Link to="/signup" className="text-red-600 font-medium hover:underline font-semibold">Terms of Service</Link> and <Link to="/signup" className="text-red-600 font-medium hover:underline font-semibold">Privacy Policy</Link>
            </p>
          </form>
        </div>

        {/* Right Panel - Illustration (5/12) */}
        <div className="md:col-span-5 bg-gray-100 flex flex-col items-center justify-center p-10 text-center">
          <img src={loginImg} alt="login" className="mb-6 w-3/4" />
          <h2 className="text-xl font-semibold mb-2">PDF tools for productive people</h2>
          <p className="text-gray-600">
            PDFTools helps you convert, edit, e-sign, and protect PDF files quickly and easily. Enjoy a full suite of tools to effectively manage documents —no matter where you’re working.
          </p>
          <a href="#" className="text-sm text-blue-600 hover:underline mt-4">See all tools</a>
        </div>
      </div>
      )}

    </div>
    </>
  );
}

export default Signup;
