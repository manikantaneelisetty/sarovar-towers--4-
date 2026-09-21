import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Compass, Train, GraduationCap, Hospital, ShoppingBag, Eye } from 'lucide-react';
import Footer from "../layouts/Footer"
const LocationMap = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [isDirectoryMinimized, setIsDirectoryMinimized] = useState(false);

  const places = [
    { name: 'Lingampally Railway Station', distance: '2.2 km', category: 'Transit', icon: Train },
    { name: 'Golden Mile Road', distance: '2.7 km', category: 'Transit', icon: Compass },
    { name: 'Trumpet Junction Outer Ring Road', distance: '10.4 km', category: 'Transit', icon: Train },
    { name: 'Musi River Expressway', distance: '12.5 km', category: 'Transit', icon: Compass },
    { name: 'Rajiv Gandhi International Airport', distance: '32.0 km', category: 'Transit', icon: Train },
    
    { name: 'Sancta Maria International School', distance: '1.8 km', category: 'Education', icon: GraduationCap },
    { name: 'Birchwood High School', distance: '2.1 km', category: 'Education', icon: GraduationCap },
    { name: 'University of Hyderabad Campus', distance: '3.5 km', category: 'Education', icon: GraduationCap },
    
    { name: 'Citizens Specialty Hospital', distance: '1.5 km', category: 'Healthcare', icon: Hospital },
    { name: 'Continental Hospital Gachibowli', distance: '6.2 km', category: 'Healthcare', icon: Hospital },
    
    { name: 'GSM Mall & Multiplex', distance: '3.8 km', category: 'Shopping', icon: ShoppingBag },
    { name: 'IKEA Hyderabad Store', distance: '9.5 km', category: 'Shopping', icon: ShoppingBag }
  ];

  const categories = ['All', 'Transit', 'Education', 'Healthcare', 'Shopping'];

  const filteredPlaces = activeCategory === 'All' 
    ? places 
    : places.filter(p => p.category === activeCategory);

  return (
    <>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        paddingTop: '80px',
        minHeight: '100vh',
        height: '100vh',
        background: '#070709',
        color: 'white',
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{
        position: 'relative',
        width: '100%',
        height: 'calc(100vh - 80px)',
        minHeight: 'calc(100vh - 80px)',
        overflow: 'hidden',
        flexGrow: 1
      }}
      className="location-map-frame"
      >
        {/* Google Map Background */}
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4722.650843103583!2d78.30820607594096!3d17.465847950538574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb930045289e53%3A0xce2d6dc45e0e01a3!2sAparna%20Sarovar%20Towers!5e1!3m2!1sen!2sin!4v1782295986508!5m2!1sen!2sin" 
          width="100%" 
          height="100%" 
          style={{ border: 0, position: 'absolute', top: 0, left: 0 }} 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="strict-origin-when-cross-origin"
          title="Aparna Sarovar Towers Location Map"
        />

        {/* POI Directory Panel (Floating Glass Panel) */}
        <div style={{
          position: 'absolute',
          left: '1.5rem',
          bottom: '1.5rem',
          width: '380px',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '20px',
          background: 'rgba(7, 7, 9, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          padding: '1.2rem',
          zIndex: 10,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          maxHeight: 'calc(100% - 3rem)',
          minHeight: isDirectoryMinimized ? '170px' : '0',
          height: isDirectoryMinimized ? '180px' : 'auto',
          justifyContent: 'flex-start'
        }}
        className="floating-neighborhood-directory"
        >
          <div style={{
            borderBottom: isDirectoryMinimized ? 'none' : '1px solid rgba(255,255,255,0.08)',
            paddingBottom: isDirectoryMinimized ? '0' : '1rem',
            marginBottom: isDirectoryMinimized ? '0' : '1rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ 
                margin: '0', 
                fontFamily: 'var(--font-display)', 
                fontSize: '1.15rem', 
                fontWeight: '700',
                color: 'white',
                letterSpacing: '-0.2px'
              }}>
                Neighborhood Directory
              </h3>
              <button
                onClick={() => setIsDirectoryMinimized(!isDirectoryMinimized)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'color 0.2s ease'
                }}
                onMouseOver={e => e.currentTarget.style.color = 'var(--primary)'}
                onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                {isDirectoryMinimized ? 'Expand' : 'Minimize'}
              </button>
            </div>

            {!isDirectoryMinimized && (
              <div style={{ marginTop: '1rem' }}>
                {/* Category Filter Tabs */}
                <div style={{
                  display: 'flex',
                  gap: '6px',
                  flexWrap: 'wrap'
                }}>
                  {categories.map(cat => {
                    const isActive = activeCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        style={{
                          background: isActive ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                          border: '1px solid',
                          borderColor: isActive ? 'var(--primary)' : 'rgba(255,255,255,0.08)',
                          color: isActive ? '#000' : 'var(--text-secondary)',
                          padding: '0.45rem 0.95rem',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                          fontFamily: 'var(--font-display)'
                        }}
                        onMouseOver={e => {
                          if (!isActive) e.currentTarget.style.borderColor = 'var(--primary)';
                        }}
                        onMouseOut={e => {
                          if (!isActive) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                        }}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {isDirectoryMinimized ? (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              gap: '6px'
            }}>
              <MapPin size={32} color="var(--primary)" />
              <div style={{ fontSize: '1rem', fontWeight: '700', color: 'white' }}>
                Neighborhood Directory
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {filteredPlaces.length} places • {activeCategory}
              </div>
            </div>
          ) : (
            <div style={{
              overflowY: 'auto',
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              paddingRight: '6px'
            }}
            className="scrollbar-styled"
            >
              <AnimatePresence mode="popLayout">
                {filteredPlaces.map((place, idx) => {
                  const IconComponent = place.icon;
                  return (
                    <motion.div
                      key={place.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.25, delay: idx * 0.02 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 0.85rem',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.04)',
                        borderRadius: '12px',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.35)';
                        e.currentTarget.style.background = 'rgba(56, 189, 248, 0.05)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.04)';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          background: 'rgba(56, 189, 248, 0.12)',
                          border: '1px solid rgba(56, 189, 248, 0.25)',
                          borderRadius: '8px',
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <IconComponent size={14} color="var(--primary)" />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'white' }}>
                            {place.name}
                          </div>
                          <span style={{
                            fontSize: '0.65rem',
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                            fontWeight: '600',
                            letterSpacing: '0.5px'
                          }}>
                            {place.category}
                          </span>
                        </div>
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        color: 'var(--primary)'
                      }}>
                        <MapPin size={12} />
                        {place.distance}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  
   </>
  );
};

export default LocationMap;
