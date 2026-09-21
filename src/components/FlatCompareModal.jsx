import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ArrowLeftRight } from 'lucide-react';
import { useCompare } from '../context/CompareContext';
import { getBlockName } from '../services/flatData';

const FlatCompareModal = () => {
  const { compareList, isCompareOpen, setIsCompareOpen, removeFromCompare, clearCompare } = useCompare();

  if (!isCompareOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 200,
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',     
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}
    onClick={() => setIsCompareOpen(false)}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        style={{
          width: '100%',
          maxWidth: '1600px',
          background: '#ffffff',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          borderRadius: '24px',
          padding: '2.5rem',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          paddingBottom: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ArrowLeftRight size={24} color="var(--primary)" />
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: '700', margin: 0, color: 'black' }}>
              Compare Apartments
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button
              onClick={clearCompare}
              style={{
                background: 'none',
                border: 'none',
                color: '#555555',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: '600',
                transition: 'color 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.color = '#ff4d4d'}
              onMouseOut={e => e.currentTarget.style.color = '#555555'}
            >
              Clear All
            </button>
            <button 
              onClick={() => setIsCompareOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'black',
                cursor: 'pointer',
                fontSize: '1.25rem'
              }}
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content body */}
        <div style={{
          overflowY: 'auto',
          flexGrow: 1,
          display: 'grid',
          gridTemplateColumns: `repeat(${compareList.length}, 1fr)`,
          gap: '2rem'
        }}
        className="compare-grid"
        >
          {compareList.map((flat) => {
            const block = getBlockName(flat.tower);
            return (
              <div 
                key={`${flat.tower}-${flat.flat}`}
                style={{
                  // background: '#f5f5dc',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '16px',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                  position: 'relative'
                }}
              >
                {/* Trash/Remove Button */}
                <button
                  onClick={() => removeFromCompare(flat.tower, flat.flat)}
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'rgba(255, 77, 77, 0.1)',
                    border: '1px solid rgba(255, 77, 77, 0.2)',
                    color: '#ff4d4d',
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    zIndex: 10
                  }}
                  onMouseOver={e => e.currentTarget.style.background = '#ff4d4d' + '44'}
                  onMouseOut={e => e.currentTarget.style.background = 'rgba(255, 77, 77, 0.1)'}
                >
                  <Trash2 size={16} />
                </button>

                {/* Flat Layout Image */}
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  aspectRatio: '4/3'
                }}>
                  <img 
                    src={flat.image} 
                    alt={`Flat ${flat.flat}`} 
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </div>

                {/* Information */}
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: '700', margin: '0 0 0.25rem 0', color: 'black' }}>
                    Flat {flat.flat}
                  </h3>
                  <span style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: '600', display: 'block', marginBottom: '0.75rem' }}>
                    {block} Block — Floor {flat.floor}
                  </span>
                  <p style={{ fontSize: '0.95rem', color: '#333333', margin: 0, fontWeight: '500' }}>
                    {flat.info}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                  paddingTop: '1.5rem',
                  marginTop: 'auto'
                }}>
                  {flat.specs.map((spec, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '1.05rem', // Increased font size
                      paddingBottom: '6px',
                      borderBottom: '1px dashed rgba(0, 0, 0, 0.1)'
                    }}>
                      <span style={{ color: '#111111', fontWeight: '600' }}>{spec[0]}</span>
                      <strong style={{ color: 'black', fontWeight: '800' }}>{spec[1]}</strong>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default FlatCompareModal;
