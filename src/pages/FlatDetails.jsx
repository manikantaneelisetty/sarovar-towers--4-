import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiArrowSmLeft, HiArrowSmRight } from "react-icons/hi";
import { ArrowLeft, CheckCircle2, ShieldCheck, Eye, DollarSign, Plus, ShieldAlert, AlertTriangle } from 'lucide-react';
import { useCompare } from '../context/CompareContext';
import { getBlockName, towerData, isRefugeFlat } from '../services/flatData';

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
  const [slideDir, setSlideDir] = useState(0);
  const [isSpecsOpen, setIsSpecsOpen] = useState(true);
  
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
  const isRefuge = isRefugeFlat(floor, flat);

  // Flat configuration
  const facing = (flatIndex === 1 || flatIndex === 2) ? 'West Facing' : 'East Facing';
  
  const towerSpecs = towerData[tower]?.specs;
  const specList = Array.isArray(towerSpecs) ? towerSpecs : (towerSpecs?.[facing] || []);
  
  const sqftMap = { 1: 3348, 2: 2878, 3: 3700 };
  const bhkMap = { 1: '4 BHK', 2: '3 BHK', 3: '4 BHK' };
  const size = `${sqftMap[tower]} Sq.ft`;
  const bhkInfo = bhkMap[tower];

  let flatImage = `/images/f/t${tower}-flats/1${flatSuffix}.png`;
  
  const floorPlan2DImage = `/images/t${tower}-flats/1${flatSuffix}.png`;

  const changeFlat = (step) => {
    // Current floor flats: flatIndex from 1 to 4
    let nextIdx = flatIndex + step;
    if (nextIdx < 1) nextIdx = 4;
    if (nextIdx > 4) nextIdx = 1;
    
    setSlideDir(step);
    
    const nextFlatNo = `${floor}${String(nextIdx).padStart(2, '0')}`;
    navigate(`/flat/${tower}/${floor}/${nextFlatNo}`);
  };

  const handleAddToCompare = () => {
    const flatObject = {
      tower,
      floor,
      flat,
      title: `Flat ${flat}`,
      image: `/images/t${tower}-flats/1${flatSuffix}.png`,
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
        background: '#f8f8f8',
        color: 'white',
        paddingLeft: '4%',
        paddingRight: '4%',
        paddingBottom: '1.5rem',
        position: 'relative'
      }}
    >
      {/* Back button */}
      <div style={{ 
        position: 'absolute', 
        top: isMobile ? '100px' : '110px', 
        left: '4%', 
        zIndex: 10 
      }}>
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
          borderRadius: '5px',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          fontWeight: '600'
        }}
        onMouseOver={e => {
          e.currentTarget.style.background = '#38BDF8';
          e.currentTarget.style.borderColor = '#38BDF8';
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
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        padding: 0,
        paddingTop: '90px'
      }}>
        {/* Main Interactive Visual Frame */}
        <div style={{
          position: 'relative',
          width: 'min(92vw, 800px)',
          height: 'min(82vh, 600px)',
          maxHeight: 'calc(100vh - 140px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <AnimatePresence>
            <motion.div
              key={flat}
              initial={{ opacity: 0, x: slideDir > 0 ? '100vw' : '-100vw' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: slideDir > 0 ? '-100vw' : '100vw' }}
              transition={{ duration: 0.7, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                borderRadius: '5px'
              }}
            >
              <img 
                src={flatImage}
                alt={`Flat ${flat} 3D plan`}
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'block',
                  objectFit: 'contain',
                  objectPosition: 'center',
                  background: 'transparent',
                  userSelect: 'none'
                }}
              />
            </motion.div>
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
            color: 'var(--text-white)',
            zIndex: 15
          }}>
            3D Floor Rendering Plan
          </div>

            {/* Left Arrow */}
            <button
              onClick={() => changeFlat(-1)}
              style={{
                position: 'fixed',
                top: '50%',
                left: 'max(2%, calc(50vw - 550px))',
                transform: 'translateY(-50%)',
                zIndex: 10,
                background: 'rgba(0, 0, 0, 0.6)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}
            >
              <HiArrowSmLeft size={20} />
            </button>

            {/* Right Arrow */}
            <button
              onClick={() => changeFlat(1)}
              style={{
                position: 'fixed',
                top: '50%',
                right: 'max(2%, calc(50vw - 550px))',
                transform: 'translateY(-50%)',
                zIndex: 10,
                background: 'rgba(0, 0, 0, 0.6)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}
            >
              <HiArrowSmRight size={20} />
            </button>
          </div>
        </div>

        {/* Glowing Toggle Button at Bottom Right */}
        <AnimatePresence>
          {!isSpecsOpen && (
            <motion.button
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.8 }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              onClick={() => setIsSpecsOpen(true)}
              style={{
                position: 'absolute',
                bottom: '2rem',
                right: '2rem',
                zIndex: 30,
                background: '#0a0a0a',
                border: 'none',
                borderRadius: '5px',
                padding: '0.6rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#38BDF8',
                cursor: 'pointer',
                fontFamily: 'var(--font-display)',
                fontWeight: '600',
                fontSize: '0.9rem'
              }}
            >
              <div style={{ width: '12px', height: '2px', background: '#38BDF8' }}></div>
              View Specifications
            </motion.button>
          )}
        </AnimatePresence>

        {/* Floating Specifications Panel */}
        <AnimatePresence>
          {isSpecsOpen && (
            <motion.div
              initial={{ opacity: 0, y: 150, scale: 0.8, transformOrigin: 'bottom right' }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 150, scale: 0.8 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              style={{
                position: 'absolute',
                bottom: '2rem',
                right: '2rem',
                width: isMobile ? '100vw' : '280px',
                maxWidth: isMobile ? '100vw' : '300px',
                height: isMobile ? '55vh' : 'auto',
                maxHeight: '60vh',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: isMobile ? '5px 5px 0 0' : '5px',
                background: 'rgba(13, 13, 15, 0.97)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                zIndex: 35,
                boxShadow: '-8px 8px 32px rgba(0,0,0,0.6)'
              }}
            >
              <div style={{
                padding: '0.8rem 1rem',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0
              }}>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-olivera)', fontSize: isMobile ? '1.05rem' : '1.15rem', fontWeight: '400', color: 'white', letterSpacing: '0.04em' }}>
                  Specifications
                </h3>
                <button 
                  onClick={() => setIsSpecsOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#38BDF8',
                    cursor: 'pointer',
                    fontSize: '2.2rem',
                    fontWeight: '400',
                    lineHeight: 1
                  }}
                >
                  &times;
                </button>
              </div>
              
              <div className="scrollbar-styled" style={{ 
                padding: isMobile ? '0.75rem' : '0.9rem', 
                overflowY: 'auto', 
                overflowX: 'hidden' 
              }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: isMobile ? '0.75rem' : '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.5rem'  }}>
              <span style={{ color: 'white' }}>{block} Block</span>
              <span style={{ color: 'white' }}>Floor {floor}</span>
            </div>

            <h2 style={{ fontFamily: 'var(--font-olivera)', fontSize: isMobile ? '1.5rem' : '1.8rem', fontWeight: '600', margin: '0 0 0.5rem 0', color: 'white' }}>
              Flat {flat}
            </h2>

            {isRefuge && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '4px',
                padding: '4px 8px',
                marginBottom: '0.6rem',
                color: '#F59E0B',
                fontSize: '0.72rem',
                fontWeight: '700'
              }}>
                <ShieldAlert size={13} color="#F59E0B" />
                <span>DESIGNATED REFUGE FLAT (FIRE SAFETY SHELTER)</span>
              </div>
            )}

            <p style={{
              color: '#38BDF8',
              fontSize: isMobile ? '0.75rem' : '0.85rem',
              fontWeight: '600',
              margin: '0 0 1rem 0',
              display: 'flex',
              gap: '6px',
              alignItems: 'center'
            }}>
              <span>{bhkInfo}</span>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#38BDF8' }}></span>
              <span>{size}</span>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#38BDF8' }}></span>
              <span>{facing}</span>
            </p>

            {isRefuge && (
              <div style={{
                marginBottom: '1.2rem',
                padding: '0.65rem 0.8rem',
                borderRadius: '5px',
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.88)',
                lineHeight: '1.4'
              }}>
                <div style={{ color: '#FBBF24', fontWeight: '700', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem' }}>
                  <AlertTriangle size={13} color="#FBBF24" />
                  Refuge Flat Safety Norms
                </div>
                Mandatory high-rise fire safety refuge area per National Building Code (NBC) guidelines. Engineered as a secure evacuation shelter equipped with 2-hour fire-rated enclosures and open-air cross ventilation.
              </div>
            )}

            {/* Specifications Box */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.95rem',
                fontWeight: '600',
                marginBottom: '0.75rem',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                paddingBottom: '0.4rem',
                color: 'white'
              }}>
                Room Specifications
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {specList.map((spec, idx) => (
                  <div key={idx} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    paddingBottom: '0.5rem',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    fontSize: isMobile ? '0.8rem' : '0.85rem',
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
              gap: '8px'
            }}>
              <button 
                onClick={handleAddToCompare}
                style={{
                  padding: '0.55rem',
                  borderRadius: '0',
                    background: '#000000',
                    border: '1px solid #333333',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.75rem',
                  display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    whiteSpace: 'nowrap',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = '#38BDF8';
                  e.currentTarget.style.borderColor = '#38BDF8';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = '#000000';
                  e.currentTarget.style.borderColor = '#333333';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
              >
                <Plus size={14} />
                Add To Compare
              </button>

              <button 
                disabled={compareList.length < 2}
                onClick={() => setIsCompareOpen(true)}
                style={{
                  padding: '0.55rem',
                  borderRadius: '0',
                    background: '#000000',
                    border: '1px solid #333333',
                  color: compareList.length < 2 ? 'var(--text-muted)' : '#FFFFFF',
                  cursor: compareList.length < 2 ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '0.75rem',
                  display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    whiteSpace: 'nowrap',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onMouseOver={e => {
                  if (compareList.length >= 2) {
                    e.currentTarget.style.background = '#38BDF8';
                    e.currentTarget.style.borderColor = '#38BDF8';
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
                Compare({compareList.length})
              </button>

              <button 
                onClick={() => setIs2DOpen(true)}
                style={{
                  padding: '0.55rem',
                  borderRadius: '0',
                    background: '#000000',
                    border: '1px solid #333333',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.75rem',
                  display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    whiteSpace: 'nowrap',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  gridColumn: 'span 2'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = '#38BDF8';
                  e.currentTarget.style.borderColor = '#38BDF8';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = '#000000';
                  e.currentTarget.style.borderColor = '#333333';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
              >
                <Eye size={14} />
                View 2D Plan
              </button>

              <button 
                onClick={() => setIsRequestOpen(true)}
                style={{
                  padding: '0.55rem',
                  borderRadius: '0',
                    background: '#000000',
                    border: '1px solid #333333',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.75rem',
                  display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    whiteSpace: 'nowrap',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  gridColumn: 'span 2'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = '#38BDF8';
                  e.currentTarget.style.borderColor = '#38BDF8';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = '#000000';
                  e.currentTarget.style.borderColor = '#333333';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
              >
                <DollarSign size={14} />
                Request Pricing
              </button>
            </div>
          </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                background: 'rgba(20, 19, 19, 0.95)',
                border: '1px solid rgba(7, 7, 7, 0.35)',
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
                <div style={{ display: 'flex', gap: '8px', fontSize: '0.9rem', color: 'var(--text-white)' }}>
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
                    color: 'var(--text-white)',
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
                        background: '#38BDF8',
                        border: '1px solid #38BDF8',
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
                        e.currentTarget.style.background = '#38BDF8';
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


