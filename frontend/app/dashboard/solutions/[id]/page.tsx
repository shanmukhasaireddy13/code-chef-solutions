import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import SolutionViewClient from './SolutionViewClient';

import ConnectionError from '../../../components/ConnectionError';
import { API_ROUTES } from '@/lib/api';

import { cache } from 'react';

export const dynamic = 'force-dynamic';

const getSolution = cache(async (id: string) => {
  try {
    const cookieStore = await cookies();
    const jwtCookie = cookieStore.get('jwt');

    if (!jwtCookie) {
      redirect('/');
    }

    const response = await fetch(API_ROUTES.SOLUTIONS.FULL(id), {
      headers: {
        'Cookie': `jwt=${jwtCookie.value}`
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error(`Failed to fetch solution: ${response.status} ${response.statusText}`);
      const text = await response.text();
      console.error('Response body:', text);
      return null;
    }

    const data = await response.json();
    console.log('Fetched solution data:', data ? 'Found' : 'Empty');
    return data;
  } catch (error: any) {
    // Check if it's a connection error (fetch failed)
    if (error.cause?.code === 'ECONNREFUSED' || error.message?.includes('fetch failed')) {
      return 'CONNECTION_ERROR';
    }
    console.error('Error fetching solution:', error);
    return null;
  }
});

export default async function SolutionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const solution = await getSolution(id);

  if (solution === 'CONNECTION_ERROR') {
    return <ConnectionError healthUrl={API_ROUTES.HEALTH} />;
  }

  if (!solution) {
    redirect('/dashboard/solutions');
  }

  return <SolutionViewClient solution={solution} />;
}
