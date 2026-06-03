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
        "email": "forrest@creationbase.io"
      }
    };

    if (type === 'Organization' || type === 'LocalBusiness') {
      return {
        ...base,
        "@type": "ProfessionalService",
        "description": "Creationbase is a creation studio for brand + UI/UX design and high-performance web development—built as one cohesive system.",
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Creative Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Web Design",
                "description": "Modern website design that clarifies your offer and makes conversion feel effortless."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Full-Stack Web Development",
                "description": "High-performance frontend development with durable, scalable implementation."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Brand Identity Systems",
                "description": "Logo, typography, and color systems designed to be distinct, repeatable, and memorable."
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
        "priceRange": "$$"
      };
    }

    if (type === 'Service') {
      return {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": data.name || "Design and Development",
        "provider": {
          "@type": "Organization",
          "name": "Creationbase",
          "url": "https://creationbase.io"
        },
        "description": data.description || "Brand + UI/UX design and high-performance web development focused on clarity, memorability, and trust."
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
      document.title = 'Creationbase — Design & Development';
      
      const defaults = [
        { name: 'description', content: 'Creationbase is a creation studio for brand + UI/UX design and high-performance web development.' },
        { property: 'og:title', content: 'Creationbase — Design & Development' },
        { property: 'og:description', content: 'Creationbase is a creation studio for brand + UI/UX design and high-performance web development.' },
        { property: 'og:image', content: 'https://www.creationbase.io/images/socialshare.jpg?v=2' },
        { property: 'og:image:secure_url', content: 'https://www.creationbase.io/images/socialshare.jpg?v=2' },
        { property: 'og:url', content: 'https://www.creationbase.io/' },
        { name: 'twitter:title', content: 'Creationbase — Design & Development' },
        { name: 'twitter:description', content: 'Creationbase is a creation studio for brand + UI/UX design and high-performance web development.' },
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
