import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { CompareProvider } from './context/CompareContext';
import Navbar from './layouts/Navbar';
import Footer from './layouts/Footer';
import FlatCompareModal from './components/FlatCompareModal';

// Pages
import Home from './pages/Home';
import TowerView from './pages/TowerView';
import FloorView from './pages/FloorView';
import FlatDetails from './pages/FlatDetails';
import LocationMap from './pages/LocationMap';
import Gallery from './pages/Gallery';
import Specifications from './pages/Specifications';
import Contact from './pages/Contact';

/* ── Floating Contact Us / Enquire Button ── */
const EnquireNowButton = () => {
  const navigate = useNavigate();
  return (
    <>
      <style>{`
        @keyframes enquire-pulse {
          0%   { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.50); }
          70%  { box-shadow: 0 0 0 10px rgba(56, 189, 248, 0); }
          100% { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0); }
        }
        .enquire-fab {
          position: fixed;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          z-index: 9998;
          background: #38BDF8;
          color: #000000;
          padding: 1.25rem 0.65rem;
          border-radius: 6px 0 0 6px;
          border: none;
          cursor: pointer;
          animation: enquire-pulse 2.5s infinite;
          transition: padding 0.25s ease, background 0.25s ease, box-shadow 0.25s ease, color 0.25s ease;
          box-shadow: -3px 0 18px rgba(56, 189, 248, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .enquire-fab:hover {
          background: #0284c7;
          color: #ffffff;
          padding: 1.35rem 0.75rem;
          animation: none;
          box-shadow: -4px 0 28px rgba(14, 165, 233, 0.60);
        }
        .enquire-fab-text {
          writing-mode: vertical-rl;
          transform: rotate(180deg);
          font-family: inherit;
          font-size: 0.85rem;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          line-height: 1;
          white-space: nowrap;
        }
      `}</style>
      <button
        className="enquire-fab"
        onClick={() => navigate('/contact')}
        aria-label="Contact Us"
        title="Contact Us"
      >
        <span className="enquire-fab-text">CONTACT US</span>
      </button>
    </>
  );
};

function AppContent() {
  const location = useLocation();
  const showFooter =
    location.pathname.startsWith('/gallery') ||
    location.pathname.startsWith('/specifications') ||
    location.pathname.startsWith('/contact');

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tower/:id" element={<TowerView />} />
          <Route path="/floor/:towerId/:floorNo" element={<FloorView />} />
          <Route path="/flat/:towerId/:floorNo/:flatNo" element={<FlatDetails />} />
          <Route path="/location" element={<LocationMap />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/specifications" element={<Specifications />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {showFooter && <Footer />}
      <FlatCompareModal />
      <EnquireNowButton />
    </div>
  );
}

function App() {
  return (
    <CompareProvider>
      <Router>
        <AppContent />
      </Router>
    </CompareProvider>
  );
}

export default App;
