import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building, Grid, DoorOpen, Droplet, Bolt, 
  ShieldAlert, Utensils, Award, FileText 
} from 'lucide-react';

const SpecCard = ({ title, icon: Icon, delay, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, scale: 1.015 }}
      className="glass-panel"
      style={{
        padding: '2rem',
        background: 'rgba(12, 12, 16, 0.45)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(56, 189, 248, 0.15)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        height: '100%',
        cursor: 'default',
        transition: 'border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.45)';
        e.currentTarget.style.boxShadow = '0 12px 30px rgba(56, 189, 248, 0.15)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.15)';
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.5)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '1rem' }}>
        <div style={{
          background: 'rgba(56, 189, 248, 0.12)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '12px',
          width: '42px',
          height: '42px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(56, 189, 248, 0.1)'
        }}>
          <Icon size={20} color="var(--primary)" />
        </div>
        <h4 style={{ 
          margin: 0, 
          fontFamily: 'var(--font-display)', 
          fontSize: '1rem', 
          fontWeight: '700', 
          color: 'white',
          letterSpacing: '-0.2px',
          textTransform: 'uppercase'
        }}>
          {title}
        </h4>
      </div>

      <div style={{
        color: 'var(--text-secondary)',
        fontSize: '0.85rem',
        lineHeight: '1.6',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        flexGrow: 1
      }}>
        {children}
      </div>
    </motion.div>
  );
};

const Specifications = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        paddingTop: '100px',
        minHeight: '100vh',
        background: '#070709',
        color: 'white',
        paddingLeft: '4%',
        paddingRight: '4%',
        paddingBottom: '4rem'
      }}
    >
      <div style={{ marginBottom: '3.5rem', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: '800', margin: '0 0 0.5rem 0', letterSpacing: '-0.5px' }}>
          Luxury Specifications
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto' }}>
          Thoughtfully selected finishes and modern engineering specifications come together to create a refined, premium lifestyle.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '2rem',
        alignItems: 'stretch'
      }}
      className="specs-grid"
      >
        <SpecCard title="Structure & Framework" icon={Building} delay={0.05}>
          <p><strong>RCC Framed Structure:</strong> Designed to withstand wind and seismic loads, conforming fully to IS standards for Seismic Zone II.</p>
          <p><strong>Super Structure:</strong> Solid 8-inch external cement block walls and 4-inch internal walls bonded with high-grade mortar.</p>
          <p><strong>Plastering:</strong> Double-coat plastering with sponge finish internally and externally for enhanced weatherproofing.</p>
        </SpecCard>

        <SpecCard title="Flooring & Surfaces" icon={Grid} delay={0.1}>
          <p>• Premium 600mm × 1200mm double-charged vitrified tiles with matching 4-inch skirting in bedrooms and halls.</p>
          <p>• Washrooms finished with anti-skid ceramic floor tiling and designer glazed PGVT dadoing up to 7.5ft.</p>
          <p>• Balconies laid with weather-resistant wood-finish anti-skid vitrified tiles.</p>
          <p>• Utility areas clad with glazed tiles up to 3ft and anti-skid porcelain bases.</p>
        </SpecCard>

        <SpecCard title="Doors & Premium Joinery" icon={DoorOpen} delay={0.15}>
          <p>• <strong>Main Door:</strong> Engineered wood frame with double-sided veneered shutter, polished in melamine (3’-9” × 8’-6”). Europa/Godrej keyless smart locks.</p>
          <p>• <strong>Bedrooms:</strong> Laminated engineered frame and shutter with premium handles (3’-3” × 8’-0”).</p>
          <p>• <strong>Windows:</strong> 3-track sliding UPVC framing with integrated mosquito mesh and thick float glass panels.</p>
        </SpecCard>

        <SpecCard title="Plumbing & Sanitary" icon={Droplet} delay={0.2}>
          <p>• Rimless, wall-hung WC suites with Cefiontect glaze and integrated tornado flush systems.</p>
          <p>• CP fittings include single-lever diverters, basin mixers, and overhead showers of reputed international makes.</p>
          <p>• Water meters installed on main inlets to track individual usage parameters.</p>
        </SpecCard>

        <SpecCard title="Electrical & Automation" icon={Bolt} delay={0.25}>
          <p>• Fire-Retardant Low Smoke (FRLS) concealed copper wiring of standard make.</p>
          <p>• Modular switchboards with safety sockets, RJ45 ports, and provisions for smart-home controller nodes.</p>
          <p>• Provision for split AC copper piping and drainage conduits in all bedrooms and living spaces.</p>
        </SpecCard>

        <SpecCard title="Elevators & Lifts" icon={Building} delay={0.3}>
          <p>• High-speed automatic passenger lifts with smart V3F energy recovery drives (Kone or equivalent).</p>
          <p>• Automatic rescue devices (ARD) in all units to ensure safety during power outages.</p>
          <p>• Total of 9 passenger lifts and 4 heavy-duty service lifts across the tower block.</p>
        </SpecCard>

        <SpecCard title="Power Backup & Solar" icon={Bolt} delay={0.35}>
          <p>• 100% DG generator backup for all common lighting, water pumps, lifts, and residential utility outlets.</p>
          <p>• Acoustic enclosures on generators to minimize sound pollution in common grounds.</p>
          <p>• Rooftop solar panel grid feeding back into main utility circuits for green energy savings.</p>
        </SpecCard>

        <SpecCard title="Water & Treatment" icon={Droplet} delay={0.4}>
          <p>• Centralized water softening plant to deliver treated water to individual apartments.</p>
          <p>• Sewage treatment plant (STP) of adequate capacity for reuse of greywater in landscaping and flushing lines.</p>
          <p>• Double supply plumbing pipeline system separating potable drinking water from flushing lines.</p>
        </SpecCard>

        <SpecCard title="Security & Access Control" icon={ShieldAlert} delay={0.45}>
          <p>• 24/7 sophisticated surveillance network with CC cameras linked to the central security pavilion.</p>
          <p>• Intercom lines and panic buttons installed in all apartments, directly connected to guard rooms.</p>
          <p>• Motorized boom barriers with RFID card reader nodes at entrance and exit checkpoints.</p>
        </SpecCard>

        <SpecCard title="Pipelined Gas & Billing" icon={Utensils} delay={0.5}>
          <p>• Centralized LPG/Natural Gas bank supplying all kitchens through smart meters.</p>
          <p>• Integrated Building Management System (BMS) with pre-paid smart meters for electricity, water, and gas.</p>
          <p>• Unified billing statements and support for automated online wallet top-ups.</p>
        </SpecCard>
      </div>
    </motion.div>
  );
};

export default Specifications;
