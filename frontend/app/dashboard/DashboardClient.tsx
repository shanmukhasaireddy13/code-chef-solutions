"use client";

import Link from 'next/link';
import { Calendar, Clock, Trophy } from 'lucide-react';
import ReferralCard from '../components/ReferralCard';
import { useState } from 'react';

interface Contest {
    _id: string;
    name: string;
    startTime: string;
    endTime?: string;
    duration?: string;
    participants?: number;
    status: 'Live' | 'Upcoming';
}

import ConnectionError from '../components/ConnectionError';
import dynamic from 'next/dynamic';
const GlobalOffers = dynamic(() => import('../components/GlobalOffers'), { ssr: false });

interface DashboardClientProps {
    initialContests: {
        live: Contest[];
        upcoming: Contest[];
    };
    initialOffers: any[];
    referralStats: any;
}

export default function DashboardClient({ initialContests, initialOffers, referralStats }: DashboardClientProps) {
    const [liveContests] = useState<Contest[]>(initialContests.live || []);
    const [upcomingContests] = useState<Contest[]>(initialContests.upcoming || []);

    return (
        <div className="text-zinc-900 max-w-6xl mx-auto pt-12">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                    <p className="text-zinc-500">Welcome back! Here's what's happening.</p>
                </div>
                <div className="w-full md:w-auto" id="tour-global-offers">
                    <GlobalOffers initialOffers={initialOffers} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12" id="tour-contests-section">
                {/* Live Contests */}
                <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm" id="tour-live-contests">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-red-50 rounded-lg">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        </div>
                        <h2 className="text-xl font-bold">Live Contests</h2>
                    </div>

                    <div className="space-y-4">
                        {liveContests.length > 0 ? liveContests.map((contest, index) => (
                            <Link
                                key={contest._id}
                                id={index === 0 ? "tour-contest-card" : undefined}
                                href={`/dashboard/contest/${contest._id}?tour=true&tourStep=6`} // Persist tour state
                                className="block p-4 rounded-xl border border-zinc-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">{contest.name}</h3>
                                    <span className="text-xs font-medium px-2 py-1 bg-red-100 text-red-600 rounded-full flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        Ends in {contest.endTime}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-zinc-500">
                                    <span className="flex items-center gap-1">
                                        <Trophy className="w-4 h-4" />
                                        Rated
                                    </span>
                                    <span>•</span>
                                    <span>{contest.participants?.toLocaleString()} participating</span>
                                </div>
                            </Link>
                        )) : (
                            <p className="text-zinc-500 text-sm">No live contests at the moment.</p>
                        )}
                    </div>
                </div>

                {/* Upcoming Contests */}
                <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm" id="tour-upcoming-contests">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-bold">Upcoming Contests</h2>
                    </div>

                    <div className="space-y-4">
                        {upcomingContests.length > 0 ? upcomingContests.map((contest) => (
                            <div
                                key={contest._id}
                                className="p-4 rounded-xl border border-zinc-100 hover:border-zinc-200 transition-all"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-semibold text-lg">{contest.name}</h3>
                                    <button className="text-xs font-medium px-3 py-1 bg-zinc-900 text-white rounded-full hover:bg-zinc-700 transition-colors">
                                        Register
                                    </button>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-zinc-500">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {contest.startTime}
                                    </span>
                                    <span>•</span>
                                    <span>{contest.duration}</span>
                                </div>
                            </div>
                        )) : (
                            <p className="text-zinc-500 text-sm">No upcoming contests scheduled.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Referral Card */}
            <div className="mt-12" id="tour-referral">
                <ReferralCard stats={referralStats} />
            </div>
        </div>
    );
}
