"use client";

import { useState, useEffect } from 'react';
import { Users, Trophy, FileCode, Activity } from 'lucide-react';
import { toast } from 'sonner';

import { safeFetch, API_ROUTES } from '@/lib/api';

interface AnalyticsData {
    totalUsers: number;
    totalContests: number;
    activeContests: number;
    totalSolutions: number;
    totalRevenue: number;
    recentUsers: {
        _id: string;
        username: string;
        email: string;
        createdAt: string;
        credits: number;
    }[];
}

interface AnalyticsClientProps { }

export default function AnalyticsClient({ }: AnalyticsClientProps) {
    const analyticsUrl = API_ROUTES.ADMIN.ANALYTICS;
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const analyticsData = await safeFetch(analyticsUrl);
                setData(analyticsData);
            } catch (error) {
                console.error("Error fetching analytics:", error);
                toast.error("Error loading analytics");
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="max-w-7xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-zinc-900">Analytics Dashboard</h1>
                <p className="text-zinc-500">Overview of platform performance and user activity.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Users"
                    value={data.totalUsers}
                    icon={Users}
                    color="blue"
                />
                <StatCard
                    title="Active Contests"
                    value={data.activeContests}
                    subValue={`Total: ${data.totalContests}`}
                    icon={Activity}
                    color="green"
                />
                <StatCard
                    title="Total Solutions"
                    value={data.totalSolutions}
                    icon={FileCode}
                    color="purple"
                />
                <StatCard
                    title="Total Revenue"
                    value={`₹${(data.totalRevenue || 0).toLocaleString()}`}
                    icon={Trophy}
                    color="orange"
                />
            </div>

            {/* Recent Users Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-zinc-200">
                    <h2 className="text-lg font-semibold text-zinc-900">Recent Signups</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Credits</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200">
                            {data.recentUsers?.length > 0 ? (
                                data.recentUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-zinc-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900">{user.username}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">{user.credits}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-zinc-500">
                                        No recent users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, subValue, icon: Icon, color }: { title: string, value: string | number, subValue?: string, icon: any, color: string }) {
    const colorClasses = {
        blue: "bg-blue-50 text-blue-600",
        green: "bg-green-50 text-green-600",
        purple: "bg-purple-50 text-purple-600",
        orange: "bg-orange-50 text-orange-600",
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-zinc-500 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-zinc-900">{value}</h3>
                {subValue && <p className="text-xs text-zinc-400 mt-1">{subValue}</p>}
            </div>
            <div className={`p-3 rounded-xl ${colorClasses[color as keyof typeof colorClasses]}`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    );
}
