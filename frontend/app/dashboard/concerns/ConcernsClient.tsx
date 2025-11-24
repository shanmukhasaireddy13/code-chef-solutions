"use client";

import { useState, useEffect } from 'react';
import { MessageSquare, CheckCircle, Clock, Reply } from 'lucide-react';
import { toast } from 'sonner';
import { API_ROUTES } from '@/lib/api';

interface Ticket {
    _id: string;
    user: {
        username: string;
        email: string;
    };
    subject: string;
    message: string;
    status: 'Open' | 'Resolved';
    adminResponse?: string;
    createdAt: string;
}

interface ConcernsClientProps { }

export default function ConcernsClient({ }: ConcernsClientProps) {
    const supportUrl = API_ROUTES.ADMIN.SUPPORT;
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyMessage, setReplyMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const response = await fetch(supportUrl, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setTickets(data);
            }
        } catch (error) {
            console.error("Error fetching tickets:", error);
            toast.error("Failed to load tickets");
        }
    };

    const handleReply = async (ticketId: string) => {
        setLoading(true);
        try {
            const response = await fetch(`${supportUrl}/${ticketId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ adminResponse: replyMessage }),
            });

            if (response.ok) {
                toast.success("Reply sent successfully!");
                setReplyingTo(null);
                setReplyMessage('');
                fetchTickets();
            } else {
                toast.error("Failed to send reply");
            }
        } catch (error) {
            console.error("Error sending reply:", error);
            toast.error("Error sending reply");
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
                        user_concerns.app
                    </div>
                    <div className="w-12" /> {/* Spacer */}
                </div>

                {/* Window Content */}
                <div className="p-8 bg-zinc-50/50 min-h-[600px]">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-zinc-900">User Concerns</h1>
                            <p className="text-sm text-zinc-500">Manage and respond to user support tickets.</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {tickets.map((ticket) => (
                            <div key={ticket._id} className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm hover:border-zinc-300 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-zinc-900">{ticket.subject}</h3>
                                        <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1 uppercase tracking-wide font-medium">
                                            <span className="text-zinc-700">{ticket.user?.username}</span>
                                            <span>•</span>
                                            <span>{ticket.user?.email}</span>
                                            <span>•</span>
                                            <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${ticket.status === 'Resolved'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {ticket.status === 'Resolved' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                        {ticket.status}
                                    </span>
                                </div>

                                <div className="bg-zinc-50 rounded-xl p-4 mb-4 text-zinc-800 text-sm border border-zinc-100">
                                    {ticket.message}
                                </div>

                                {ticket.adminResponse ? (
                                    <div className="border-t border-zinc-100 pt-4">
                                        <p className="text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wider">Your Response</p>
                                        <p className="text-zinc-700 text-sm">{ticket.adminResponse}</p>
                                    </div>
                                ) : (
                                    <div>
                                        {replyingTo === ticket._id ? (
                                            <div className="space-y-3">
                                                <textarea
                                                    value={replyMessage}
                                                    onChange={(e) => setReplyMessage(e.target.value)}
                                                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-zinc-900 text-sm transition-all"
                                                    rows={3}
                                                    placeholder="Type your response..."
                                                />
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleReply(ticket._id)}
                                                        disabled={loading || !replyMessage.trim()}
                                                        className="bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 shadow-lg shadow-zinc-900/10"
                                                    >
                                                        {loading ? 'Sending...' : 'Send Reply'}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setReplyingTo(null);
                                                            setReplyMessage('');
                                                        }}
                                                        className="bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setReplyingTo(ticket._id)}
                                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                                            >
                                                <Reply className="w-4 h-4" />
                                                Reply
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}

                        {tickets.length === 0 && (
                            <div className="text-center py-12 text-zinc-500 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                                No tickets found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
