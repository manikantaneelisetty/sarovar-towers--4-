import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Layers, ChevronLeft, ChevronRight } from 'lucide-react';
import { tower1Data, tower2Data, tower3Data } from '../services/towerData';
import { getBlockName } from '../services/flatData';

const towerHeroImages = {
  1: '/images/tower1/hero.jpg',
  2: '/images/tower2/hero.jpg',
  3: '/images/tower3/hero.jpg'
};

const towerIds = [1, 2, 3];

const TowerView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const towerId = parseInt(id) || 1;

  const [hoveredFloor, setHoveredFloor] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const [isSliderPaused, setIsSliderPaused] = useState(false);

  const goToTower = (targetId) => {
    const normalizedTowerId = targetId < 1 ? 3 : targetId > 3 ? 1 : targetId;
    navigate(`/tower/${normalizedTowerId}`);
  };

  const goToNextTower = () => goToTower(towerId === 3 ? 1 : towerId + 1);
  const goToPrevTower = () => goToTower(towerId === 1 ? 3 : towerId - 1);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get active tower data
  const getTowerData = () => {
    if (towerId === 1) return tower1Data;
    if (towerId === 2) return tower2Data;
    if (towerId === 3) return tower3Data;
    return tower1Data;
  };

  const towerDataList = getTowerData();
  const blockName = getBlockName(towerId);
  const filteredFloors = towerDataList;

  const handleMouseMove = (e) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const floorNumber = hoveredFloor ? parseInt(hoveredFloor.floor.replace(/\D/g, ''), 10) : null;
    const shouldShowBelow = Number.isFinite(floorNumber) && floorNumber >= 25;

    const tooltipWidth = 230;
    const tooltipHeight = 150;
    const rawX = e.clientX - bounds.left + 15;
    const rawY = e.clientY - bounds.top + (shouldShowBelow ? 15 : -110);

    setTooltipPos({
      x: Math.min(Math.max(rawX, 15), bounds.width - tooltipWidth - 15),
      y: Math.min(Math.max(rawY, 15), bounds.height - tooltipHeight - 15)
    });
  };

  const handleFloorClick = (floorName) => {
    const cleanFloor = floorName.replace(/[^\d]/g, '');
    navigate(`/floor/${towerId}/${cleanFloor}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        minHeight: '100vh',
        background: '#000000',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Floating Header Controls */}
        <div style={{
          position: 'absolute',
          top: isMobile ? '1.25rem' : '5rem',
          left: '2rem',
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        padding: isMobile ? '0.55rem 0.7rem' : '0.6rem 0.85rem',
        borderRadius: '999px',
        background: 'rgba(0, 0, 0, 0.68)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)'
      }}>
        <Link to="/" style={{
          color: 'white',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: isMobile ? '0.78rem' : '0.85rem',
          fontWeight: '600',
          whiteSpace: 'nowrap'
        }}>
          <ArrowLeft size={isMobile ? 14 : 15} />
          <span>{isMobile ? 'Back' : 'Back'}</span>
        </Link>
      </div>

      {/* Main Interactive Visual Frame (Edge-to-edge) */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 1
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={towerId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsSliderPaused(true)}
            onMouseLeave={() => setIsSliderPaused(false)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              overflow: 'hidden'
            }}
          >
            {/* Unified Interactive SVG Viewport (locks image and floor paths in exact 1:1 sync across all screen sizes) */}
            <svg 
              viewBox="0 0 459.802 258.638" 
              preserveAspectRatio="xMidYMid slice"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'block',
                background: '#000000',
                pointerEvents: 'auto'
              }}
            >
              {/* Background Tower Hero Image */}
              <image
                href={towerHeroImages[towerId]}
                x="0"
                y="0"
                width="459.802"
                height="258.638"
                preserveAspectRatio="none"
              />

              {/* Floor Overlay Paths */}
              {towerDataList.map((floorData, idx) => {
                const isHovered = hoveredFloor && hoveredFloor.floor === floorData.floor;

                return (
                  <path
                    key={idx}
                    d={floorData.d}
                    fill={isHovered ? 'rgba(56, 189, 248, 0.35)' : 'transparent'}
                    stroke={isHovered ? 'var(--primary)' : 'transparent'}
                    strokeWidth={isHovered ? '0.35' : '0.2'}
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                      pointerEvents: 'auto'
                    }}
                    onMouseEnter={() => setHoveredFloor(floorData)}
                    onMouseLeave={() => setHoveredFloor(null)}
                    onClick={() => handleFloorClick(floorData.floor)}
                  />
                );
              })}
            </svg>

            {/* Floor Info Card (Tooltip Tracking) */}
            <AnimatePresence>
              {hoveredFloor && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: 'absolute',
                    left: tooltipPos.x,
                    top: tooltipPos.y,
                    pointerEvents: 'none',
                    zIndex: 40,
                    width: '220px',
                    padding: '0.9rem',
                    borderRadius: '16px',
                    background: 'rgba(7, 7, 9, 0.85)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid var(--primary)',
                    boxShadow: '0 8px 32px rgba(56, 189, 248, 0.25)'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    paddingBottom: '0.5rem',
                    marginBottom: '0.6rem'
                  }}>
                    <h4 style={{ fontFamily: 'var(--font-display)', margin: 0, fontWeight: '700', fontSize: '0.9rem', color: 'white' }}>
                      {hoveredFloor.floor}
                    </h4>
                    <span style={{
                      fontSize: '0.7rem',
                      background: 'rgba(56, 189, 248, 0.12)',
                      color: 'var(--primary)',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontWeight: '600',
                      border: '1px solid rgba(56, 189, 248, 0.2)'
                    }}>
                      {hoveredFloor.type}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Available flats</span>
                      <span style={{ fontWeight: '600', color: 'white' }}>{hoveredFloor.units}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Floor Area</span>
                      <span style={{ fontWeight: '600', color: 'white' }}>{hoveredFloor.area}</span>
                    </div>
                  </div>
                  <div style={{
                    marginTop: '0.8rem',
                    fontSize: '0.75rem',
                    color: 'var(--primary)',
                    fontWeight: '600',
                    textAlign: 'right',
                    textShadow: '0 0 8px rgba(56, 189, 248, 0.3)'
                  }}>
                    Click to view flats &rarr;
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
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

      {/* Floating Floors Directory panel (Right Side Overlay) */}
      <AnimatePresence>
        {(!isMobile || isDirectoryOpen) && (
          <motion.div
            initial={isMobile ? { x: 350 } : { opacity: 0, x: 20 }}
            animate={{ x: 0, opacity: 1 }}
            exit={isMobile ? { x: 350 } : { opacity: 0, x: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'absolute',
              top: isMobile ? '0' : '5rem',
              right: isMobile ? '0' : '1.25rem',
              bottom: isMobile ? '0' : '1.25rem',
              width: isMobile ? '80vw' : '260px',
              maxWidth: '280px',
              height: isMobile ? '100%' : 'auto',
              maxHeight: isMobile ? '100%' : 'calc(100vh - 6.5rem)',
              display: 'flex',
              flexDirection: 'column',
              border: isMobile ? 'none' : '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: isMobile ? '0' : '16px',
              background: isMobile ? 'rgba(7, 7, 9, 0.95)' : 'rgba(7, 7, 9, 0.72)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              overflow: 'hidden',
              zIndex: 25,
              boxShadow: '-8px 0 32px rgba(0,0,0,0.5)'
            }}
          >
            <div style={{
              padding: '0.95rem 1rem',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              flexShrink: 0
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={16} color="var(--primary)" />
                <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: '600', color: 'white' }}>
                  Floors Directory ({filteredFloors.length})
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

            <div 
              style={{
                overflowY: 'auto',
                flexGrow: 1,
                padding: '0.6rem',
              }}
              className="scrollbar-styled"
            >
              {filteredFloors.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.45rem 0.6rem',
                    borderRadius: '10px',
                    marginBottom: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    background: hoveredFloor?.floor === item.floor ? 'rgba(56, 189, 248, 0.12)' : 'none',
                    border: hoveredFloor?.floor === item.floor ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent'
                  }}
                  onMouseEnter={() => setHoveredFloor(item)}
                  onMouseLeave={() => setHoveredFloor(null)}
                  onClick={() => handleFloorClick(item.floor)}
                >
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: '600', color: hoveredFloor?.floor === item.floor ? 'white' : 'var(--text-primary)' }}>{item.floor}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{item.area}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      color: 'var(--text-secondary)',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.05)'
                    }}>
                      {item.type}
                    </span>
                    <span style={{
                      fontSize: '0.7rem',
                      color: 'var(--primary)',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      background: 'rgba(56, 189, 248, 0.08)',
                      fontWeight: '600'
                    }}>
                      {item.units}
                    </span>
                  </div>
                </div>
              ))}
              {filteredFloors.length === 0 && (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No floors match.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Tower Switcher Slider */}
            <div style={{
              position: 'absolute',
              bottom: '2rem',
              
        left: '50%',
        bottom:"2%",
        transform: 'translateX(-50%)',
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? '0.5rem' : '1.5rem',
        padding: '0.6rem 1.25rem',
        borderRadius: '24px',
        background: 'rgba(7, 7, 9, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        boxShadow: '0 8px 32px rgba(56, 189, 248, 0.15)',
        width: isMobile ? 'calc(100% - 2.5rem)' : 'auto',
        justifyContent: 'center',
      }}>
        <button
          onClick={goToPrevTower}
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary)'}
          onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
        >
          <ChevronLeft size={16} />
        </button>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {[
            { id: 1, label: 'Tower 1', code: 'Canopus' },
            { id: 2, label: 'Tower 2', code: 'Orion' },
            { id: 3, label: 'Tower 3', code: 'Nova' }
          ].map(t => {
            const isActive = t.id === towerId;
            return (
              <button
                key={t.id}
                onClick={() => navigate(`/tower/${t.id}`)}
                style={{
                  padding: '0.4rem 1rem',
                  borderRadius: '16px',
                  border: isActive ? '1px solid var(--primary)' : '1px solid transparent',
                  background: isActive ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                  color: isActive ? 'white' : 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: isMobile ? '70px' : '90px'
                }}
                onMouseOver={e => {
                  if (!isActive) e.currentTarget.style.color = 'var(--primary)';
                }}
                onMouseOut={e => {
                  if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <span>{t.label}</span>
                <span style={{ fontSize: '0.6rem', color: isActive ? 'var(--primary-light)' : 'var(--text-muted)', fontWeight: '400' }}>
                  {t.code}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={goToNextTower}
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary)'}
          onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default TowerView;

