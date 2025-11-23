import { cookies } from 'next/headers';
import MySolutionsClient from './MySolutionsClient';

import ConnectionError from '../../components/ConnectionError';
import { API_ROUTES } from '@/lib/api';

import { cache } from 'react';

export const dynamic = 'force-dynamic';

const getMySolutions = cache(async () => {
    try {
        const cookieStore = await cookies();
        const jwtCookie = cookieStore.get('jwt');

        if (!jwtCookie) {
            return [];
        }

        const response = await fetch(`${API_ROUTES.SOLUTIONS.BASE}/my-solutions`, {
            headers: {
                'Cookie': `jwt=${jwtCookie.value}`
            },
            next: { revalidate: 60 }
        });

        if (!response.ok) {
            return [];
        }

        return await response.json();
    } catch (error: any) {
        // Check if it's a connection error (fetch failed)
        if (error.cause?.code === 'ECONNREFUSED' || error.message?.includes('fetch failed')) {
            return 'CONNECTION_ERROR';
        }
        console.error('Error fetching solutions:', error);
        return [];
    }
});

export default async function MySolutionsPage() {
    const solutions = await getMySolutions();

    if (solutions === 'CONNECTION_ERROR') {
        return <ConnectionError healthUrl={API_ROUTES.HEALTH} />;
    }

    return <MySolutionsClient initialSolutions={solutions} contestsUrl={API_ROUTES.CONTESTS} />;
}
