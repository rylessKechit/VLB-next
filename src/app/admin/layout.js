"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { SessionProvider, signOut } from "next-auth/react";
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Suspense } from 'react';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  
  // Fermer la sidebar lors du changement de page
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);
  
  // Si la page est login, afficher uniquement le contenu sans la mise en page
  if (pathname === '/admin/login') {
    return children;
  }
  
  return (
    <SessionProvider>
      {/* Cette div avec la classe relative isole complètement cette interface du reste du site */}
      <div className="min-h-screen h-screen w-full bg-gray-50 absolute top-0 left-0 z-50">
        <div className="flex h-full w-full overflow-hidden">
          {/* Sidebar pour mobile */}
          <div className={`fixed inset-0 z-20 transition-opacity ease-linear duration-300 ${
            sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}>
            <div className="absolute inset-0 bg-gray-600 opacity-75" onClick={() => setSidebarOpen(false)}></div>
          </div>
          
          {/* Sidebar */}
          <AdminSidebar sidebarOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
          
          {/* Contenu principal */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Barre simple avec bouton de déconnexion */}
            <div className="bg-white shadow-sm h-16 flex items-center z-10 px-4">
              <div className="flex-1 flex justify-between items-center">
                {/* Bouton hamburger pour mobile */}
                <button
                  className="md:hidden px-2 py-2 text-gray-600 hover:text-primary focus:outline-none"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Menu"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                
                <h1 className="text-xl font-semibold text-gray-800">Administration</h1>
                
                {/* Bouton de déconnexion */}
                <button
                  onClick={() => signOut({ callbackUrl: '/admin/login' })}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300"
                >
                  Déconnexion
                </button>
              </div>
            </div>
            
            {/* Contenu principal */}
            <main className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-6">
              <Suspense fallback={
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              }>
                {children}
              </Suspense>
            </main>
          </div>
        </div>
      </div>
    </SessionProvider>
  );
}