// src/app/admin/layout.js - Version fixée avec useState

"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { SessionProvider, signOut } from "next-auth/react";
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Suspense } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  
  // Fermer la sidebar lors du changement de page
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);
  
  // Si la page est login, afficher uniquement le contenu
  if (pathname === '/admin/login') {
    return children;
  }
  
  return (
    <SessionProvider>
      {/* Container principal avec isolement complet */}
      <div className="min-h-screen h-screen w-full bg-gray-50 fixed top-0 left-0 z-50 overflow-hidden">
        <div className="flex h-full w-full">
          {/* Sidebar */}
          <AdminSidebar 
            sidebarOpen={sidebarOpen} 
            closeSidebar={() => setSidebarOpen(false)} 
          />
          
          {/* Contenu principal */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header mobile/desktop optimisé */}
            <header className="bg-white shadow-sm h-16 flex items-center z-10 px-4 border-b border-gray-200">
              <div className="flex-1 flex justify-between items-center">
                {/* Bouton hamburger - toujours visible sur mobile */}
                <button
                  className="lg:hidden p-2.5 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-md transition-colors duration-200"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Ouvrir le menu"
                  type="button"
                >
                  <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
                </button>
                
                {/* Titre adaptatif */}
                <h1 className="text-lg sm:text-xl font-semibold text-gray-800 
                              lg:ml-0 ml-4 lg:text-left text-center flex-1 lg:flex-none">
                  Administration
                </h1>
                
                {/* Bouton de déconnexion adaptatif */}
                <button
                  onClick={() => signOut({ callbackUrl: '/admin/login' })}
                  className="flex items-center px-3 py-2 sm:px-4 sm:py-2.5 
                           bg-red-500 text-white rounded-md hover:bg-red-600 
                           transition-colors duration-200 text-sm sm:text-base"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Déconnexion</span>
                </button>
              </div>
            </header>
            
            {/* Zone de contenu principale */}
            <main className="flex-1 overflow-y-auto bg-gray-100 p-3 sm:p-4 lg:p-6">
              <div className="max-w-full">
                <Suspense fallback={
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 
                                  border-t-2 border-b-2 border-primary"></div>
                  </div>
                }>
                  {/* Container pour le contenu avec contraintes mobiles */}
                  <div className="min-h-full">
                    {children}
                  </div>
                </Suspense>
              </div>
            </main>
          </div>
        </div>
      </div>
    </SessionProvider>
  );
}