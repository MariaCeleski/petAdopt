import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { applySecurityHeaders } from '@/lib/security/headers.js';
import { applyRateLimitHeaders, getClientIp, createRateLimitKey, rateLimiter } from '@/lib/rate-limiting/index.js';

export default withAuth(
  async function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Verificar rate limit para APIs
    if (pathname.startsWith('/api/')) {
      const clientId = getClientIp(req);
      const key = createRateLimitKey(clientId);

      // Determinar tipo de rate limit baseado na rota
      let limitType = 'general';
      if (pathname.includes('/auth/')) limitType = 'auth';
      else if (pathname.includes('/upload')) limitType = 'upload';
      else if (pathname.includes('/pets') && ['POST', 'PUT', 'PATCH'].includes(req.method)) limitType = 'petCreate';
      else if (pathname.includes('/pets') && req.method === 'DELETE') limitType = 'petModify';
      else if (pathname.includes('/adoptions')) limitType = 'adoption';
      else if (pathname.includes('/pets') && req.method === 'GET') limitType = 'publicGet';

      const result = await rateLimiter.checkLimit(key, limitType);
      
      if (!result.success) {
        const response = new NextResponse(
          JSON.stringify({
            error: 'Muitas requisições. Tente novamente mais tarde.',
            code: 'RATE_LIMIT_EXCEEDED',
            retryAfter: result.retryAfter,
          }),
          { status: 429 }
        );
        
        response.headers.set('Retry-After', result.retryAfter.toString());
        Object.entries(result.headers).forEach(([key, value]) => {
          response.headers.set(key, value);
        });
        
        return response;
      }
    }

    // Aplicar security headers
    const publicRoutes = [
      '/',
      '/pets',
      '/pets/[id]',
      '/contato',
      '/auth/signin',
      '/auth/signup',
      '/auth/error',
      '/auth/verify-request',
    ];

    // Permitir acesso a páginas públicas e recursos estáticos
    if (
      publicRoutes.some(route => 
        pathname === route || 
        pathname.startsWith('/api/pets') && req.method === 'GET' ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/favicon.ico') ||
        pathname.startsWith('/api/auth/')
      )
    ) {
      return NextResponse.next();
    }

    // Verificar se o usuário está autenticado para rotas protegidas
    if (!token) {
      const signInUrl = new URL('/auth/signin', req.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Verificar permissões específicas por rota
    if (pathname.startsWith('/dashboard')) {
      // Dashboard requer usuário autenticado
      if (!token) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
      }
    }

    if (pathname.startsWith('/admin')) {
      // Área admin requer tipo específico de usuário
      if (token.type !== 'SHELTER_ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    // Proteção para APIs específicas
    if (pathname.startsWith('/api/pets') && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      if (!token) {
        return new NextResponse(
          JSON.stringify({ error: 'Não autorizado' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    if (pathname.startsWith('/api/adoptions')) {
      if (!token) {
        return new NextResponse(
          JSON.stringify({ error: 'Não autorizado' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    if (pathname.startsWith('/api/upload')) {
      if (!token) {
        return new NextResponse(
          JSON.stringify({ error: 'Não autorizado' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Sempre permitir acesso a rotas de auth
        if (pathname.startsWith('/api/auth/') || pathname.startsWith('/auth/')) {
          return true;
        }
        
        // Para outras rotas, deixar o middleware principal decidir
        return true;
      },
    },
  }
);

// Configurar quais rotas o middleware deve processar
export const config = {
  matcher: [
    /*
     * Aplicar middleware a todas as rotas exceto:
     * - api/auth/* (NextAuth routes)
     * - _next/static (arquivos estáticos)
     * - _next/image (otimização de imagens)
     * - favicon.ico
     * - arquivos públicos
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};