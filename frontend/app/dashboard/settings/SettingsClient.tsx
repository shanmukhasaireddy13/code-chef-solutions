"use client";

import { useState } from 'react';
import { User, Shield, CreditCard } from 'lucide-react';
import axios from 'axios';


interface SettingsClientProps {
    initialName: string;
    initialEmail: string;
    initialTransactions: any[];
    profileUrl: string;
}

export default function SettingsClient({ initialName, initialEmail, initialTransactions, profileUrl }: SettingsClientProps) {
    const [name, setName] = useState(initialName);
    const [email, setEmail] = useState(initialEmail);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Use initial data from SSR
    const transactions = initialTransactions;

    const handleSaveProfile = async () => {
        setLoading(true);
        setMessage('');
        try {
            await axios.put(
                profileUrl,
                { name, email },
                { withCredentials: true }
            );
            setMessage('Profile updated successfully!');
        } catch (error: any) {
            if (error.code === 'ERR_NETWORK' || error.response?.status === 503) {
                setMessage('Connection lost. Please check your internet connection.');
            } else {
                setMessage('Failed to update profile');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto pt-12 pb-12 px-4">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-zinc-200/60">
                {/* Window Header */}
                <div className="bg-zinc-100/80 backdrop-blur-md border-b border-zinc-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-600/20" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80 border border-yellow-600/20" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80 border border-green-600/20" />
                    </div>
                    <div className="text-xs font-medium text-zinc-500 flex items-center gap-2 font-mono">
                        system_preferences.app
                    </div>
                    <div className="w-12" /> {/* Spacer */}
                </div>

                {/* Window Content */}
                <div className="p-8 bg-zinc-50/50 min-h-[600px]">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-zinc-900">Settings</h1>
                            <p className="text-sm text-zinc-500">Manage your account and preferences</p>
                        </div>
                        {message && (
                            <div className={`px-4 py-2 rounded-lg text-sm font-medium ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {message}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Sidebar / Navigation within Settings */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-white rounded-xl border border-zinc-200 p-1 shadow-sm">
                                <button className="w-full flex items-center gap-3 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium transition-colors">
                                    <User className="w-4 h-4" />
                                    Profile & Security
                                </button>
                                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-zinc-600 hover:bg-zinc-50 rounded-lg text-sm font-medium transition-colors">
                                    <CreditCard className="w-4 h-4" />
                                    Billing & History
                                </button>
                            </div>

                            {/* Profile Card */}
                            <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm text-center">
                                <div className="w-20 h-20 bg-zinc-100 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-zinc-400">
                                    {name.charAt(0).toUpperCase()}
                                </div>
                                <h3 className="font-bold text-zinc-900">{name}</h3>
                                <p className="text-sm text-zinc-500 mb-4">{email}</p>
                                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Pro Member
                                </div>
                            </div>
                        </div>

                        {/* Main Form Area */}
                        <div className="lg:col-span-8 space-y-6">
                            {/* Profile Section */}
                            <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
                                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-zinc-100">
                                    <User className="w-4 h-4 text-zinc-400" />
                                    <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Personal Information</h2>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase">Full Name</label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-zinc-50 text-zinc-900 text-sm transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase">Email</label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-zinc-50 text-zinc-900 text-sm transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-2">
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={loading}
                                            className="px-4 py-2 bg-zinc-900 text-white hover:bg-zinc-800 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 shadow-lg shadow-zinc-900/10"
                                        >
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Security Section */}
                            <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
                                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-zinc-100">
                                    <Shield className="w-4 h-4 text-zinc-400" />
                                    <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Security</h2>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase">Change Password</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                type="password"
                                                placeholder="Current Password"
                                                className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-zinc-50 text-zinc-900 text-sm transition-all"
                                            />
                                            <div className="flex gap-2">
                                                <input
                                                    type="password"
                                                    placeholder="New Password"
                                                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-zinc-50 text-zinc-900 text-sm transition-all"
                                                />
                                                <button className="px-4 py-2 bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
                                                    Update
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Transactions */}
                            <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
                                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-zinc-100">
                                    <CreditCard className="w-4 h-4 text-zinc-400" />
                                    <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Recent Transactions</h2>
                                </div>

                                <div className="space-y-2">
                                    {transactions.length > 0 ? transactions.map((tx) => (
                                        <div key={tx.id} className="flex justify-between items-center p-3 hover:bg-zinc-50 rounded-lg transition-colors border border-transparent hover:border-zinc-100">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                    <CreditCard className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-zinc-900">{tx.description}</p>
                                                    <p className="text-xs text-zinc-500">{tx.date}</p>
                                                </div>
                                            </div>
                                            <span className={`text-sm font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                                {tx.amount}
                                            </span>
                                        </div>
                                    )) : (
                                        <p className="text-zinc-500 text-sm text-center py-4 italic">No transactions found</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
