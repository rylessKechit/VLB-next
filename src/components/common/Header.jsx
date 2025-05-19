// src/components/common/Header.jsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faCalendarAlt, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import Navbar from './Navbar';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Gestionnaire de défilement simplifié
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.pageYOffset > 30);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu mobile lors du changement de page
  useEffect(() => {
    setMobileMenuOpen(false);
    if (mobileMenuOpen) {
      document.body.classList.remove('overflow-hidden');
    }
  }, [pathname]);

  // Fonction pour inverser l'état du menu
  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    
    if (!mobileMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-dark`}
    >
      <div className="container mx-auto px-4 h-20 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="block">
            <Image 
              src="/images/logo.webp" 
              alt="Taxi VLB Logo" 
              width={75}
              height={30}
              className="transition-all duration-300"
              priority={true}
              loading="eager"
            />
          </Link>
        </div>

        <div className="flex items-center">
          <div className="hidden md:flex items-center mr-6">
            <Link href="/contact" 
              className="flex items-center px-4 py-2 mr-3 rounded-md transition-all duration-300 text-white hover:text-primary" 
              title="Appelez-nous"
            >
              <FontAwesomeIcon icon={faPhone} className="mr-2" />
              <span className="hidden lg:inline">Réservation téléphonique</span>
            </Link>
            
            <Link href="/#booking" 
              className="flex items-center px-4 py-2 rounded-md bg-primary text-white transition-all duration-300 hover:bg-primary-dark hover:text-white hover:-translate-y-1" 
              title="Réservation en ligne"
            >
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
              <span className="hidden lg:inline">Réserver maintenant</span>
            </Link>
          </div>
          
          <button 
            className="flex flex-col justify-between md:hidden w-6 h-5 bg-transparent border-none cursor-pointer z-50"
            onClick={toggleMenu}
            aria-label="Menu principal"
            aria-expanded={mobileMenuOpen}
          >
            <span className={`block w-full h-0.5 bg-white rounded transition-transform duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-full h-0.5 bg-white rounded transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`block w-full h-0.5 bg-white rounded transition-transform duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
      </div>
      
      {/* La navbar avec bordure optionnelle */}
      <div className={`${scrolled ? 'border-t border-gray-700 border-opacity-30' : ''}`}>
        <Navbar mobileMenuOpen={mobileMenuOpen} />
      </div>
    </header>
  );
};

export default Header;