"use client";

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
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';

const AdminSidebar = ({ sidebarOpen, closeSidebar }) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  
  // Vérifier si l'utilisateur est admin
  const isAdmin = session?.user?.role === 'admin';
  
  // Navigation Items
  const navItems = [
    { name: 'Tableau de bord', href: '/admin/dashboard', icon: faTachometerAlt, roles: ['admin', 'driver'] },
    { name: 'Planning', href: '/admin/planning', icon: faCalendarAlt, roles: ['admin', 'driver'] },
    { name: 'Réservations', href: '/admin/bookings', icon: faCalendarCheck, roles: ['admin', 'driver'] },
    { name: 'Utilisateurs', href: '/admin/users', icon: faUsers, roles: ['admin'] },
    { name: 'Mon profil', href: '/admin/profile', icon: faUserCog, roles: ['admin', 'driver'] },
    { name: 'Paramètres', href: '/admin/settings', icon: faCog, roles: ['admin'] },
  ];
  
  // Filtrer les éléments de navigation en fonction du rôle de l'utilisateur
  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(session?.user?.role)
  );
  
  return (
    <>
      {/* Sidebar mobile */}
      <div
        className={`fixed inset-y-0 left-0 flex flex-col z-40 w-64 bg-dark text-white transform ease-in-out duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:inset-auto`}
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
            />
            <span className="text-lg font-semibold ml-2 text-white">Admin</span>
          </Link>
          <button
            className="md:hidden text-white hover:text-gray-300"
            onClick={closeSidebar}
            aria-label="Fermer le menu"
          >
            <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
          </button>
        </div>
        
        {/* Navigation principale */}
        <div className="overflow-y-auto flex-grow">
          <nav className="px-2 py-4">
            <div className="space-y-1">
              {filteredNavItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-2 text-sm rounded-md ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <FontAwesomeIcon icon={item.icon} className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
        
        {/* Footer avec détails utilisateur et déconnexion */}
        <div className="px-4 py-2 border-t border-gray-700">
          <div className="flex items-center py-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
              {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{session?.user?.name || 'Utilisateur'}</p>
              <p className="text-xs text-gray-400">{session?.user?.role === 'admin' ? 'Administrateur' : 'Chauffeur'}</p>
            </div>
          </div>
          
          <Link
            href="/api/auth/signout"
            className="flex items-center px-4 py-2 mt-1 text-sm text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
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