import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_ROUTES } from '@/lib/api';

export async function POST() {
    try {
        const cookieStore = await cookies();

        // Clear the jwt cookie
        cookieStore.delete('jwt');

        // Optional: Call backend logout if needed, but clearing cookie is usually enough for JWT
        // await fetch(API_ROUTES.AUTH.LOGOUT, { method: 'POST' });

        return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json({ message: 'Logout failed' }, { status: 500 });
    }
}
