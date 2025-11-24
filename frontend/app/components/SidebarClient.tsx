"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { LayoutGrid, BookOpen, Settings, LogOut, ChevronLeft, ChevronRight, Wallet, Plus, BarChart3, MessageSquare, HelpCircle, Tag } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface SidebarClientProps {
    initialCredits: number;
    userName: string;
    role: string;
    isCollapsed: boolean;
    toggleSidebar: () => void;
}

export default function SidebarClient({ initialCredits, userName, role, isCollapsed, toggleSidebar }: SidebarClientProps) {
    const [credits, setCredits] = useState(initialCredits);
    const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handleCreditsUpdate = (event: CustomEvent) => {
            setCredits(event.detail.credits);
        };

        window.addEventListener('creditsUpdated', handleCreditsUpdate as EventListener);

        return () => {
            window.removeEventListener('creditsUpdated', handleCreditsUpdate as EventListener);
        };
    }, []);

    const searchParams = useSearchParams();
    const isTourActive = searchParams.get('tour') === 'true';

    // Auto-close sidebar after 5 seconds of inactivity (but NOT if modal is open or tour is active)
    useEffect(() => {
        if (!isCollapsed && !isTourActive) {
            autoCloseTimerRef.current = setTimeout(() => {
                toggleSidebar();
            }, 5000);
        }

        return () => {
            if (autoCloseTimerRef.current) {
                clearTimeout(autoCloseTimerRef.current);
            }
        };
    }, [isCollapsed, toggleSidebar, isTourActive]);

    // Reset timer on user interaction (but NOT if modal is open or tour is active)
    const handleInteraction = () => {
        if (!isCollapsed && autoCloseTimerRef.current && !isTourActive) {
            clearTimeout(autoCloseTimerRef.current);
            autoCloseTimerRef.current = setTimeout(() => {
                toggleSidebar();
            }, 5000);
        }
    };

    const handleAddCredits = () => {
        // Navigate to payment page
        window.location.href = '/payment';
    };

    return (
        <motion.div
            initial={false}
            animate={{ width: isCollapsed ? 80 : 288 }}
            transition={{
                duration: isCollapsed ? 0.3 : 0.4,
                ease: isCollapsed ? [0.32, 0, 0.67, 0] : [0.23, 1, 0.32, 1]
            }}
            onMouseEnter={handleInteraction}
            onMouseMove={handleInteraction}
            className="h-screen bg-zinc-50/80 backdrop-blur-xl border-r border-zinc-200 text-zinc-900 flex flex-col shadow-sm fixed left-0 top-0 z-50 overflow-hidden"
        >
            {/* Mac-style Header / Toggle */}
            <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-6'}`}>
                <button
                    onClick={toggleSidebar}
                    className="group focus:outline-none p-2 rounded-lg hover:bg-black/5 transition-colors relative w-10 h-10 flex items-center justify-center"
                >
                    <div className="relative w-6 h-6 flex items-center justify-center">
                        {/* Red Dot */}
                        <motion.div
                            animate={{
                                x: isCollapsed ? 0 : -14,
                                y: isCollapsed ? -4 : 0,
                                scale: isCollapsed ? 1 : 1,
                                rotate: isCollapsed ? 0 : 0
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="absolute w-3 h-3 rounded-full bg-red-500 border border-red-600/20 shadow-sm z-30"
                        />
                        {/* Yellow Dot */}
                        <motion.div
                            animate={{
                                x: isCollapsed ? 4 : 0,
                                y: isCollapsed ? 4 : 0,
                                scale: isCollapsed ? 1 : 1,
                                rotate: isCollapsed ? 120 : 0
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.05 }}
                            className="absolute w-3 h-3 rounded-full bg-yellow-500 border border-yellow-600/20 shadow-sm z-20"
                        />
                        {/* Green Dot */}
                        <motion.div
                            animate={{
                                x: isCollapsed ? -4 : 14,
                                y: isCollapsed ? 4 : 0,
                                scale: isCollapsed ? 1 : 1,
                                rotate: isCollapsed ? 240 : 0
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                            className="absolute w-3 h-3 rounded-full bg-green-500 border border-green-600/20 shadow-sm z-10"
                        />

                        {/* Orbiting Ring Effect in Collapsed State */}
                        <AnimatePresence>
                            {isCollapsed && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
                                    animate={{ opacity: 1, scale: 1.4, rotate: 180 }}
                                    exit={{ opacity: 0, scale: 0.5, rotate: 360 }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                    className="absolute inset-0 rounded-full border border-zinc-300/50"
                                />
                            )}
                        </AnimatePresence>
                    </div>
                </button>

                <AnimatePresence>
                    {!isCollapsed && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="text-xs font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap"
                        >
                            Menu
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            {/* User Profile / Credits Section */}
            {role !== 'admin' && (
                <div className="px-4 mb-6">
                    <motion.div
                        layout
                        className={`bg-white/50 border border-zinc-200/50 rounded-2xl overflow-hidden relative ${isCollapsed ? 'h-14' : 'h-20'}`}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    >
                        <AnimatePresence mode="popLayout">
                            {!isCollapsed ? (
                                <motion.div
                                    key="expanded"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute inset-0 p-4 flex items-center justify-between"
                                >
                                    <div>
                                        <p className="text-xs text-zinc-500 font-medium mb-0.5">Credits</p>
                                        <p className="text-2xl font-bold text-zinc-900">{credits}</p>
                                    </div>
                                    <button
                                        id="btn-add-credits"
                                        onClick={handleAddCredits}
                                        className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.button
                                    key="collapsed"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    onClick={handleAddCredits}
                                    className="absolute inset-0 w-full h-full flex flex-col items-center justify-center hover:bg-blue-50/50 transition-colors group"
                                >
                                    <span className="text-xs font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">{credits}</span>
                                    <Plus className="w-3 h-3 text-zinc-400 group-hover:text-blue-500 transition-colors" />
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1">
                <NavItem id="nav-dashboard" href="/dashboard" icon={LayoutGrid} label="Dashboard" isCollapsed={isCollapsed} />
                {role === 'admin' ? (
                    <>
                        <NavItem id="nav-upload" href="/dashboard/upload" icon={BookOpen} label="Upload Solutions" isCollapsed={isCollapsed} />
                        <NavItem id="nav-analytics" href="/dashboard/analytics" icon={BarChart3} label="Analytics" isCollapsed={isCollapsed} />
                        <NavItem id="nav-concerns" href="/dashboard/concerns" icon={MessageSquare} label="User Concerns" isCollapsed={isCollapsed} />
                        <NavItem id="nav-offers" href="/dashboard/offers" icon={Tag} label="Offers & Coupons" isCollapsed={isCollapsed} />
                    </>
                ) : (
                    <>
                        <NavItem id="nav-solutions" href="/dashboard/solutions" icon={BookOpen} label="My Solutions" isCollapsed={isCollapsed} />
                        <NavItem id="nav-help" href="/dashboard/help" icon={HelpCircle} label="Help & Support" isCollapsed={isCollapsed} />
                    </>
                )}
                <NavItem id="nav-settings" href="/dashboard/settings" icon={Settings} label="Settings" isCollapsed={isCollapsed} />
            </nav>

            {/* Footer / User Info */}
            <div className="p-4 border-t border-zinc-200/50">
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                    <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-sm font-bold text-zinc-500 flex-shrink-0">
                        {userName.charAt(0).toUpperCase()}
                    </div>
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                className="flex-1 overflow-hidden whitespace-nowrap"
                            >
                                <p className="text-sm font-medium text-zinc-900 truncate">{userName}</p>
                                <p className="text-xs text-zinc-500 truncate">Pro Member</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

        </motion.div>
    );
}

function NavItem({ id, href, icon: Icon, label, isCollapsed }: { id?: string, href: string, icon: any, label: string, isCollapsed: boolean }) {
    const searchParams = useSearchParams();
    const isTourActive = searchParams.get('tour') === 'true';
    const finalHref = isTourActive ? `${href}?tour=true` : href;

    return (
        <Link
            id={id}
            href={finalHref}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-black/5 transition-all group ${isCollapsed ? 'justify-center' : ''
                }`}
            title={isCollapsed ? label : ''}
        >
            <Icon className={`w-5 h-5 transition-colors group-hover:text-blue-600 ${isCollapsed ? 'w-6 h-6' : ''}`} strokeWidth={1.5} />
            <AnimatePresence>
                {!isCollapsed && (
                    <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="font-medium text-sm whitespace-nowrap overflow-hidden"
                    >
                        {label}
                    </motion.span>
                )}
            </AnimatePresence>
        </Link>
    );
}
