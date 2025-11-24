import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';
import AdminDashboardClient from './AdminDashboardClient';
import { API_ROUTES } from '@/lib/api';
import { fetchServer } from '@/lib/server-utils';

export default async function DashboardPage() {
    let role = null;
    let initialContests = { live: [], upcoming: [] };
    let initialOffers = [];
    let referralStats = null;

    try {
        // Fetch user role
        const user = await fetchServer(API_ROUTES.USER.ME);
        role = user.role;

        // Fetch data based on role
        if (role === 'admin') {
            try {
                initialOffers = await fetchServer(API_ROUTES.ADMIN.ORDERS);
            } catch (e) {
                console.error("Failed to fetch admin orders", e);
            }
        } else {
            // Fetch user dashboard data in parallel
            const [contestsResult, offersResult, referralResult] = await Promise.allSettled([
                fetchServer(API_ROUTES.CONTESTS, { next: { revalidate: 60 } }),
                fetchServer(API_ROUTES.OFFERS.ACTIVE, { next: { revalidate: 60 } }),
                fetchServer(API_ROUTES.REFERRAL.STATS, { next: { revalidate: 60 } })
            ]);

            if (contestsResult.status === 'fulfilled') initialContests = contestsResult.value;
            else console.error("Failed to fetch contests", contestsResult.reason);

            if (offersResult.status === 'fulfilled') initialOffers = offersResult.value;
            else console.error("Failed to fetch offers", offersResult.reason);

            if (referralResult.status === 'fulfilled') referralStats = referralResult.value;
            else console.error("Failed to fetch referral stats", referralResult.reason);
        }

    } catch (error) {
        console.error("Failed to fetch user data", error);
        redirect('/');
    }
    return (
        <div className="max-w-7xl mx-auto">
            {role === 'admin' ? (
                <AdminDashboardClient
                    initialOrders={initialOffers}
                />
            ) : (
                <DashboardClient
                    initialContests={initialContests}
                    initialOffers={initialOffers}
                    referralStats={referralStats}
                />
            )}
        </div>
    );
}
