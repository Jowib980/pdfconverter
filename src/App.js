import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/pages/Home";
import WordConverter from "./components/tools/WordtoPDF/WordConverter";
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import DownloadPdf from './components/tools/WordtoPDF/DownloadPdf';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/" element={<Home />} />
          <Route path="/word-to-pdf" element={<WordConverter />} />
          <Route path="/download/:token" element={<DownloadPdf />} />

        </Routes>
      </div>
    </Router>
  );
}
export default App;
