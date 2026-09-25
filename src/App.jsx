import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { CompareProvider } from './context/CompareContext';
import Navbar from './layouts/Navbar';
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

/* ── Floating Enquire Now Button ── */
const EnquireNowButton = () => {
  const navigate = useNavigate();
  return (
    <>
      <style>{`
        @keyframes enquire-pulse {
          0%   { box-shadow: 0 0 0 0 rgba(56,189,248,0.50); }
          70%  { box-shadow: 0 0 0 10px rgba(56,189,248,0); }
          100% { box-shadow: 0 0 0 0 rgba(56,189,248,0); }
        }
        .enquire-fab {
          position: fixed;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          z-index: 9998;
          writing-mode: vertical-rl;
          text-orientation: mixed;
          background: linear-gradient(180deg, #0ea5e9, #38BDF8);
          color: #fff;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 1.4rem 0.7rem;
          border-radius: 0;
          border: none;
          cursor: pointer;
          animation: enquire-pulse 2.5s infinite;
          transition: padding 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
          box-shadow: -3px 0 18px rgba(14,165,233,0.30);
          font-family: inherit;
          line-height: 1;
        }
        .enquire-fab:hover {
          background: linear-gradient(180deg, #0284c7, #0ea5e9);
          padding: 1.6rem 0.85rem;
          animation: none;
          box-shadow: -4px 0 28px rgba(14,165,233,0.50);
        }
      `}</style>
      <button
        className="enquire-fab"
        onClick={() => navigate('/contact')}
        aria-label="Enquire Now"
      >
        Enquire Now
      </button>
    </>
  );
};

function App() {
  return (
    <CompareProvider>
      <Router>
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
            </Routes>
          </main>
          <FlatCompareModal />
          <EnquireNowButton />
        </div>
      </Router>
    </CompareProvider>
  );
}

export default App;
