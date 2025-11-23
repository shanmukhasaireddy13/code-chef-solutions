import { cookies } from 'next/headers';
import { API_BASE_URL } from './api';
export const runtime = "nodejs";

export async function getAuthHeaders() {
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt')?.value;

    return {
        'Content-Type': 'application/json',
        'Cookie': `jwt=${token || ''}`,
        'Authorization': `Bearer ${token || ''}`
    };
}

export async function fetchServer(endpoint: string, options: RequestInit = {}) {
    const headers = await getAuthHeaders();

    const res = await fetch(endpoint, {
        ...options,
        headers: {
            ...headers,
            ...options.headers,
        },
        // Default to no-store if not specified, but allow overriding
        cache: options.cache || (options.next ? undefined : 'no-store'),
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch ${endpoint}: ${res.statusText}`);
    }

    return res.json();
}
