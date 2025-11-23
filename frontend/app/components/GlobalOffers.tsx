"use client";

import { useState, useEffect } from 'react';
import { Tag, Clock, Copy, Check, Gift, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { API_ROUTES } from '@/lib/api';

interface Offer {
    _id: string;
    code: string;
    title: string;
    description: string;
    discountPercent: number;
    validUntil: string;
}

export default function GlobalOffers({ initialOffers = [] }: { initialOffers?: Offer[] }) {
    const [offers, setOffers] = useState<Offer[]>(initialOffers);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // We can keep the effect to fetch updates if needed, but for SSR we rely on initialOffers
    // If we want real-time updates, we can keep the fetch, but for now let's rely on SSR data
    // to match the "convert everything to SSR" request.
    // However, if the user navigates away and back, the page reloads and fetches fresh data.

    // If we want to support client-side updates (e.g. polling), we can keep a useEffect
    // but for now let's simplify.


    useEffect(() => {
        if (offers.length <= 1 || isPaused || showModal) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % offers.length);
        }, 6000);

        return () => clearInterval(interval);
    }, [offers.length, isPaused, showModal]);

    const handleCopy = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        toast.success("Coupon code copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    if (offers.length === 0) return null;

    const currentOffer = offers[currentIndex];

    return (
        <>
            {/* Compact Header Widget */}
            <motion.button
                onClick={() => setShowModal(true)}
                className="relative group flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-zinc-200/60 pl-2 pr-4 py-1.5 rounded-full shadow-sm hover:shadow-md transition-all hover:bg-white"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <div className="relative w-8 h-8 flex items-center justify-center bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full text-white shadow-inner overflow-hidden">
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
                    >
                        <Gift className="w-4 h-4" />
                    </motion.div>
                    <motion.div
                        className="absolute inset-0 bg-white/30"
                        animate={{
                            x: ['-100%', '100%'],
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 1.5,
                            repeatDelay: 2,
                            ease: "linear"
                        }}
                        style={{ skewX: -20 }}
                    />
                </div>

                <div className="text-left">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-800">Special Offer</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-violet-100 text-violet-700 rounded-full">
                            {currentOffer.discountPercent}% OFF
                        </span>
                    </div>
                    <p className="text-[10px] text-zinc-500 truncate max-w-[150px]">
                        {currentOffer.title}
                    </p>
                </div>
            </motion.button>

            {/* Detailed Modal Overlay */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-zinc-900/20 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/50"
                        >
                            {/* Decorative Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5" />
                            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-violet-500 to-fuchsia-600 opacity-10" />

                            {/* Close Button */}
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 p-2 bg-white/50 hover:bg-white rounded-full text-zinc-500 hover:text-zinc-900 transition-colors z-10"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <div className="relative p-8 text-center">
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", damping: 12 }}
                                    className="w-20 h-20 mx-auto bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-xl shadow-violet-500/20 mb-6 rotate-3"
                                >
                                    <Gift className="w-10 h-10 text-white" />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-100 text-violet-700 border border-violet-200 mb-4">
                                        <Sparkles className="w-3 h-3" />
                                        Limited Time Offer
                                    </span>

                                    <h3 className="text-2xl font-bold text-zinc-900 mb-2">
                                        {currentOffer.title}
                                    </h3>
                                    <p className="text-zinc-500 mb-8">
                                        {currentOffer.description}
                                    </p>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100 mb-6"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Coupon Code</span>
                                        {currentOffer.validUntil && (
                                            <span className="flex items-center gap-1 text-xs text-zinc-400">
                                                <Clock className="w-3 h-3" />
                                                Exp: {new Date(currentOffer.validUntil).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <code className="flex-1 bg-white border border-zinc-200 rounded-lg py-2.5 text-lg font-mono font-bold text-zinc-900 tracking-wider">
                                            {currentOffer.code}
                                        </code>
                                        <button
                                            onClick={() => handleCopy(currentOffer.code)}
                                            className="p-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg transition-colors active:scale-95"
                                        >
                                            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </motion.div>

                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    onClick={() => setShowModal(false)}
                                    className="text-sm font-medium text-zinc-400 hover:text-zinc-600 transition-colors"
                                >
                                    Maybe later
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
