import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/pages/Home";
import WordConverter from "./components/tools/WordtoPDF/WordConverter";
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import DownloadPdf from './components/tools/WordtoPDF/DownloadPdf';
import PdfFile from "./components/tools/PDFtoWord/PdfFile";
import PPTFile from "./components/tools/PptToPDF/PPTFile";
import ExcelFile from "./components/tools/ExceltoPDF/ExcelFile";
import HtmlFile from "./components/tools/HtmltoPDF/HtmlFile";
import MergePDF from "./components/tools/MergePDF/MergePDF";
import SplitPDF from "./components/tools/SplitPDF/SplitPDF";
import CompressPDF from "./components/tools/CompressPDF/CompressPDF";

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/" element={<Home />} />
          <Route path="/word-to-pdf" element={<WordConverter />} />
          <Route path="/pdf-to-word" element={<PdfFile />} />
          <Route path="/ppt-to-pdf" element={<PPTFile />} />
          <Route path="/excel-to-pdf" element={<ExcelFile />} />
          <Route path="/html-to-pdf" element={<HtmlFile />} />
          <Route path="/merge-pdf" element={<MergePDF />} />
          <Route path="/split-pdf" element={<SplitPDF />} />
          <Route path="/compress-pdf" element={<CompressPDF />} />

          <Route path="/download/:token" element={<DownloadPdf />} />

        </Routes>
      </div>
    </Router>
  );
}
export default App;
