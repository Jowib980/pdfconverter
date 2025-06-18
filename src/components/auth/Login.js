import React from 'react';
import loginImg from '../../assets/images/login.png'; // Your right-side illustration
import { FaFacebook, FaGoogle, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="grid grid-cols-1 md:grid-cols-12 w-full max-w-6xl bg-white shadow-lg rounded-lg overflow-hidden">
        
        {/* Left Panel - Form (7/12) */}
        <div className="md:col-span-7 px-8 py-12 flex flex-col justify-center items-center">
          <img src="" alt="PDFTOOLS" className="mb-4" />
          <h2 className="text-2xl font-bold text-center mb-6">Login to your account</h2>

          {/* Social Buttons */}
          <div className="flex space-x-3 w-full max-w-sm mb-6 justify-center">
            <a
              href="/auth/auth?authclient=facebook"
              className="flex items-center justify-center bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-800 transition w-32"
            >
              <FaFacebook className="mr-2" /> Facebook
            </a>
            <a
              href="/auth/auth?authclient=google"
              className="flex items-center justify-center border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition w-32"
            >
              <FaGoogle className="mr-2" /> Google
            </a>
            <a
              href="/auth/auth?authclient=sso"
              className="flex items-center justify-center border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition w-32"
            >
              <FaUser className="mr-2" /> SSO
            </a>
          </div>

          {/* Login Form */}
          <form action="/login" method="post" className="w-full max-w-sm space-y-4">
            <div className="relative">
              <span className="absolute top-3 left-3 text-gray-400">
                <FaEnvelope />
              </span>
              <input
                type="text"
                name="LoginForm[email]"
                placeholder="Enter your email"
                className="pl-10 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="relative">
              <span className="absolute top-3 left-3 text-gray-400">
                <FaLock />
              </span>
              <input
                type="password"
                name="LoginForm[password]"
                placeholder="Password"
                className="pl-10 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="text-right">
              <a
                href="https://www.ilovepdf.com/login/forgetpassword"
                className="text-sm text-red-600 hover:underline font-semibold"
              >
                <u>Forgot your password?</u>
              </a>
            </div>

            <input type="hidden" name="remember" value="1" />

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
            >
              Log in
            </button>

            <p className="text-center text-sm mt-4">
              Don’t have an account?{' '}
              <Link to="/signup" className="text-red-600 font-medium hover:underline font-semibold">
                <u>Create an account</u>
              </Link>
            </p>
          </form>
        </div>

        {/* Right Panel - Illustration (5/12) */}
        <div className="md:col-span-5 bg-gray-100 flex flex-col items-center justify-center p-10 text-center">
          <img src={loginImg} alt="login" className="mb-6 w-3/4" />
          <h2 className="text-xl font-semibold mb-2">Log in to your workspace</h2>
          <p className="text-gray-600">
            Enter your email and password to access your iLovePDF account. You are one step closer to boosting your
            document productivity.
          </p>
          <a href="#" className="text-sm text-blue-600 hover:underline mt-4">See all tools</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
