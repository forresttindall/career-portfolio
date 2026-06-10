import { useMemo, useEffect } from 'react';

const Schema = ({ type = 'Organization', data = {} }) => {
  const schemaData = useMemo(() => {
    const base = {
      "@context": "https://schema.org",
      "@type": type,
      "name": "Forrest Tindall",
      "url": "https://creationbase.io",
      "logo": "https://creationbase.io/logo.png",
      "sameAs": [
        "https://instagram.com/creationbase.io",
        "https://www.linkedin.com/company/creationbaseio/"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "email": "forrest@creationbase.io"
      }
    };

    if (type === 'Organization' || type === 'LocalBusiness') {
      return {
        ...base,
        "@type": "Person",
        "jobTitle": "UI/UX Designer",
        "description": "Forrest Tindall is a UI/UX designer and fullstack creative focused on clean digital experiences, brand-aligned interfaces, and modern frontend development.",
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Design Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "UI/UX Design",
                "description": "User-centered interface and experience design for websites, apps, and digital products."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Frontend Development",
                "description": "Modern frontend implementation for fast, polished, brand-aligned digital experiences."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Brand and Visual Design",
                "description": "Brand-aligned visual systems spanning UI, graphic design, layout, and digital presentation."
              }
            }
          ]
        },
        "priceRange": "$$"
      };
    }

    if (type === 'Service') {
      return {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": data.name || "UI/UX Design and Frontend Development",
        "provider": {
          "@type": "Person",
          "name": "Forrest Tindall",
          "url": "https://creationbase.io"
        },
        "description": data.description || "UI/UX design, frontend development, and digital visual design focused on clarity, usability, and modern execution."
      };
    }

    if (type === 'BlogPosting') {
      return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": data.title,
        "datePublished": data.date,
        "author": {
          "@type": "Person",
          "name": "Forrest Tindall"
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
      document.title = `${data.title} | Forrest Tindall`;
      
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
      document.title = 'Forrest Tindall — UI/UX Designer';
      
      const defaults = [
        { name: 'description', content: 'Forrest Tindall is a UI/UX designer and fullstack creative focused on clean digital experiences, brand-aligned interfaces, and modern frontend development.' },
        { property: 'og:title', content: 'Forrest Tindall — UI/UX Designer' },
        { property: 'og:description', content: 'Forrest Tindall is a UI/UX designer and fullstack creative focused on clean digital experiences, brand-aligned interfaces, and modern frontend development.' },
        { property: 'og:image', content: 'https://www.creationbase.io/images/socialshare.jpg?v=2' },
        { property: 'og:image:secure_url', content: 'https://www.creationbase.io/images/socialshare.jpg?v=2' },
        { property: 'og:url', content: 'https://www.creationbase.io/' },
        { name: 'twitter:title', content: 'Forrest Tindall — UI/UX Designer' },
        { name: 'twitter:description', content: 'Forrest Tindall is a UI/UX designer and fullstack creative focused on clean digital experiences, brand-aligned interfaces, and modern frontend development.' },
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
