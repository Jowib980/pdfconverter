import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaGlobe, FaTiktok } from 'react-icons/fa';
import GooglePlayStore from '../../assets/images/google_play.svg';
import appStoreImage from '../../assets/images/app_store.svg';

function Footer() {
  return (
    <footer className="bg-gray-100 text-sm text-slate-600 pt-10">
      <div className="container mx-auto px-6">

        {/* Top: Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-b pb-8">
          <div>
            <h4 className="text-red-600 font-bold mb-3">PDFTOOLS</h4>
            <ul className="space-y-1">
              <li>Home</li>
              <li>Pricing</li>
              <li>Security</li>
              <li>Tools</li>
              <li>FAQ</li>
            </ul>
          </div>

          <div>
            <h4 className="text-red-600 font-bold mb-3">PRODUCT</h4>
            <ul className="space-y-1">
              <li>PDFTools Desktop</li>
              <li>PDFTools Mobile</li>
              <li>Developers</li>
              <li>Features</li>
              <li>iloveimg.com</li>
            </ul>
          </div>

          <div>
            <h4 className="text-red-600 font-bold mb-3">SOLUTIONS</h4>
            <ul className="space-y-1">
              <li>Business</li>
              <li>Education</li>
            </ul>
          </div>

          <div>
            <h4 className="text-red-600 font-bold mb-3">COMPANY</h4>
            <ul className="space-y-1">
              <li>Our Story</li>
              <li>Blog</li>
              <li>Press</li>
              <li>Legal & Privacy</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>

        {/* Middle: Language + Store buttons */}
        <div className="flex flex-col md:flex-row justify-between items-center py-6 border-b">
          <div className="flex items-center space-x-2 text-slate-700">
            <FaGlobe />
            <span>English</span>
          </div>

          <div className="flex space-x-3 mt-4 md:mt-0">
            <img src={GooglePlayStore} alt="Google Play" className="h-10" />
            <img src={appStoreImage} alt="App Store" className="h-10" />
          </div>
        </div>

        {/* Bottom: Copyright + Social */}
        <div className="flex flex-col md:flex-row justify-between items-center py-6">
          <p>© PDFTools 2025 ® - Your PDF Editor</p>
          <div className="flex space-x-4 mt-4 md:mt-0 text-xl text-slate-600">
            <FaXTwitter />
            <FaFacebookF />
            <FaLinkedinIn />
            <FaInstagram />
            <FaTiktok />
          </div>
        </div>
      </div>
    </footer>
  );
}

// You might need to define this if FaXTwitter isn't available
function FaXTwitter() {
  return (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M21.7 2H18.3L12 9.5L5.7 2H2L10.6 12L2 22H5.4L12 14.5L18.3 22H21.7L13.1 12L21.7 2Z" />
    </svg>
  );
}

export default Footer;
