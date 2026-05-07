import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowUpRight } from '@phosphor-icons/react';
import { blogPosts } from '../blog/posts';

const BLACK = '#FFFFFF';
const GRAY1 = 'rgba(17, 17, 17, 0.56)';
const GRAY2 = '#C9C9C9';
const WHITE = '#111111';

const Blog = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const route = useMemo(() => {
    const pathname = location.pathname || '/blog';
    const isList = pathname === '/blog' || pathname === '/blog/';
    const slug = !isList && pathname.startsWith('/blog/') ? decodeURIComponent(pathname.slice('/blog/'.length)) : null;
    return { isList, slug };
  }, [location.pathname]);

  const post = useMemo(() => {
    if (!route.slug) return null;
    return blogPosts.find((p) => p.slug === route.slug) || null;
  }, [route.slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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
            <h1 className="section-title" style={{ fontSize: 'var(--fs-xl)', marginBottom: 0 }}>BLOG</h1>
            <div className="small-text" style={{ color: GRAY1 }}>INDEX (06.2)</div>
          </header>
          <div style={{ height: 1, background: 'var(--color-border)', marginTop: 'var(--spacing-sm)' }} aria-hidden="true" />
          <div className="small-text" style={{ marginTop: 'var(--spacing-md)', maxWidth: 680, opacity: 0.85 }}>
            Writing, ideas, notes. Short essays and working thoughts.
          </div>
        </div>
      </section>

      <section style={{ padding: 'var(--spacing-xl) var(--spacing-md) var(--spacing-xxl)' }}>
        <div className="container" style={{ maxWidth: 1200 }}>
          {route.isList ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))', gap: 'var(--spacing-lg)' }}>
              {blogPosts.map((p, idx) => (
                <article key={p.slug}>
                  <motion.div
                    onClick={() => navigate(`/blog/${p.slug}`)}
                    whileHover={{ y: -4 }}
                    style={{
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--spacing-md)',
                      height: '100%',
                    }}
                  >
                    <div style={{ 
                      aspectRatio: '16/10', 
                      background: '#F5F5F5', 
                      overflow: 'hidden', 
                      borderRadius: 4,
                      position: 'relative'
                    }}>
                      {p.image && (
                        <img 
                          src={p.image} 
                          alt="" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'multiply', opacity: 0.9 }} 
                        />
                      )}
                      <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(255,255,255,0.8)', padding: '4px 8px', borderRadius: 2 }} className="small-text">
                        {idx < 9 ? `0${idx + 1}` : idx + 1}
                      </div>
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <h2 style={{ 
                        fontFamily: 'var(--font-display)', 
                        color: WHITE, 
                        textTransform: 'uppercase', 
                        letterSpacing: '-0.04em', 
                        lineHeight: 0.95, 
                        fontSize: '24px', 
                        margin: '0 0 12px' 
                      }}>
                        {p.title}
                      </h2>
                      <div className="small-text" style={{ color: GRAY1, marginBottom: 16 }}>
                        {Array.isArray(p.body) && p.body[0] ? `${p.body[0].slice(0, 100)}…` : ''}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: 12 }}>
                      <time className="small-text" dateTime={p.date} style={{ color: GRAY1 }}>{p.date}</time>
                      <div className="small-text" style={{ color: WHITE, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        READ
                        <ArrowUpRight size={14} weight="thin" />
                      </div>
                    </div>
                  </motion.div>
                </article>
              ))}
            </div>
          ) : post ? (
            <article style={{ maxWidth: 860, margin: '0 auto' }}>
              <nav style={{ marginBottom: 'var(--spacing-lg)' }}>
                <button
                  onClick={() => navigate('/blog')}
                  className="small-text"
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: GRAY1, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                  aria-label="Back to blog list"
                >
                  [BACK TO INDEX]
                </button>
              </nav>

              {post.image && (
                <div style={{ 
                  aspectRatio: '21/9', 
                  background: '#F5F5F5', 
                  overflow: 'hidden', 
                  borderRadius: 4, 
                  marginBottom: 'var(--spacing-xl)' 
                }}>
                  <img 
                    src={post.image} 
                    alt="" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'multiply' }} 
                  />
                </div>
              )}

              <h1 style={{ 
                fontFamily: 'var(--font-display)', 
                color: WHITE, 
                fontSize: 'clamp(32px, 8vw, 64px)', 
                lineHeight: 0.9, 
                letterSpacing: '-0.04em', 
                textTransform: 'uppercase', 
                margin: '0 0 var(--spacing-sm)' 
              }}>
                {post.title}
              </h1>
              
              <div className="small-text" style={{ color: GRAY1, marginBottom: 'var(--spacing-xl)', display: 'flex', gap: 'var(--spacing-md)' }}>
                <span>ENTRY / {post.date}</span>
                <span>•</span>
                <span>BY CREATIONBASE</span>
              </div>

              <div style={{ borderTop: `1px solid ${GRAY2}`, paddingTop: 'var(--spacing-xl)' }}>
                {post.body.map((paragraph, idx) => (
                  <p key={idx} style={{ 
                    fontFamily: 'var(--font-mono)', 
                    fontSize: 15, 
                    lineHeight: 1.8, 
                    margin: '0 0 var(--spacing-lg)',
                    color: '#333'
                  }}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          ) : (
            <div style={{ maxWidth: 860 }}>
              <button
                onClick={() => navigate('/blog')}
                className="small-text"
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: GRAY1 }}
              >
                [BACK]
              </button>
              <div style={{ marginTop: 'var(--spacing-md)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--spacing-md)' }}>
                <div style={{ fontFamily: 'var(--font-display)', color: WHITE, textTransform: 'uppercase', letterSpacing: '-0.04em', fontSize: 'clamp(18px, 4vw, 28px)' }}>
                  Not Found
                </div>
                <div className="small-text" style={{ marginTop: 8, color: GRAY1 }}>
                  That entry doesn’t exist yet.
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
};

export default Blog;
