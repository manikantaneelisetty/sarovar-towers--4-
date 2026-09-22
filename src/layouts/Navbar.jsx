import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { Menu, X, ArrowLeftRight } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { compareList, setIsCompareOpen } = useCompare();
  const location = useLocation();
  const isFloorView = location.pathname.startsWith('/floor/') || location.pathname.startsWith('/flat/') || location.pathname.startsWith('/tower/');

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`topbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="logo-area" onClick={closeMenu}>
          <img src="/Aparna Sarover.png" alt="Aparna Logo" className="logo" />
        </Link>

        {/* Desktop Navbar */}
        <nav className={`navbar ${isOpen ? 'active' : ''} ${isFloorView ? 'floor-view-nav' : ''}`}>
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/location" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>
            Location Map
          </NavLink>
          <NavLink to="/gallery" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>
            Gallery
          </NavLink>
          <NavLink to="/specifications" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>
            Specifications
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>
            Contact
          </NavLink>

          {compareList.length > 0 && (
            <button
              onClick={() => {
                setIsCompareOpen(true);
                closeMenu();
              }}
              style={{
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid var(--primary)',
                color: 'var(--primary)',
                cursor: 'pointer',
                borderRadius: '20px',
                padding: '0.4rem 1rem',
                fontSize: '0.85rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                fontFamily: 'var(--font-display)',
                marginLeft: '10px',
                boxShadow: '0 0 10px rgba(56, 189, 248, 0.1)'
              }}
              className="compare-badge"
              onMouseOver={e => {
                e.currentTarget.style.background = 'rgba(56, 189, 248, 0.25)';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(56, 189, 248, 0.3)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = 'rgba(56, 189, 248, 0.15)';
                e.currentTarget.style.boxShadow = '0 0 10px rgba(56, 189, 248, 0.1)';
              }}
            >
              <ArrowLeftRight size={14} />
              Compare ({compareList.length})
            </button>
          )}
        </nav>

        {/* Mobile menu toggle */}
        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
          {isOpen ? <X size={24} color={isFloorView ? "black" : "white"} /> : <Menu size={24} color={isFloorView ? "black" : "white"} />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
