import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from '../../assets/images/logo.png';
import { FaBars, FaTimes, FaCaretDown } from 'react-icons/fa';
import Cookies from 'js-cookie';

function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const token = Cookies.get("access_token");
  const userString = Cookies.get("current_user");
  let user = null;
  if (userString) {
    user = JSON.parse(userString);

  }
  const role = Cookies.get('role');
  

  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

 
const isTablet = screenWidth >= 640 && screenWidth <= 974;
const isDesktop = screenWidth > 974;

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

 useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if(token) {
      setIsAuthenticated(true);
    }
  }, [token]);

  const handleLogout = () => {
    Cookies.remove('access_token');
    Cookies.remove('current_user');
    setIsAuthenticated(false);
    navigate('/login');
  }

  const navItems = [
      {
      title: "CONVERT PDF",
      url: "/",
      dropdownGrouped: [
        {
          title: "CONVERT TO PDF",
          tools: [
            { title: "JPG to PDF", url: "/jpg-to-pdf", icon: "ico--jpgpdf" },
            { title: "WORD to PDF", url: "/word-to-pdf", icon: "ico--wordpdf" },
            // { title: "POWERPOINT to PDF", url: "/powerpoint-to-pdf", icon: "ico--powerpointpdf" },
            { title: "EXCEL to PDF", url: "/excel-to-pdf", icon: "ico--excelpdf" },
            { title: "HTML to PDF", url: "/html-to-pdf", icon: "ico--htmlpdf" },
          ],
        },
      ],
    },
    {
      title: "ALL PDF TOOL",
      url: "/",
      dropdownGrouped: [
        {
          title: "Organize PDF",
          tools: [
            { title: "Merge PDF", url: "/merge-pdf", icon: "ico--merge" },
            { title: "Split PDF", url: "/split-pdf", icon: "ico--split" },
          ],
        },
        {
          title: "Convert to PDF",
          tools: [
            { title: "JPG to PDF", url: "/jpg-to-pdf", icon: "ico--jpgpdf" },
            { title: "Word to PDF", url: "/word-to-pdf", icon: "ico--wordpdf" },
            { title: "Excel to PDF", url: "/excel-to-pdf", icon: "ico--excelpdf" },
            { title: "HTML to PDF", url: "/html-to-pdf", icon: "ico--htmlpdf" },
          ],
        },
        {
          title: "Edit PDF",
          tools: [
            { title: "Rotate PDF", url: "/rotate-pdf", icon: "ico--rotate" },
            { title: "Add watermark", url: "/watermark", icon: "ico--watermark" },
          ],
        },
        
      ],
    },
    { title: "PRICING", url: "/plans" },
    { title: "CONTACT", url: "/contact" },
  ];

  return (
    <header className="header bg-white shadow fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-bold text-red-600">
          <Link to="/">
            <img src={logo} alt="PDFTools" className="w-20" />
          </Link>
        </div>

        {/* Hamburger Icon for Mobile */}
        <div className="sm:hidden">
          <button onClick={toggleMobileMenu} className="text-2xl text-gray-700 focus:outline-none">
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Navigation Desktop */}
       

        <nav className="hidden sm:flex items-center space-x-4 relative w-full justify-end">
          {/* Tablet View: Show Tools Button */}
          {isTablet && (
            <div className="relative tools-dropdown">
              <button
                onClick={toggleDropdown}
                className="text-slate-700 font-medium flex items-center hover:text-red-600"
              >
                Tools <FaCaretDown className="ml-1" />
              </button>
              {dropdownOpen && (
                <div className="absolute top-full right-0 mt-2 z-50 bg-white border border-gray-200 shadow-xl rounded-lg p-6 flex space-x-8 text-sm">
                  {navItems.map(({ title, dropdownGrouped }) =>
                    dropdownGrouped?.length ? (
                      dropdownGrouped.map((group, idx) => (
                        <div key={title + idx}>
                          <div className="font-semibold mb-2 text-gray-800">{group.title}</div>
                          <ul className="space-y-1">
                            {group.tools.map((tool) => (
                              <li key={tool.url}>
                                <Link
                                  to={tool.url}
                                  className="flex items-center space-x-2 text-slate-700 hover:text-red-600"
                                >
                                  <i className={`ico ${tool.icon}`}></i>
                                  <span>{tool.title}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))
                    ) : null
                  )}
                </div>
              )}
            </div>
          )}

          {/* Desktop View: Full Nav Items */}
          {isDesktop && (
            <>
              {navItems.map(({ title, url, dropdownGrouped }) => (
                <div key={url} className="group relative">
                  <Link
                    to={url}
                    className="rounded-lg px-3 py-2 text-slate-700 font-medium hover:text-red-600"
                  >
                    {title}
                  </Link>

                  {dropdownGrouped && (
                    <div className="dropdowngrouped absolute left-0 top-full z-20 hidden group-hover:flex bg-white shadow-xl mt-4 p-6 rounded-lg text-sm space-x-10 border border-gray-200">
                      {dropdownGrouped.map((group, idx) => (
                        <div key={idx}>
                          <div className="font-semibold mb-2 text-gray-800">{group.title}</div>
                          <ul className="space-y-1">
                            {group.tools.map((tool) => (
                              <li key={tool.url}>
                                <Link
                                  to={tool.url}
                                  className="flex items-center space-x-2 text-slate-700 hover:text-red-600"
                                >
                                  <i className={`ico ${tool.icon}`}></i>
                                  <span>{tool.title}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}

          {/* Auth Section (Always visible) */}
          {!isAuthenticated ? (
            <>
              <div className="group relative">
                <Link
                  to="/login"
                  className="rounded-lg px-2 py-2 text-slate-700 font-medium hover:text-red-600"
                >
                  Login
                </Link>
              </div>
              <div className="group relative">
                <Link
                  to="/signup"
                  className="rounded-lg px-2 py-2 text-white bg-red-600 font-medium hover:bg-red-700"
                >
                  Sign up
                </Link>
              </div>
            </>
          ) : (
            <div className="relative inline-block">
              <div className="flex items-center">
                <button className="rounded-lg px-3 text-slate-700 font-medium hover:text-red-600">
                  {user?.name}
                </button>
                <FaCaretDown onClick={toggleDropdown} className="cursor-pointer" />
              </div>
              {dropdownOpen && (
                <div className="absolute right-0 z-10 bg-white shadow-md rounded-lg mt-2 w-48">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

      </div>

      {/* Mobile Nav Panel */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white shadow-md px-4 pb-4 max-h-screen overflow-y-auto scrollbar-red">
          {navItems.map(({ title, url, dropdown, dropdownGrouped }) => (
            <div key={url} className="py-2">
              <Link
                to={url}
                className="block px-2 py-2 text-slate-700 font-medium hover:text-red-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                {title}
              </Link>

              {/* Basic Dropdown on Mobile */}
              {dropdown && (
                <div className="pl-4 mt-1 space-y-1">
                  {dropdown.map((item) => (
                    <Link
                      key={item.url}
                      to={item.url}
                      className="block text-sm text-slate-600 hover:text-red-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span>{item.title}</span>
                    </Link>
                  ))}
                </div>
              )}

              {/* Grouped Dropdown on Mobile */}
              {dropdownGrouped && (
                <div className="pl-4 mt-1">
                  {dropdownGrouped.map((group, idx) => (
                    <div key={idx} className="mb-2">
                      <div className="text-gray-800 text-sm font-semibold">{group.title}</div>
                      <ul className="pl-2 space-y-1">
                        {group.tools.map((tool) => (
                          <li key={tool.url}>
                            <Link
                              to={tool.url}
                              className="text-sm text-slate-600 hover:text-red-600 flex"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <i className={`ico ${tool.icon}`}></i>
                          <span className="px-2">{tool.title}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

           {/* Auth Buttons at Bottom */}
            <div className="mt-4 border-t pt-4">
              {!isAuthenticated ? (
                <>
                <div className="flex justify-between">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center px-4 py-2 rounded-md border border-red-600 text-red-600 hover:bg-red-50 font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 font-medium ml-2"
                  >
                    Sign up
                  </Link>
                 
                </div>
                <div className="py-6"></div>
                </>
              ) : (
                <button
                  onClick={() => {
                    Cookies.remove("access_token");
                    Cookies.remove("user");
                    setIsAuthenticated(false);
                    navigate("/login");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 mt-2 text-sm text-red-600 hover:text-red-800"
                >
                  Logout
                </button>
              )}
            </div>
        </div>
      )}
    </header>
  );
}

export default Header;
