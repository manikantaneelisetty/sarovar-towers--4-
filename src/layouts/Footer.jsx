import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      background: '#09090b',
      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      padding: '3rem 4% 2rem 4%',
      color: 'var(--text-secondary)',
      fontSize: '0.9rem',
      fontFamily: 'var(--font-body)'
    }}>
      <div style={{
        maxWidth: '1600px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem',
        marginBottom: '2.5rem'
      }}>
        <div>
          <img src="/Ap-logo.png" alt="Aparna Logo" style={{ height: '36px', marginBottom: '1rem' }} />
          <p style={{ maxWidth: '300px', lineHeight: '1.6', fontSize: '0.85rem' }}>
            Ultra-luxury 3 & 4 BHK high-rise residences in Nallagandla, Hyderabad. Premium specifications, modern amenities, and elevated lifestyle.
          </p>
        </div>

        <div>
          <h4 style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)', marginBottom: '1rem', fontSize: '1rem', fontWeight: '400' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <li><Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>Home</Link></li>
            <li><Link to="/location" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>Location Map</Link></li>
            <li><Link to="/gallery" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>Gallery</Link></li>
            <li><Link to="/specifications" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>Specifications</Link></li>
            <li><Link to="/contact" style={{ color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}>Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)', marginBottom: '1rem', fontSize: '1rem', fontWeight: '400' }}>Contact Info</h4>
          <p style={{ lineHeight: '1.6', fontSize: '0.85rem' }}>
            Nallagandla, Hyderabad,<br />
            Telangana, India<br /><br />
            Mobile: +91 6309030303<br />
            Email: info@thetrilight.com
          </p>
        </div>
      </div>

      <div style={{
        maxWidth: '1600px',
        margin: '0 auto',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        paddingTop: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        fontSize: '0.8rem'
      }}>
        <span>&copy; {new Date().getFullYear()} Aparna Sarovar Towers. All rights reserved.</span>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Terms of Use</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
