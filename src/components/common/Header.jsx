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
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const pathname = usePathname();

  // Gestionnaire de défilement avec hide/show header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      
      // Détermine si l'utilisateur a défilé vers le haut ou vers le bas
      const isScrollingDown = currentScrollPos > prevScrollPos;
      
      // Visibility logic - hide header when scrolling down, show when scrolling up
      if (currentScrollPos > 100) {
        setVisible(!isScrollingDown);
        setScrolled(true);
      } else {
        setVisible(true);
        setScrolled(currentScrollPos > 30);
      }
      
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

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
    
    // Empêcher le défilement du body quand le menu est ouvert
    if (!mobileMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'h-header-scrolled shadow-custom bg-dark' : 'h-header bg-dark shadow-custom-light'
      } ${visible ? 'translate-y-0' : '-translate-y-full'}`}
    >
      <div className="container mx-auto px-4 h-full flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="block">
            <Image 
              src="/images/logo.webp" 
              alt="Taxi VLB Logo" 
              width={150} 
              height={55} 
              className={`transition-all duration-300 ${scrolled ? 'h-10' : 'h-14'}`}
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
              className="flex items-center px-4 py-2 rounded-md bg-primary text-white transition-all duration-300 hover:bg-primary-dark hover:-translate-y-1" 
              title="Réservation en ligne"
            >
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
              <span className="hidden lg:inline">Réserver maintenant</span>
            </Link>
          </div>
          
          <button 
            className={`flex flex-col justify-between md:hidden w-6 h-5 bg-transparent border-none cursor-pointer z-50`}
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
      
      <Navbar mobileMenuOpen={mobileMenuOpen} />
    </header>
  );
};

export default Header;