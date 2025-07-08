import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from '../../assets/images/logo.png';
import { FaBars, FaTimes } from 'react-icons/fa';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

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
    { title: "PRICING", url: "/plans" },
    { title: "CONTACT", url: "/contact" },
  ];

  return (
    <header className="header bg-white shadow fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
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
        <nav className="hidden sm:flex space-x-4 relative">
          {navItems.map(({ title, url, dropdown, dropdownGrouped }) => (
            <div key={url} className="group relative">
              <a href={url} className="rounded-lg px-3 py-2 text-slate-700 font-medium hover:text-red-600">
                {title}
              </a>

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
      </div>

      {/* Mobile Nav Panel */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white shadow-md px-4 pb-4">
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
                      {item.title}
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
                              className="text-sm text-slate-600 hover:text-red-600"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {tool.title}
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
        </div>
      )}
    </header>
  );
}

export default Header;
