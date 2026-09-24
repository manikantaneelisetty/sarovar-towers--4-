import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import {
  Building, Grid, DoorOpen, Droplet, Bolt,
  ShieldAlert, Utensils
} from 'lucide-react';

/* ─── Thin horizontal rule ─── */
const Divider = () => (
  <div style={{
    width: '60px',
    height: '2px',
    background: 'linear-gradient(90deg, #38BDF8, transparent)',
    margin: '1rem 0 1.5rem 0'
  }} />
);

/* ─── Counter badge ─── */
const IndexBadge = ({ num }) => (
  <span style={{
    fontFamily: 'var(--font-display)',
    fontSize: '7rem',
    fontWeight: '800',
    color: '#f0f9ff',
    lineHeight: 1,
    userSelect: 'none',
    letterSpacing: '-4px',
    pointerEvents: 'none'
  }}>
    {String(num).padStart(2, '0')}
  </span>
);

/* ─── Spec Item row ─── */
const SpecItem = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
    style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem',
      padding: '0.6rem 0',
      borderBottom: '1px solid #f3f4f6'
    }}
  >
    <span style={{
      width: '5px',
      height: '5px',
      borderRadius: '50%',
      background: '#38BDF8',
      marginTop: '0.55rem',
      flexShrink: 0
    }} />
    <p style={{ margin: 0, color: '#4b5563', fontSize: '0.97rem', lineHeight: '1.7' }}>
      {children}
    </p>
  </motion.div>
);

/* ─── Parallax image wrapper ─── */
const ParallaxImage = ({ src, alt }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  return (
    <div ref={ref} style={{
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <motion.img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '115%',
          objectFit: 'cover',
          display: 'block',
          y
        }}
      />
    </div>
  );
};

/* ─── LAYOUT A — image left, text right with big number ─── */
const LayoutA = ({ title, icon: Icon, imageSrc, index, children }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref} style={{ position: 'relative', marginBottom: '7rem' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0',
        alignItems: 'stretch',
        minHeight: '480px'
      }}
        className="spec-grid"
      >
        {/* IMAGE */}
        <motion.div
          initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
          animate={inView ? { opacity: 1, clipPath: 'inset(0 0% 0 0)' } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'relative', aspectRatio: '4/3' }}
        >
          <ParallaxImage src={imageSrc} alt={title} />
          {/* thin vertical accent line */}
          <div style={{
            position: 'absolute',
            top: '10%',
            right: '-1px',
            width: '3px',
            height: '80%',
            background: '#38BDF8',
            zIndex: 2
          }} />
        </motion.div>

        {/* TEXT */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          style={{
            padding: '3.5rem 3rem 3.5rem 4rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* ghost number */}
          <div style={{ position: 'absolute', top: '-1rem', right: '1rem' }}>
            <IndexBadge num={index} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
            <Icon size={22} color="#38BDF8" strokeWidth={1.8} />
            <span style={{ fontSize: '0.78rem', fontWeight: '600', letterSpacing: '2px', color: '#38BDF8', textTransform: 'uppercase' }}>
              Specification
            </span>
          </div>

          <h2 style={{
            margin: '0.5rem 0 0 0',
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            fontWeight: '700',
            color: '#111111',
            letterSpacing: '-0.5px',
            lineHeight: 1.2
          }}>
            {title}
          </h2>
          <Divider />
          <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

/* ─── LAYOUT B — full-width image strip + text below pinned left ─── */
const LayoutB = ({ title, icon: Icon, imageSrc, index, children }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref} style={{ marginBottom: '7rem' }}>
      {/* WIDE image */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0.92, originX: 0 }}
        animate={inView ? { opacity: 1, scaleX: 1 } : {}}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: 'relative', height: '340px', overflow: 'hidden', width: '75%' }}
      >
        <ParallaxImage src={imageSrc} alt={title} />
        {/* bottom accent */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '3px',
            background: 'linear-gradient(90deg,#38BDF8,transparent)',
            transformOrigin: 'left',
            zIndex: 2
          }}
        />
      </motion.div>

      {/* TEXT block */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '3rem',
          paddingTop: '3rem',
          alignItems: 'start'
        }}
        className="spec-text-grid"
      >
        {/* Left meta */}
        <div>
          <span style={{ fontSize: '0.78rem', fontWeight: '600', letterSpacing: '2px', color: '#38BDF8', textTransform: 'uppercase' }}>
            Specification
          </span>
          <h2 style={{
            margin: '0.75rem 0 0 0',
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            fontWeight: '700',
            color: '#111111',
            letterSpacing: '-0.5px',
            lineHeight: 1.2
          }}>
            {title}
          </h2>
          <Divider />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Icon size={20} color="#38BDF8" strokeWidth={1.8} />
            <span style={{
              fontSize: '6rem',
              fontWeight: '800',
              color: '#f0f9ff',
              lineHeight: 1,
              letterSpacing: '-4px',
              userSelect: 'none'
            }}>
              {String(index).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Right content */}
        <div style={{ paddingTop: '0.5rem' }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
};

/* ─── LAYOUT C — text left, image right with offset overlap ─── */
const LayoutC = ({ title, icon: Icon, imageSrc, index, children }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref} style={{ position: 'relative', marginBottom: '7rem' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0',
        alignItems: 'stretch',
        minHeight: '480px'
      }}
        className="spec-grid"
      >
        {/* TEXT left */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          style={{
            padding: '3.5rem 4rem 3.5rem 0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', bottom: '-1rem', left: '-1.5rem' }}>
            <IndexBadge num={index} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
            <Icon size={22} color="#38BDF8" strokeWidth={1.8} />
            <span style={{ fontSize: '0.78rem', fontWeight: '600', letterSpacing: '2px', color: '#38BDF8', textTransform: 'uppercase' }}>
              Specification
            </span>
          </div>
          <h2 style={{
            margin: '0.5rem 0 0 0',
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            fontWeight: '700',
            color: '#111111',
            letterSpacing: '-0.5px',
            lineHeight: 1.2
          }}>
            {title}
          </h2>
          <Divider />
          <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
            {children}
          </div>
        </motion.div>

        {/* IMAGE right */}
        <motion.div
          initial={{ opacity: 0, clipPath: 'inset(0 0 0 100%)' }}
          animate={inView ? { opacity: 1, clipPath: 'inset(0 0 0 0%)' } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'relative', aspectRatio: '4/3' }}
        >
          <ParallaxImage src={imageSrc} alt={title} />
          <div style={{
            position: 'absolute',
            top: '10%',
            left: '-1px',
            width: '3px',
            height: '80%',
            background: '#38BDF8',
            zIndex: 2
          }} />
        </motion.div>
      </div>
    </div>
  );
};

/* ─── LAYOUT D — diagonal image overlay ─── */
const LayoutD = ({ title, icon: Icon, imageSrc, index, children }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref} style={{ marginBottom: '7rem' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '4rem',
        alignItems: 'center'
      }}
        className="spec-text-grid"
      >
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
            <Icon size={22} color="#38BDF8" strokeWidth={1.8} />
            <span style={{ fontSize: '0.78rem', fontWeight: '600', letterSpacing: '2px', color: '#38BDF8', textTransform: 'uppercase' }}>
              Specification
            </span>
          </div>
          <h2 style={{
            margin: '0.5rem 0 0 0',
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            fontWeight: '700',
            color: '#111111',
            letterSpacing: '-0.5px',
            lineHeight: 1.2
          }}>
            {title}
          </h2>
          <Divider />
          {children}
        </motion.div>

        {/* Rotated image panel */}
        <motion.div
          initial={{ opacity: 0, rotate: 4, scale: 0.92 }}
          animate={inView ? { opacity: 1, rotate: -2, scale: 1 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          whileHover={{ rotate: 0, scale: 1.02 }}
          style={{
            position: 'relative',
            height: '380px',
            overflow: 'hidden',
            cursor: 'default'
          }}
        >
          <ParallaxImage src={imageSrc} alt={title} />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg,transparent,#38BDF8)'
          }} />
        </motion.div>
      </div>
    </div>
  );
};

/* ─── Hero scroll progress bar ─── */
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: '#38BDF8',
        transformOrigin: 'left',
        scaleX: scrollYProgress,
        zIndex: 9999
      }}
    />
  );
};

/* ─── Main component ─── */
const specs = [
  {
    title: 'Structure & Framework',
    icon: Building,
    imageSrc: '/images/gallery/1.jpg',
    items: [
      <><strong>RCC Framed Structure:</strong> Designed to withstand wind and seismic loads, conforming fully to IS standards for Seismic Zone II.</>,
      <><strong>Super Structure:</strong> Solid 8-inch external cement block walls and 4-inch internal walls bonded with high-grade mortar.</>,
      <><strong>Plastering:</strong> Double-coat plastering with sponge finish internally and externally for enhanced weatherproofing.</>
    ]
  },
  {
    title: 'Flooring & Surfaces',
    icon: Grid,
    imageSrc: '/images/gallery/2.jpg',
    items: [
      'Premium 600mm × 1200mm double-charged vitrified tiles with matching 4-inch skirting in bedrooms and halls.',
      'Washrooms finished with anti-skid ceramic floor tiling and designer glazed PGVT dadoing up to 7.5ft.',
      'Balconies laid with weather-resistant wood-finish anti-skid vitrified tiles.',
      'Utility areas clad with glazed tiles up to 3ft and anti-skid porcelain bases.'
    ]
  },
  {
    title: 'Doors & Premium Joinery',
    icon: DoorOpen,
    imageSrc: '/images/gallery/3.jpg',
    items: [
      <><strong>Main Door:</strong> Engineered wood frame with double-sided veneered shutter, polished in melamine (3'-9" × 8'-6"). Europa/Godrej keyless smart locks.</>,
      <><strong>Bedrooms:</strong> Laminated engineered frame and shutter with premium handles (3'-3" × 8'-0").</>,
      <><strong>Windows:</strong> 3-track sliding UPVC framing with integrated mosquito mesh and thick float glass panels.</>
    ]
  },
  {
    title: 'Plumbing & Sanitary',
    icon: Droplet,
    imageSrc: '/images/gallery/4.jpg',
    items: [
      'Rimless, wall-hung WC suites with Cefiontect glaze and integrated tornado flush systems.',
      'CP fittings include single-lever diverters, basin mixers, and overhead showers of reputed international makes.',
      'Water meters installed on main inlets to track individual usage parameters.'
    ]
  },
  {
    title: 'Electrical & Automation',
    icon: Bolt,
    imageSrc: '/images/gallery/5.jpg',
    items: [
      'Fire-Retardant Low Smoke (FRLS) concealed copper wiring of standard make.',
      'Modular switchboards with safety sockets, RJ45 ports, and provisions for smart-home controller nodes.',
      'Provision for split AC copper piping and drainage conduits in all bedrooms and living spaces.'
    ]
  },
  {
    title: 'Elevators & Lifts',
    icon: Building,
    imageSrc: '/images/gallery/7.jpg',
    items: [
      'High-speed automatic passenger lifts with smart V3F energy recovery drives (Kone or equivalent).',
      'Automatic rescue devices (ARD) in all units to ensure safety during power outages.',
      'Total of 9 passenger lifts and 4 heavy-duty service lifts across the tower block.'
    ]
  },
  {
    title: 'Security & Access Control',
    icon: ShieldAlert,
    imageSrc: '/images/gallery/8.jpg',
    items: [
      '24/7 sophisticated surveillance network with CC cameras linked to the central security pavilion.',
      'Intercom lines and panic buttons installed in all apartments, directly connected to guard rooms.',
      'Motorized boom barriers with RFID card reader nodes at entrance and exit checkpoints.'
    ]
  },
  {
    title: 'Pipelined Gas & Utilities',
    icon: Utensils,
    imageSrc: '/images/gallery/9.jpg',
    items: [
      'Centralized LPG/Natural Gas bank supplying all kitchens through smart meters.',
      'Integrated Building Management System (BMS) with pre-paid smart meters for electricity, water, and gas.',
      'Centralized water softening plant and Sewage treatment plant (STP) for landscaping reuse.'
    ]
  }
];

/* cycle through 4 different layouts */
const layouts = [LayoutA, LayoutB, LayoutC, LayoutD];

const Specifications = () => {
  return (
    <>
      <ScrollProgress />
      <style>{`
        @media (max-width: 768px) {
          .spec-grid { grid-template-columns: 1fr !important; }
          .spec-text-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          paddingTop: '120px',
          minHeight: '100vh',
          background: '#ffffff',
          color: '#111111',
          paddingLeft: 'max(5%, calc(50vw - 720px))',
          paddingRight: 'max(5%, calc(50vw - 720px))',
          paddingBottom: '8rem',
          overflowX: 'hidden'
        }}
      >
        {/* ── HEADER ── */}
        <div style={{ marginBottom: '6rem', maxWidth: '680px' }}>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              fontSize: '0.78rem',
              fontWeight: '600',
              letterSpacing: '3px',
              color: '#38BDF8',
              textTransform: 'uppercase'
            }}
          >
            Crafted to Perfection
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '700',
              margin: '0.75rem 0 1.5rem 0',
              letterSpacing: '-1.5px',
              color: '#000000',
              lineHeight: 1.1
            }}
          >
            Luxury<br />Specifications
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: '80px',
              height: '2px',
              background: 'linear-gradient(90deg,#38BDF8,transparent)',
              transformOrigin: 'left',
              marginBottom: '1.5rem'
            }}
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            style={{
              color: '#6b7280',
              fontSize: '1.05rem',
              lineHeight: '1.75',
              margin: 0
            }}
          >
            Thoughtfully selected finishes and modern engineering specifications
            come together to create a refined, premium lifestyle.
          </motion.p>
        </div>

        {/* ── SPEC SECTIONS ── */}
        {specs.map((spec, i) => {
          const Layout = layouts[i % layouts.length];
          return (
            <Layout
              key={spec.title}
              title={spec.title}
              icon={spec.icon}
              imageSrc={spec.imageSrc}
              index={i + 1}
            >
              {spec.items.map((item, j) => (
                <SpecItem key={j}>{item}</SpecItem>
              ))}
            </Layout>
          );
        })}
      </motion.div>
    </>
  );
};

export default Specifications;
