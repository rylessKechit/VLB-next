// src/middleware.js
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;
  
  // Vérifier si la page est une page d'administration
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
    if (!token) {
      const url = new URL('/admin/login', request.url);
      // Ajouter l'URL de redirection pour revenir à la page d'origine après la connexion
      url.searchParams.set('callbackUrl', encodeURI(request.url));
      return NextResponse.redirect(url);
    }
    
    // Si l'utilisateur est un chauffeur et essaie d'accéder à une page réservée aux admins
    if (token.role === 'driver' && (
      pathname.startsWith('/admin/users') || 
      pathname.startsWith('/admin/settings')
    )) {
      // Rediriger vers le tableau de bord
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  // Si tout est en ordre, continuer
  return NextResponse.next();
}

// Ne pas appliquer le middleware à ces chemins
export const config = {
  matcher: [
    /*
     * Match toutes les routes commençant par /admin
     * Exclure les routes api, _next et les fichiers statiques (images, etc.)
     */
    '/admin/:path*',
  ],
};