"use client";

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';
import ConnectionError from './components/ConnectionError';
import { API_ROUTES } from '@/lib/api';


export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    if (error.message === 'CONNECTION_ERROR' || error.message.includes('fetch failed')) {
        return <ConnectionError onRetry={reset} healthUrl={API_ROUTES.HEALTH} />;
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
            <div className="text-center max-w-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-red-500/10"
                >
                    <AlertTriangle className="w-10 h-10 text-red-600" />
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl font-bold text-zinc-900 mb-4"
                >
                    Something went wrong!
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-zinc-500 mb-10"
                >
                    We apologize for the inconvenience. An unexpected error has occurred.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <button
                        onClick={reset}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-all hover:scale-105 active:scale-95"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </button>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-zinc-900 border border-zinc-200 rounded-xl font-medium hover:bg-zinc-50 transition-all hover:scale-105 active:scale-95"
                    >
                        <Home className="w-4 h-4" />
                        Back to Home
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
