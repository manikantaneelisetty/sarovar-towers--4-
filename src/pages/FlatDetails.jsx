import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle2, ShieldCheck, MapPin, Eye, DollarSign, Plus } from 'lucide-react';
import { useCompare } from '../context/CompareContext';
import { getBlockName, towerData } from '../services/flatData';

const FlatDetails = () => {
  const { towerId, floorNo, flatNo } = useParams();
  const navigate = useNavigate();
  const { addToCompare, setIsCompareOpen, compareList } = useCompare();

  const tower = parseInt(towerId) || 1;
  const floor = parseInt(floorNo) || 1;
  const [flat, setFlat] = useState(flatNo || `${floor}01`);

  const [is2DOpen, setIs2DOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const [isImageHovered, setIsImageHovered] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({ name: '', email: '', mobile: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Update flat if param changes
  useEffect(() => {
    if (flatNo) setFlat(flatNo);
  }, [flatNo]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const block = getBlockName(tower);
  const flatIndex = parseInt(flat.slice(-2)) || 1; // 1 to 4
  const flatSuffix = String(flatIndex).padStart(2, '0'); // '01', '02', etc.

  // Flat configuration
  const specList = towerData[tower]?.specs || [];
  const facing = (flatIndex === 1 || flatIndex === 2) ? 'West Facing' : 'East Facing';
  
  const sqftMap = { 1: 3348, 2: 2878, 3: 3700 };
  const bhkMap = { 1: '4 BHK', 2: '3 BHK', 3: '4 BHK' };
  const size = `${sqftMap[tower]} Sq.ft`;
  const bhkInfo = bhkMap[tower];

  let flatImage = `/images/t${tower}-flats/1${flatSuffix}.png`;
  if (flat === '101') {
    flatImage = '/images/f/isometric_Final_02.png';
  }
  const floorPlan2DImage = `/images/2d/1${flatSuffix}.jpg`;

  const changeFlat = (step) => {
    // Current floor flats: flatIndex from 1 to 4
    let nextIdx = flatIndex + step;
    if (nextIdx < 1) nextIdx = 4;
    if (nextIdx > 4) nextIdx = 1;
    
    const nextFlatNo = `${floor}${String(nextIdx).padStart(2, '0')}`;
    navigate(`/flat/${tower}/${floor}/${nextFlatNo}`);
  };

  const handleAddToCompare = () => {
    const flatObject = {
      tower,
      floor,
      flat,
      title: `Flat ${flat}`,
      image: flatImage,
      info: `${bhkInfo} | ${size} | ${facing}`,
      specs: specList
    };
    const success = addToCompare(flatObject);
    if (success) {
      alert('Apartment added to comparison successfully!');
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.mobile) {
      setErrorMsg('Please fill in all fields.');
      return;
    }
    // Validation matches contact/request specs
    if (formData.mobile.length < 10) {
      setErrorMsg('Please enter a valid mobile number.');
      return;
    }
    setErrorMsg('');
    setFormSubmitted(true);
    setTimeout(() => {
      setIsRequestOpen(false);
      setFormSubmitted(false);
      setFormData({ name: '', email: '', mobile: '' });
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        paddingTop: '90px',
        minHeight: '100vh',
        height: 'calc(100vh - 80px)',
        overflow: 'hidden',
        background: '#FBF8F3',
        color: 'white',
        paddingLeft: '4%',
        paddingRight: '4%',
        paddingBottom: '1.5rem',
        position: 'relative'
      }}
    >
      {/* Back button */}
      <div style={{ marginBottom: '1.5rem', marginTop: isMobile ? '1.25rem' : '3.5rem' }}>
        <Link to={`/floor/${tower}/${floor}`} style={{
          color: '#FFFFFF',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.95rem',
          background: '#000000',
          border: '1px solid #333333',
          padding: '0.55rem 1rem',
          borderRadius: '24px',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          fontWeight: '600'
        }}
        onMouseOver={e => {
          e.currentTarget.style.background = '#ecc31f';
          e.currentTarget.style.borderColor = '#ecc31f';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.color = '#FFFFFF';
        }}
        onMouseOut={e => {
          e.currentTarget.style.background = '#000000';
          e.currentTarget.style.borderColor = '#333333';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.color = '#FFFFFF';
        }}
        >
          <ArrowLeft size={16} />
          Back to Floor Layout
        </Link>
      </div>

      {/* Main layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1.15fr) minmax(320px, 0.85fr)',
        gap: isMobile ? '1.5rem' : '2rem',
        alignItems: 'stretch',
        height: 'calc(100% - 3.5rem)',
        maxHeight: 'calc(100vh - 240px)',
        minHeight: 0
      }}
      className="flat-details-grid"
      >
        {/* Left Side: 3D Visualization */}
        <div style={{ position: 'relative', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <div
            className="flat-details-image-panel"
            style={{
              position: 'relative',
              borderRadius: '5px',
              // border: '1px solid rgba(0, 0, 0, 0.05)',
              background: '#FBF8F3',
              width: '100%',
              height: isMobile ? 'auto' : '100%',
              minHeight: isMobile ? '320px' : '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              boxShadow: 'none'
            }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={flat}
                src={flatImage}
                alt={`Flat ${flat} 3D plan`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                style={{
                  width: '100%',
                  height: '100%',
                  maxWidth: '85%',
                  maxHeight: '85%',
                  objectFit: 'contain',
                  objectPosition: 'center'
                }}
              />
            </AnimatePresence>

            {/* Float details indicator */}
            <div style={{
             
              position: 'absolute',
              bottom: '1.5rem',
              left: '1.5rem',
              background: 'rgba(9, 9, 11, 0.75)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '5px',
              padding: '0.5rem 1rem',
              fontSize: '0.8rem',
              color: 'var(--text-white)'
            }}>
              3D Floor Rendering Plan
            </div>

            {/* Left Arrow */}
            <button
              onClick={() => changeFlat(-1)}
              style={{
                position: 'absolute',
                top: '50%',
                left: '-20px',
                transform: 'translateY(-50%)',
                background: 'rgba(15, 15, 18, 0.9)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                cursor: 'pointer',
                width: '45px',
                height: '45px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-md)',
                transition: 'all 0.2s',
                zIndex: 10
              }}
              onMouseOver={e => e.currentTarget.style.borderColor = '#ecc31f'}
              onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
            >
              <ChevronLeft size={24} />
            </button>

            {/* Right Arrow */}
            <button
              onClick={() => changeFlat(1)}
              style={{
                position: 'absolute',
                top: '50%',
                right: '-20px',
                transform: 'translateY(-50%)',
                background: 'rgba(15, 15, 18, 0.9)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                cursor: 'pointer',
                width: '45px',
                height: '45px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-md)',
                transition: 'all 0.2s',
                zIndex: 10
              }}
              onMouseOver={e => e.currentTarget.style.borderColor = '#ecc31f'}
              onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
            >
              <ChevronRight size={24} />
            </button>

          </div>
        </div>

        {/* Right Side: Flat Specifications & Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', minHeight: 0, height: '100%' }}>
          <div className="glass-panel" style={{ 
            padding: '1.4rem', 
            background: 'rgba(4, 4, 4, 0.85)', 
            border: '1px solid rgba(56, 189, 248, 0.35)',
            minHeight: 0, 
            height: '100%', 
            overflowY: 'auto', 
            overflowX: 'hidden', 
            boxShadow: 'var(--shadow-md)' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem'  }}>
              <span style={{ color: 'white' }}>{block} Block</span>
              <span style={{ color: 'white' }}>Floor {floor}</span>
            </div>

            <h2 style={{ fontFamily: 'var(--font-olivera)', fontSize: '2.2rem', fontWeight: '600', margin: '0 0 0.5rem 0', color: 'white' }}>
              Flat {flat}
            </h2>

            <p style={{
              color: '#ecc31f',
              fontSize: '1rem',
              fontWeight: '600',
              margin: '0 0 1.5rem 0',
              display: 'flex',
              gap: '10px',
              alignItems: 'center'
            }}>
              <span>{bhkInfo}</span>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#ecc31f' }}></span>
              <span>{size}</span>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#ecc31f' }}></span>
              <span>{facing}</span>
            </p>

            {/* Specifications Box */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.1rem',
                fontWeight: '600',
                marginBottom: '1rem',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                paddingBottom: '0.5rem',
                color: 'white'
              }}>
                Room Specifications
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {specList.map((spec, idx) => (
                  <div key={idx} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    paddingBottom: '0.75rem',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    fontSize: '1.05rem',
                  }}>
                    <span style={{ color: 'white', fontWeight: '500' }}>{spec[0]}</span>
                    <span style={{ fontWeight: '700', color: 'white' }}>{spec[1]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px'
            }}>
              <button 
                onClick={handleAddToCompare}
                style={{
                  padding: '0.8rem',
                  borderRadius: '24px',
                  background: '#000000',
                  border: '1px solid #333333',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = '#ecc31f';
                  e.currentTarget.style.borderColor = '#ecc31f';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = '#000000';
                  e.currentTarget.style.borderColor = '#333333';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
              >
                <Plus size={16} />
                Add to Compare
              </button>

              <button 
                disabled={compareList.length < 2}
                onClick={() => setIsCompareOpen(true)}
                style={{
                  padding: '0.8rem',
                  borderRadius: '24px',
                  background: '#000000',
                  border: '1px solid #333333',
                  color: compareList.length < 2 ? 'var(--text-muted)' : '#FFFFFF',
                  cursor: compareList.length < 2 ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onMouseOver={e => {
                  if (compareList.length >= 2) {
                    e.currentTarget.style.background = '#ecc31f';
                    e.currentTarget.style.borderColor = '#ecc31f';
                    e.currentTarget.style.color = '#FFFFFF';
                  }
                }}
                onMouseOut={e => {
                  if (compareList.length >= 2) {
                    e.currentTarget.style.background = '#000000';
                    e.currentTarget.style.borderColor = '#333333';
                    e.currentTarget.style.color = '#FFFFFF';
                  }
                }}
              >
                Compare ({compareList.length})
              </button>

              <button 
                onClick={() => setIs2DOpen(true)}
                style={{
                  padding: '0.8rem',
                  borderRadius: '24px',
                  background: '#000000',
                  border: '1px solid #333333',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  gridColumn: 'span 2'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = '#ecc31f';
                  e.currentTarget.style.borderColor = '#ecc31f';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = '#000000';
                  e.currentTarget.style.borderColor = '#333333';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
              >
                <Eye size={16} />
                View 2D Layout Plan
              </button>

              <button 
                onClick={() => setIsRequestOpen(true)}
                style={{
                  padding: '0.8rem',
                  borderRadius: '24px',
                  background: '#000000',
                  border: '1px solid #333333',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  gridColumn: 'span 2'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = '#ecc31f';
                  e.currentTarget.style.borderColor = '#ecc31f';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = '#000000';
                  e.currentTarget.style.borderColor = '#333333';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
              >
                <DollarSign size={16} />
                Request Pricing Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2D Zoomable Floorplan Modal */}
      <AnimatePresence>
        {is2DOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 100,
              background: 'rgba(0,0,0,0.9)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={() => setIs2DOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                width: '95%',
                maxWidth: '1200px',
                background: 'rgba(4, 4, 4, 0.95)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                borderRadius: '5px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                boxShadow: 'var(--shadow-lg)'
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'white', fontWeight: '600' }}>2D layout</span>
                  <span>|</span>
                  <span>{size}</span>
                  <span>|</span>
                  <span>{facing}</span>
                </div>
                <button 
                  onClick={() => setIs2DOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '1.2rem'
                  }}
                >
                  ✕
                </button>
              </div>
              
              <div style={{
                maxHeight: '85vh',
                overflow: 'hidden',
                borderRadius: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'white'
              }}>
                  <img 
                    src={floorPlan2DImage} 
                    alt="2D Floor plan" 
                    style={{
                      maxWidth: '100%',
                      maxHeight: '80vh',
                      objectFit: 'contain',
                      marginTop: '2rem'
                    }}
                  />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pricing Request Modal */}
      <AnimatePresence>
        {isRequestOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 2000,
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              overflowY: 'auto'
            }}
            onClick={() => setIsRequestOpen(false)}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              style={{
                width: 'min(90vw, 450px)',
                maxWidth: '450px',
                maxHeight: 'min(90vh, 680px)',
                overflowY: 'auto',
                background: 'rgba(22, 22, 28, 0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '5px',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-lg)'
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>
                  Request Price Quote
                </h3>
                <button 
                  onClick={() => setIsRequestOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '1.1rem'
                  }}
                >
                  ✕
                </button>
              </div>

              {formSubmitted ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{ display: 'inline-flex', marginBottom: '1rem' }}
                  >
                    <CheckCircle2 size={48} color="var(--accent-teal)" />
                  </motion.div>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: '700' }}>Request Submitted!</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Our sales counselor will contact you shortly with custom price quotes.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '0 0 0.5rem 0' }}>
                    Pricing for <strong style={{ color: 'white' }}>Flat {flat} ({block} Block)</strong> is available on request. Please supply details to download the official brochure.
                  </p>
                  
                  {errorMsg && (
                    <div style={{ color: '#ff4d4d', fontSize: '0.8rem', fontWeight: '600' }}>
                      {errorMsg}
                    </div>
                  )}

                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                    style={{
                      background: 'rgba(0,0,0,0.2)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '8px',
                      padding: '0.75rem',
                      color: 'white',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />

                  <input
                    type="email"
                    placeholder="Email ID"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    required
                    style={{
                      background: 'rgba(0,0,0,0.2)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '8px',
                      padding: '0.75rem',
                      color: 'white',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />

                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    value={formData.mobile}
                    onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                    required
                    style={{
                      background: 'rgba(0,0,0,0.2)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '8px',
                      padding: '0.75rem',
                      color: 'white',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    marginTop: '0.25rem',
                    marginBottom: '1rem'
                  }}>
                    <ShieldCheck size={14} />
                    <span>Your contact details are encrypted and kept strictly confidential.</span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => setIsRequestOpen(false)}
                      style={{
                        padding: '0.75rem 1.25rem',
                        borderRadius: '24px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: 'none',
                        color: 'var(--text-secondary)',
                        fontWeight: '600',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                      onMouseOver={e => e.currentTarget.style.color = '#FFFFFF'}
                      onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{
                        padding: '0.75rem 1.5rem',
                        fontSize: '0.85rem',
                        borderRadius: '24px',
                        background: '#ecc31f',
                        border: '1px solid #ecc31f',
                        color: '#000000',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                      onMouseOver={e => {
                        e.currentTarget.style.background = '#000000';
                        e.currentTarget.style.color = '#FFFFFF';
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.background = '#ecc31f';
                        e.currentTarget.style.color = '#000000';
                      }}
                    >
                      Request Quote
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FlatDetails;
