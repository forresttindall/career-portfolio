import { useMemo, useEffect } from 'react';

const Schema = ({ type = 'Organization', data = {} }) => {
  const schemaData = useMemo(() => {
    const base = {
      "@context": "https://schema.org",
      "@type": type,
      "name": "Creationbase",
      "url": "https://creationbase.io",
      "logo": "https://creationbase.io/logo.png",
      "sameAs": [
        "https://instagram.com/creationbase.io",
        "https://www.linkedin.com/company/creationbaseio/"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "email": "hello@creationbase.io"
      }
    };

    if (type === 'Organization' || type === 'LocalBusiness') {
      return {
        ...base,
        "@type": "LocalBusiness",
        "description": "Creationbase is a Boise-based creative studio specializing in visual system design, high-performance web development, and digital brand identity for Idaho startups and teams.",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Boise",
          "addressLocality": "Boise",
          "addressRegion": "ID",
          "postalCode": "83702",
          "addressCountry": "US"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "43.6150",
          "longitude": "-116.2023"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Creative Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Boise Web Design",
                "description": "Custom, responsive website design for Boise businesses and startups."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Full-Stack Web Development",
                "description": "High-performance React and Next.js development based in Idaho."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Brand Identity Systems",
                "description": "Comprehensive visual identity and logo design for Treasure Valley brands."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "UI/UX Design",
                "description": "User-centric interface and experience design for apps and platforms."
              }
            }
          ]
        },
        "areaServed": [
          { "@type": "City", "name": "Boise" },
          { "@type": "City", "name": "Meridian" },
          { "@type": "City", "name": "Eagle" },
          { "@type": "City", "name": "Nampa" },
          { "@type": "City", "name": "Garden City" },
          { "@type": "City", "name": "Kuna" },
          { "@type": "State", "name": "Idaho" }
        ],
        "priceRange": "$$"
      };
    }

    if (type === 'Service') {
      return {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": data.name || "Web Design and Development",
        "provider": {
          "@type": "LocalBusiness",
          "name": "Creationbase",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Boise",
            "addressRegion": "ID"
          }
        },
        "areaServed": [
          { "@type": "City", "name": "Boise" },
          { "@type": "City", "name": "Meridian" },
          { "@type": "City", "name": "Eagle" },
          { "@type": "City", "name": "Nampa" }
        ],
        "description": data.description || "Custom web design, UI/UX, and high-performance development in Boise, ID."
      };
    }

    if (type === 'BlogPosting') {
      return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": data.title,
        "datePublished": data.date,
        "author": {
          "@type": "Organization",
          "name": "Creationbase"
        },
        "image": data.image,
        "description": data.description,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://creationbase.io/blog/${data.slug}`
        }
      };
    }

    return base;
  }, [type, data]);

  useEffect(() => {
    if (type === 'BlogPosting' && data.title) {
      // Update Title
      document.title = `${data.title} | Creationbase`;
      
      // Update Meta Tags
      const metaUpdates = [
        { name: 'description', content: data.description },
        { property: 'og:title', content: data.title },
        { property: 'og:description', content: data.description },
        { property: 'og:image', content: data.image },
        { property: 'og:image:secure_url', content: data.image },
        { property: 'og:url', content: `https://creationbase.io/blog/${data.slug}` },
        { name: 'twitter:title', content: data.title },
        { name: 'twitter:description', content: data.description },
        { name: 'twitter:image', content: data.image }
      ];

      metaUpdates.forEach(update => {
        let el = update.name 
          ? document.querySelector(`meta[name="${update.name}"]`)
          : document.querySelector(`meta[property="${update.property}"]`);
        
        if (el) {
          el.setAttribute('content', update.content);
        } else {
          const newMeta = document.createElement('meta');
          if (update.name) newMeta.setAttribute('name', update.name);
          if (update.property) newMeta.setAttribute('property', update.property);
          newMeta.setAttribute('content', update.content);
          document.head.appendChild(newMeta);
        }
      });
    } else if (type === 'Organization' || type === 'LocalBusiness') {
      // Reset to defaults with Boise localization
      document.title = 'Creationbase - Boise Web Design & Development Studio';
      
      const defaults = [
        { name: 'description', content: 'Creationbase — design and development studio in Boise, ID. Custom web design, branding, and high-performance development for Idaho startups and teams.' },
        { property: 'og:title', content: 'Creationbase - Boise Web Design & Development Studio' },
        { property: 'og:description', content: 'Creationbase — design and development studio in Boise, ID. Custom web design, branding, and high-performance development for Idaho startups and teams.' },
        { property: 'og:image', content: 'https://www.creationbase.io/images/socialshare.jpg?v=2' },
        { property: 'og:image:secure_url', content: 'https://www.creationbase.io/images/socialshare.jpg?v=2' },
        { property: 'og:url', content: 'https://www.creationbase.io/' },
        { name: 'twitter:title', content: 'Creationbase - Boise Web Design & Development Studio' },
        { name: 'twitter:description', content: 'Creationbase — design and development studio in Boise, ID. Custom web design, branding, and high-performance development for Idaho startups and teams.' },
        { name: 'twitter:image', content: 'https://www.creationbase.io/images/socialshare.jpg?v=2' }
      ];

      defaults.forEach(update => {
        let el = update.name 
          ? document.querySelector(`meta[name="${update.name}"]`)
          : document.querySelector(`meta[property="${update.property}"]`);
        if (el) el.setAttribute('content', update.content);
      });
    }
  }, [type, data]);

  return (
    <script type="application/ld+json">
      {JSON.stringify(schemaData)}
    </script>
  );
};

export default Schema;
