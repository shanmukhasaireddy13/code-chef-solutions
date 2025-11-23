"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, RefreshCw, CheckCircle, Search, Terminal, ServerCrash, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
interface ConnectionErrorProps {
    onRetry?: () => void;
    message?: string;
    healthUrl: string;
}

export default function ConnectionError({ onRetry, message = "Connection interrupted", healthUrl }: ConnectionErrorProps) {
    const router = useRouter();
    const [status, setStatus] = useState<'error' | 'scanning' | 'success' | 'server_down'>('error');
    const [scanProgress, setScanProgress] = useState(0);

    const checkConnection = async () => {
        try {
            // Try to hit the backend health check
            const res = await fetch(healthUrl, {
                method: 'GET',
                cache: 'no-store',
                mode: 'cors'
            });
            return res.ok;
        } catch (error) {
            return false;
        }
    };

    const handleRetry = async () => {
        setStatus('scanning');
        setScanProgress(0);

        // Visual scanning progress
        const duration = 3000;
        const interval = 50;
        const steps = duration / interval;
        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            setScanProgress((currentStep / steps) * 90); // Go up to 90%

            if (currentStep >= steps) {
                clearInterval(timer);
                performCheck();
            }
        }, interval);
    };

    const performCheck = async () => {
        const isOnline = await checkConnection();
        setScanProgress(100);

        setTimeout(() => {
            if (isOnline) {
                setStatus('success');
                setTimeout(() => {
                    if (onRetry) {
                        onRetry();
                    } else {
                        window.location.reload();
                    }
                }, 1500);
            } else {
                setStatus('server_down');
            }
        }, 500);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-zinc-50 flex items-center justify-center p-6 font-sans">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden border border-zinc-200/60"
            >
                {/* Apple-style Window Header */}
                <div className="bg-zinc-100/80 backdrop-blur-md border-b border-zinc-200 px-4 py-3 flex items-center justify-between">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-600/20" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80 border border-yellow-600/20" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80 border border-green-600/20" />
                    </div>
                    <div className="text-xs font-medium text-zinc-500 flex items-center gap-2">
                        <Terminal className="w-3 h-3" />
                        network_diagnostic.exe
                    </div>
                    <div className="w-12" /> {/* Spacer for centering */}
                </div>

                {/* Main Content Area */}
                <div className="p-8 md:p-12 min-h-[400px] flex flex-col items-center justify-center relative">
                    <AnimatePresence mode="wait">
                        {status === 'error' && (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="text-center w-full"
                            >
                                <div className="relative w-32 h-32 mx-auto mb-8">
                                    <motion.div
                                        animate={{ rotate: [0, 10, -10, 0] }}
                                        transition={{ repeat: Infinity, duration: 5, repeatDelay: 1 }}
                                    >
                                        <WifiOff className="w-32 h-32 text-zinc-200" />
                                    </motion.div>
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute bottom-0 right-0 bg-red-500 text-white p-2 rounded-full shadow-lg"
                                    >
                                        <div className="w-2 h-2 bg-white rounded-full animate-ping absolute" />
                                        <div className="w-2 h-2 bg-white rounded-full relative" />
                                    </motion.div>
                                </div>

                                <h2 className="text-2xl font-bold text-zinc-900 mb-2">Connection Lost</h2>
                                <p className="text-zinc-500 mb-8 max-w-md mx-auto">
                                    {message} The server seems unreachable. Run diagnostics to attempt reconnection.
                                </p>

                                <button
                                    onClick={handleRetry}
                                    className="group relative inline-flex items-center gap-3 px-8 py-4 bg-zinc-900 text-white rounded-xl font-medium overflow-hidden transition-all hover:scale-105 hover:shadow-xl hover:shadow-zinc-900/20"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                                        Run Diagnostics
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </button>
                            </motion.div>
                        )}

                        {status === 'scanning' && (
                            <motion.div
                                key="scanning"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="w-full max-w-md"
                            >
                                <div className="relative h-64 bg-zinc-900 rounded-lg p-6 font-mono text-sm text-green-400 mb-8 overflow-hidden shadow-inner">
                                    {/* Code/Log Output */}
                                    <div className="space-y-2">
                                        <p>&gt; ping server.local...</p>
                                        <p className="text-yellow-400">&gt; checking_ports [80, 443, 5000]...</p>
                                        <p>&gt; analyzing_packets...</p>
                                        {scanProgress > 30 && <p>&gt; verifying_handshake...</p>}
                                        {scanProgress > 60 && <p className="text-blue-400">&gt; resolving_dns...</p>}
                                        {scanProgress > 80 && <p>&gt; establishing_secure_tunnel...</p>}
                                        <motion.span
                                            animate={{ opacity: [0, 1, 0] }}
                                            transition={{ repeat: Infinity, duration: 0.8 }}
                                            className="inline-block w-2 h-4 bg-green-400 align-middle"
                                        />
                                    </div>

                                    {/* Magnifying Glass Animation */}
                                    <motion.div
                                        animate={{
                                            x: [0, 200, 0, 150, 50],
                                            y: [0, 100, 50, 150, 20]
                                        }}
                                        transition={{ duration: 4, ease: "linear" }}
                                        className="absolute top-0 left-0 pointer-events-none"
                                    >
                                        <div className="relative">
                                            <Search className="w-16 h-16 text-white/20 drop-shadow-lg" strokeWidth={1.5} />
                                            <div className="absolute inset-0 bg-white/5 rounded-full blur-md" />
                                        </div>
                                    </motion.div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                        <span>System Scan</span>
                                        <span>{Math.round(scanProgress)}%</span>
                                    </div>
                                    <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                            style={{ width: `${scanProgress}%` }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {status === 'server_down' && (
                            <motion.div
                                key="server_down"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center w-full"
                            >
                                <div className="relative w-32 h-32 mx-auto mb-8">
                                    <motion.div
                                        animate={{
                                            y: [0, -10, 0],
                                            rotate: [0, -5, 5, 0]
                                        }}
                                        transition={{ duration: 4, repeat: Infinity }}
                                    >
                                        <ServerCrash className="w-32 h-32 text-zinc-300" />
                                    </motion.div>
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute top-0 right-0 bg-yellow-500 text-white p-2 rounded-full shadow-lg"
                                    >
                                        <AlertTriangle className="w-6 h-6" />
                                    </motion.div>
                                </div>

                                <h2 className="text-2xl font-bold text-zinc-900 mb-2">Server Unreachable</h2>
                                <p className="text-zinc-500 mb-8 max-w-md mx-auto">
                                    Looks like the server is down. We will try to get back soon.
                                </p>

                                <button
                                    onClick={handleRetry}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-zinc-900 border border-zinc-200 rounded-xl font-medium hover:bg-zinc-50 transition-all hover:scale-105"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Try Again
                                </button>
                            </motion.div>
                        )}

                        {status === 'success' && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                    className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6"
                                >
                                    <CheckCircle className="w-12 h-12 text-green-500" />
                                </motion.div>
                                <h2 className="text-2xl font-bold text-zinc-900 mb-2">Connection Established</h2>
                                <p className="text-zinc-500 mb-8">
                                    Compiling assets and redirecting to dashboard...
                                </p>
                                <div className="flex items-center justify-center gap-2 text-sm text-zinc-400">
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    <span>Redirecting...</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
