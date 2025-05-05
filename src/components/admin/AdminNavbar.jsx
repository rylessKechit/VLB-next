"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars, 
  faBell, 
  faUser, 
  faSignOutAlt,
  faCalendarCheck,
  faUserCog
} from '@fortawesome/free-solid-svg-icons';

const AdminNavbar = ({ openSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();
  const { data: session } = useSession();
  
  // Titre de la page en fonction du chemin
  const getPageTitle = () => {
    if (pathname === '/admin/dashboard') return 'Tableau de bord';
    if (pathname === '/admin/bookings') return 'Gestion des réservations';
    if (pathname.startsWith('/admin/bookings/')) return 'Détails de la réservation';
    if (pathname === '/admin/users') return 'Gestion des utilisateurs';
    if (pathname.startsWith('/admin/users/')) return 'Détails de l\'utilisateur';
    if (pathname === '/admin/profile') return 'Mon profil';
    if (pathname === '/admin/settings') return 'Paramètres';
    return 'Admin';
  };

  // Récupérer les notifications (exemple, à remplacer par un appel API réel)
  useEffect(() => {
    // Simuler la récupération des notifications
    const fetchNotifications = async () => {
      try {
        // Remplacer par un appel API réel pour récupérer les notifications
        // const response = await fetch('/api/notifications');
        // const data = await response.json();
        
        // Données de test (à remplacer)
        const demoNotifications = [
          {
            id: 1,
            type: 'booking',
            message: 'Nouvelle réservation #BK1234',
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
            read: false,
            link: '/admin/bookings/BK1234'
          },
          {
            id: 2,
            type: 'system',
            message: 'Mise à jour du système effectuée',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
            read: true,
            link: '/admin/settings'
          }
        ];
        
        setNotifications(demoNotifications);
        setUnreadCount(demoNotifications.filter(n => !n.read).length);
      } catch (error) {
        console.error('Erreur lors de la récupération des notifications:', error);
      }
    };
    
    fetchNotifications();
    
    // Mettre à jour les notifications périodiquement
    const interval = setInterval(fetchNotifications, 60000); // Toutes les minutes
    
    return () => clearInterval(interval);
  }, []);
  
  // Fermer les dropdowns lors d'un clic extérieur
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownOpen && !event.target.closest('.user-dropdown')) {
        setDropdownOpen(false);
      }
      if (notificationsOpen && !event.target.closest('.notifications-dropdown')) {
        setNotificationsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [dropdownOpen, notificationsOpen]);
  
  // Gestion de la déconnexion
  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/admin/login' });
  };
  
  // Gestion de la lecture d'une notification
  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };
  
  return (
    <nav className="bg-white shadow-sm h-16 flex items-center z-10">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          {/* Bouton d'ouverture du menu mobile */}
          <button
            className="md:hidden mr-4 text-gray-600 hover:text-primary focus:outline-none"
            onClick={openSidebar}
            aria-label="Menu"
          >
            <FontAwesomeIcon icon={faBars} className="h-5 w-5" />
          </button>
          
          {/* Titre de la page */}
          <h1 className="text-xl font-semibold text-gray-800">{getPageTitle()}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Menu des notifications */}
          <div className="relative notifications-dropdown">
            <button
              className="relative p-1 text-gray-600 hover:text-primary focus:outline-none"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              aria-label="Notifications"
            >
              <FontAwesomeIcon icon={faBell} className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {/* Dropdown des notifications */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
                </div>
                
                <div className="max-h-60 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      Aucune notification
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <Link
                        key={notification.id}
                        href={notification.link}
                        className={`block px-4 py-3 hover:bg-gray-50 ${notification.read ? 'opacity-70' : 'bg-blue-50'}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start">
                          <div className={`flex-shrink-0 rounded-full p-1 ${
                            notification.type === 'booking' ? 'bg-green-100 text-green-500' :
                            notification.type === 'system' ? 'bg-blue-100 text-blue-500' :
                            'bg-gray-100 text-gray-500'
                          }`}>
                            <FontAwesomeIcon 
                              icon={notification.type === 'booking' ? faCalendarCheck : faBell} 
                              className="h-4 w-4"
                            />
                          </div>
                          <div className="ml-3 w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(notification.timestamp).toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                              })} - {new Date(notification.timestamp).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
                
                {notifications.length > 0 && (
                  <div className="px-4 py-2 border-t border-gray-200">
                    <Link 
                      href="/admin/notifications" 
                      className="block text-center text-sm text-primary hover:text-primary-dark"
                    >
                      Voir toutes les notifications
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Menu utilisateur */}
          <div className="relative user-dropdown">
            <button
              className="flex items-center space-x-2 text-gray-600 hover:text-primary focus:outline-none"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-label="Menu utilisateur"
            >
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="hidden md:block text-sm font-medium">
                {session?.user?.name || 'Utilisateur'}
              </span>
            </button>
            
            {/* Dropdown utilisateur */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 py-1">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
                  <p className="text-xs text-gray-500">{session?.user?.email}</p>
                </div>
                
                <Link
                  href="/admin/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FontAwesomeIcon icon={faUserCog} className="mr-2" />
                  Mon profil
                </Link>
                
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;