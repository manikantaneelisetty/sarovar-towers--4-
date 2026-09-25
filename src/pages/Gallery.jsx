import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { Play, X, Volume2, VolumeX, ZoomIn } from 'lucide-react';

/* ─────────────────────────────────────────────
   CONSTANTS & DATA
───────────────────────────────────────────── */
const EASE = [0.16, 1, 0.3, 1];
const SKY = '#38BDF8';

/* Filter categories — plain text, no button chrome */
const FILTERS = [
  { key: 'all',          label: 'All' },
  { key: 'exterior',     label: 'Exterior' },
  { key: 'interiors',    label: 'Interiors' },
   { key: 'construction', label: 'Progress' },
  { key: 'amenities',    label: 'Amenities' },
 
  { key: 'video',        label: 'Videos' },
];

/* 9 real gallery images + 3 inline videos (sample sources) */
const ALL_ITEMS = [
  /* ── EXTERIOR ── */
  { id: 'e1', type: 'image', cat: 'exterior',     src: '/images/gallery/1.jpg',  label: 'Grand Facade',          size: 'wide' },
  { id: 'e2', type: 'image', cat: 'exterior',     src: '/images/gallery/2.jpg',  label: 'Tower Elevation',       size: 'normal' },

  /* ── INTERIORS ── */
  { id: 'i1', type: 'image', cat: 'interiors',    src: '/images/gallery/3.jpg',  label: 'Living Room',           size: 'tall' },
  { id: 'i2', type: 'image', cat: 'interiors',    src: '/images/gallery/4.jpg',  label: 'Premium Lounge',        size: 'normal' },
  { id: 'i3', type: 'image', cat: 'interiors',    src: '/images/gallery/5.jpg',  label: 'Dining Space',          size: 'wide' },
  { id: 'i4', type: 'image', cat: 'interiors',    src: '/images/gallery/03.jpg', label: 'Modular Kitchen',       size: 'normal' },

  /* ── AMENITIES ── */
  { id: 'a1', type: 'image', cat: 'amenities',    src: '/images/gallery/7.jpg',  label: 'Fitness Centre',        size: 'normal' },
  { id: 'a2', type: 'image', cat: 'amenities',    src: '/images/gallery/8.jpg',  label: 'Master Suite',          size: 'wide' },
  { id: 'a3', type: 'image', cat: 'amenities',    src: '/images/gallery/9.jpg',  label: 'Entertainment Lounge',  size: 'normal' },

  /* ── CONSTRUCTION ── */
  { id: 'c1', type: 'image', cat: 'construction', src: '/images/gallery/8.jpg',  label: 'Structural Progress',   size: 'normal' },
  { id: 'c2', type: 'image', cat: 'construction', src: '/images/gallery/9.jpg',  label: 'Interior Progress',     size: 'normal' },

  /* ── VIDEOS ── */
  {
    id: 'v1', type: 'video', cat: 'video',
    src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    poster: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    label: 'Project Walkthrough', size: 'wide'
  },
  {
    id: 'v2', type: 'video', cat: 'video',
    src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    poster: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
    label: 'Drone Flyover', size: 'normal'
  },
  {
    id: 'v3', type: 'video', cat: 'video',
    src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    poster: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
    label: 'Construction Timelapse', size: 'normal'
  },
];

/* ─────────────────────────────────────────────
   SCROLL PROGRESS BAR
───────────────────────────────────────────── */
const ScrollBar = () => {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: '2px', background: SKY,
        transformOrigin: 'left', scaleX: scrollYProgress,
        zIndex: 9999
      }}
    />
  );
};

/* ─────────────────────────────────────────────
   LIGHTBOX
───────────────────────────────────────────── */
const Lightbox = ({ item, onClose }) => {
  const [muted, setMuted] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        key="lb-bg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 9000,
          background: 'rgba(0,0,0,0.92)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '2rem'
        }}
      >
        <motion.div
          key="lb-inner"
          initial={{ opacity: 0, scale: 0.88, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.45, ease: EASE }}
          onClick={(e) => e.stopPropagation()}
          style={{ position: 'relative', maxWidth: '90vw', maxHeight: '88vh', lineHeight: 0 }}
        >
          {item.type === 'video' ? (
            <>
              <video
                ref={videoRef}
                src={item.src}
                poster={item.poster}
                muted={muted}
                autoPlay
                controls={false}
                loop
                playsInline
                style={{ maxWidth: '90vw', maxHeight: '82vh', borderRadius: '4px', display: 'block' }}
              />
              <button
                onClick={() => setMuted(m => !m)}
                style={{
                  position: 'absolute', bottom: '1rem', left: '1rem',
                  background: 'rgba(255,255,255,0.15)', border: 'none',
                  borderRadius: '50%', width: '36px', height: '36px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#fff'
                }}
              >
                {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </>
          ) : (
            <img
              src={item.src}
              alt={item.label}
              style={{ maxWidth: '90vw', maxHeight: '82vh', borderRadius: '4px', display: 'block', objectFit: 'contain' }}
            />
          )}

          {/* caption */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '0.75rem 1rem',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
            color: '#fff', fontSize: '0.85rem', fontWeight: 500,
            borderRadius: '0 0 4px 4px'
          }}>
            {item.label}
          </div>

          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '-2.5rem', right: 0,
              background: 'none', border: 'none',
              color: 'rgba(255,255,255,0.7)', cursor: 'pointer'
            }}
          >
            <X size={24} />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ─────────────────────────────────────────────
   SINGLE GALLERY CARD
   — image/video grows from bottom + text fade
───────────────────────────────────────────── */
const GalleryCard = ({ item, index, onOpen }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  /* staggered delay based on column position */
  const delay = (index % 3) * 0.08;

  const isWide   = item.size === 'wide';
  const isTall   = item.size === 'tall';
  const isVideo  = item.type === 'video';

  return (
    <motion.div
      ref={ref}
      /* ENTRY: scale from small + rise from below */
      initial={{ opacity: 0, y: 60, scaleY: 0.7, scaleX: 0.92, transformOrigin: 'bottom center' }}
      animate={inView
        ? { opacity: 1, y: 0, scaleY: 1, scaleX: 1 }
        : {}}
      transition={{ duration: 0.75, ease: EASE, delay }}
      onClick={() => onOpen(item)}
      style={{
        gridColumn: isWide ? 'span 2' : 'span 1',
        gridRow:    isTall ? 'span 2' : 'span 1',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        background: '#f8f8f8',
      }}
    >
      {/* media */}
      <motion.div
        whileHover={{ scale: 1.04 }}
        transition={{ duration: 0.55, ease: EASE }}
        style={{ width: '100%', height: '100%', position: 'relative' }}
      >
        {isVideo ? (
          <img
            src={item.poster}
            alt={item.label}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <img
            src={item.src}
            alt={item.label}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        )}

        {/* hover overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'flex-end', padding: '1rem 1.1rem'
          }}
        >
          {/* label rises from bottom */}
          <motion.p
            initial={{ y: 14, opacity: 0 }}
            whileHover={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35, ease: EASE }}
            style={{
              margin: 0, color: '#fff',
              fontSize: '0.85rem', fontWeight: 600,
              letterSpacing: '0.3px'
            }}
          >
            {item.label}
          </motion.p>
        </motion.div>

        {/* video play badge */}
        {isVideo && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: '52px', height: '52px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none'
          }}>
            <Play size={20} fill={SKY} color={SKY} />
          </div>
        )}

        {/* zoom icon top-right */}
        <div style={{
          position: 'absolute', top: '0.75rem', right: '0.75rem',
          width: '30px', height: '30px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: 0.85, pointerEvents: 'none'
        }}>
          {isVideo ? <Play size={13} color="#111" /> : <ZoomIn size={13} color="#111" />}
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   SECTION LABEL  — text slides in from the right edge
───────────────────────────────────────────── */
const SectionLabel = ({ label, count }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <div ref={ref} style={{
      display: 'flex', alignItems: 'baseline', gap: '1.2rem',
      marginBottom: '1.75rem', overflow: 'hidden'
    }}>
      <motion.span
        initial={{ x: '110%', opacity: 0 }}
        animate={inView ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 0.7, ease: EASE }}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.05rem', fontWeight: 600,
          color: '#111', letterSpacing: '-0.2px'
        }}
      >
        {label}
      </motion.span>
      <motion.span
        initial={{ x: '110%', opacity: 0 }}
        animate={inView ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 0.7, ease: EASE, delay: 0.06 }}
        style={{ fontSize: '0.78rem', color: '#aaa', fontWeight: 400 }}
      >
        {count} {count === 1 ? 'item' : 'items'}
      </motion.span>
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.7, ease: EASE, delay: 0.12 }}
        style={{
          flex: 1, height: '1px',
          background: 'linear-gradient(90deg, #e5e7eb, transparent)',
          transformOrigin: 'left'
        }}
      />
    </div>
  );
};

/* ─────────────────────────────────────────────
   HERO — parallax text block
───────────────────────────────────────────── */
const HeroSection = ({ activeFilter }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);

  const filterLabel = FILTERS.find(f => f.key === activeFilter)?.label || 'All';

  return (
    <div ref={ref} style={{
      height: '52vh', minHeight: '340px', position: 'relative',
      display: 'flex', alignItems: 'flex-end', overflow: 'hidden',
      marginBottom: '4rem'
    }}>
      {/* Large parallax heading */}
      <motion.div style={{ y, position: 'relative', zIndex: 1 }}>
        <motion.span
          key={activeFilter + '-tag'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            fontSize: '0.75rem', fontWeight: 600, letterSpacing: '3px',
            color: SKY, textTransform: 'uppercase', display: 'block',
            marginBottom: '0.5rem'
          }}
        >
          {activeFilter === 'all' ? 'Full Collection' : filterLabel}
        </motion.span>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(3rem, 8vw, 6.5rem)',
          fontWeight: 700, color: '#000',
          letterSpacing: '-3px', lineHeight: 0.95,
          margin: 0
        }}>
          Gallery
        </h1>

        <p style={{
          marginTop: '1rem', color: '#6b7280',
          fontSize: '1rem', lineHeight: 1.7,
          maxWidth: '480px'
        }}>
          Every corner of Sarovar Towers, captured. Browse images and videos from
          exteriors, interiors, amenities and construction milestones.
        </p>
      </motion.div>

      {/* Giant ghost word */}
      <div aria-hidden style={{
        position: 'absolute', right: '1rem', bottom: '1rem',
        fontSize: 'clamp(8rem,18vw,14rem)', fontWeight: 800,
        color: '#f3f4f6', letterSpacing: '-5px',
        userSelect: 'none', lineHeight: 1,
        fontFamily: 'var(--font-display)',
        zIndex: 0
      }}>
       Gallery
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   FILTER STRIP — plain text, no button chrome
───────────────────────────────────────────── */
const FilterStrip = ({ active, onChange, counts }) => (
  <div style={{
    display: 'flex', gap: '0', alignItems: 'center',
    marginBottom: '3.5rem', flexWrap: 'wrap',
    borderBottom: '2px solid #f0f0f0', paddingBottom: '1.25rem',
    rowGap: '0.75rem'
  }}>
    {FILTERS.map((f, i) => {
      const isActive = f.key === active;
      const cnt = f.key === 'all' ? counts.all : (counts[f.key] || 0);
      if (f.key !== 'all' && cnt === 0) return null;

      return (
        <React.Fragment key={f.key}>
          {i > 0 && (
            <span style={{
              color: '#d1d5db', padding: '0 1rem',
              fontSize: '1.1rem', userSelect: 'none', lineHeight: 1
            }}>
              /
            </span>
          )}
          <button
            onClick={() => onChange(f.key)}
            style={{
              background: 'none', border: 'none',
              padding: '0.1rem 0.2rem',
              cursor: 'pointer',
              fontFamily: 'var(--font-display)',
              fontSize: isActive ? '1.9rem' : '1.3rem',
              fontWeight: isActive ? 800 : 500,
              color: isActive ? '#000000' : '#555555',
              letterSpacing: isActive ? '-1px' : '-0.2px',
              transition: 'all 0.38s cubic-bezier(0.16,1,0.3,1)',
              lineHeight: 1.15,
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'baseline',
              gap: '4px'
            }}
          >
            {f.label}
            {/* animated active dot */}
            {isActive && (
              <motion.span
                layoutId="filter-dot"
                style={{
                  position: 'absolute', bottom: '-1.35rem', left: '50%',
                  transform: 'translateX(-50%)',
                  width: '5px', height: '5px', borderRadius: '50%',
                  background: SKY, display: 'block'
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              />
            )}
            {/* count badge — always visible, black when active */}
            <span style={{
              fontSize: isActive ? '0.75rem' : '0.68rem',
              fontWeight: 600,
              color: isActive ? '#000000' : '#aaaaaa',
              marginLeft: '3px',
              verticalAlign: 'super',
              lineHeight: 1,
              transition: 'color 0.35s ease, font-size 0.35s ease'
            }}>
              {cnt}
            </span>
          </button>
        </React.Fragment>
      );
    })}
  </div>
);

/* ─────────────────────────────────────────────
   MASONRY GRID — CSS grid auto-rows with spans
───────────────────────────────────────────── */
const MasonryGrid = ({ items, onOpen }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridAutoRows: '260px',
    gap: '10px',
  }}
    className="gallery-masonry"
  >
    {items.map((item, i) => (
      <GalleryCard key={item.id} item={item} index={i} onOpen={onOpen} />
    ))}
  </div>
);

/* ─────────────────────────────────────────────
   STATS BAND — between sections
───────────────────────────────────────────── */
const StatsBand = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const stats = [
    { value: '14+', label: 'Zones Covered' },
    { value: '9',   label: 'Gallery Images' },
    { value: '3',   label: 'Video Tours' },
    { value: '212ft', label: 'Tower Height' },
  ];
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: EASE }}
      style={{
        display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
        gap: '2px', background: '#e5e7eb',
        margin: '4rem 0', overflow: 'hidden'
      }}
      className="stats-band"
    >
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
          style={{
            background: '#fff', padding: '2rem 1.5rem',
            textAlign: 'center'
          }}
        >
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2.2rem', fontWeight: 700,
            color: '#111', letterSpacing: '-1px', lineHeight: 1
          }}>
            {s.value}
          </div>
          <div style={{
            marginTop: '0.4rem',
            fontSize: '0.72rem', fontWeight: 600,
            letterSpacing: '1.5px', color: '#9ca3af',
            textTransform: 'uppercase'
          }}>
            {s.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   VIDEOS ROW — full-width cinematic strip
───────────────────────────────────────────── */
const VideoStrip = ({ videos, onOpen }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  if (!videos.length) return null;

  return (
    <div ref={ref} style={{ marginTop: '5rem' }}>
      <SectionLabel label="Video Tours" count={videos.length} />
      <div style={{
        display: 'grid',
        gridTemplateColumns: `2fr ${videos.slice(1).map(() => '1fr').join(' ')}`,
        gap: '10px',
        gridAutoRows: '340px'
      }}
        className="video-strip"
      >
        {videos.map((v, i) => {
          const isHero = i === 0;
          return (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, scaleY: 0.65, y: 50, transformOrigin: 'bottom' }}
              animate={inView ? { opacity: 1, scaleY: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: EASE, delay: i * 0.12 }}
              onClick={() => onOpen(v)}
              style={{
                position: 'relative', overflow: 'hidden', cursor: 'pointer',
                gridRow: isHero ? 'span 1' : 'span 1'
              }}
            >
              <motion.img
                src={v.poster} alt={v.label}
                loading="lazy"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.5, ease: EASE }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              {/* gradient */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)'
              }} />
              {/* play */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%,-50%)',
                width: isHero ? '72px' : '52px', height: isHero ? '72px' : '52px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.95)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'transform 0.3s ease'
              }}>
                <Play size={isHero ? 26 : 18} fill={SKY} color={SKY} />
              </div>
              {/* label */}
              <div style={{
                position: 'absolute', bottom: '1rem', left: '1.2rem', right: '1.2rem',
                color: '#fff'
              }}>
                <p style={{ margin: 0, fontSize: isHero ? '1rem' : '0.82rem', fontWeight: 600 }}>
                  {v.label}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
const Gallery = () => {
  const [active, setActive]   = useState('all');
  const [lightbox, setLightbox] = useState(null);

  /* computed */
  const imageItems = ALL_ITEMS.filter(i => i.type === 'image');
  const videoItems = ALL_ITEMS.filter(i => i.type === 'video');

  const counts = {
    all: ALL_ITEMS.length,
    ...FILTERS.slice(1).reduce((acc, f) => {
      acc[f.key] = ALL_ITEMS.filter(i =>
        f.key === 'video' ? i.type === 'video' : i.cat === f.key
      ).length;
      return acc;
    }, {})
  };

  const filtered = active === 'all'
    ? imageItems
    : active === 'video'
      ? videoItems
      : imageItems.filter(i => i.cat === active);

  const filteredVideos = active === 'all' || active === 'video' ? videoItems : [];

  const openLightbox = useCallback((item) => setLightbox(item), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  return (
    <>
      <ScrollBar />

      {/* responsive helpers */}
      <style>{`
        @media (max-width: 768px) {
          .gallery-masonry { grid-template-columns: repeat(2,1fr) !important; grid-auto-rows: 200px !important; }
          .video-strip { grid-template-columns: 1fr !important; }
          .stats-band { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 500px) {
          .gallery-masonry { grid-template-columns: 1fr !important; }
          .stats-band { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          minHeight: '100vh',
          background: '#ffffff',
          paddingTop: '110px',
          paddingLeft: 'max(5%, calc(50vw - 720px))',
          paddingRight: 'max(5%, calc(50vw - 720px))',
          paddingBottom: '8rem',
          overflowX: 'hidden'
        }}
      >
        {/* ── HERO ── */}
        <HeroSection activeFilter={active} />

        {/* ── FILTER STRIP — text only, clickable ── */}
        <FilterStrip active={active} onChange={setActive} counts={counts} />

        {/* ── STATS ── */}
        {active === 'all' && <StatsBand />}

        {/* ── IMAGE GRID ── */}
        <AnimatePresence mode="wait">
          {filtered.length > 0 && (
            <motion.div
              key={active + '-grid'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              {active !== 'video' && (
                <>
                  <SectionLabel
                    label={active === 'all' ? 'Images' : FILTERS.find(f => f.key === active)?.label}
                    count={filtered.length}
                  />
                  <MasonryGrid items={filtered} onOpen={openLightbox} />
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── VIDEO STRIP ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active + '-videos'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <VideoStrip videos={filteredVideos} onOpen={openLightbox} />
          </motion.div>
        </AnimatePresence>

        {/* ── EMPTY STATE ── */}
        {filtered.length === 0 && filteredVideos.length === 0 && (
          <div style={{ textAlign: 'center', padding: '6rem 0', color: '#9ca3af' }}>
            <p style={{ fontSize: '1rem' }}>No items in this category yet.</p>
          </div>
        )}

        {/* ── FOOTER NOTE ── */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            marginTop: '5rem',
            color: '#d1d5db', fontSize: '0.78rem',
            textAlign: 'center', letterSpacing: '1px',
            textTransform: 'uppercase'
          }}
        >
          Aparna Sarovar Towers · Hyderabad · All visuals are representational
        </motion.p>
      </motion.div>

      {/* ── LIGHTBOX ── */}
      {lightbox && <Lightbox item={lightbox} onClose={closeLightbox} />}
    </>
  );
};

export default Gallery;
