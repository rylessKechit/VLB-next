"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ mobileMenuOpen }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRefs = useRef([]);
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  // Détecter si l'appareil est mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Réinitialiser le dropdown lorsque le menu mobile est fermé
  useEffect(() => {
    if (!mobileMenuOpen) {
      setOpenDropdown(null);
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { path: '/', label: 'Accueil', exact: true },
    {
      label: 'Nos Services',
      isDropdown: true,
      items: [
        { path: '/services/longue-distance', label: 'Voyages Longue Distance' },
        { path: '/services/aeroport-gare', label: 'Transports Aéroport - Gare' }
      ]
    },
    { path: '/flotte', label: 'Notre Flotte' },
    { path: '/about', label: 'À Propos' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  return (
    <>
      <nav 
        className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block transition-all duration-300 bg-dark`}
        aria-label="Navigation principale"
      >
        <div className="container mx-auto px-4">
          {/* Mobile menu */}
          <div className="md:hidden">
            {mobileMenuOpen && (
              <ul className="py-2 space-y-0" role="menubar">
                {navLinks.map((link, index) => {
                  const dropdownIndex = link.isDropdown ? navLinks.filter((l, i) => l.isDropdown && i < index).length : -1;
                  
                  return (
                    <li key={index} className="border-b border-gray-700 border-opacity-50" role="none">
                      {link.isDropdown ? (
                        <>
                          <button 
                            className="flex items-center justify-between w-full px-4 py-4 text-white font-medium text-left uppercase tracking-wide transition-all duration-300 hover:text-primary hover:bg-gray-800 hover:bg-opacity-50 active:bg-gray-700 active:bg-opacity-50 min-h-[56px] touch-manipulation"
                            onClick={() => setOpenDropdown(openDropdown === dropdownIndex ? null : dropdownIndex)}
                            aria-haspopup="true"
                            aria-expanded={openDropdown === dropdownIndex}
                            role="menuitem"
                          >
                            {link.label}
                            <FontAwesomeIcon 
                              icon={faChevronDown} 
                              className={`text-xs transition-transform duration-300 ${openDropdown === dropdownIndex ? 'rotate-180' : ''}`}
                              aria-hidden="true"
                            />
                          </button>
                          
                          {/* Mobile dropdown menu avec animation Tailwind */}
                          <div 
                            className={`bg-gray-800 border-t border-gray-700 border-opacity-50 overflow-hidden transition-all duration-300 ease-in-out ${
                              openDropdown === dropdownIndex 
                                ? 'max-h-96 opacity-100' 
                                : 'max-h-0 opacity-0'
                            }`}
                            role="menu"
                          >
                            {link.items.map((item, itemIndex) => (
                              <Link 
                                key={itemIndex}
                                href={item.path}
                                className={`block px-8 py-4 text-sm transition-all duration-300 min-h-[48px] flex items-center touch-manipulation ${
                                  isActive(item.path) 
                                    ? 'bg-primary bg-opacity-20 text-primary border-l-4 border-primary' 
                                    : 'text-gray-300 hover:bg-gray-700 hover:bg-opacity-50 hover:text-white active:bg-gray-600'
                                }`}
                                role="menuitem"
                                onClick={() => setOpenDropdown(null)}
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        </>
                      ) : (
                        <Link 
                          href={link.path} 
                          className={`block px-4 py-4 text-white font-medium uppercase tracking-wide transition-all duration-300 min-h-[56px] flex items-center touch-manipulation ${
                            isActive(link.path, link.exact) 
                              ? 'text-primary border-l-4 border-primary bg-primary bg-opacity-10' 
                              : 'hover:text-primary hover:bg-gray-800 hover:bg-opacity-50 active:bg-gray-700 active:bg-opacity-50'
                          }`}
                          role="menuitem"
                          aria-current={isActive(link.path, link.exact) ? 'page' : undefined}
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          
          {/* Desktop menu */}
          <ul className="hidden md:flex justify-center h-12" role="menubar">
            {navLinks.map((link, index) => {
              const dropdownIndex = link.isDropdown ? navLinks.filter((l, i) => l.isDropdown && i < index).length : -1;
              
              return (
                <li 
                  key={index} 
                  className={`relative ${link.isDropdown ? 'group' : ''}`}
                  role="none"
                >
                  {link.isDropdown ? (
                    <>
                      <button 
                        className="flex items-center h-full px-5 py-0 text-white font-medium text-sm uppercase tracking-wider transition-colors duration-300 hover:text-primary group-hover:text-primary"
                        role="menuitem"
                      >
                        {link.label}
                        <FontAwesomeIcon 
                          icon={faChevronDown} 
                          className="ml-2 text-xs transition-transform duration-300 group-hover:rotate-180"
                          aria-hidden="true"
                        />
                      </button>
                      <div 
                        className="absolute top-full left-0 w-64 bg-white shadow-lg rounded-b-md z-40 opacity-0 invisible transform scale-95 transition-all duration-300 group-hover:opacity-100 group-hover:visible group-hover:scale-100"
                        role="menu"
                      >
                        {link.items.map((item, itemIndex) => (
                          <Link 
                            key={itemIndex}
                            href={item.path}
                            className={`block px-5 py-3 text-sm border-b last:border-b-0 border-gray-100 transition-colors duration-300 ${
                              isActive(item.path) 
                                ? 'bg-primary bg-opacity-5 text-primary' 
                                : 'hover:bg-primary hover:bg-opacity-5 hover:text-primary'
                            }`}
                            role="menuitem"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link 
                      href={link.path} 
                      className={`flex items-center justify-center h-full px-5 py-0 text-sm font-medium uppercase tracking-wider transition-colors duration-300 relative ${
                        isActive(link.path, link.exact) 
                          ? 'text-primary after:content-[""] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-8 after:h-0.5 after:bg-primary' 
                          : 'text-white hover:text-primary'
                      }`}
                      role="menuitem"
                      aria-current={isActive(link.path, link.exact) ? 'page' : undefined}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;