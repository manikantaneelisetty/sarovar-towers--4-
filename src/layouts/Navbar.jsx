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

  /* Pages that need black links (light background, no forced dark bar) */
  const isLightNav =
    location.pathname.startsWith('/floor/') ||
    location.pathname.startsWith('/flat/');

  /* Gallery, Specifications & Contact → same dark transparent navbar as LocationMap
     (white links on a subtle dark bar, regardless of scroll position)     */
  const isDarkForced =
    location.pathname.startsWith('/gallery') ||
    location.pathname.startsWith('/specifications') ||
    location.pathname.startsWith('/contact');

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu  = () => setIsOpen(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* On route change reset scroll-state check immediately */
  useEffect(() => {
    setIsScrolled(window.scrollY > 20);
  }, [location.pathname]);

  /* ── inline style for header ── */
  const headerStyle = isDarkForced && !isScrolled
    ? {
        background: 'rgba(5, 6, 8, 0.72)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }
    : {};

  return (
    <header
      className={`topbar ${isScrolled ? 'scrolled' : ''}`}
      style={headerStyle}
    >
      <div className="nav-container">
        <Link to="/" className="logo-area" onClick={closeMenu}>
          <img src="/Aparna Sarover.png" alt="Aparna Logo" className="logo" />
        </Link>

        {/* Desktop Navbar */}
        <nav className={`navbar ${isOpen ? 'active' : ''} ${isFloorView ? 'floor-view-nav' : ''} ${isLightNav ? 'light-nav-items' : ''}`}>
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
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                cursor: 'pointer',
                borderRadius: '20px',
                padding: '0.4rem 1rem',
                fontSize: '0.85rem',
                fontWeight: '400',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                marginLeft: '10px',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
              }}
              className="compare-badge"
              onMouseOver={e => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 255, 255, 0.1)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.4)';
                e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
              }}
            >
              <ArrowLeftRight size={14} />
              Compare ({compareList.length})
            </button>
          )}
        </nav>

        {/* Mobile menu toggle */}
        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
          {isOpen
            ? <X    size={24} color={isLightNav ? 'black' : 'white'} />
            : <Menu size={24} color={isLightNav ? 'black' : 'white'} />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
