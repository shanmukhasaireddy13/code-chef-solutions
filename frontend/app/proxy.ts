import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
export default async function proxy(req: NextRequest) {
    const url = req.nextUrl;
    const pathname = url.pathname;

    // Skip middleware for API routes and Next.js internals (but NOT RSC requests - they need auth checks)
    if (
        pathname.startsWith('/api') ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/_vercel') ||
        pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|css|js|woff|woff2|ttf|eot)$/)
    ) {
        return NextResponse.next();
    }

    const token = req.cookies.get('jwt')?.value;
    const isRSCRequest = url.searchParams.has('_rsc');

    const publicPaths = ['/', '/auth/login', '/auth/signup'];
    const adminPaths = [
        '/dashboard/upload',
        '/dashboard/concerns',
        '/dashboard/offers',
        '/dashboard/analytics',
        '/admin',
    ];

    const isPublic = publicPaths.some((p) => pathname === p || pathname.startsWith('/auth'));
    const isAdmin = adminPaths.some((p) => pathname.startsWith(p));
    const isProtected = pathname.startsWith('/dashboard') || pathname.startsWith('/payment');

    // For RSC requests, don't redirect - just pass through (they're internal Next.js requests)
    // The server components will handle authentication checks themselves
    if (isRSCRequest) {
        return NextResponse.next();
    }

    // Not logged in -> redirect to home
    if (isProtected && !token) {
        console.log(`Middleware - Redirecting ${pathname} to / because no token found`);
        return NextResponse.redirect(new URL('/', req.url));
    }

    // Logged in user trying to access login/signup -> send to dashboard (but not if already on dashboard)
    if (isPublic && token && pathname !== '/dashboard') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Admin check
    if (token && isAdmin) {
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');
            const { payload } = await jwtVerify(token, secret);
            const role = payload.role as string;
            if (role !== 'admin') {
                return NextResponse.redirect(new URL('/dashboard', req.url));
            }
        } catch (e) {
            // If token is invalid, clear it and redirect to home
            const response = NextResponse.redirect(new URL('/', req.url));
            response.cookies.delete('jwt');
            return response;
        }
    }

    // Pass through
    return NextResponse.next();
}


export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
