import OffersClient from './OffersClient';

import { API_ROUTES } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default function OffersPage() {
    return <OffersClient offersUrl={API_ROUTES.ADMIN.OFFERS} />;
}
