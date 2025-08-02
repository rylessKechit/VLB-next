// src/middleware.js - Version MINIMALE
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;
  
  // ✅ PLUS AUCUN HEADER X-Robots-Tag - Laisser faire Next.js
  
  // Seulement vérifier l'authentification admin
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

  // ✅ Laisser passer TOUT le reste sans modification
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Matcher UNIQUEMENT pour l'admin
    '/admin/:path*',
  ],
};