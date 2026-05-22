import { useEffect } from 'react';
import { motion } from 'framer-motion';

const commercialPhotographyImages = [
  '/images/campfire.JPG',
  '/images/_DSC4685-2.jpg',
  '/images/_DSC4390.jpg',
  '/images/_DSC2842.jpg',
  '/images/_DSC1636.jpg',
  '/images/_DSC6969.jpg',
  '/images/_DSC8589.jpg',
  '/images/fish.jpg',
  '/images/_DSC3525.jpg',
  '/images/_DSC9182.jpg',
  '/images/_DSC1954-2.jpg',
  '/images/_DSC7392.jpg',
  '/images/_DSC7142.jpg',
  '/images/_DSC6942.jpg',
  '/images/_DSC6840.jpg',
  '/images/_DSC4988.jpg',
  '/images/_DSC4899.jpg',
  '/images/_DSC3991.jpg',
  '/images/_DSC3168-2.jpg',
  '/images/_DSC2016.jpg',
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
