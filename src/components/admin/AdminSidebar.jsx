"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarCheck, 
  faTachometerAlt, 
  faUsers, 
  faUserCog, 
  faCog, 
  faSignOutAlt, 
  faTimes,
  faCalendarAlt,
  faChevronDown,
  faBars
} from '@fortawesome/free-solid-svg-icons';

const AdminSidebar = ({ sidebarOpen, closeSidebar }) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileView, setIsMobileView] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);
  
  // Vérifier si l'utilisateur est admin
  const isAdmin = session?.user?.role === 'admin';
  
  // Détecter la taille d'écran pour optimiser l'affichage
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    handleResize(); // Exécuter au chargement
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Fermer la sidebar sur les appareils mobiles lors du changement de page
  useEffect(() => {
    if (isMobileView && sidebarOpen) {
      closeSidebar();
    }
  }, [pathname, isMobileView, sidebarOpen, closeSidebar]);
  
  // Navigation Items
  const navItems = [
    { 
      name: 'Tableau de bord', 
      href: '/admin/dashboard', 
      icon: faTachometerAlt, 
      roles: ['admin'],
      items: [] // Sous-menu vide pour respecter la structure
    },
    { 
      name: 'Réservations', 
      href: null, // Null pour indiquer que c'est un menu déroulant
      icon: faCalendarCheck, 
      roles: ['admin'],
      items: [
        { name: 'Toutes les réservations', href: '/admin/bookings' },
        { name: 'Planning', href: '/admin/planning' },
        { name: 'Ajouter une réservation', href: '/admin/bookings/new' }
      ]
    },
    { 
      name: 'Utilisateurs', 
      href: '/admin/users', 
      icon: faUsers, 
      roles: ['admin'],
      items: [] 
    },
    { 
      name: 'Paramètres', 
      href: '/admin/settings', 
      icon: faCog, 
      roles: ['admin'],
      items: [] 
    },
    { 
      name: 'Mon profil', 
      href: '/admin/profile', 
      icon: faUserCog, 
      roles: ['admin'],
      items: [] 
    },
  ];
  
  // Filtrer les éléments de navigation en fonction du rôle de l'utilisateur
  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(session?.user?.role)
  );
  
  // Toggler pour les menus déroulants sur mobile
  const toggleExpand = (index) => {
    if (expandedItem === index) {
      setExpandedItem(null);
    } else {
      setExpandedItem(index);
    }
  };
  
  // Vérifier si un lien ou l'un de ses sous-éléments est actif
  const isActive = (item) => {
    if (item.href && (pathname === item.href || pathname.startsWith(`${item.href}/`))) {
      return true;
    }
    
    if (item.items && item.items.length > 0) {
      return item.items.some(subItem => pathname === subItem.href || pathname.startsWith(`${subItem.href}/`));
    }
    
    return false;
  };
  
  return (
    <>
      {/* Overlay mobile qui s'affiche quand la sidebar est ouverte */}
      {isMobileView && (
        <div 
          className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ${
            sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={closeSidebar}
          aria-hidden="true"
        ></div>
      )}
      
      {/* Bouton d'ouverture pour petits écrans */}
      <button
        className="md:hidden fixed bottom-6 right-6 z-20 bg-primary text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Menu"
      >
        <FontAwesomeIcon icon={faBars} className="h-5 w-5" />
      </button>
      
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 flex flex-col z-40 w-72 max-w-full bg-dark text-white transform ease-in-out duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:inset-auto md:w-64 md:min-h-screen`}
      >
        {/* En-tête de la sidebar */}
        <div className="flex items-center justify-between px-4 py-3 h-16 border-b border-gray-700">
          <Link href="/admin/dashboard" className="flex items-center">
            <Image 
              src="/images/logo.webp" 
              alt="Taxi VLB Logo" 
              width={120} 
              height={40} 
              className="h-8 w-auto"
              priority
            />
            <span className="text-lg font-semibold ml-2 text-white">Admin</span>
          </Link>
          <button
            className="md:hidden text-white hover:text-gray-300 p-2"
            onClick={closeSidebar}
            aria-label="Fermer le menu"
          >
            <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
          </button>
        </div>
        
        {/* Navigation principale avec scrolling si nécessaire */}
        <div className="overflow-y-auto flex-grow py-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          <nav className="px-2">
            <div className="space-y-1">
              {filteredNavItems.map((item, index) => (
                <div key={index} className="mb-1">
                  {item.items && item.items.length > 0 ? (
                    <>
                      <button
                        onClick={() => toggleExpand(index)}
                        className={`flex items-center justify-between w-full px-4 py-3 text-sm rounded-md transition-colors duration-200 ${
                          isActive(item)
                            ? 'bg-primary text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                        aria-expanded={expandedItem === index}
                      >
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={item.icon} className="h-5 w-5 mr-3" />
                          <span>{item.name}</span>
                        </div>
                        <FontAwesomeIcon 
                          icon={faChevronDown} 
                          className={`h-3 w-3 transition-transform duration-200 ${expandedItem === index ? 'rotate-180' : ''}`} 
                        />
                      </button>
                      
                      {/* Sous-menu */}
                      <div 
                        className={`mt-1 overflow-hidden transition-all duration-300 ${
                          expandedItem === index 
                            ? 'max-h-60 opacity-100' 
                            : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="pl-10 pr-2 space-y-1 py-1">
                          {item.items.map((subItem, subIndex) => (
                            <Link
                              key={subIndex}
                              href={subItem.href}
                              className={`block px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                                pathname === subItem.href || pathname.startsWith(`${subItem.href}/`)
                                  ? 'bg-primary bg-opacity-25 text-white font-medium'
                                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                              }`}
                              onClick={isMobileView ? closeSidebar : undefined}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center px-4 py-3 text-sm rounded-md transition-colors duration-200 ${
                        isActive(item)
                          ? 'bg-primary text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                      onClick={isMobileView ? closeSidebar : undefined}
                    >
                      <FontAwesomeIcon icon={item.icon} className="h-5 w-5 mr-3" />
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </nav>
        </div>
        
        {/* Footer avec détails utilisateur et déconnexion */}
        <div className="px-4 py-4 border-t border-gray-700">
          <div className="flex items-center py-2">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white">
              {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="ml-3 flex-1 truncate">
              <p className="text-sm font-medium text-white truncate">{session?.user?.name || 'Utilisateur'}</p>
              <p className="text-xs text-gray-400">Administrateur</p>
            </div>
          </div>
          
          <Link
            href="/api/auth/signout"
            className="flex items-center px-4 py-2 mt-2 text-sm text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors duration-200 w-full"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5 mr-3" />
            Déconnexion
          </Link>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;