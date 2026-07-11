import { useEffect } from 'react';
import { motion } from 'framer-motion';

const commercialPhotographyImages = [
  '/images/campfire.webp',
  '/images/_DSC4685-2.webp',
  '/images/_DSC4390.webp',
  '/images/_DSC2842.webp',
  '/images/_DSC1636.webp',
  '/images/_DSC6969.webp',
  '/images/_DSC8589.webp',
  '/images/fish.webp',
  '/images/_DSC3525.webp',
  '/images/_DSC9182.webp',
  '/images/_DSC1954-2.webp',
  '/images/_DSC7392.webp',
  '/images/_DSC7142.webp',
  '/images/_DSC6942.webp',
  '/images/_DSC6840.webp',
  '/images/_DSC4988.webp',
  '/images/_DSC4899.webp',
  '/images/_DSC3991.webp',
  '/images/_DSC3168-2.webp',
  '/images/_DSC2016.webp',
];

const CommercialPhotography = ({ images = commercialPhotographyImages, masonryClassName = 'mosaic-masonry' }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-header-theme="light"
      style={{
        padding: 0,
        background: '#FFFFFF',
        color: '#111111',
        minHeight: '100vh',
      }}
    >
      <div className="full-bleed">
        <div className={masonryClassName}>
          {images.map((src) => (
            <div className="mosaic-tile" key={src}>
              <img src={src} alt="" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CommercialPhotography;
