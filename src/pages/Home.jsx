import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Layers, Compass, Home as HomeIcon, Map } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [isOverviewMinimized, setIsOverviewMinimized] = useState(false);

  const towerInfo = {
    'tower-1': {
      name: 'Tower 1 - Canopus',
      bhk: '4 BHK',
      units: '196 Units',
      area: '3,348 Sq.ft',
      details: 'Ultra-luxury sky villas with panoramic views, private lounges, and east/west configurations.',
      color: '#38BDF8'
    },
    'tower-2': {
      name: 'Tower 2 - Orion',
      bhk: '3 BHK',
      units: '196 Units',
      area: '2,878 Sq.ft',
      details: 'Premium spacious apartments with multi-aspect balconies and functional modern layouts.',
      color: '#38BDF8'
    },
    'tower-3': {
      name: 'Tower 3 - Nova',
      bhk: '2 & 3 BHK',
      units: '193 Units',
      area: '3,700 Sq.ft',
      details: 'Exquisite signature residences featuring premium automation and private deck terraces.',
      color: '#38BDF8'
    },
    'clubhouse': {
      name: 'The Clubhouse',
      bhk: 'Amenities',
      units: 'G + 3 Floors',
      area: 'Exclusive',
      details: 'Luxury recreational amenities, infinity pool, fitness center, and community lounges.',
      color: '#ecc31f'
    }
  };

  const handleMouseMove = (e) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const tooltipWidth = 260; // Same as the width in styling
    const tooltipHeight = 180; // Approximate max height
    const rawX = e.clientX - bounds.left + 15;
    const rawY = e.clientY - bounds.top + 15;
    
    setTooltipPos({
      x: Math.min(Math.max(rawX, 15), bounds.width - tooltipWidth - 15),
      y: Math.min(Math.max(rawY, 15), bounds.height - tooltipHeight - 15)
    });
  };

  const handleItemClick = (id) => {
    if (id === 'tower-1') navigate('/tower/1');
    if (id === 'tower-2') navigate('/tower/2');
    if (id === 'tower-3') navigate('/tower/3');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7}}
      style={{
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: '#070709',
        overflow: 'hidden',
        width: '100vw',
        height: '100vh'
      }}
    >
      {/* Interactive Hero Screen */}
      <div 
        onMouseMove={handleMouseMove}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        <svg 
          viewBox="0 0 1600 900" 
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg" 
          style={{
            width: '100%',
            height: '100%',
            display: 'block'
          }}
        >
          <defs>
            <linearGradient id="hero-overlay" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(7, 7, 9, 0.75)" />
              <stop offset="25%" stopColor="rgba(7, 7, 9, 0.1)" />
              <stop offset="75%" stopColor="rgba(7, 7, 9, 0.15)" />
              <stop offset="100%" stopColor="rgba(7, 7, 9, 0.85)" />
            </linearGradient>
          </defs>

          {/* Background image */}
          <image href="/sarovar-towers-bg.jpg" x="0" y="0" width="1600" height="900" />
          
          {/* Subtle Dark Overlay */}
          <rect x="0" y="0" width="1600" height="900" fill="url(#hero-overlay)" />

          {/* Tower 1 Overlay */}
          <g transform="translate(450 258) scale(2.91)">
            <path 
              id="tower-1" 
              className="tower-path"
              d="M25.56 103.1l-13.92 -48.29 -1.13 -4.82 -10.51 -35.22 0 -1.14 0.85 0c0.29,0.85 0.85,0.85 0.85,0.85l14.2 -4.82 0 -1.42 0.86 -0.29 1.13 1.14 2.84 3.97 0.57 0.29 0 1.99 3.41 4.26 2.55 -0.86 -2.84 -13.06 0.86 -0.28 0.85 1.13 13.92 -4.26 0 -1.99 0.85 -0.28 4.83 5.96 0.28 2.28 3.98 4.54 2.55 -0.85 1.14 0 1.13 0.85 0.86 7.95 3.97 -1.13 1.71 1.13 0.28 5.11 0.57 0.29 0.28 2.55 1.14 -0.28 4.54 5.68 0.85 1.14 4.83 40.04 0.29 4.26 0.85 8.24 1.13 3.41 3.41 28.4 1.71 1.7 -19.03 7.67 -1.71 -3.12 0.29 3.12 -14.49 5.68 -6.24 -9.37 -2.56 0.28 -4.83 -6.53 0 -4.54 -2.27 -0.29 -1.42 -5.11 -2.27 -2.56 0.28 -1.98 -1.42 -1.42 z"
              fill={hoveredItem === 'tower-1' ? 'rgba(56, 189, 248, 0.25)' : 'transparent'}
              stroke={hoveredItem === 'tower-1' ? '#ecc31f' : 'transparent'}
              strokeWidth="0.6"
              style={{
                        cursor: 'pointer',
                        transition: 'fill 0.2s ease, stroke 0.2s ease'
                      }}
              // style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              onMouseEnter={() => setHoveredItem('tower-1')}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => handleItemClick('tower-1')}
            />
          </g>

          {/* Tower 2 Overlay */}
          <g transform="translate(670 229) scale(1.08)">
            <path 
              id="tower-2" 
              className="tower-path"
              d="M24.46 281.03l-10.7 -109.29 0.76 -9.18 -2.29 -12.23 -1.53 -14.52 -2.29 -9.93 -1.53 -14.53 -6.88 -72.61c0,0 1.53,-3.06 3.82,-0.76 2.3,2.29 1.53,3.06 1.53,3.06l41.27 -13.76 0 -4.59c0,0 0.77,-1.53 1.53,-0.76 0.77,0.76 13.76,13.75 13.76,13.75l0 6.12 3.06 3.06 2.29 -0.77 0 -27.51c0,0 0,-3.83 3.06,-0.77 3.06,3.06 3.06,2.3 3.06,2.3l38.21 -12.23 0 -4.59c0,0 3.06,-2.29 4.59,-0.76 1.53,1.52 11.46,12.99 11.46,12.99l1.53 1.53 0 5.35 3.06 -0.77 0.76 3.06 0.77 3.82 8.41 -3.05c0,0 5.34,-0.77 6.87,3.05 1.53,3.83 -0.76,2.3 -0.76,2.3l0 5.35 1.53 1.52 0 10.71 11.46 -3.06c0,0 3.06,-1.53 5.35,2.29 2.3,3.82 0,1.53 0,1.53l0.77 10.7 3.06 0.76 12.99 16.06 -2.29 60.38 -3.06 8.41 -0.77 31.33 0 7.65 -6.87 132.23 -41.28 16.05 -4.58 -3.06 0.76 -6.88 -5.35 -6.11 -2.29 0.76 0 19.87 -42.04 16.05 -5.35 -4.58 0 -6.12 -5.35 -6.11 -2.29 0.76 -3.83 -3.82 -3.82 0 -0.76 -8.41 -3.82 -0.76 -1.53 -1.53 0 -12.23 -2.3 -2.29 0 7.64 -5.35 0 -1.52 -10.7 -3.06 0 -8.41 -10.7 0.77 -7.64 -4.59 -3.83z"
              fill={hoveredItem === 'tower-2' ? 'rgba(56, 189, 248, 0.25)' : 'transparent'}
              stroke={hoveredItem === 'tower-2' ? '#ecc31f' : 'transparent'}
              strokeWidth="1.5"
              // style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
               style={{
                        cursor: 'pointer',
                        transition: 'fill 0.2s ease, stroke 0.2s ease'
                      }}
              onMouseEnter={() => setHoveredItem('tower-2')}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => handleItemClick('tower-2')}
            />
          </g>

          {/* Tower 3 Overlay */}
          <g transform="translate(878 204) scale(0.545)">
            <path 
              id="tower-3" 
              className="tower-path"
              d="M0 562.21l10.72 -131.74 6.13 -10.73 3.06 -68.93 1.54 -55.15 18.38 -225.19c0,0 6.13,-6.13 9.19,-1.53 3.06,4.59 6.13,6.12 6.13,6.12l64.34 -24.51 1.53 -7.66c0,0 4.6,-3.06 6.13,-1.53 1.53,1.53 22.98,21.45 22.98,21.45l6.12 -12.26 1.54 -16.85c0,0 3.06,-10.72 9.19,-6.13 6.13,4.6 6.13,6.13 6.13,6.13l64.34 -22.98c0,0 -0.01,-10.72 7.65,-10.72 7.66,0 18.39,22.98 26.05,26.04 7.66,3.07 3.06,16.85 3.06,16.85l32.17 29.11 18.38 -4.6c0,0 12.26,0 12.26,4.6 0,4.59 0,6.13 0,6.13l12.26 10.72 -3.07 22.98 19.92 -4.6c0,0 10.72,-3.06 10.72,4.6 0,7.66 -1.53,21.45 -1.53,21.45l10.72 9.19 0 6.13 13.79 12.25 9.19 -3.06 27.57 27.57c0,0 6.13,4.6 3.07,18.38 -3.07,13.79 -45.96,162.39 -45.96,162.39l-9.19 16.85 -7.66 33.7 -6.13 24.51 0 21.45 -53.61 203.74 16.85 24.51 -15.32 7.66 -16.85 -19.92 -53.62 19.92 -10.72 -7.66 -1.54 12.26 -10.72 -12.26 3.06 -12.26 -4.59 -3.06 -4.6 35.23 -68.93 27.58 -16.85 -1.53 -7.66 -10.73 3.06 -12.25 -30.64 -33.7 -3.06 9.19 -9.19 -7.66 -7.66 0 3.06 -18.38 -6.13 -1.54 0 -16.85 -10.72 -7.66 -3.06 6.13 -10.73 1.53 -1.53 -18.38 -6.13 -4.59 -1.53 -6.13 -6.13 -12.26 -13.78 -12.25 0 12.25 -16.85 -15.32 4.59 -18.38 -9.19 -7.66z"
              fill={hoveredItem === 'tower-3' ? 'rgba(102, 190, 228, 0.29)' : 'transparent'}
              stroke={hoveredItem === 'tower-3' ? '#ecc31f' : 'transparent'}
              strokeWidth="3"
              style={{ cursor: 'pointer', transition: 'fill 0.2s ease, stroke 0.2s ease' }}
              onMouseEnter={() => setHoveredItem('tower-3')}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => handleItemClick('tower-3')}
            />
          </g>

          {/* Clubhouse Overlay */}
          <g transform="translate(752 595) scale(0.450)">
            <path 
              id="clubhouse" 
              className="clubhouse-path"
              d="M0.13 126.44l3.81 65.33c0,0 5.72,21.45 20.35,19.45 14.61,-1.99 84.65,
      -2.3 84.65,-2.3l0.2 3.65 15.44 -0.5 0.63 -5.97 227.6 -4.52 0.16 4.33 15.45 
      -0.12 -0.32 -5.11 71.88 0.26c0,0 14.15,-11.36 14.32,-20.93 0.16,-9.57 10.57,
      -58.06 10.57,-58.06 0,0 6.51,-14.55 -17.4,-22.2 -23.91,-7.65 -90.27,-29.22 
      -90.27,-29.22l-59.61 -70.53 -235.9 90.62 0 16.82 -42.89 2.07c0,0 -20.61,5.16 
      -18.67,16.93z"
              fill={hoveredItem === 'clubhouse' ? 'rgba(81, 188, 221, 0.35)' : 'transparent'}
              stroke={hoveredItem === 'clubhouse' ? '#ecc31f' : 'transparent'}
              strokeWidth="4"
              style={{ cursor: 'pointer', transition: 'fill 0.2s ease, stroke 0.2s ease' }}
              onMouseEnter={() => setHoveredItem('clubhouse')}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => handleItemClick('clubhouse')}
            />
          </g>

        </svg>

        {/* Hover Tooltip - Cursor Tracking */}
        <AnimatePresence>
          {hoveredItem && towerInfo[hoveredItem] && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                left: tooltipPos.x,
                top: tooltipPos.y,
                pointerEvents: 'none',
                zIndex: 50,
                width: '260px',
                padding: '1.25rem',
                borderRadius: '16px',
                background: 'rgba(7, 7, 9, 0.85)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: `1px solid rgba(56, 189, 248, 0.25)`,
                boxShadow: '0 8px 32px rgba(56, 189, 248, 0.15)',
              }}
            >
              <h4 style={{ 
                fontFamily: 'var(--font-display)', 
                color: 'white', 
                fontSize: '1rem',
                fontWeight: '600',
                borderBottom: `1px solid rgba(255, 255, 255, 0.08)`,
                paddingBottom: '0.6rem',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                {towerInfo[hoveredItem].name}
                <span style={{
                  fontSize: '0.7rem',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: `rgba(56, 189, 248, 0.12)`,
                  color: 'var(--primary)',
                  border: `1px solid rgba(56, 189, 248, 0.25)`
                }}>
                  Active
                </span>
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Config</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: '500' }}>{towerInfo[hoveredItem].bhk}</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Total Area</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: '500' }}>{towerInfo[hoveredItem].area}</span>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Total Units</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: '500' }}>{towerInfo[hoveredItem].units}</span>
                </div>
              </div>
              <p style={{ 
                fontSize: '0.75rem', 
                color: 'var(--text-secondary)', 
                lineHeight: '1.5', 
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                paddingTop: '0.6rem',
                margin: 0
              }}>
                {towerInfo[hoveredItem].details}
              </p>
              {/* <div style={{
                marginTop: '0.8rem',
                fontSize: '0.75rem',
                color: 'var(--primary)',
                fontWeight: '600',
                textAlign: 'right',
                textShadow: '0 0 8px rgba(56, 189, 248, 0.3)'
              }}>
                Explore Floor layouts &rarr;
              </div> */}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Project Overview Card (Bottom Right Floating) */}
    
      <div
  className="glass-panel-premium luxury-hover-glow"
  style={{
    position: "fixed",
    bottom: "2rem",
    right: "2rem",
    zIndex: 40,
    width: isOverviewMinimized ? "240px" : "360px",
    minHeight: isOverviewMinimized ? "140px" : "260px",
    maxHeight: isOverviewMinimized ? "140px" : "calc(100vh - 4rem)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: "1.1rem",
  }}
>
  {/* Header */}
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: isOverviewMinimized
        ? "none"
        : "1px solid rgba(255,255,255,0.08)",
      paddingBottom: isOverviewMinimized ? "0" : "0.75rem",
      marginBottom: isOverviewMinimized ? "0.5rem" : "0.9rem",
      paddingTop: "0.2rem",
    }}
  >
    <h3
      style={{
        fontFamily: "var(--font-display)",
        fontSize: "1rem",
        fontWeight: "600",
        margin: 0,
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <Building2
        size={16}
        color="var(--primary)"
        style={{ filter: "drop-shadow(0 0 5px var(--primary-glow))" }}
      />
      Project Overview
    </h3>

    <button
      onClick={() => setIsOverviewMinimized(!isOverviewMinimized)}
      style={{
        background: "none",
        border: "none",
        color: "var(--text-secondary)",
        cursor: "pointer",
        fontSize: "0.8rem",
        fontWeight: "600",
        padding: "2px",
        display: "flex",
        alignItems: "center",
        transition: "color var(--transition-fast)",
      }}
      onMouseOver={(e) =>
        (e.currentTarget.style.color = "var(--primary)")
      }
      onMouseOut={(e) =>
        (e.currentTarget.style.color = "var(--text-secondary)")
      }
    >
      {isOverviewMinimized ? "Expand" : "Minimize"}
    </button>
  </div>

  {/* ---------------- Minimized View ---------------- */}
  {isOverviewMinimized ? (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        gap: "4px",
      }}
    >
      <Building2
        size={36}
        color="var(--primary)"
        style={{
          filter: "drop-shadow(0 0 10px var(--primary-glow))",
        }}
      />

      <div
        style={{
          fontSize: "1rem",
          fontWeight: "700",
          color: "white",
        }}
      >
        Sarovar Towers
      </div>

      <div
        style={{
          fontSize: "0.75rem",
          color: "var(--text-secondary)",
        }}
      >
        Nallagandla, Hyderabad
      </div>
        

   
  
 


    </div>
  ) : (
    /* ---------------- Expanded View ---------------- */
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.5rem",
          fontWeight: "700",
          color: "white",
          marginBottom: "0.25rem",
          letterSpacing: "-0.3px",
        }}
      >
        Sarovar Towers
      </h2>

      <p
        style={{
          fontSize: "0.85rem",
          color: "var(--primary)",
          fontWeight: "600",
          marginBottom: "1rem",
          textShadow: "0 0 8px rgba(56, 189, 248, 0.2)",
        }}
      >
        Nallagandla, Hyderabad
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "0.7rem",
          marginBottom: "0.9rem",
        }}
      >
        {[
          {
            label: "High-Rise",
            val: "3 Towers",
            icon: <Building2 size={16} />,
          },
          {
            label: "Storeys",
            val: "50 Floors",
            icon: <Layers size={16} />,
          },
          {
            label: "Luxury Units",
            val: "585 Units",
            icon: <HomeIcon size={16} />,
          },
          {
            label: "Land Area",
            val: "5.25 Acres",
            icon: <Map size={16} />,
          },
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.05)",
              padding: "0.6rem 0.75rem",
              borderRadius: "12px",
            }}
          >
            <div
              style={{
                background: "rgba(56,189,248,0.1)",
                border: "1px solid rgba(56,189,248,0.15)",
                borderRadius: "8px",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--primary)",
                flexShrink: 0,
              }}
            >
              {stat.icon}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span
                style={{
                  fontSize: "0.65rem",
                  color: "var(--text-muted)",
                }}
              >
                {stat.label}
              </span>

              <span
                style={{
                  fontSize: "0.85rem",
                  color: "white",
                  fontWeight: "700",
                }}
              >
                {stat.val}
              </span>
            </div>
          </div>
        ))}
      </div>

    </motion.div>
  )}
</div>
 </motion.div>
  )
 
};

export default Home;
