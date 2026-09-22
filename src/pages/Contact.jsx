import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Globe, MessageSquare, CheckCircle2 } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', mobile: '', message: '' });
  const [countryCode, setCountryCode] = useState('+91');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.mobile) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (formData.mobile.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    setErrorMsg('');
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', mobile: '', message: '' });
    }, 2500);
  };
  console.log(`form data is ${formData}`)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        paddingTop: '100px',
        minHeight: '100vh',
        background: '#09090b',
        color: 'white',
        paddingLeft: '4%',
        paddingRight: '4%',
        paddingBottom: '4rem'
      }}
    >
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: '800', margin: '0 0 0.5rem 0' }}>
          Get In Touch
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px', margin: 0 }}>
          Reach out to our project consultants today to request pricing details, schedule site visits, or download the brochure.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '3rem',
        alignItems: 'start'
      }}
      className="contact-view-grid"
      >
        {/* Left Column: Office Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Site Location */}
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(22, 22, 28, 0.4)' }}>
            <h3 style={{
              margin: '0 0 0.75rem 0',
              fontFamily: 'var(--font-display)',
              fontSize: '1.15rem',
              fontWeight: '700',
              color: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <MapPin size={16} color="var(--primary)" />
              Site Experience Center
            </h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Nallagandla, Gachibowli Extension,<br />
              Hyderabad, Telangana, India
            </p>
          </div>

          {/* Corporate Office */}
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(22, 22, 28, 0.4)' }}>
            <h3 style={{
              margin: '0 0 0.75rem 0',
              fontFamily: 'var(--font-display)',
              fontSize: '1.15rem',
              fontWeight: '700',
              color: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <MapPin size={16} color="var(--primary)" />
              Corporate Headquarters
            </h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              1st Floor, K.V. Towers, Jubilee Enclave,<br />
              Opp. HITEX Exhibition Grounds, Gachibowli,<br />
              Hyderabad - 500081, Telangana, India
            </p>
          </div>

          {/* Direct Connections */}
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(22, 22, 28, 0.4)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Phone size={16} color="var(--primary)" />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>+91 9160666534</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Mail size={16} color="var(--primary)" />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>info@sarovar.com</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Globe size={16} color="var(--primary)" />
              <a href="https://sarovars-towers1.netlify.app/" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9rem', color: 'var(--primary-light)', textDecoration: 'none' }}>
                www.sarovar.com
              </a>
            </div>
          </div>

          {/* Quick Communication widgets */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <a 
              href="https://wa.me/919160666534" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                flex: 1,
                padding: '0.8rem',
                borderRadius: '5px',
                background: '#25D366',
                color: 'black',
                fontWeight: '700',
                fontSize: '0.85rem',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'transform 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'none'}
            >
              <MessageSquare size={16} />
              WhatsApp Us
            </a>

            <a 
              href="tel:+919160666534" 
              style={{
                flex: 1,
                padding: '0.8rem',
                borderRadius: '5px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontWeight: '700',
                fontSize: '0.85rem',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'transform 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'none'}
            >
              <Phone size={16} color="var(--primary)" />
              Call Directly
            </a>
          </div>

        </div>

        {/* Right Column: Form Panel */}
        <div className="glass-panel" style={{ padding: '2.5rem', background: 'rgba(22, 22, 28, 0.6)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: '700', color: 'white', marginBottom: '0.5rem' }}>
            Consultation Enquiry Form
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Fill in the information below and our relationship manager will contact you with booking options and brochures.
          </p>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <div style={{ display: 'inline-flex', marginBottom: '1rem' }}>
                <CheckCircle2 size={56} color="var(--accent-teal)" />
              </div>
              <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: '700' }}>Enquiry Submitted!</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                Thank you for your interest. We will contact you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {errorMsg && (
                <div style={{ color: '#ff4d4d', fontSize: '0.85rem', fontWeight: '600' }}>
                  {errorMsg}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Full Name *</label>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    padding: '0.8rem',
                    color: 'white',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Email ID *</label>
                <input
                  type="email"
                  placeholder="name@domain.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  required
                  style={{
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    padding: '0.8rem',
                    color: 'white',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Mobile Number *</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <select
                    value={countryCode}
                    onChange={e => setCountryCode(e.target.value)}
                    style={{
                      background: 'rgba(0,0,0,0.2)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '5px',
                      padding: '0.8rem',
                      color: 'white',
                      fontSize: '0.9rem',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="+91" style={{ background: '#0f0f12' }}>+91 (IN)</option>
                    <option value="+1" style={{ background: '#0f0f12' }}>+1 (US)</option>
                    <option value="+44" style={{ background: '#0f0f12' }}>+44 (UK)</option>
                    <option value="+971" style={{ background: '#0f0f12' }}>+971 (UAE)</option>
                  </select>
                  <input
                    type="tel"
                    placeholder="98765 43210"
                    value={formData.mobile}
                    onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                    required
                    style={{
                      flexGrow: 1,
                      background: 'rgba(0,0,0,0.2)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '8px',
                      padding: '0.8rem',
                      color: 'white',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Your Message (Optional)</label>
                <textarea
                  rows="4"
                  placeholder="I would like to schedule a site visit..."
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  style={{
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '5px',
                    padding: '0.8rem',
                    color: 'white',
                    fontSize: '0.9rem',
                    outline: 'none',
                    resize: 'none',
                    fontFamily: 'var(--font-body)'
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  padding: '0.85rem',
                  fontSize: '0.95rem',
                  marginTop: '0.5rem'
                }}
              >
                Submit Enquiry
              </button>

            </form>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
