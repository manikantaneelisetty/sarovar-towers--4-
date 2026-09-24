import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  MapPin, Phone, Mail, Globe, MessageSquare,
  CheckCircle2, ArrowRight, Clock, ChevronDown, User, AtSign, Smartphone
} from 'lucide-react';

/* ── constants ── */
const EASE = [0.16, 1, 0.3, 1];
const SKY  = '#38BDF8';

/* ── floating label input ── */
const FloatField = ({ label, icon: Icon, type = 'text', value, onChange, required, placeholder, children }) => {
  const [focused, setFocused] = useState(false);
  const filled = value && value.length > 0;
  const active = focused || filled;

  return (
    <div style={{ position: 'relative' }}>
      {children ? (
        /* custom slot (phone row) */
        children
      ) : (
        <div style={{
          position: 'relative',
          background: '#fff',
          border: `1.5px solid ${focused ? SKY : '#e4e7ec'}`,
          borderRadius: '12px',
          transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
          boxShadow: focused ? `0 0 0 4px rgba(56,189,248,0.10)` : 'none',
        }}>
          {/* floating label */}
          <label style={{
            position: 'absolute',
            left: Icon ? '42px' : '16px',
            top: active ? '8px' : '50%',
            transform: active ? 'translateY(0)' : 'translateY(-50%)',
            fontSize: active ? '0.68rem' : '0.9rem',
            fontWeight: active ? 600 : 400,
            color: active ? SKY : '#9ca3af',
            pointerEvents: 'none',
            transition: 'all 0.22s ease',
            letterSpacing: active ? '0.5px' : '0',
            textTransform: active ? 'uppercase' : 'none',
            zIndex: 1
          }}>
            {label}{required && <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>}
          </label>

          {/* icon */}
          {Icon && (
            <div style={{
              position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
              color: focused ? SKY : '#cbd5e1', transition: 'color 0.25s ease', zIndex: 1
            }}>
              <Icon size={16} strokeWidth={1.8} />
            </div>
          )}

          {type === 'textarea' ? (
            <textarea
              rows={4}
              placeholder={active ? placeholder : ''}
              value={value}
              onChange={onChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              style={{
                width: '100%', border: 'none', outline: 'none', background: 'transparent',
                padding: active ? '26px 16px 10px 16px' : '18px 16px',
                fontSize: '0.92rem', color: '#111', resize: 'none',
                fontFamily: 'inherit', boxSizing: 'border-box', borderRadius: '12px',
                lineHeight: 1.6
              }}
            />
          ) : (
            <input
              type={type}
              placeholder={active ? placeholder : ''}
              value={value}
              onChange={onChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              required={required}
              style={{
                width: '100%', border: 'none', outline: 'none', background: 'transparent',
                padding: active ? '26px 16px 10px' : '18px 16px',
                paddingLeft: Icon ? (active ? '42px' : '42px') : '16px',
                fontSize: '0.92rem', color: '#111',
                fontFamily: 'inherit', boxSizing: 'border-box', borderRadius: '12px'
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

/* ── contact info row ── */
const InfoRow = ({ icon: Icon, label, value, href, delay }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.a
      ref={ref}
      href={href || '#'}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.55, ease: EASE, delay }}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: '1rem',
        padding: '1rem 0', textDecoration: 'none', color: 'inherit',
        borderBottom: '1px solid #f1f5f9', cursor: href ? 'pointer' : 'default'
      }}
      whileHover={href ? { x: 4 } : {}}
    >
      <div style={{
        width: '40px', height: '40px', borderRadius: '10px',
        background: 'rgba(56,189,248,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0
      }}>
        <Icon size={17} color={SKY} strokeWidth={1.8} />
      </div>
      <div>
        <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '1px', color: '#111', textTransform: 'uppercase' }}>
          {label}
        </p>
        <p style={{ margin: '3px 0 0 0', fontSize: '0.9rem', color: '#000', lineHeight: 1.55 }}>
          {value}
        </p>
      </div>
    </motion.a>
  );
};

/* ── success animation ── */
const SuccessState = ({ onReset }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.88 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.92 }}
    transition={{ duration: 0.5, ease: EASE }}
    style={{ textAlign: 'center', padding: '3.5rem 1rem' }}
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
      style={{
        width: '72px', height: '72px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 1.5rem auto'
      }}
    >
      <CheckCircle2 size={34} color="#059669" strokeWidth={2} />
    </motion.div>

    <motion.h3
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.45 }}
      style={{ margin: '0 0 0.5rem 0', fontSize: '1.4rem', fontWeight: 700, color: '#111' }}
    >
      Enquiry Received!
    </motion.h3>
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.45 }}
      style={{ color: '#000', fontSize: '0.9rem', maxWidth: '320px', margin: '0 auto 2rem auto', lineHeight: 1.65 }}
    >
      Thank you for reaching out. Our relationship manager will call you within 24 hours.
    </motion.p>
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      onClick={onReset}
      style={{
        background: 'none', border: `1.5px solid #e4e7ec`,
        borderRadius: '8px', padding: '0.6rem 1.4rem',
        fontSize: '0.82rem', fontWeight: 600, color: '#555',
        cursor: 'pointer', letterSpacing: '0.3px'
      }}
    >
      Send another enquiry
    </motion.button>
  </motion.div>
);

/* ── intent chips ── */
const INTENTS = ['Site Visit', 'Pricing Details', 'Brochure', 'Investment Query', 'Other'];

/* ── main component ── */
const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', mobile: '', message: '' });
  const [countryCode, setCountryCode] = useState('+91');
  const [intent, setIntent]     = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg]   = useState('');
  const [mobileFocused, setMobileFocused] = useState(false);
  const mobileFilled = formData.mobile.length > 0;
  const mobileActive = mobileFocused || mobileFilled;

  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.mobile) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }
    if (formData.mobile.length < 10) {
      setErrorMsg('Enter a valid 10-digit mobile number.');
      return;
    }
    setErrorMsg('');
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({ name: '', email: '', mobile: '', message: '' });
    setIntent('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        minHeight: '100vh',
        background: '#f8f9fb',
        paddingTop: '100px',
        paddingBottom: '6rem',
        overflowX: 'hidden'
      }}
    >
      {/* ── PAGE HEADER ── */}
      <div
        ref={headerRef}
        style={{
          paddingLeft: 'max(5%, calc(50vw - 680px))',
          paddingRight: 'max(5%, calc(50vw - 680px))',
          marginBottom: '3.5rem'
        }}
      >
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45 }}
          style={{
            fontSize: '0.72rem', fontWeight: 700, letterSpacing: '3px',
            color: SKY, textTransform: 'uppercase', display: 'block', marginBottom: '0.6rem'
          }}
        >
          Get In Touch
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE, delay: 0.08 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.4rem, 5vw, 4rem)',
            fontWeight: 800, color: '#0a0a0a',
            margin: '0 0 1rem 0', letterSpacing: '-2px', lineHeight: 1.05
          }}
        >
          Let's Start a<br />
          <span style={{ color: SKY }}>Conversation.</span>
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={headerInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          style={{
            width: '60px', height: '2px', transformOrigin: 'left',
            background: `linear-gradient(90deg, ${SKY}, transparent)`
          }}
        />
      </div>

      {/* ── MAIN GRID ── */}
      <div
        style={{
          paddingLeft: 'max(5%, calc(50vw - 680px))',
          paddingRight: 'max(5%, calc(50vw - 680px))',
          display: 'grid',
          gridTemplateColumns: '1fr 1.45fr',
          gap: '2.5rem',
          alignItems: 'start'
        }}
        className="contact-outer-grid"
      >

        {/* ════════════════════════════
            LEFT — contact info sidebar
        ════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* quick-action buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <motion.a
              href="https://wa.me/919160666534"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{
                flex: 1, padding: '0.85rem 1rem',
                background: '#25D366', borderRadius: '12px',
                color: '#fff', fontWeight: 700, fontSize: '0.82rem',
                textDecoration: 'none', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '7px', letterSpacing: '0.3px',
                boxShadow: '0 4px 16px rgba(37,211,102,0.25)'
              }}
            >
              <MessageSquare size={15} /> WhatsApp
            </motion.a>
            <motion.a
              href="tel:+919160666534"
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{
                flex: 1, padding: '0.85rem 1rem',
                background: '#fff', borderRadius: '12px',
                color: '#111', fontWeight: 700, fontSize: '0.82rem',
                textDecoration: 'none', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '7px', letterSpacing: '0.3px',
                border: '1.5px solid #e4e7ec',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              <Phone size={15} color={SKY} /> Call Now
            </motion.a>
          </div>

          {/* info rows */}
          <div style={{
            background: '#fff', borderRadius: '16px',
            padding: '1.5rem 1.5rem 0.5rem 1.5rem',
            border: '1.5px solid #f1f5f9'
          }}>
            <p style={{
              margin: '0 0 0.75rem 0', fontSize: '0.72rem', fontWeight: 700,
              letterSpacing: '1.5px', color: '#111', textTransform: 'uppercase'
            }}>
              Contact Details
            </p>
            <InfoRow icon={Phone} label="Sales Helpline" value="+91 91606 66534" href="tel:+919160666534" delay={0.05} />
            <InfoRow icon={Mail}  label="Email Us"      value="info@sarovar.com" href="mailto:info@sarovar.com" delay={0.1} />
            <InfoRow icon={Globe} label="Website"       value="www.sarovar.com"  href="https://sarovars-towers1.netlify.app/" delay={0.15} />
            <InfoRow icon={Clock} label="Office Hours"  value="Mon – Sat, 9 AM – 7 PM" delay={0.2} />
          </div>

          {/* addresses */}
          <div style={{
            background: '#fff', borderRadius: '16px',
            padding: '1.5rem',
            border: '1.5px solid #f1f5f9'
          }}>
            <p style={{
              margin: '0 0 1rem 0', fontSize: '0.72rem', fontWeight: 700,
              letterSpacing: '1.5px', color: '#111', textTransform: 'uppercase'
            }}>
              Addresses
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                {
                  title: 'Site Experience Center',
                  address: 'Nallagandla, Gachibowli Extension,\nHyderabad, Telangana 500019'
                },
                {
                  title: 'Corporate Headquarters',
                  address: '1st Floor, K.V. Towers, Jubilee Enclave,\nOpp. HITEX, Gachibowli,\nHyderabad – 500081'
                }
              ].map((loc, i) => (
                <motion.div
                  key={loc.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.1, ease: EASE }}
                  style={{
                    padding: '1rem', borderRadius: '10px',
                    background: '#f8f9fb',
                    display: 'flex', gap: '0.75rem', alignItems: 'flex-start'
                  }}
                >
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    background: 'rgba(56,189,248,0.10)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: '1px'
                  }}>
                    <MapPin size={14} color={SKY} />
                  </div>
                  <div>
                    <p style={{ margin: '0 0 3px 0', fontSize: '0.8rem', fontWeight: 700, color: '#111' }}>
                      {loc.title}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#000', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                      {loc.address}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ════════════════════════════
            RIGHT — FORM CARD
        ════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
          style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '2.5rem',
            border: '1.5px solid #f0f2f5',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* decorative corner accent */}
          <div style={{
            position: 'absolute', top: 0, right: 0,
            width: '160px', height: '160px',
            background: `radial-gradient(circle at top right, rgba(56,189,248,0.08), transparent 70%)`,
            pointerEvents: 'none'
          }} />

          <AnimatePresence mode="wait">
            {submitted ? (
              <SuccessState key="success" onReset={handleReset} />
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* form header */}
                <div style={{ marginBottom: '2rem' }}>
                  <h2 style={{
                    margin: '0 0 0.4rem 0',
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.5rem', fontWeight: 800,
                    color: '#0a0a0a', letterSpacing: '-0.5px'
                  }}>
                    Consultation Enquiry
                  </h2>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#000', lineHeight: 1.6 }}>
                    Fill in your details — our team will reach out within 24 hrs.
                  </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                  {/* error */}
                  <AnimatePresence>
                    {errorMsg && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        style={{
                          background: '#fef2f2', border: '1px solid #fecaca',
                          borderRadius: '8px', padding: '0.7rem 1rem',
                          fontSize: '0.82rem', color: '#dc2626', fontWeight: 500
                        }}
                      >
                        {errorMsg}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* two-col row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-two-col">
                    {/* Name */}
                    <FloatField
                      label="Full Name" icon={User}
                      value={formData.name} required
                      placeholder="Ravi Kumar"
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                    {/* Email */}
                    <FloatField
                      label="Email" icon={AtSign} type="email"
                      value={formData.email} required
                      placeholder="ravi@email.com"
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  {/* Phone — custom two-part field */}
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      background: '#fff',
                      border: `1.5px solid ${mobileFocused ? SKY : '#e4e7ec'}`,
                      borderRadius: '12px',
                      transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
                      boxShadow: mobileFocused ? `0 0 0 4px rgba(56,189,248,0.10)` : 'none',
                      display: 'flex', alignItems: 'center', overflow: 'hidden'
                    }}>
                      {/* icon */}
                      <div style={{
                        padding: '0 0 0 14px', color: mobileFocused ? SKY : '#cbd5e1',
                        transition: 'color 0.25s', display: 'flex', alignItems: 'center'
                      }}>
                        <Smartphone size={16} strokeWidth={1.8} />
                      </div>
                      {/* dial-code */}
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <select
                          value={countryCode}
                          onChange={e => setCountryCode(e.target.value)}
                          onFocus={() => setMobileFocused(true)}
                          onBlur={() => setMobileFocused(false)}
                          style={{
                            border: 'none', outline: 'none', background: 'transparent',
                            padding: mobileActive ? '26px 8px 10px 8px' : '18px 8px',
                            fontSize: '0.82rem', color: '#555',
                            fontFamily: 'inherit', cursor: 'pointer', appearance: 'none',
                            paddingRight: '20px', minWidth: '72px'
                          }}
                        >
                          <option value="+91">+91 🇮🇳</option>
                          <option value="+1">+1 🇺🇸</option>
                          <option value="+44">+44 🇬🇧</option>
                          <option value="+971">+971 🇦🇪</option>
                        </select>
                        <ChevronDown size={11} color="#999" style={{ position: 'absolute', right: '2px', pointerEvents: 'none' }} />
                      </div>
                      {/* divider */}
                      <div style={{ width: '1px', height: '24px', background: '#e4e7ec', flexShrink: 0 }} />
                      {/* number input */}
                      <div style={{ flex: 1, position: 'relative' }}>
                        <label style={{
                          position: 'absolute', left: '12px',
                          top: mobileActive ? '8px' : '50%',
                          transform: mobileActive ? 'translateY(0)' : 'translateY(-50%)',
                          fontSize: mobileActive ? '0.68rem' : '0.9rem',
                          fontWeight: mobileActive ? 600 : 400,
                          color: mobileActive ? SKY : '#9ca3af',
                          pointerEvents: 'none',
                          transition: 'all 0.22s ease',
                          letterSpacing: mobileActive ? '0.5px' : '0',
                          textTransform: mobileActive ? 'uppercase' : 'none'
                        }}>
                          Mobile Number <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                          type="tel"
                          placeholder={mobileActive ? '98765 43210' : ''}
                          value={formData.mobile}
                          onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                          onFocus={() => setMobileFocused(true)}
                          onBlur={() => setMobileFocused(false)}
                          required
                          style={{
                            width: '100%', border: 'none', outline: 'none', background: 'transparent',
                            padding: mobileActive ? '26px 16px 10px 12px' : '18px 16px 18px 12px',
                            fontSize: '0.92rem', color: '#111', boxSizing: 'border-box'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Intent chips */}
                  <div>
                    <p style={{ margin: '0 0 0.6rem 0', fontSize: '0.72rem', fontWeight: 700, color: '#aaa', letterSpacing: '1px', textTransform: 'uppercase' }}>
                      I'm interested in
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {INTENTS.map(chip => (
                        <button
                          key={chip} type="button"
                          onClick={() => setIntent(intent === chip ? '' : chip)}
                          style={{
                            padding: '0.4rem 0.9rem',
                            borderRadius: '20px',
                            border: `1.5px solid ${intent === chip ? SKY : '#e4e7ec'}`,
                            background: intent === chip ? 'rgba(56,189,248,0.08)' : '#fff',
                            color: intent === chip ? SKY : '#000',
                            fontSize: '0.78rem', fontWeight: 600,
                            cursor: 'pointer', transition: 'all 0.2s ease',
                            letterSpacing: '0.2px'
                          }}
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <FloatField
                    label="Your Message" type="textarea"
                    icon={null}
                    value={formData.message}
                    placeholder="I would like to schedule a site visit..."
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                  />

                  {/* divider */}
                  <div style={{ height: '1px', background: '#f0f2f5' }} />

                  {/* submit */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.01, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: '100%', padding: '1rem',
                      background: `linear-gradient(135deg, #0ea5e9, #38BDF8)`,
                      border: 'none', borderRadius: '12px',
                      color: '#fff', fontSize: '0.95rem', fontWeight: 700,
                      cursor: 'pointer', letterSpacing: '0.3px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      boxShadow: '0 6px 24px rgba(56,189,248,0.30)',
                      transition: 'box-shadow 0.3s ease'
                    }}
                  >
                    Send Enquiry <ArrowRight size={17} />
                  </motion.button>

                  <p style={{ margin: 0, textAlign: 'center', fontSize: '0.72rem', color: '#c4c9d4' }}>
                    Your data is protected. We never share your information.
                  </p>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ── responsive styles ── */}
      <style>{`
        @media (max-width: 860px) {
          .contact-outer-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 540px) {
          .form-two-col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </motion.div>
  );
};

export default Contact;
