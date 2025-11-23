"use client";

import { useState, useEffect } from 'react';
import { Check, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';



interface Order {
    _id: string;
    user: {
        name: string;
        email: string;
    };
    amount: number;
    utr: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
}

interface AdminDashboardClientProps {
    initialOrders?: Order[];
    ordersUrl: string;
    verifyOrderUrl: string;
}

export default function AdminDashboardClient({ initialOrders = [], ordersUrl, verifyOrderUrl }: AdminDashboardClientProps) {
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [loading, setLoading] = useState(false);
    const [adminUtrInputs, setAdminUtrInputs] = useState<{ [key: string]: string }>({});
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await fetch(ordersUrl, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            } else {
                toast.error("Failed to fetch orders");
            }
        } catch (error) {
            console.error("Failed to fetch orders", error);
            toast.error("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    // We can keep fetchOrders for manual refresh, but initial load is SSR


    const handleVerify = async (orderId: string) => {
        const adminUtr = adminUtrInputs[orderId];
        if (!adminUtr) {
            toast.error("Please enter the UTR you received.");
            return;
        }

        setProcessingId(orderId);
        try {
            const response = await fetch(verifyOrderUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ orderId, adminUtr }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Order Verified Successfully!");
                fetchOrders(); // Refresh list
            } else {
                // Show specific error from backend (e.g., "Invalid UTR", "UTR already used")
                toast.error(data.message || "Verification Failed. Please check the UTR.");
            }
        } catch (error) {
            console.error("Verification error", error);
            toast.error("Error verifying order");
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-900">Payment Verification</h1>
                        <p className="text-zinc-500">Verify user payments by matching UTR numbers.</p>
                    </div>
                    <button
                        onClick={fetchOrders}
                        className="p-2 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
                    >
                        <RefreshCw className={`w-5 h-5 text-zinc-600 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-50 border-b border-zinc-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Verify UTR</th>
                                    <th className="px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {orders.length === 0 && !loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                                            No orders found.
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map((order) => (
                                        <tr key={order._id} className="hover:bg-zinc-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-zinc-900">{order.user?.name || 'Unknown'}</span>
                                                    <span className="text-xs text-zinc-500">{order.user?.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-zinc-900">₹{order.amount}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-zinc-500">
                                                {new Date(order.createdAt).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    order.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {order.status === 'pending' ? (
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Received UTR"
                                                        value={adminUtrInputs[order._id] || ''}
                                                        onChange={(e) => setAdminUtrInputs(prev => ({ ...prev, [order._id]: e.target.value }))}
                                                        className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-900"
                                                    />
                                                ) : (
                                                    <span className="text-xs text-zinc-400 font-mono">Verified</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {order.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleVerify(order._id)}
                                                        disabled={processingId === order._id || !adminUtrInputs[order._id]}
                                                        className="bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                    >
                                                        {processingId === order._id ? (
                                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        ) : (
                                                            <>Verify <Check className="w-4 h-4" /></>
                                                        )}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
