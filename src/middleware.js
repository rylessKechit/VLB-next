// src/middleware.js - Version corrigée
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;
  
  // ✅ CORRECTION MAJEURE : Ne bloquer l'indexation QUE pour les ressources techniques
  if (pathname.startsWith('/_next/static/') || 
      pathname.startsWith('/_next/image') ||
      pathname.startsWith('/api/') ||
      pathname.startsWith('/admin/')) {
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }
  
  // ✅ PERMETTRE l'indexation de toutes les autres pages
  // Supprimer complètement le X-Robots-Tag pour les pages publiques
  
  // Vérifier si la page est une page d'administration
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    if (!token) {
      const url = new URL('/admin/login', request.url);
      url.searchParams.set('callbackUrl', encodeURI(request.url));
      return NextResponse.redirect(url);
    }
    
    if (token.role === 'driver' && (
      pathname.startsWith('/admin/users') || 
      pathname.startsWith('/admin/settings')
    )) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  // ✅ Pages publiques : AUCUN header X-Robots-Tag
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Matcher plus précis pour éviter les problèmes
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};