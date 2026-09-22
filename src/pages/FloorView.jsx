import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, Info, Compass, Layers } from 'lucide-react';
import { floorPlans, towerFloorDetails, getBlockName } from '../services/flatData';

const FloorView = () => {
  const { towerId, floorNo } = useParams();
  const navigate = useNavigate();

  const tower = parseInt(towerId) || 1;
  const floor = parseInt(floorNo) || 1;

  const [hoveredFlat, setHoveredFlat] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const imgRef = useRef(null);
  const containerRef = useRef(null);
  const [svgOverlayStyle, setSvgOverlayStyle] = useState({});

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // measure image position and size and apply to SVG overlay so hotspots align
  const measureOverlay = () => {
    try {
      const img = imgRef.current;
      const container = containerRef.current;
      if (!img || !container) return;
      const containerRect = container.getBoundingClientRect();
      const imgRect = img.getBoundingClientRect();

      const naturalW = img.naturalWidth || imgRect.width;
      const naturalH = img.naturalHeight || imgRect.height;

      const elW = imgRect.width;
      const elH = imgRect.height;
      const scale = Math.min(elW / naturalW, elH / naturalH);
      const displayW = naturalW * scale;
      const displayH = naturalH * scale;
      const offsetX = (elW - displayW) / 2;
      const offsetY = (elH - displayH) / 2;

      setSvgOverlayStyle({
        position: 'absolute',
        left: `${imgRect.left - containerRect.left + offsetX}px`,
        top: `${imgRect.top - containerRect.top + offsetY}px`,
        width: `${displayW}px`,
        height: `${displayH}px`,
        display: 'block',
        pointerEvents: 'auto'
      });
    } catch (e) {
      // ignore measurement errors
    }
  };

  const handleImageLoad = () => {
    measureOverlay();
  };

  useEffect(() => {
    measureOverlay();
    const onResize = () => requestAnimationFrame(measureOverlay);
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, [tower, floor, isMobile]);

  const block = getBlockName(tower);
  const floorDetail = towerFloorDetails[tower]?.[floor] || { bhk: '4 BHK', area: '3,348 Sq.ft' };

  const layoutNumber = ((floor - 1) % 3) + 1;
  const currentPlan = floorPlans[tower]?.[layoutNumber] || floorPlans[1][1];
  const previewFlatNo = hoveredFlat?.flatNo || `${floor}01`;
  const previewFlatArea = hoveredFlat?.size || floorDetail.area;
  const previewFacing = hoveredFlat?.facing || 'West Facing';

  const handleMouseMove = (e) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left + 20;
    const y = e.clientY - bounds.top - 20;
    setTooltipPos({
      x: Math.min(Math.max(x, 12), bounds.width - 252),
      y: Math.min(Math.max(y, 12), bounds.height - 100)
    });
  };

  const changeFloor = (direction) => {
    let nextFloor = floor + direction;
    if (nextFloor < 1) nextFloor = 1;
    if (nextFloor > 50) nextFloor = 50;
    navigate(`/floor/${tower}/${nextFloor}`);
  };

  const handleFlatClick = (flatIdx) => {
    const flatNoStr = `${floor}${String(flatIdx + 1).padStart(2, '0')}`;
    navigate(`/flat/${tower}/${floor}/${flatNoStr}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        minHeight: '100vh',
        background: '#000000',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '80px'
      }}
    >
      {/* Floating Header Controls */}
      <div style={{
        position: 'absolute',
        top: isMobile ? '1.25rem' : '4rem',
        marginTop: '3rem',
        left: '1.25rem',
        right: '1.25rem',
        zIndex: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0.75rem 0',
        pointerEvents: 'none'
      }}>
        <div style={{ position: 'absolute', left: '1.5rem', pointerEvents: 'auto' }}>
          <Link to={`/tower/${tower}`} style={{
            color: '#FFFFFF',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.95rem',
            background: '#000000',
            border: '1px solid #333333',
            padding: '0.55rem 1rem',
            borderRadius: '24px',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            fontWeight: '600',
            flexShrink: 0
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = '#BE9D7C';
            e.currentTarget.style.borderColor = '#BE9D7C';
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
            {isMobile ? 'Back' : `Tower ${tower} View`}
          </Link>
        </div>
        
        <div style={{ pointerEvents: 'auto', textAlign: 'center' }}>
          <h1 style={{
            fontFamily: 'var(--font-olivera)',
            fontSize: isMobile ? '1.5rem' : '2.1rem',
            fontWeight: '600',
            margin: 0,
            letterSpacing: '0.04em',
            color: '#000000',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {block} Block - Floor <span style={{ fontFamily: 'var(--font-body)', fontWeight: '400', fontSize: '0.85em' }}>{floor}</span>
          </h1>
        </div>
      </div>

      {/* Main Interactive Visual Frame */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
             background: '#FBF8F3',
          padding: 0,
          paddingTop: '90px'
        }}
      >
        <div 
          onMouseMove={handleMouseMove}
          style={{
            marginRight:"100px",
            position: 'relative',
            width: 'min(92vw, 1000px)',
            height: 'min(82vh, 700px)',
            maxHeight: 'calc(100vh - 140px)',
            
            overflow: 'hidden',
            borderRadius: '5px',
            // background: '#000000',
            // boxShadow: '0 10px 35px rgba(0,0,0,0.45)'
            
          }}
          ref={containerRef}
        >
          {/* Layout Plan Image */}
          <img 
            src={`/images/tower${tower}/${currentPlan.image}`}
            alt={`${block} Floor ${floor} Plan`}
            ref={imgRef}
            onLoad={handleImageLoad}
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              objectFit: 'contain',
              objectPosition: 'center',
             background: '#FBF8F3',
             
              userSelect: 'none'
            }}
          />

          {/* SVG Hotspots overlay */}
          <svg
            viewBox="0 0 459.802 258.638"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              ...svgOverlayStyle,
              pointerEvents: 'auto'
            }}
          >
            <defs>
              <filter id="hoverGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {currentPlan.flats.map((flatData, idx) => {
              const flatNo = `${floor}${String(idx + 1).padStart(2, '0')}`;
              const isHovered = hoveredFlat && hoveredFlat.flatNo === flatNo;

              return (
                <polygon
                  key={idx}
                  points={flatData.points}
                  fill={isHovered ? 'rgba(190, 157, 124, 0.3)' : 'rgba(255, 255, 255, 0.001)'}
                  stroke={isHovered ? '#BE9D7C' : 'transparent'}
                  strokeWidth={isHovered ? '1.5' : '1'}
                  filter={isHovered ? 'url(#hoverGlow)' : undefined}
                  pointerEvents="all"
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  onMouseEnter={() => setHoveredFlat({ ...flatData, flatNo })}
                  onMouseLeave={() => setHoveredFlat(null)}
                  onClick={() => handleFlatClick(idx)}
                />
              );
            })}
          </svg>

          {/* Floating details overlay inside canvas */}
          <AnimatePresence>
            {isDetailsVisible && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  zIndex: 20,
                  width: 'min(90%, 280px)',
                  padding: '1.25rem',
                  borderRadius: '5px',
                  background: 'rgba(4, 4, 4, 0.85)',
                  backdropFilter: 'blur(25px)',
                  WebkitBackdropFilter: 'blur(25px)',
                  border: '1px solid rgba(190, 157, 124, 0.35)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem'
                }}
              >
                <div style={{
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                  paddingBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Info size={14} color="#BE9D7C" />
                  <h4 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: '600', color: 'white' }}>
                    Floor details
                  </h4>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Tower Block</span>
                    <span style={{ fontWeight: '600', color: 'white' }}>Tower {tower} ({block})</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Apartment Type</span>
                    <span style={{ fontWeight: '600', color: '#BE9D7C' }}>{floorDetail.bhk}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Super Built-up</span>
                    <span style={{ fontWeight: '600', color: 'white' }}>{floorDetail.area}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Flats per floor</span>
                    <span style={{ fontWeight: '600', color: 'white' }}>4 Apartments</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Flat details tooltip */}
          <AnimatePresence>
            {hoveredFlat && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                style={{
                  position: 'absolute',
                  left: tooltipPos.x,
                  top: tooltipPos.y,
                  pointerEvents: 'none',
                  zIndex: 40,
                  width: 'min(90%, 240px)',
                  maxWidth: '240px',
                  padding: '1rem',
                  borderRadius: '5px',
                  background: 'rgba(3, 3, 3, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid #BE9D7C',
                  boxShadow: '0 8px 32px rgba(190, 157, 124, 0.15)'
                }}
              >
                <div style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingBottom: '0.4rem',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <h4 style={{ fontFamily: 'var(--font-display)', margin: 0, fontWeight: '700', fontSize: '1.05rem', color: 'white' }}>
                    Apartment {hoveredFlat.flatNo}
                  </h4>
                  <span style={{ fontSize: '0.7rem', color: '#BE9D7C', fontWeight: '600' }}>
                    {floorDetail.bhk}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Carpet Area</span>
                    <span style={{ fontWeight: '600', color: 'white' }}>{hoveredFlat.size}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Orientation</span>
                    <span style={{ fontWeight: '600', color: 'white', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Compass size={12} color="#BE9D7C" />
                      {hoveredFlat.facing}
                    </span>
                  </div>
                </div>
                <div style={{
                  marginTop: '0.6rem',
                  fontSize: '0.75rem',
                  color: '#BE9D7C',
                  fontWeight: '600',
                  textAlign: 'right'
                }}>
                  View Specs &rarr;
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Toggle Button for Mobile Directory */}
      {isMobile && (
        <button
          onClick={() => setIsDirectoryOpen(!isDirectoryOpen)}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            zIndex: 30,
            background: 'rgba(7, 7, 9, 0.8)',
            border: '1px solid rgba(190, 157, 124, 0.4)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#BE9D7C',
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
            cursor: 'pointer'
          }}
        >
          <Layers size={18} />
        </button>
      )}

      {/* Floating Jump to Floor Navigator panel (Right Side Overlay) */}
      <AnimatePresence>
        {(!isMobile || isDirectoryOpen) && (
          <motion.div
            initial={isMobile ? { x: 350 } : { opacity: 0, x: 20 }}
            animate={{ x: 0, opacity: 1 }}
            exit={isMobile ? { x: 350 } : { opacity: 0, x: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'absolute',
              top: isMobile ? 'calc(20% + 3rem)' : '6rem',
              right: isMobile ? '0' : '1rem',
              bottom: isMobile ? '0' : '1rem',
              width: isMobile ? '82vw' : '280px',
              maxWidth: isMobile ? '320px' : '300px',
              height: isMobile ? '100%' : 'auto',
              display: 'flex',
              flexDirection: 'column',
              border: isMobile ? 'none' : '1px solid rgba(190, 157, 124, 0.4)',
              borderRadius: isMobile ? '0' : '5px',
              background: isMobile ? 'rgba(13, 13, 15, 0.97)' : 'rgba(13, 13, 15, 0.97)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              overflow: 'hidden',
              zIndex: 25,
              boxShadow: '-8px 0 32px rgba(0,0,0,0.5)'
            }}
          >
            <div style={{
              padding: isMobile ? '0.75rem 0.75rem 0.6rem' : '1rem 1rem 0.8rem',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              flexShrink: 0
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px',  }}>
                <Layers size={18} color="#BE9D7C" />
                <h3 style={{ margin: 0, fontFamily: 'var(--font-olivera)', fontSize: isMobile ? '1.05rem' : '1.25rem', fontWeight: '400', color: 'white', letterSpacing: '0.04em' }}>
                  Jump to Floor
                </h3>
              </div>
              {isMobile && (
                <button 
                  onClick={() => setIsDirectoryOpen(false)}
                  style={{
                    background: 'none',
                   
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '600'
                  }}
                >
                  Close
                </button>
              )}
            </div>
            
            <div style={{
              padding: isMobile ? '0.75rem' : '0.9rem',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: isMobile ? '0.6rem' : '0.7rem',
              background: 'rgba(255,255,255,0.02)',
              fontSize: isMobile ? '0.75rem' : '0.82rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: isMobile ? '0.65rem' : '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)' }}>Floor overview</span>
                <span style={{ fontSize: isMobile ? '0.7rem' : '0.75rem', fontWeight: '700', color: '#BE9D7C' }}>Floor {floor}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: isMobile ? '0.75rem' : '0.82rem', color: 'white' }}>
                <span>Tower</span>
                <span style={{ fontWeight: '600', color: 'white' }}>Tower {tower}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: isMobile ? '0.75rem' : '0.82rem', color: 'white' }}>
                <span>Block</span>
                <span style={{ fontWeight: '600', color: 'white' }}>{block}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: isMobile ? '0.75rem' : '0.82rem', color: 'white' }}>
                <span>Apartment Type</span>
                <span style={{ fontWeight: '600', color: 'white' }}>{floorDetail.bhk}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: isMobile ? '0.75rem' : '0.82rem', color: 'white' }}>
                <span>Super Built-up</span>
                <span style={{ fontWeight: '600', color: 'white' }}>{floorDetail.area}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: isMobile ? '0.75rem' : '0.82rem', color: 'white' }}>
                <span>Selected Flat</span>
                <span style={{ fontWeight: '600', color: 'white' }}>{previewFlatNo}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: isMobile ? '0.75rem' : '0.82rem', color: 'white' }}>
                <span>Flat Area</span>
                <span style={{ fontWeight: '600', color: 'white' }}>{previewFlatArea}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: isMobile ? '0.75rem' : '0.82rem', color: 'white' }}>
                <span>Facing</span>
                <span style={{ fontWeight: '600', color: 'white' }}>{previewFacing}</span>
              </div>
            </div>
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '6px',
                overflowY: 'auto',
                flexGrow: 1,
                padding: '0.75rem'
              }}
              className="scrollbar-styled"
            >
              {Array.from({ length: 50 }, (_, i) => 50 - i).map(fNum => {
                const isCurrent = fNum === floor;
                return (
                  <button
                    key={fNum}
                    onClick={() => {
                      navigate(`/floor/${tower}/${fNum}`);
                      if (isMobile) setIsDirectoryOpen(false);
                    }}
                    style={{
                      padding: '0.5rem 0',
                      borderRadius: '6px',
                      border: isCurrent ? '#BE9D7C' : '1px solid rgba(255,255,255,0.05)',
                      background: isCurrent ? '#BE9D7C' : 'rgba(255,255,255,0.02)',
                      color: isCurrent ? 'white' : 'var(--text-secondary)',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    onMouseOver={e => {
                      if (!isCurrent) {
                        e.currentTarget.style.borderColor = '#BE9D7C';
                        e.currentTarget.style.color = '#BE9D7C';
                      }
                    }}
                    onMouseOut={e => {
                      if (!isCurrent) {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }
                    }}
                  >
                    {fNum}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Floor Switcher Slider */}
          <div style={{
        position: 'absolute',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.6rem 1.25rem',
        borderRadius: '5px',
        background: 'rgba(1, 1, 5, 0.87)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(190, 157, 124, 0.3)',
        boxShadow: '0 8px 32px rgba(190, 157, 124, 0.15)',
      }}>
        <button 
          disabled={floor <= 1}
          onClick={() => changeFloor(-1)}
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: floor <= 1 ? 'var(--text-muted)' : 'white',
            cursor: floor <= 1 ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={e => { if (floor > 1) e.currentTarget.style.borderColor = '#BE9D7C'; }}
          onMouseOut={e => { if (floor > 1) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
        >
          <ChevronLeft size={16} />
        </button>

        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'white', minWidth: '90px', textAlign: 'center', fontFamily: 'var(--font-display)' }}>
          Floor {floor} of 50
        </span>

        <button 
          disabled={floor >= 50}
          onClick={() => changeFloor(1)}
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: floor >= 50 ? 'var(--text-muted)' : 'white',
            cursor: floor >= 50 ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={e => { if (floor < 50) e.currentTarget.style.borderColor = '#BE9D7C'; }}
          onMouseOut={e => { if (floor < 50) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default FloorView;

