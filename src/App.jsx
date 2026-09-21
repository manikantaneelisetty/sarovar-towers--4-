import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
        </div>
      </Router>
    </CompareProvider>
  );
}

export default App;
