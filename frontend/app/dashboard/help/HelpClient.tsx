"use client";

import { useState, useEffect } from 'react';
import { Send, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
interface Ticket {
    _id: string;
    subject: string;
    message: string;
    status: 'Open' | 'Resolved';
    adminResponse?: string;
    createdAt: string;
}

interface HelpClientProps {
    supportUrl: string;
}

export default function HelpClient({ supportUrl }: HelpClientProps) {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [newTicket, setNewTicket] = useState({ subject: '', message: '' });
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
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(supportUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(newTicket),
            });

            if (response.ok) {
                toast.success("Ticket submitted successfully!");
                setNewTicket({ subject: '', message: '' });
                fetchTickets();
            } else {
                toast.error("Failed to submit ticket");
            }
        } catch (error) {
            console.error("Error submitting ticket:", error);
            toast.error("Error submitting ticket");
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
                        help_center.app
                    </div>
                    <div className="w-12" /> {/* Spacer */}
                </div>

                {/* Window Content */}
                <div className="p-8 bg-zinc-50/50 min-h-[600px]">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-zinc-900">Help & Support</h1>
                            <p className="text-sm text-zinc-500">Submit a ticket for any issues or questions.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Submit Ticket Form */}
                        <div className="lg:col-span-6 space-y-6">
                            <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
                                <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Send className="w-4 h-4 text-blue-600" />
                                    New Ticket
                                </h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase">Subject</label>
                                        <input
                                            type="text"
                                            value={newTicket.subject}
                                            onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                                            required
                                            className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-zinc-50 text-zinc-900 text-sm transition-all"
                                            placeholder="Brief description of the issue"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase">Message</label>
                                        <textarea
                                            value={newTicket.message}
                                            onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                                            required
                                            rows={5}
                                            className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-zinc-50 text-zinc-900 text-sm transition-all"
                                            placeholder="Describe your issue in detail..."
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-zinc-900/10"
                                    >
                                        {loading ? 'Submitting...' : 'Submit Ticket'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Ticket History */}
                        <div className="lg:col-span-6 space-y-6">
                            <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
                                <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-zinc-400" />
                                    Your Tickets
                                </h2>
                                <div className="space-y-4">
                                    {tickets.length === 0 ? (
                                        <div className="text-center py-8 text-zinc-500 bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
                                            No tickets found.
                                        </div>
                                    ) : (
                                        tickets.map((ticket) => (
                                            <div key={ticket._id} className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm hover:border-zinc-300 transition-colors">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-medium text-zinc-900">{ticket.subject}</h3>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${ticket.status === 'Resolved'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {ticket.status === 'Resolved' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                                        {ticket.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-zinc-600 mb-3">{ticket.message}</p>
                                                <div className="text-xs text-zinc-400 mb-3">
                                                    {new Date(ticket.createdAt).toLocaleDateString()}
                                                </div>

                                                {ticket.adminResponse && (
                                                    <div className="bg-zinc-50 rounded-lg p-3 border border-zinc-200 mt-3">
                                                        <p className="text-xs font-semibold text-zinc-500 mb-1 uppercase">Admin Response</p>
                                                        <p className="text-sm text-zinc-800">{ticket.adminResponse}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))
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
