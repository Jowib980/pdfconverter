import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProtectedRoute from './ProtectedRoute';
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
import RotatePDF from "./components/tools/RotatePDF/RotatePDF";
import JpgFile from "./components/tools/JPGtoPDF/JpgFile";
import WatermarkFile from "./components/tools/Watermark/WatermarkFile";
import Plans from "./components/pages/Plans";
import Contact from "./components/pages/Contact";
import PaypalPayment from './components/pages/PaypalPayment';
import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
   
    <Router>
      <div className="app">
        <Routes>
         
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/"
            element={
              <Home />
            }
          />

          <Route 
            path="/word-to-pdf"
            element={
              // <ProtectedRoute>
                <WordConverter />
              // </ProtectedRoute>
            } 
          />

          <Route 
            path="/pdf-to-word"
            element={
              // <ProtectedRoute>
                <PdfFile />
              // </ProtectedRoute>
            } 
          />

          <Route
            path="/ppt-to-pdf"
            element={
              // <ProtectedRoute>
                <PPTFile />
              // </ProtectedRoute>
            } 
          />

          <Route 
            path="/excel-to-pdf"
            element={
              // <ProtectedRoute>
                <ExcelFile />
              // </ProtectedRoute>
            }
          />

          <Route 
            path="/html-to-pdf"
            element={
              // <ProtectedRoute>
                <HtmlFile />
              // </ProtectedRoute>
            }
          />

          <Route
            path="/merge-pdf"
            element={
              // <ProtectedRoute>
                <MergePDF />
                // </ProtectedRoute>
              }
            />

          <Route
            path="/split-pdf"
            element={
              // <ProtectedRoute>
                <SplitPDF />
              // </ProtectedRoute>
            }
          />

          <Route
            path="/compress-pdf"
            element={
              // <ProtectedRoute>
                <CompressPDF />
                // </ProtectedRoute>
              }
            />

          <Route
            path="/rotate-pdf"
            element={
              // <ProtectedRoute>
                <RotatePDF />
              // </ProtectedRoute>
            }
          />

          <Route
            path="/download/:token"
            element={
              // <ProtectedRoute>
                <DownloadPdf />
              // </ProtectedRoute>
            }
          />

          <Route
            path="/jpg-to-pdf"
            element={
              // <ProtectedRoute>
                <JpgFile />
              // </ProtectedRoute>
            }
          />

           <Route
            path="/watermark"
            element={
              // <ProtectedRoute>
                <WatermarkFile />
              // </ProtectedRoute>
            }
          />

          <Route
            path="/plans"
            element={
              // <ProtectedRoute>
                <Plans />
              // </ProtectedRoute>
            }
          />

          <Route
            path="/contact"
            element={
              // <ProtectedRoute>
                <Contact />
              // </ProtectedRoute>
            }
          />

          <Route
            path="/payment"
            element={
              // <ProtectedRoute>
                <PaypalPayment />
              // </ProtectedRoute>
            }
          />
          
            }
        
        </Routes>
      </div>
    </Router>
    </HelmetProvider>
  );
}
export default App;
