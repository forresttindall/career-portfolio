import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from '@phosphor-icons/react';
import { blastConfetti } from '../utils/confetti';

const BLACK = '#FFFFFF';
const GRAY1 = 'rgba(17, 17, 17, 0.56)';
const WHITE = '#111111';
const STRATEGY_CALL_URL = 'https://calendly.com/forrest-creationbase/30min';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_txe96pq';
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_l2zhyqf';
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'ZpTIIyS2dofg5_9Ux';

    try {
      const resp = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            from_name: name,
            reply_to: email,
            user_email: email,
            subject: 'Creationbase Inquiry',
            message,
          },
        }),
      });

      if (!resp.ok) throw new Error('Email failed');
      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
      blastConfetti();
    } catch {
      setStatus('error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-header-theme="light"
      style={{ background: BLACK, color: WHITE, minHeight: '100vh' }}
      role="main"
    >
      <section style={{ padding: 'var(--spacing-xxl) var(--spacing-md) var(--spacing-xl)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container" style={{ maxWidth: 1200 }}>
          <header className="flex" style={{ justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--spacing-md)' }}>
            <h1 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0, color: WHITE }}>
              CONTACT
            </h1>
            <div className="small-text" style={{ color: WHITE }}>
              INDEX (08)
            </div>
          </header>
          <div style={{ height: 1, background: 'var(--color-border)', marginTop: 'var(--spacing-sm)' }} aria-hidden="true" />
          <div className="small-text" style={{ marginTop: 'var(--spacing-md)', maxWidth: 680, opacity: 0.85, color: WHITE }}>
            FOR BRAND SYSTEMS, UI/UX DESIGN, AND HIGH-PERFORMANCE WEB DEVELOPMENT INQUIRIES.
          </div>
        </div>
      </section>

      <section style={{ padding: 'var(--spacing-xl) var(--spacing-md) var(--spacing-xxl)' }}>
        <div className="container" style={{ maxWidth: 1200 }}>
          <div className="contact-grid">
            <div>
              <article>
                <header>
                  <h2 className="small-text" style={{ color: WHITE, letterSpacing: 2 }}>
                    CONTACT INFO
                  </h2>
                </header>
                <div style={{ marginTop: 'var(--spacing-md)' }}>
                  <div className="small-text" style={{ fontWeight: 'var(--font-mono-weight-bold)' }}>
                    CREATIONBASE •
                  </div>
                  <address className="small-text" style={{ marginTop: 6, fontStyle: 'normal', lineHeight: 1.5 }}>
                    REMOTE STUDIO<br />
                    WORKING WITH STARTUPS + TEAMS<br />
                    BRAND SYSTEMS • UI/UX • WEB
                  </address>
                  <div className="small-text" style={{ marginTop: 'var(--spacing-md)', color: WHITE }}>
                    FORREST@CREATIONBASE.IO<br />
                  </div>
                </div>
              </article>
            </div>

            <div>
              <article>
                <header>
                  <h2 className="small-text" style={{ color: WHITE, letterSpacing: 2, marginBottom: 'var(--spacing-md)' }}>
                    INQUIRY FORM
                  </h2>
                </header>
                <a
                  href={STRATEGY_CALL_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="newsletter-button contact-primary-cta"
                >
                  BOOK STRATEGY CALL
                  <ArrowUpRight size={14} weight="thin" />
                </a>
                <div className="small-text" style={{ color: WHITE, marginBottom: 'var(--spacing-md)', opacity: 0.9 }}>
                  OR SEND A MESSAGE
                </div>
                <form onSubmit={submit} className="contact-form">
                <input
                  className="newsletter-input"
                  type="text"
                  value={name}
                  onChange={(ev) => setName(ev.target.value)}
                  placeholder="NAME"
                  required
                />
                <input
                  className="newsletter-input"
                  type="email"
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                  placeholder="EMAIL"
                  required
                />
                <textarea
                  className="newsletter-input contact-textarea"
                  value={message}
                  onChange={(ev) => setMessage(ev.target.value)}
                  placeholder="MESSAGE"
                  required
                />
                <div className="contact-actions">
                  <button
                    type="submit"
                    className="newsletter-button"
                    disabled={status === 'loading'}
                    style={{
                      cursor: status === 'loading' ? 'default' : 'pointer',
                      opacity: status === 'loading' ? 0.6 : 1,
                    }}
                  >
                    {status === 'loading' ? '...' : 'SEND'}
                  </button>

                  {status === 'success' && (
                    <div className="small-text" style={{ opacity: 0.85, color: WHITE }}>
                      SENT.
                    </div>
                  )}
                  {status === 'error' && (
                    <div className="small-text" style={{ opacity: 0.85, color: WHITE }}>
                      ERROR. TRY AGAIN.
                    </div>
                  )}
                </div>
              </form>
              </article>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Contact;
