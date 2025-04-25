"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ mobileMenuOpen }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const pathname = usePathname();

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
    { path: '/a-propos', label: 'À Propos' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block bg-white shadow-custom-light transition-all duration-300 absolute md:relative top-full left-0 w-full z-40`}>
      <div className="container mx-auto px-4">
        <ul className="flex flex-col md:flex-row md:h-12">
          {navLinks.map((link, index) => (
            <li 
              key={index} 
              className={`relative ${link.isDropdown ? (openDropdown === index ? 'open' : '') : ''}`}
            >
              {link.isDropdown ? (
                <>
                  <button 
                    className="flex items-center w-full md:h-full px-5 py-4 md:py-0 text-text-dark font-medium text-sm uppercase tracking-wider transition-colors duration-300 hover:text-primary border-b md:border-b-0 border-gray-100"
                    onClick={() => toggleDropdown(index)}
                  >
                    {link.label}
                    <FontAwesomeIcon 
                      icon={faChevronDown} 
                      className={`ml-2 text-xs transition-transform duration-300 ${openDropdown === index ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <div className={`${openDropdown === index ? 'max-h-screen opacity-100 visible' : 'max-h-0 md:max-h-screen opacity-0 md:opacity-100 invisible md:invisible'} md:absolute md:top-full md:left-0 w-full md:w-64 bg-white md:shadow-custom md:rounded-md transition-all duration-300 overflow-hidden md:opacity-0 md:transform md:translate-y-2 md:group-hover:opacity-100 md:group-hover:visible md:group-hover:translate-y-0`}>
                    {link.items.map((item, itemIndex) => (
                      <Link 
                        key={itemIndex}
                        href={item.path}
                        className={`block px-8 md:px-5 py-3 text-sm border-b last:border-b-0 border-gray-100 transition-colors duration-300 ${isActive(item.path) ? 'bg-primary bg-opacity-5 text-primary' : 'hover:bg-primary hover:bg-opacity-5 hover:text-primary'}`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link 
                  href={link.path} 
                  className={`flex items-center h-full px-5 py-4 md:py-0 text-sm font-medium uppercase tracking-wider transition-colors duration-300 border-b md:border-b-0 border-gray-100 ${
                    isActive(link.path, link.exact) 
                      ? 'text-primary md:after:content-[""] md:after:absolute md:after:bottom-0 md:after:left-1/2 md:after:-translate-x-1/2 md:after:w-8 md:after:h-0.5 md:after:bg-primary' 
                      : 'text-text-dark hover:text-primary'
                  }`}
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;