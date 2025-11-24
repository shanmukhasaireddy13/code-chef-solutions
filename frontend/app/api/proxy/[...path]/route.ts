import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function GET(request: NextRequest) {
    return proxyRequest(request, 'GET');
}

export async function POST(request: NextRequest) {
    return proxyRequest(request, 'POST');
}

export async function PUT(request: NextRequest) {
    return proxyRequest(request, 'PUT');
}

export async function DELETE(request: NextRequest) {
    return proxyRequest(request, 'DELETE');
}

async function proxyRequest(request: NextRequest, method: string) {
    const pathname = request.nextUrl.pathname.replace('/api/proxy', '');
    const search = request.nextUrl.search;
    const url = `${BACKEND_URL}${pathname}${search}`;

    try {
        // Get cookies from the request
        const cookieHeader = request.headers.get('cookie');

        // Prepare headers
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (cookieHeader) {
            headers['Cookie'] = cookieHeader;
        }

        // Prepare request options
        const options: RequestInit = {
            method,
            headers,
            credentials: 'include',
        };

        // Add body for POST/PUT requests
        if (method === 'POST' || method === 'PUT') {
            const body = await request.text();
            if (body) {
                options.body = body;
            }
        }

        // Make the request to backend
        const response = await fetch(url, options);

        // Get response data
        const data = await response.text();

        // Create Next.js response
        const nextResponse = new NextResponse(data, {
            status: response.status,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Forward Set-Cookie headers from backend to frontend
        const setCookieHeaders = response.headers.getSetCookie();
        if (setCookieHeaders && setCookieHeaders.length > 0) {
            setCookieHeaders.forEach(cookie => {
                nextResponse.headers.append('Set-Cookie', cookie);
            });
        }

        return nextResponse;
    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json(
            { error: 'Failed to proxy request' },
            { status: 500 }
        );
    }
}
