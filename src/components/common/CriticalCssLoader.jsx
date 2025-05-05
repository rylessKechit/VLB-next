"use client";

import { useEffect } from 'react';

export default function CriticalCssLoader() {
  useEffect(() => {
    // Ne chargez les styles non critiques qu'une fois que la page est chargée
    const loadNonCriticalCSS = () => {
      const stylesheets = document.querySelectorAll('link[rel="stylesheet"][data-critical="false"]');
      
      stylesheets.forEach((stylesheet) => {
        stylesheet.setAttribute('media', 'all');
        stylesheet.removeAttribute('data-critical');
      });

      // Charger les polices de manière optimisée
      const fontStylesheet = document.createElement('link');
      fontStylesheet.rel = 'stylesheet';
      fontStylesheet.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap';
      fontStylesheet.type = 'text/css';
      document.head.appendChild(fontStylesheet);
      
      // Charger des scripts analytiques après le chargement initial
      setTimeout(() => {
        if (process.env.NEXT_PUBLIC_GA_ID) {
          const gaScript = document.createElement('script');
          gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`;
          gaScript.async = true;
          document.head.appendChild(gaScript);

          const gaConfigScript = document.createElement('script');
          gaConfigScript.text = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              page_path: window.location.pathname,
              'anonymize_ip': true,
              'cookie_flags': 'SameSite=None;Secure'
            });
          `;
          document.head.appendChild(gaConfigScript);
        }
      }, 3000);
    };

    // Lorsque la page est entièrement chargée OU après un timeout de secours
    if (document.readyState === 'complete') {
      loadNonCriticalCSS();
    } else {
      window.addEventListener('load', loadNonCriticalCSS);
      
      // Fallback pour assurer le chargement même si 'load' ne se déclenche pas correctement
      setTimeout(loadNonCriticalCSS, 2000);
    }

    return () => {
      window.removeEventListener('load', loadNonCriticalCSS);
    };
  }, []);

  return null; // Ce composant ne rend rien
}