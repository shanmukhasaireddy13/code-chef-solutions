import { cookies } from 'next/headers';
import DashboardLayout from '../components/DashboardLayout';
import ConnectionError from '../components/ConnectionError';

import { cache } from 'react';

import { API_ROUTES } from '@/lib/api';

export const dynamic = 'force-dynamic';

const getUserData = cache(async () => {
    try {
        const cookieStore = await cookies();
        const jwtCookie = cookieStore.get('jwt');

        if (!jwtCookie) {
            return { credits: 0, name: 'Guest', role: 'user' };
        }

        const response = await fetch(API_ROUTES.USER.ME, {
            headers: {
                'Cookie': `jwt=${jwtCookie.value}`
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            return { credits: 0, name: 'Guest', role: 'user' };
        }

        const data = await response.json();
        return { 
            credits: data.credits || 0, 
            name: data.name || 'User', 
            role: data.role || 'user',
            hasSeenTour: data.hasSeenTour || false
        };
    } catch (error: any) {
        // Check if it's a connection error (fetch failed)
        if (error.cause?.code === 'ECONNREFUSED' || error.message?.includes('fetch failed')) {
            return 'CONNECTION_ERROR';
        }
        console.error('Error fetching user data:', error);
        return { credits: 0, name: 'Guest', role: 'user' };
    }
});

export default async function Layout({ children }: { children: React.ReactNode }) {
    const userData = await getUserData();

    if (userData === 'CONNECTION_ERROR') {
        return <ConnectionError healthUrl={API_ROUTES.HEALTH} />;
    }

    return (
        <DashboardLayout userData={userData}>
            {children}
        </DashboardLayout>
    );
}
