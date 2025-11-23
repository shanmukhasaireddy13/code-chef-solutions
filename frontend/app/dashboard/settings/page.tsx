import { cookies } from 'next/headers';
import SettingsClient from './SettingsClient';

import ConnectionError from '../../components/ConnectionError';
import { API_ROUTES } from '@/lib/api';

export const dynamic = 'force-dynamic';

async function getUser() {
    try {
        const cookieStore = await cookies();
        const jwtCookie = cookieStore.get('jwt');

        if (!jwtCookie) {
            return null;
        }

        const response = await fetch(API_ROUTES.USER.ME, {
            headers: {
                'Cookie': `jwt=${jwtCookie.value}`
            },
            next: { revalidate: 60 }
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}

async function getTransactions() {
    try {
        const cookieStore = await cookies();
        const jwtCookie = cookieStore.get('jwt');

        if (!jwtCookie) {
            return [];
        }

        const response = await fetch(API_ROUTES.USER.TRANSACTIONS, {
            headers: {
                'Cookie': `jwt=${jwtCookie.value}`
            },
            next: { revalidate: 60 }
        });

        if (!response.ok) {
            return [];
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return [];
    }
}

async function getUserData() {
    try {
        const [userDataResult, transactionsResult] = await Promise.all([
            getUser(),
            getTransactions()
        ]);

        const userData = userDataResult || { name: '', email: '' };
        const transactionsList = transactionsResult || [];

        return {
            user: { name: userData.name || '', email: userData.email || '' },
            transactions: transactionsList
        };
    } catch (error: any) {
        // Check if it's a connection error (fetch failed)
        if (error.cause?.code === 'ECONNREFUSED' || error.message?.includes('fetch failed')) {
            return 'CONNECTION_ERROR';
        }
        console.error('Error fetching user data:', error);
        return { user: { name: '', email: '' }, transactions: [] };
    }
}

export default async function SettingsPage() {
    const data = await getUserData();

    if (data === 'CONNECTION_ERROR') {
        return <ConnectionError healthUrl={API_ROUTES.HEALTH} />;
    }

    const { user, transactions } = data;

    return <SettingsClient
        initialName={user.name}
        initialEmail={user.email}
        initialTransactions={transactions}
        profileUrl={API_ROUTES.USER.PROFILE}
    />;
}
