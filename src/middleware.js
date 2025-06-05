// src/middleware.js
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;
  
  // Bloquer l'indexation des ressources Next.js
  if (pathname.startsWith('/_next/static/') || 
      pathname.startsWith('/_next/image') ||
      pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }
  
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

// Configuration du middleware
export const config = {
  matcher: [
    /*
     * Match toutes les routes sauf :
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    // Inclure spécifiquement les routes admin
    '/admin/:path*',
    // Inclure les routes de ressources pour ajouter les headers no-index
    '/_next/static/:path*',
    '/_next/image/:path*'
  ],
};