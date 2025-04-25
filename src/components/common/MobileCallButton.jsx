"use client";

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faCalendarAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

const MobileCallButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Détecte le défilement pour masquer le bouton en haut de page
  useEffect(() => {
    const handleScroll = () => {
      // Afficher le bouton après avoir défilé un peu
      setHasScrolled(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // N'affiche pas le bouton sur les grands écrans
  if (typeof window !== 'undefined' && window.innerWidth >= 768) {
    return null;
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${hasScrolled ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
      {/* Version compacte ou étendue */}
      {isExpanded ? (
        <div className="bg-white rounded-lg shadow-lg p-4 w-64 transform transition-transform duration-300 animate-slide-in-up">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-gray-800">Besoin d'un taxi ?</h4>
            <button 
              onClick={() => setIsExpanded(false)}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Fermer"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          
          <div className="space-y-3">
            <Link 
              href="tel:+33600000000" 
              className="bg-primary hover:bg-primary-dark text-white py-3 px-4 rounded-md font-medium transition-colors duration-300 w-full flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faPhone} className="mr-2" />
              Appeler maintenant
            </Link>
            
            <Link 
              href="/#booking" 
              className="bg-secondary hover:bg-secondary-dark text-white py-3 px-4 rounded-md font-medium transition-colors duration-300 w-full flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
              Réserver
            </Link>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsExpanded(true)}
          className="w-14 h-14 bg-primary hover:bg-primary-dark text-white rounded-full shadow-lg flex items-center justify-center transition-colors duration-300"
          aria-label="Options de contact"
        >
          <FontAwesomeIcon icon={faPhone} size="lg" className="animate-pulse" />
        </button>
      )}
    </div>
  );
};

export default MobileCallButton;