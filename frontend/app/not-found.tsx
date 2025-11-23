"use client";

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Search, FileCode, FolderOpen, AlertCircle, Terminal, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function NotFound() {
    const [searchStep, setSearchStep] = useState(0);
    const [isSearching, setIsSearching] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => {
            setSearchStep((prev) => {
                if (prev >= 3) {
                    clearInterval(timer);
                    setIsSearching(false);
                    return prev;
                }
                return prev + 1;
            });
        }, 1500);
        return () => clearInterval(timer);
    }, []);

    const files = [
        { name: 'src', type: 'folder' },
        { name: 'components', type: 'folder' },
        { name: 'pages', type: 'folder' },
        { name: 'utils', type: 'folder' },
        { name: 'requested_page.tsx', type: 'file', status: 'missing' },
    ];

    return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 font-sans">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden border border-zinc-200/60 flex flex-col md:flex-row min-h-[500px]"
            >
                {/* Sidebar / File Tree */}
                <div className="w-full md:w-64 bg-zinc-50 border-r border-zinc-200 p-4 hidden md:flex flex-col">
                    <div className="flex gap-2 mb-6">
                        <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-600/20" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80 border border-yellow-600/20" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80 border border-green-600/20" />
                    </div>
                    <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 pl-2">Explorer</div>
                    <div className="space-y-1">
                        {files.map((file, i) => (
                            <motion.div
                                key={file.name}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-sm ${file.status === 'missing' ? 'bg-red-50 text-red-600' : 'text-zinc-600 hover:bg-zinc-100'
                                    }`}
                            >
                                {file.type === 'folder' ? (
                                    <FolderOpen className="w-4 h-4 text-blue-400" />
                                ) : (
                                    <FileCode className="w-4 h-4" />
                                )}
                                {file.name}
                                {file.status === 'missing' && (
                                    <AlertCircle className="w-3 h-3 ml-auto" />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    {/* Tab Bar */}
                    <div className="h-10 bg-zinc-100 border-b border-zinc-200 flex items-center px-4">
                        <div className="bg-white px-4 py-1.5 rounded-t-lg border-x border-t border-zinc-200 text-xs font-medium text-red-500 flex items-center gap-2 translate-y-[1px]">
                            <FileCode className="w-3 h-3" />
                            requested_page.tsx
                            <span className="ml-2 text-zinc-300">×</span>
                        </div>
                    </div>

                    {/* Editor Area */}
                    <div className="flex-1 p-8 flex flex-col items-center justify-center relative bg-white">
                        <AnimatePresence mode="wait">
                            {isSearching ? (
                                <motion.div
                                    key="searching"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center"
                                >
                                    <div className="relative w-24 h-24 mx-auto mb-6">
                                        <Search className="w-24 h-24 text-zinc-200" />
                                        <motion.div
                                            animate={{
                                                rotate: [0, 360],
                                                scale: [1, 1.1, 1]
                                            }}
                                            transition={{ duration: 3, repeat: Infinity }}
                                            className="absolute inset-0 border-4 border-blue-500/30 border-t-blue-500 rounded-full"
                                        />
                                    </div>
                                    <div className="font-mono text-sm text-zinc-500 space-y-2">
                                        <p className={searchStep >= 0 ? 'opacity-100' : 'opacity-30'}>
                                            &gt; searching_directory...
                                        </p>
                                        <p className={searchStep >= 1 ? 'opacity-100' : 'opacity-30'}>
                                            &gt; checking_routes...
                                        </p>
                                        <p className={searchStep >= 2 ? 'opacity-100' : 'opacity-30'}>
                                            &gt; verifying_developer_commits...
                                        </p>
                                        <p className={searchStep >= 3 ? 'text-red-500 font-bold' : 'opacity-0'}>
                                            &gt; error: page_never_created (404)
                                        </p>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="not-found"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center max-w-md"
                                >
                                    <div className="w-20 h-20 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-6 relative overflow-hidden">
                                        <FileCode className="w-10 h-10 text-zinc-400" />
                                        <motion.div
                                            initial={{ x: '-100%' }}
                                            animate={{ x: '100%' }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                                        />
                                        <div className="absolute inset-0 border-2 border-red-500/20 rounded-2xl" />
                                    </div>
                                    <h1 className="text-3xl font-bold text-zinc-900 mb-2">Page Not Found</h1>
                                    <p className="text-zinc-500 mb-8">
                                        This page was never created by the developer. It simply does not exist in this reality.
                                    </p>

                                    <div className="flex gap-4 justify-center">
                                        <Link
                                            href="/"
                                            className="group relative inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-xl font-medium overflow-hidden transition-all hover:scale-105"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            <span className="relative z-10 flex items-center gap-2">
                                                <Home className="w-4 h-4" />
                                                Return Home
                                            </span>
                                        </Link>
                                        <button
                                            onClick={() => window.history.back()}
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-zinc-900 border border-zinc-200 rounded-xl font-medium hover:bg-zinc-50 transition-all hover:scale-105"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            Go Back
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
