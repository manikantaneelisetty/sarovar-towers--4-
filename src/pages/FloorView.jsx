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
        left: '1.25rem',
        right: isMobile ? '4.5rem' : '290px',
        zIndex: 20,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 1.25rem',
        borderRadius: '16px',
        background: 'rgba(3, 3, 3, 0.65)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'center',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: isMobile ? '100%' : 'auto' }}>
          <Link to={`/tower/${tower}`} style={{
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8rem',
            background: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.15)',
            padding: '0.4rem 0.8rem',
            borderRadius: '20px',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            fontWeight: '600',
            flexShrink: 0
          }}
          onMouseOver={e => {
            e.currentTarget.style.borderColor = 'var(--primary)';
            e.currentTarget.style.boxShadow = '0 0 10px rgba(56, 189, 248, 0.2)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.15)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            <ArrowLeft size={12} />
            {isMobile ? 'Back' : `Tower ${tower} View`}
          </Link>
          <div style={{ overflow: 'hidden' }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: isMobile ? '1rem' : '1.4rem',
              fontWeight: '700',
              margin: 0,
              letterSpacing: '-0.3px',
              whiteSpace: isMobile ? 'normal' : 'nowrap',
              textOverflow: 'ellipsis',
              overflowWrap: isMobile ? 'anywhere' : 'normal'
            }}>
              {block} Block — Floor {floor}
            </h1>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setIsDetailsVisible(!isDetailsVisible)}
            style={{
              background: isDetailsVisible ? 'rgba(56, 189, 248, 0.15)' : 'rgba(7, 7, 9, 0.6)',
              border: isDetailsVisible ? '1px solid var(--primary)' : '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '20px',
              padding: '0.35rem 0.85rem',
              color: isDetailsVisible ? 'white' : 'var(--text-secondary)',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <Info size={12} color="var(--primary)" />
            <span>Floor Details</span>
          </button>
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
          background: '#000000',
          padding: 0,
          paddingTop: '90px'
        }}
      >
        <div 
          onMouseMove={handleMouseMove}
          style={{
            position: 'relative',
            width: 'min(92vw, 1000px)',
            height: 'min(82vh, 700px)',
            maxHeight: 'calc(100vh - 140px)',
            overflow: 'hidden',
            borderRadius: '20px',
            background: '#000000',
            boxShadow: '0 10px 35px rgba(0,0,0,0.45)'
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
              background: '#000000',
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
                  fill={isHovered ? 'rgba(56, 189, 248, 0.3)' : 'rgba(255, 255, 255, 0.001)'}
                  stroke={isHovered ? 'var(--primary)' : 'transparent'}
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
                  borderRadius: '16px',
                  background: 'rgba(4, 4, 4, 0.85)',
                  backdropFilter: 'blur(25px)',
                  WebkitBackdropFilter: 'blur(25px)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
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
                  <Info size={14} color="var(--primary)" />
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
                    <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{floorDetail.bhk}</span>
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
                  borderRadius: '12px',
                  background: 'rgba(3, 3, 3, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid var(--primary)',
                  boxShadow: '0 8px 32px rgba(56, 189, 248, 0.15)'
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
                  <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '600' }}>
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
                      <Compass size={12} color="var(--primary)" />
                      {hoveredFlat.facing}
                    </span>
                  </div>
                </div>
                <div style={{
                  marginTop: '0.6rem',
                  fontSize: '0.75rem',
                  color: 'var(--primary)',
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
            border: '1px solid rgba(56, 189, 248, 0.4)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)',
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
              border: isMobile ? 'none' : '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: isMobile ? '0' : '16px',
              background: isMobile ? 'rgba(0, 0, 0, 0.95)' : 'rgba(13, 13, 15, 0.78)',
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
                <Layers size={16} color="var(--primary)" />
                <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: isMobile ? '0.9rem' : '1rem', fontWeight: '600', color: 'white' }}>
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
                <span style={{ fontSize: isMobile ? '0.7rem' : '0.75rem', fontWeight: '700', color: 'var(--primary)' }}>Floor {floor}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: isMobile ? '0.75rem' : '0.82rem', color: 'var(--text-secondary)' }}>
                <span>Tower</span>
                <span style={{ fontWeight: '600', color: 'white' }}>Tower {tower}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: isMobile ? '0.75rem' : '0.82rem', color: 'var(--text-secondary)' }}>
                <span>Block</span>
                <span style={{ fontWeight: '600', color: 'white' }}>{block}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: isMobile ? '0.75rem' : '0.82rem', color: 'var(--text-secondary)' }}>
                <span>Apartment Type</span>
                <span style={{ fontWeight: '600', color: 'white' }}>{floorDetail.bhk}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: isMobile ? '0.75rem' : '0.82rem', color: 'var(--text-secondary)' }}>
                <span>Super Built-up</span>
                <span style={{ fontWeight: '600', color: 'white' }}>{floorDetail.area}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: isMobile ? '0.75rem' : '0.82rem', color: 'var(--text-secondary)' }}>
                <span>Selected Flat</span>
                <span style={{ fontWeight: '600', color: 'white' }}>{previewFlatNo}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: isMobile ? '0.75rem' : '0.82rem', color: 'var(--text-secondary)' }}>
                <span>Flat Area</span>
                <span style={{ fontWeight: '600', color: 'white' }}>{previewFlatArea}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: isMobile ? '0.75rem' : '0.82rem', color: 'var(--text-secondary)' }}>
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
                      border: isCurrent ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.05)',
                      background: isCurrent ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255,255,255,0.02)',
                      color: isCurrent ? 'white' : 'var(--text-secondary)',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    onMouseOver={e => {
                      if (!isCurrent) {
                        e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
                        e.currentTarget.style.color = 'var(--primary)';
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
        borderRadius: '24px',
        background: 'rgba(7, 7, 9, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        boxShadow: '0 8px 32px rgba(56, 189, 248, 0.15)',
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
          onMouseOver={e => { if (floor > 1) e.currentTarget.style.borderColor = 'var(--primary)'; }}
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
          onMouseOver={e => { if (floor < 50) e.currentTarget.style.borderColor = 'var(--primary)'; }}
          onMouseOut={e => { if (floor < 50) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default FloorView;
