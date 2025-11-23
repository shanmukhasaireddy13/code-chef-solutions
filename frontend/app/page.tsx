"use client";

import { useState, useEffect } from 'react';
import { ArrowRight, Code, CheckCircle, Zap, Star, Users, Shield, ChevronDown, Terminal, Cpu, Globe } from 'lucide-react';
import dynamic from 'next/dynamic';
const AuthModal = dynamic(() => import('./components/AuthModal'), { ssr: false });
import { API_ROUTES } from '@/lib/api';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    useEffect(() => {
        // Check for referral params
        const params = new URLSearchParams(window.location.search);
        const ref = params.get('ref');
        const action = params.get('action');

        if (ref) {
            localStorage.setItem('referralCode', ref);
        }

        if (action === 'signup') {
            setIsAuthModalOpen(true);
        }
    }, []);

    return (
        <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
            {/* Background Gradients - Subtle Blue only */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 border-b border-zinc-100 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 font-bold text-xl tracking-tight"
                    >
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                            <Code className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-zinc-900">CodeChef<span className="text-blue-600">Sol</span></span>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-8"
                    >
                        <div className="hidden md:flex items-center gap-6">
                            {['Solutions', 'Pricing', 'Community'].map((item) => (
                                <button key={item} className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors relative group">
                                    {item}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full" />
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setIsAuthModalOpen(true)}
                            className="relative group px-6 py-2.5 rounded-full overflow-hidden shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all"
                        >
                            <span className="absolute inset-0 bg-zinc-900 transition-all group-hover:scale-105" />
                            <span className="relative text-sm font-medium text-white">Get Started</span>
                        </button>
                    </motion.div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative pt-32 pb-20 px-6 z-10">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-8 border border-blue-100"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        New: Advanced DP Solutions Added
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-6xl md:text-8xl font-bold tracking-tight mb-8 text-zinc-900"
                    >
                        Master Coding <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
                            Like a Pro
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-xl text-zinc-500 max-w-2xl mx-auto mb-12 leading-relaxed"
                    >
                        Unlock premium, detailed solutions for CodeChef problems.
                        Optimized algorithms, clear explanations, and code in C++, Java, and Python.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <button
                            onClick={() => setIsAuthModalOpen(true)}
                            className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-semibold transition-all hover:bg-blue-700 hover:scale-105 hover:shadow-xl hover:shadow-blue-600/20 flex items-center justify-center gap-2"
                        >
                            Start Learning Now
                            <ArrowRight className="w-5 h-5" />
                        </button>
                        <button className="w-full sm:w-auto px-8 py-4 bg-white text-zinc-900 border border-zinc-200 rounded-2xl font-semibold transition-all hover:bg-zinc-50 hover:border-zinc-300 shadow-sm">
                            View Sample Solution
                        </button>
                    </motion.div>

                    {/* Floating Elements */}
                    <motion.div style={{ y: y1 }} className="absolute top-40 left-10 hidden lg:block opacity-10 pointer-events-none">
                        <Terminal className="w-24 h-24 text-blue-600" />
                    </motion.div>
                    <motion.div style={{ y: y2 }} className="absolute top-60 right-10 hidden lg:block opacity-10 pointer-events-none">
                        <Cpu className="w-24 h-24 text-blue-600" />
                    </motion.div>
                </div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="mt-32 max-w-5xl mx-auto"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 rounded-3xl bg-white border border-zinc-100 shadow-xl shadow-zinc-200/50">
                        {[
                            { label: 'Solutions', value: '500+', icon: Code },
                            { label: 'Active Users', value: '10k+', icon: Users },
                            { label: 'Accuracy', value: '100%', icon: CheckCircle },
                        ].map((stat, index) => (
                            <div key={index} className="text-center p-4">
                                <div className="w-12 h-12 mx-auto bg-blue-50 rounded-xl flex items-center justify-center mb-4 text-blue-600">
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <p className="text-4xl font-bold text-zinc-900 mb-1">{stat.value}</p>
                                <p className="text-zinc-500 font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Features Grid */}
                <div className="mt-32 max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 mb-6">Why Choose Us?</h2>
                        <p className="text-zinc-500 max-w-2xl mx-auto">We provide more than just code. We provide understanding.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Optimized Code',
                                description: 'Solutions written with time and space complexity in mind. Never get TLE again.',
                                icon: Zap,
                                color: 'blue'
                            },
                            {
                                title: 'Verified Correct',
                                description: 'Every solution is tested against the official test cases to ensure 100% accuracy.',
                                icon: CheckCircle,
                                color: 'blue'
                            },
                            {
                                title: 'Multi-Language',
                                description: 'Implementations available in C++, Java, Python, and JavaScript for every problem.',
                                icon: Globe,
                                color: 'blue'
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="p-8 rounded-3xl bg-white border border-zinc-100 shadow-lg shadow-zinc-200/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all group"
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all bg-blue-50 text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white`}>
                                    <feature.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-zinc-900">{feature.title}</h3>
                                <p className="text-zinc-500 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                googleAuthUrl={API_ROUTES.AUTH.GOOGLE}
            />
        </div>
    );
}
