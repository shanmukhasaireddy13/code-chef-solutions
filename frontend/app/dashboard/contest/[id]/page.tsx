import { cookies } from 'next/headers';
import ContestClient from './ContestClient';
import ConnectionError from '../../../components/ConnectionError';
import { API_ROUTES } from '@/lib/api';

export const dynamic = 'force-dynamic';

async function getUserData() {
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
        return data; // Returns { credits, purchasedSolutions, ... }
    } catch (error: any) {
        // Check if it's a connection error (fetch failed)
        if (error.cause?.code === 'ECONNREFUSED' || error.message?.includes('fetch failed')) {
            return 'CONNECTION_ERROR';
        }
        console.error('Error fetching user data:', error);
        return null;
    }
}

export default async function ContestPage({ params }: { params: Promise<{ id: string }> }) {
    const data = await getUserData();
    const { id } = await params;

    if (data === 'CONNECTION_ERROR') {
        return <ConnectionError healthUrl={API_ROUTES.HEALTH} />;
    }

    return (
        <ContestClient
            contestId={id}
            initialCredits={data?.credits || 0}
            purchasedSolutionIds={data?.purchasedSolutions || []}
            contestProblemsUrl={API_ROUTES.CONTEST_PROBLEMS(id)}
            activeOffersUrl={API_ROUTES.OFFERS.ACTIVE}
            validateOfferUrl={API_ROUTES.OFFERS.VALIDATE}
            buyCartUrl={API_ROUTES.SOLUTIONS.BUY_CART}
        />
    );
}
