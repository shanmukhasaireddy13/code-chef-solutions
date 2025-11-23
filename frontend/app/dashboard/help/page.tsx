import HelpClient from './HelpClient';

import { API_ROUTES } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default function HelpPage() {
    return <HelpClient supportUrl={API_ROUTES.SUPPORT} />;
}
