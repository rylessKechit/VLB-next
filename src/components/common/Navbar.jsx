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

  // Ajouter les références pour chaque dropdown
  useEffect(() => {
    dropdownRefs.current = dropdownRefs.current.slice(0, navLinks.filter(link => link.isDropdown).length);
  }, []);

  const toggleDropdown = (index) => {
    if (openDropdown === index) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(index);
    }
  };

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
    { path: '/about', label: 'À Propos' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  // Gestionnaire de souris pour les menus déroulants
  const handleMouseEnter = (index) => {
    setOpenDropdown(index);
  };

  const handleMouseLeave = (index) => {
    // Utiliser un délai pour éviter que le menu ne se ferme immédiatement
    setTimeout(() => {
      if (openDropdown === index) {
        setOpenDropdown(null);
      }
    }, 150);
  };

  // Gestionnaire de clavier pour l'accessibilité
  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleDropdown(index);
    } else if (e.key === 'Escape' && openDropdown === index) {
      setOpenDropdown(null);
    }
  };

  return (
    <nav 
      className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block transition-all duration-300 bg-dark`}
      aria-label="Navigation principale"
    >
      <div className="container mx-auto px-4">
        <ul className="flex flex-col md:flex-row justify-center md:h-12" role="menubar">
          {navLinks.map((link, index) => {
            const dropdownIndex = link.isDropdown ? navLinks.filter((l, i) => l.isDropdown && i < index).length : -1;
            
            return (
              <li 
                key={index} 
                className={`relative ${link.isDropdown ? 'group' : ''}`}
                onMouseEnter={link.isDropdown ? () => handleMouseEnter(dropdownIndex) : undefined}
                onMouseLeave={link.isDropdown ? () => handleMouseLeave(dropdownIndex) : undefined}
                ref={link.isDropdown ? (el) => (dropdownRefs.current[dropdownIndex] = el) : null}
                role="none"
              >
                {link.isDropdown ? (
                  <>
                    <button 
                      className="flex items-center w-full md:h-full px-5 py-4 md:py-0 text-white font-medium text-sm uppercase tracking-wider transition-colors duration-300 hover:text-primary border-b md:border-b-0 border-gray-700"
                      onClick={() => toggleDropdown(dropdownIndex)}
                      onKeyDown={(e) => handleKeyDown(e, dropdownIndex)}
                      aria-haspopup="true"
                      aria-expanded={openDropdown === dropdownIndex}
                      aria-controls={`dropdown-menu-${dropdownIndex}`}
                      role="menuitem"
                    >
                      {link.label}
                      <FontAwesomeIcon 
                        icon={faChevronDown} 
                        className={`ml-2 text-xs transition-transform duration-300 ${openDropdown === dropdownIndex ? 'rotate-180' : ''}`}
                        aria-hidden="true"
                      />
                    </button>
                    <div 
                      id={`dropdown-menu-${dropdownIndex}`}
                      className={`${
                        openDropdown === dropdownIndex || mobileMenuOpen ? 'block' : 'hidden'
                      } md:absolute md:top-full md:left-0 w-full md:w-64 bg-white shadow-lg rounded-b-md z-40`}
                      role="menu"
                      aria-label={`Sous-menu ${link.label}`}
                    >
                      {link.items.map((item, itemIndex) => (
                        <Link 
                          key={itemIndex}
                          href={item.path}
                          className={`block px-8 md:px-5 py-3 text-sm border-b last:border-b-0 border-gray-100 transition-colors duration-300 ${
                            isActive(item.path) 
                              ? 'bg-primary bg-opacity-5 text-primary' 
                              : 'hover:bg-primary hover:bg-opacity-5 hover:text-primary'
                          }`}
                          role="menuitem"
                          tabIndex={openDropdown === dropdownIndex ? 0 : -1}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link 
                    href={link.path} 
                    className={`flex items-center justify-center h-full px-5 py-4 md:py-0 text-sm font-medium uppercase tracking-wider transition-colors duration-300 border-b md:border-b-0 border-gray-700 ${
                      isActive(link.path, link.exact) 
                        ? 'text-primary md:after:content-[""] md:after:absolute md:after:bottom-0 md:after:left-1/2 md:after:-translate-x-1/2 md:after:w-8 md:after:h-0.5 md:after:bg-primary' 
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
  );
};

export default Navbar;