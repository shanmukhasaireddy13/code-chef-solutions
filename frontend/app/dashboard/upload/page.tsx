import UploadSolutionsClient from './UploadSolutionsClient';

import { API_ROUTES } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default function UploadSolutionsPage() {
    return <UploadSolutionsClient contestsUrl={API_ROUTES.CONTESTS} solutionsUrl={API_ROUTES.SOLUTIONS.BASE} />;
}
