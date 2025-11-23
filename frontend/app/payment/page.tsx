import PaymentClient from './PaymentClient';
import { API_ROUTES } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default function PaymentPage() {
    return (
        <PaymentClient
            userMeUrl={API_ROUTES.USER.ME}
            validateOfferUrl={API_ROUTES.OFFERS.VALIDATE}
            createOrderUrl={API_ROUTES.PAYMENT.CREATE_ORDER}
        />
    );
}
