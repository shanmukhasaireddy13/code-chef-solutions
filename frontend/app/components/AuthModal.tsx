"use client";

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Chrome, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { API_ROUTES, NEXT_API_ROUTES } from '@/lib/api';


interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    googleAuthUrl: string;
}

function AuthModalContent({ isOpen, onClose, googleAuthUrl }: AuthModalProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [referralCode, setReferralCode] = useState('');

    useEffect(() => {
        // Check for referral code in URL or localStorage
        const refCode = searchParams.get('ref') || localStorage.getItem('referralCode');
        if (refCode) {
            setReferralCode(refCode);
            // If we found a code, default to signup unless explicitly logging in
            if (searchParams.get('action') === 'signup') {
                setIsLogin(false);
            }
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const endpoint = isLogin ? NEXT_API_ROUTES.LOGIN : NEXT_API_ROUTES.SIGNUP;
            const payload = isLogin
                ? { email, password }
                : { name, email, password, referralCode };

            // Use Next.js API route to proxy the request and set cookie on frontend domain
            const response = await axios.post(endpoint, payload, {
                withCredentials: true
            });

            // Force a full page reload to ensure cookies are available
            if (isLogin) {
                window.location.href = '/dashboard';
            } else {
                window.location.href = '/dashboard?tour=true';
            }
        } catch (err: any) {
            if (err.code === 'ERR_NETWORK' || err.response?.status === 503) {
                setError('Connection lost. Please check your internet connection.');
            } else {
                setError(err.response?.data?.message || 'An error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = googleAuthUrl;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-zinc-100"
                    >
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold text-zinc-900">
                                    {isLogin ? 'Welcome Back' : 'Create Account'}
                                </h2>
                                <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-zinc-500" />
                                </button>
                            </div>

                            <div className="flex gap-2 mb-8 bg-zinc-50 p-1 rounded-xl">
                                <button
                                    onClick={() => { setIsLogin(true); setError(''); }}
                                    className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${isLogin
                                        ? 'bg-white text-zinc-900 shadow-sm ring-1 ring-black/5'
                                        : 'text-zinc-500 hover:text-zinc-700'
                                        }`}
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => { setIsLogin(false); setError(''); }}
                                    className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${!isLogin
                                        ? 'bg-white text-zinc-900 shadow-sm ring-1 ring-black/5'
                                        : 'text-zinc-500 hover:text-zinc-700'
                                        }`}
                                >
                                    Sign Up
                                </button>
                            </div>

                            {error && (
                                <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {!isLogin && (
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-700 mb-1.5">Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-zinc-900 transition-all"
                                                placeholder="John Doe"
                                                required={!isLogin}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-zinc-900 transition-all"
                                            placeholder="you@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-zinc-900 transition-all"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                                </button>
                            </form>

                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-zinc-100"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-zinc-400">Or continue with</span>
                                </div>
                            </div>

                            <button
                                onClick={handleGoogleLogin}
                                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-all text-zinc-600 font-medium group"
                            >
                                <Chrome className="w-5 h-5 text-zinc-400 group-hover:text-blue-500 transition-colors" />
                                Google
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default function AuthModal({ isOpen, onClose, googleAuthUrl }: AuthModalProps & { googleAuthUrl: string }) {
    return (
        <Suspense fallback={null}>
            <AuthModalContent isOpen={isOpen} onClose={onClose} googleAuthUrl={googleAuthUrl} />
        </Suspense>
    );
}

// Force re-compilation
