import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from '../../assets/images/logo.png';

function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  let user = null;
  if (userString) {
    user = JSON.parse(userString);
  }
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    if(token) {
      setIsAuthenticated(true);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    navigate('/login');
  }

  const navItems = [
    { title: "MERGE PDF", url: "/merge-pdf" },
    { title: "SPLIT PDF", url: "/split-pdf" },
    { title: "COMPRESS PDF", url: "/compress-pdf" },
    {
      title: "CONVERT PDF",
      url: "/convert-pdf",
      dropdownGrouped: [
        {
          title: "CONVERT TO PDF",
          tools: [
            { title: "JPG to PDF", url: "/jpg-to-pdf", icon: "ico--jpgpdf" },
            { title: "WORD to PDF", url: "/word-to-pdf", icon: "ico--wordpdf" },
            { title: "POWERPOINT to PDF", url: "/powerpoint-to-pdf", icon: "ico--powerpointpdf" },
            { title: "EXCEL to PDF", url: "/excel-to-pdf", icon: "ico--excelpdf" },
            { title: "HTML to PDF", url: "/html-to-pdf", icon: "ico--htmlpdf" },
          ],
        },
        {
          title: "CONVERT FROM PDF",
          tools: [
            { title: "PDF to JPG", url: "/pdf-to-jpg", icon: "ico--pdfjpg" },
            { title: "PDF to WORD", url: "/pdf-to-word", icon: "ico--pdfword" },
            { title: "PDF to POWERPOINT", url: "/pdf-to-powerpoint", icon: "ico--pdfpowerpoint" },
            { title: "PDF to EXCEL", url: "/pdf-to-excel", icon: "ico--pdfexcel" },
            { title: "PDF to PDF", url: "/pdf-to-html", icon: "ico--pdfa" },
          ],
        }
      ],
    },
    {
      title: "ALL PDF TOOL",
      url: "/all-pdf",
      dropdownGrouped: [
        {
          title: "Organize PDF",
          tools: [
            { title: "Merge PDF", url: "/merge_pdf", icon: "ico--merge" },
            { title: "Split PDF", url: "/split_pdf", icon: "ico--split" },
            { title: "Remove pages", url: "/remove-pages", icon: "ico--remove" },
            { title: "Extract pages", url: "/split_pdf#split,extract", icon: "ico--extract" },
            { title: "Organize PDF", url: "/organize-pdf", icon: "ico--organize" },
            { title: "Scan to PDF", url: "/scan-pdf", icon: "ico--scan" },
          ],
        },
        {
          title: "Optimize PDF",
          tools: [
            { title: "Compress PDF", url: "/compress_pdf", icon: "ico--compress" },
            { title: "Repair PDF", url: "/repair-pdf", icon: "ico--repair" },
            { title: "OCR PDF", url: "/ocr-pdf", icon: "ico--pdfocr" },
          ],
        },
        {
          title: "Convert to PDF",
          tools: [
            { title: "JPG to PDF", url: "/jpg_to_pdf", icon: "ico--jpgpdf" },
            { title: "Word to PDF", url: "/word-to-pdf", icon: "ico--wordpdf" },
            { title: "PowerPoint to PDF", url: "/powerpoint_to_pdf", icon: "ico--powerpointpdf" },
            { title: "Excel to PDF", url: "/excel_to_pdf", icon: "ico--excelpdf" },
            { title: "HTML to PDF", url: "/html-to-pdf", icon: "ico--htmlpdf" },
          ],
        },
        {
          title: "Convert from PDF",
          tools: [
            { title: "PDF to JPG", url: "/pdf_to_jpg", icon: "ico--pdfjpg" },
            { title: "PDF to Word", url: "/pdf-to-word", icon: "ico--pdfword" },
            { title: "PDF to PowerPoint", url: "/pdf_to_powerpoint", icon: "ico--pdfpowerpoint" },
            { title: "PDF to Excel", url: "/pdf_to_excel", icon: "ico--pdfexcel" },
            { title: "PDF to PDF/A", url: "/convert-pdf-to-pdfa", icon: "ico--pdfa" },
          ],
        },
        {
          title: "Edit PDF",
          tools: [
            { title: "Rotate PDF", url: "/rotate-pdf", icon: "ico--rotate" },
            { title: "Add page numbers", url: "/add_pdf_page_number", icon: "ico--pagenumber" },
            { title: "Add watermark", url: "/pdf_add_watermark", icon: "ico--watermark" },
            { title: "Crop PDF", url: "/crop-pdf", icon: "ico--pdfcrop" },
            { title: "Edit PDF", url: "/edit-pdf", icon: "ico--editpdf" },
          ],
        },
        {
          title: "PDF Security",
          tools: [
            { title: "Unlock PDF", url: "/unlock_pdf", icon: "ico--unlock" },
            { title: "Protect PDF", url: "/protect-pdf", icon: "ico--protect" },
            { title: "Sign PDF", url: "/sign-pdf", icon: "ico--sign" },
            { title: "Redact PDF", url: "/redact-pdf", icon: "ico--redact" },
            { title: "Compare PDF", url: "/compare-pdf", icon: "ico--pdfcompare" },
          ],
        },
      ],
    },
  ];

  return (
    <header className="header bg-white shadow fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <div className="text-xl font-bold text-red-600">
          <Link to="/"><img src={logo} alt="PDFTools" className="w-20" /></Link>
        </div>

        {/* Navigation */}
        <nav className="hidden sm:flex space-x-4 relative">
          {navItems.map(({ title, url, dropdown, dropdownGrouped }) => (
            <div key={url} className="group relative">
              <Link
                to={url}
                className="rounded-lg px-3 py-2 text-slate-700 font-medium hover:text-red-600"
              >
                {title}
              </Link>

              {/* Basic Dropdown */}
              {dropdown && (
                <div className="absolute left-0 top-full z-10 hidden group-hover:block bg-white shadow-lg rounded-md mt-2 min-w-[160px]">
                  {dropdown.map((item) => (
                    <Link
                      key={item.url}
                      to={item.url}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-gray-100 hover:text-red-600"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              )}

              {/* Grouped Mega Dropdown */}
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
        </nav>

        {/* Auth Buttons */}
        {/* <div className="flex space-x-2">
        {isAuthenticated ? (
             <>
          <button
            onClick={toggleDropdown}
            className="relative flex items-center space-x-2 px-4 py-2 "
          >
            <span className="text-slate-700 font-medium">{user ? user.name : 'Guest'}</span>
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              {user?.roles?.some(role => role.name === 'admin') ? (
                <a
                  href={`${process.env.REACT_APP_BACKEND_URL}/auth/token-login?token=${token}`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Admin Dashboard
                </a>
              ) : (
                <a
                  href={`${process.env.REACT_APP_BACKEND_URL}/auth/token-login?token=${token}`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  User Dashboard
                </a>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          )}
        </>

          ) : (
            <>
              <Link
                to="/login"
                className="text-sm px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-sm px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Sign Up
              </Link>
            </>
          )}
          
        </div>
      */}
      </div>
    </header>
  );
}

export default Header;
