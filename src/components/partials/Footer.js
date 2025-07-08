import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaGlobe, FaTiktok } from 'react-icons/fa';
import GooglePlayStore from '../../assets/images/google_play.svg';
import appStoreImage from '../../assets/images/app_store.svg';
import logo from '../../assets/images/logo.png';

function Footer() {
  return (
    <footer className="bg-gray-100 text-sm text-slate-600 p-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8">
          {/* Logo and Description */}
          <div>
            <img src={logo} className="h-10 mb-4" alt="PDFTOOLS Logo" />
            <p className="text-gray-600">
              The ultimate PDF toolkit to convert, merge, protect, and manage your documents effortlessly.
            </p>
            {/*<div className="flex mt-4 space-x-3">
              <img src={GooglePlayStore} alt="Google Play" className="h-8 cursor-pointer" />
              <img src={appStoreImage} alt="App Store" className="h-8 cursor-pointer" />
            </div>*/}
          </div>

          {/* Navigation Links */}
          
            <div>
              <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase">PDFTOOLS</h2>
              <ul className="space-y-2 text-gray-500 font-medium">
                <li><a href="/" className="hover:text-black">Home</a></li>
                <li><a href="/plans" className="hover:text-black">Pricing</a></li>
                <li><a href="/tools" className="hover:text-black">Tools</a></li>
                <li><a href="/faq" className="hover:text-black">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase">Company</h2>
              <ul className="space-y-2 text-gray-500 font-medium">
                <li><a href="/blog" className="hover:text-black">Blog</a></li>
                <li><a href="/legal" className="hover:text-black">Legal & Privacy</a></li>
                <li><a href="/contact" className="hover:text-black">Contact</a></li>
              </ul>
            </div>
          

          {/* Newsletter (Optional) */}
          
          <div>
            <h2 className="mb-4 text-sm font-semibold text-gray-900 uppercase">Subscribe</h2>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <a href="https://www.facebook.com/jowibtech/" target="_blank"  className="hover:text-red-500"><FaFacebookF /></a>
              <a href="https://twitter.com/Jowibtech" target="_blank"  className="hover:text-red-500"><FaTwitter /></a>
              <a href="https://www.instagram.com/jowibtechnologies/" target="_blank"  className="hover:text-red-500"><FaInstagram /></a>
              <a href="https://www.linkedin.com/company/jowib-technologies/" target="_blank"  className="hover:text-red-500"><FaLinkedinIn /></a>
              <a href="https://www.jowibtechnologies.com/" target="_blank" className="hover:text-red-500"><FaGlobe /></a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-6 border-gray-200" />

        {/* Bottom Row */}
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <span className="text-sm text-gray-500">© 2025 PDFTOOLS. All rights reserved.</span>
          
        </div>
      </div>
    </footer>
  );
}

export default Footer;
