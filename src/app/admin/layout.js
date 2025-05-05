"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { SessionProvider } from "next-auth/react";
import AdminNavbar from '@/components/admin/AdminNavbar';
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
      <div className="flex h-screen bg-gray-50 overflow-hidden">
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
          {/* Navbar */}
          <AdminNavbar openSidebar={() => setSidebarOpen(true)} />
          
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
    </SessionProvider>
  );
}