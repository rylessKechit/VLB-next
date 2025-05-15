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
  faBars,
  faPlus,
  faList,
  faClipboardList
} from '@fortawesome/free-solid-svg-icons';

const AdminSidebar = ({ sidebarOpen, closeSidebar }) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [expandedItem, setExpandedItem] = useState(null);
  
  // Vérifier si l'utilisateur est admin
  const isAdmin = session?.user?.role === 'admin';
  
  // Fermer la sidebar sur changement de page en mobile
  useEffect(() => {
    if (sidebarOpen) {
      closeSidebar();
    }
  }, [pathname]);
  
  // Navigation Items avec une structure optimisée pour mobile
  const navItems = [
    { 
      name: 'Tableau de bord', 
      href: '/admin/dashboard', 
      icon: faTachometerAlt, 
      roles: ['admin']
    },
    { 
      name: 'Réservations', 
      href: null,
      icon: faCalendarCheck, 
      roles: ['admin'],
      items: [
        { name: 'Toutes les réservations', href: '/admin/bookings', icon: faList },
        { name: 'Planning', href: '/admin/planning', icon: faCalendarAlt },
        { name: 'Nouvelle réservation', href: '/admin/bookings/new', icon: faPlus }
      ]
    },
    { 
      name: 'Utilisateurs', 
      href: '/admin/users', 
      icon: faUsers, 
      roles: ['admin']
    },
    { 
      name: 'Paramètres', 
      href: '/admin/settings', 
      icon: faCog, 
      roles: ['admin']
    },
    { 
      name: 'Mon profil', 
      href: '/admin/profile', 
      icon: faUserCog, 
      roles: ['admin']
    },
  ];
  
  // Filtrer les éléments de navigation en fonction du rôle
  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(session?.user?.role)
  );
  
  // Toggle pour les menus déroulants
  const toggleExpand = (index) => {
    setExpandedItem(expandedItem === index ? null : index);
  };
  
  // Vérifier si un lien est actif
  const isActive = (item) => {
    if (item.href && (pathname === item.href || pathname.startsWith(`${item.href}/`))) {
      return true;
    }
    
    if (item.items && item.items.length > 0) {
      return item.items.some(subItem => 
        pathname === subItem.href || pathname.startsWith(`${subItem.href}/`)
      );
    }
    
    return false;
  };
  
  return (
    <>
      {/* Overlay pour mobile */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 lg:hidden ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeSidebar}
        aria-hidden="true"
      />
      
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 flex flex-col z-40 w-80 sm:w-72 max-w-full bg-dark text-white transform ease-in-out duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:inset-auto lg:w-64 lg:min-h-screen`}
      >
        {/* En-tête avec logo */}
        <div className="flex items-center justify-between px-6 py-4 h-16 border-b border-gray-700">
          <Link href="/admin/dashboard" className="flex items-center">
            <div className="bg-primary h-10 w-auto px-3 rounded flex items-center justify-center text-white font-bold text-sm">
              TAXI VLB
            </div>
            <span className="text-lg font-semibold ml-3 text-white hidden sm:block">Admin</span>
          </Link>
          <button
            className="lg:hidden text-white hover:text-gray-300 p-2 -mr-2 rounded-md"
            onClick={closeSidebar}
            aria-label="Fermer le menu"
          >
            <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
          </button>
        </div>
        
        {/* Navigation principale */}
        <div className="overflow-y-auto flex-grow py-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          <nav className="px-4">
            <div className="space-y-2">
              {filteredNavItems.map((item, index) => (
                <div key={index}>
                  {item.items && item.items.length > 0 ? (
                    <>
                      <button
                        onClick={() => toggleExpand(index)}
                        className={`flex items-center justify-between w-full px-4 py-3 text-left rounded-md transition-all duration-200 ${
                          isActive(item)
                            ? 'bg-primary text-white shadow-md'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                        aria-expanded={expandedItem === index}
                      >
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={item.icon} className="h-5 w-5 mr-3 flex-shrink-0" />
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <FontAwesomeIcon 
                          icon={faChevronDown} 
                          className={`h-4 w-4 transition-transform duration-200 ${
                            expandedItem === index ? 'rotate-180' : ''
                          }`} 
                        />
                      </button>
                      
                      {/* Sous-menu avec animation */}
                      <div 
                        className={`transition-all duration-300 ease-in-out overflow-hidden ${
                          expandedItem === index 
                            ? 'max-h-64 opacity-100 pb-2' 
                            : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="mt-2 ml-4 space-y-1">
                          {item.items.map((subItem, subIndex) => (
                            <Link
                              key={subIndex}
                              href={subItem.href}
                              className={`flex items-center px-4 py-2.5 text-sm rounded-md transition-all duration-200 ${
                                pathname === subItem.href || pathname.startsWith(`${subItem.href}/`)
                                  ? 'bg-primary bg-opacity-25 text-white font-medium border-r-2 border-primary'
                                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                              }`}
                              onClick={closeSidebar}
                            >
                              {subItem.icon && (
                                <FontAwesomeIcon icon={subItem.icon} className="h-4 w-4 mr-3 flex-shrink-0" />
                              )}
                              <span>{subItem.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center px-4 py-3 rounded-md transition-all duration-200 ${
                        isActive(item)
                          ? 'bg-primary text-white shadow-md'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                      onClick={closeSidebar}
                    >
                      <FontAwesomeIcon icon={item.icon} className="h-5 w-5 mr-3 flex-shrink-0" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </nav>
        </div>
        
        {/* Footer avec utilisateur */}
        <div className="px-4 py-4 border-t border-gray-700">
          <div className="flex items-center p-4 rounded-md bg-gray-800 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
              {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="ml-3 flex-1 truncate">
              <p className="text-sm font-medium text-white truncate">
                {session?.user?.name || 'Utilisateur'}
              </p>
              <p className="text-xs text-gray-400">
                {session?.user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => {
              closeSidebar();
              // Utiliser router pour la déconnexion
              window.location.href = '/api/auth/signout';
            }}
            className="flex items-center w-full px-4 py-3 text-sm text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-all duration-200"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5 mr-3" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;