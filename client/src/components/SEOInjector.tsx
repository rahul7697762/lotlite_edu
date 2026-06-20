import { useEffect } from 'react';

export default function SEOInjector() {
  useEffect(() => {
    const fetchSEO = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/website-data/seo`);
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            const { title, description, keywords } = json.data;

            if (title) {
              document.title = title;
            }

            if (description) {
              let metaDescription = document.querySelector('meta[name="description"]');
              if (metaDescription) {
                metaDescription.setAttribute('content', description);
              } else {
                metaDescription = document.createElement('meta');
                metaDescription.setAttribute('name', 'description');
                metaDescription.setAttribute('content', description);
                document.head.appendChild(metaDescription);
              }
            }

            if (keywords) {
              let metaKeywords = document.querySelector('meta[name="keywords"]');
              if (metaKeywords) {
                metaKeywords.setAttribute('content', keywords);
              } else {
                metaKeywords = document.createElement('meta');
                metaKeywords.setAttribute('name', 'keywords');
                metaKeywords.setAttribute('content', keywords);
                document.head.appendChild(metaKeywords);
              }
            }
          }
        }
      } catch (e) {
        console.error('Failed to fetch global SEO data', e);
      }
    };

    fetchSEO();
  }, []);

  return null; // This component does not render anything visible
}
