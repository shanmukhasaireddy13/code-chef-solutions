"use client";

import { useState, useEffect } from 'react';
import { Tag, Plus, Power, Calendar, Gift, Users, Sparkles, Lock, CheckCircle, Wand2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';


import { safeFetch } from '@/lib/api';

interface Offer {
    _id: string;
    code: string;
    title: string;
    description: string;
    offerType: 'DISCOUNT' | 'BOGO' | 'FIRST_TIME' | 'REFERRAL_UNLOCK';
    discountType: 'FLAT' | 'PERCENTAGE';
    discountValue: number;
    discountPercent: number;
    type: 'Global' | 'Coupon';
    isActive: boolean;
    validUntil: string;
    usageLimit: number;
    conditions: {
        minPurchaseAmount?: number;
        minReferrals?: number;
        requiredSolutionCount?: number;
        maxFreeSolutionPrice?: number;
    };
    bogoRules: {
        buyCount?: number;
        minTotalValue?: number;
        getFreeCount?: number;
        maxFreePrice?: number;
    };
    autoApply: boolean;
    requiresCode: boolean;
}

interface OffersClientProps {
    offersUrl: string;
}

export default function OffersClient({ offersUrl }: OffersClientProps) {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(false);
    const [newOffer, setNewOffer] = useState<Partial<Offer>>({
        code: '',
        title: '',
        description: '',
        offerType: 'DISCOUNT',
        discountType: 'PERCENTAGE',
        discountValue: 0,
        discountPercent: 10,
        type: 'Coupon',
        validUntil: '',
        usageLimit: 1,
        autoApply: false,
        requiresCode: true,
        conditions: {
            minPurchaseAmount: 0,
            minReferrals: 0
        },
        bogoRules: {
            buyCount: 2,
            minTotalValue: 0,
            getFreeCount: 1,
            maxFreePrice: 0
        }
    });

    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        try {
            const data = await safeFetch(offersUrl);
            setOffers(data);
        } catch (error) {
            console.error("Error fetching offers:", error);
            toast.error("Failed to load offers");
        }
    };

    const generateCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setNewOffer({ ...newOffer, code: result });
    };

    const generateTitleDescription = () => {
        const type = newOffer.offerType;
        let title = '';
        let description = '';

        switch (type) {
            case 'DISCOUNT':
                const discountVal = newOffer.discountType === 'PERCENTAGE' ? `${newOffer.discountPercent}%` : `₹${newOffer.discountValue}`;
                title = `${discountVal} Off`;
                description = `Get ${discountVal} discount on your purchase. Add credits and save more!`;
                break;
            case 'BOGO':
                title = `Buy ${newOffer.bogoRules?.buyCount} Get ${newOffer.bogoRules?.getFreeCount} Free`;
                description = `Purchase ${newOffer.bogoRules?.buyCount} solutions and get ${newOffer.bogoRules?.getFreeCount} free!`;
                break;
            case 'FIRST_TIME':
                title = 'First Time User Offer';
                description = 'Special discount for first-time users. Welcome aboard!';
                break;
            case 'REFERRAL_UNLOCK':
                title = `Refer ${newOffer.conditions?.minReferrals} Friends`;
                description = `Unlock this offer by referring ${newOffer.conditions?.minReferrals} friends. Share the love!`;
                break;
        }

        setNewOffer({ ...newOffer, title, description });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Adjust payload based on offer type
            const payload = { ...newOffer };
            if (payload.offerType === 'FIRST_TIME') {
                payload.requiresCode = false;
                payload.autoApply = true;
            }

            await safeFetch(offersUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            toast.success("Offer created successfully!");
            setNewOffer({
                code: '',
                title: '',
                description: '',
                offerType: 'DISCOUNT',
                discountType: 'PERCENTAGE',
                discountValue: 0,
                discountPercent: 10,
                type: 'Coupon',
                validUntil: '',
                usageLimit: 1,
                autoApply: false,
                requiresCode: true,
                conditions: { minPurchaseAmount: 0, minReferrals: 0 },
                bogoRules: { buyCount: 2, minTotalValue: 0, getFreeCount: 1, maxFreePrice: 0 }
            });
            fetchOffers();
        } catch (error) {
            console.error("Error creating offer:", error);
            toast.error("Error creating offer");
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (id: string) => {
        try {
            await safeFetch(`${offersUrl}/${id}/toggle`, {
                method: 'PUT'
            });

            toast.success("Offer status updated");
            fetchOffers();
        } catch (error) {
            console.error("Error toggling status:", error);
            toast.error("Failed to update status");
        }
    };

    const deleteOfferHandler = async (id: string) => {
        if (!confirm('Are you sure you want to delete this offer? This action cannot be undone.')) return;

        try {
            await safeFetch(`${offersUrl}/${id}`, {
                method: 'DELETE'
            });

            toast.success("Offer deleted successfully");
            fetchOffers();
        } catch (error) {
            console.error("Error deleting offer:", error);
            toast.error("Failed to delete offer");
        }
    };

    return (
        <div className="max-w-7xl mx-auto pt-12 pb-12 px-4">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-zinc-200/60">
                {/* Window Header */}
                <div className="bg-zinc-100/80 backdrop-blur-md border-b border-zinc-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-600/20" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80 border border-yellow-600/20" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80 border border-green-600/20" />
                    </div>
                    <div className="text-xs font-medium text-zinc-500 flex items-center gap-2 font-mono">
                        offers_engine.admin
                    </div>
                    <div className="w-12" />
                </div>

                <div className="p-8 bg-zinc-50/50 min-h-[600px]">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-zinc-900">Offers & Rules Engine</h1>
                            <p className="text-sm text-zinc-500">Configure advanced coupons, BOGO offers, and referral rewards.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Create Offer Form */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
                                <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Plus className="w-4 h-4 text-blue-600" />
                                    Create New Rule
                                </h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Offer Type Selector */}
                                    <div className="grid grid-cols-2 gap-2 mb-4">
                                        {['DISCOUNT', 'BOGO', 'FIRST_TIME', 'REFERRAL_UNLOCK'].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setNewOffer({ ...newOffer, offerType: type as any })}
                                                className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${newOffer.offerType === type
                                                    ? 'bg-zinc-900 text-white border-zinc-900'
                                                    : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300'
                                                    }`}
                                            >
                                                {type.replace('_', ' ')}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Common Fields */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">Code</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={newOffer.code}
                                                    onChange={(e) => setNewOffer({ ...newOffer, code: e.target.value.toUpperCase() })}
                                                    required
                                                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:bg-white transition-all font-mono uppercase placeholder:text-zinc-400 text-zinc-900"
                                                    placeholder="SUMMER2025"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={generateCode}
                                                    className="p-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-xl transition-colors"
                                                    title="Auto Generate"
                                                >
                                                    <Wand2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">Title & Description</label>
                                            <button
                                                type="button"
                                                onClick={generateTitleDescription}
                                                className="text-xs px-2 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-lg transition-colors flex items-center gap-1"
                                                title="Auto Generate"
                                            >
                                                <Wand2 className="w-3 h-3" /> Generate
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            value={newOffer.title}
                                            onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
                                            required
                                            className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:bg-white transition-all placeholder:text-zinc-400 text-zinc-900 mb-2"
                                            placeholder="Summer Sale"
                                        />
                                        <textarea
                                            value={newOffer.description}
                                            onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:bg-white transition-all placeholder:text-zinc-400 text-zinc-900"
                                            rows={2}
                                            placeholder="Offer details..."
                                        />
                                    </div>
                                    {newOffer.offerType === 'DISCOUNT' && (
                                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 space-y-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Tag className="w-4 h-4 text-blue-600" />
                                                <span className="text-xs font-bold text-blue-700 uppercase">Discount Settings</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-blue-600 mb-1">Type</label>
                                                    <select
                                                        value={newOffer.discountType}
                                                        onChange={(e) => setNewOffer({ ...newOffer, discountType: e.target.value as any })}
                                                        className="w-full px-2 py-1.5 border border-blue-200 rounded text-sm text-zinc-900"
                                                    >
                                                        <option value="PERCENTAGE">Percentage (%)</option>
                                                        <option value="FLAT">Flat Amount (₹)</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-blue-600 mb-1">Value</label>
                                                    <input
                                                        type="number"
                                                        value={newOffer.discountType === 'PERCENTAGE' ? newOffer.discountPercent : newOffer.discountValue}
                                                        onChange={(e) => {
                                                            const val = Number(e.target.value);
                                                            if (newOffer.discountType === 'PERCENTAGE') {
                                                                setNewOffer({ ...newOffer, discountPercent: val });
                                                            } else {
                                                                setNewOffer({ ...newOffer, discountValue: val });
                                                            }
                                                        }}
                                                        className="w-full px-2 py-1.5 border border-blue-200 rounded text-sm placeholder:text-zinc-400 text-zinc-900"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-blue-600 mb-1">Min Purchase Amount (₹)</label>
                                                <input
                                                    type="number"
                                                    value={newOffer.conditions?.minPurchaseAmount}
                                                    onChange={(e) => setNewOffer({
                                                        ...newOffer,
                                                        conditions: { ...newOffer.conditions, minPurchaseAmount: Number(e.target.value) }
                                                    })}
                                                    className="w-full px-2 py-1.5 border border-blue-200 rounded text-sm placeholder:text-zinc-400 text-zinc-900"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {newOffer.offerType === 'BOGO' && (
                                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-100 space-y-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Gift className="w-4 h-4 text-purple-600" />
                                                <span className="text-xs font-bold text-purple-700 uppercase">BOGO Logic</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-purple-600 mb-1">Buy Count</label>
                                                    <input
                                                        type="number"
                                                        value={newOffer.bogoRules?.buyCount}
                                                        onChange={(e) => setNewOffer({
                                                            ...newOffer,
                                                            bogoRules: { ...newOffer.bogoRules, buyCount: Number(e.target.value) }
                                                        })}
                                                        className="w-full px-2 py-1.5 border border-purple-200 rounded text-sm placeholder:text-zinc-400 text-zinc-900"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-purple-600 mb-1">Get Free</label>
                                                    <input
                                                        type="number"
                                                        value={newOffer.bogoRules?.getFreeCount}
                                                        onChange={(e) => setNewOffer({
                                                            ...newOffer,
                                                            bogoRules: { ...newOffer.bogoRules, getFreeCount: Number(e.target.value) }
                                                        })}
                                                        className="w-full px-2 py-1.5 border border-purple-200 rounded text-sm placeholder:text-zinc-400 text-zinc-900"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-purple-600 mb-1">Max Free Item Price (₹)</label>
                                                <input
                                                    type="number"
                                                    value={newOffer.bogoRules?.maxFreePrice}
                                                    onChange={(e) => setNewOffer({
                                                        ...newOffer,
                                                        bogoRules: { ...newOffer.bogoRules, maxFreePrice: Number(e.target.value) }
                                                    })}
                                                    className="w-full px-2 py-1.5 border border-purple-200 rounded text-sm placeholder:text-zinc-400 text-zinc-900"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {newOffer.offerType === 'REFERRAL_UNLOCK' && (
                                        <div className="p-4 bg-green-50 rounded-lg border border-green-100 space-y-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Users className="w-4 h-4 text-green-600" />
                                                <span className="text-xs font-bold text-green-700 uppercase">Referral Conditions</span>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-green-600 mb-1">Required Referrals</label>
                                                <input
                                                    type="number"
                                                    value={newOffer.conditions?.minReferrals}
                                                    onChange={(e) => setNewOffer({
                                                        ...newOffer,
                                                        conditions: { ...newOffer.conditions, minReferrals: Number(e.target.value) }
                                                    })}
                                                    className="w-full px-2 py-1.5 border border-green-200 rounded text-sm placeholder:text-zinc-400 text-zinc-900"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-green-600 mb-1">Reward Discount (%)</label>
                                                <input
                                                    type="number"
                                                    value={newOffer.discountPercent}
                                                    onChange={(e) => setNewOffer({ ...newOffer, discountPercent: Number(e.target.value) })}
                                                    className="w-full px-2 py-1.5 border border-green-200 rounded text-sm placeholder:text-zinc-400 text-zinc-900"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase">Usage Limit</label>
                                            <input
                                                type="number"
                                                value={newOffer.usageLimit}
                                                onChange={(e) => setNewOffer({ ...newOffer, usageLimit: Number(e.target.value) })}
                                                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm placeholder:text-zinc-400 text-zinc-900"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase">Valid Until</label>
                                            <input
                                                type="date"
                                                value={newOffer.validUntil}
                                                onChange={(e) => setNewOffer({ ...newOffer, validUntil: e.target.value })}
                                                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm placeholder:text-zinc-400 text-zinc-900"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2 text-sm text-zinc-600">
                                            <input
                                                type="checkbox"
                                                checked={newOffer.autoApply}
                                                onChange={(e) => setNewOffer({ ...newOffer, autoApply: e.target.checked })}
                                                className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                                            />
                                            Auto-Apply
                                        </label>
                                        <label className="flex items-center gap-2 text-sm text-zinc-600">
                                            <input
                                                type="checkbox"
                                                checked={newOffer.type === 'Global'}
                                                onChange={(e) => setNewOffer({ ...newOffer, type: e.target.checked ? 'Global' : 'Coupon' })}
                                                className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                                            />
                                            Global Offer
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-zinc-900/10"
                                    >
                                        {loading ? 'Creating...' : 'Create Rule'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Offers List */}
                        <div className="lg:col-span-7 space-y-4">
                            {offers.map((offer) => (
                                <div key={offer._id} className={`bg-white rounded-xl border p-4 transition-all ${offer.isActive ? 'border-zinc-200 shadow-sm' : 'border-zinc-100 opacity-75'}`}>
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2 rounded-lg ${offer.offerType === 'BOGO' ? 'bg-purple-100 text-purple-600' :
                                                offer.offerType === 'REFERRAL_UNLOCK' ? 'bg-green-100 text-green-600' :
                                                    offer.offerType === 'FIRST_TIME' ? 'bg-yellow-100 text-yellow-600' :
                                                        'bg-blue-100 text-blue-600'
                                                }`}>
                                                {offer.offerType === 'BOGO' ? <Gift className="w-5 h-5" /> :
                                                    offer.offerType === 'REFERRAL_UNLOCK' ? <Users className="w-5 h-5" /> :
                                                        offer.offerType === 'FIRST_TIME' ? <Sparkles className="w-5 h-5" /> :
                                                            <Tag className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-zinc-900">{offer.code}</h3>
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 font-medium">
                                                        {offer.offerType.replace('_', ' ')}
                                                    </span>
                                                    {offer.autoApply && (
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium flex items-center gap-1">
                                                            <CheckCircle className="w-3 h-3" /> Auto
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm font-medium text-zinc-700 mt-1">{offer.title}</p>
                                                <p className="text-sm text-zinc-500">{offer.description}</p>

                                                {/* Rule Details */}
                                                <div className="mt-2 text-xs text-zinc-500 space-y-1">
                                                    {offer.offerType === 'BOGO' && (
                                                        <p>Buy {offer.bogoRules?.buyCount}, Get {offer.bogoRules?.getFreeCount} Free (Max ₹{offer.bogoRules?.maxFreePrice})</p>
                                                    )}
                                                    {offer.offerType === 'REFERRAL_UNLOCK' && (
                                                        <p>Requires {offer.conditions?.minReferrals} referrals</p>
                                                    )}
                                                    {offer.offerType === 'DISCOUNT' && (
                                                        <p>Min Purchase: ₹{offer.conditions?.minPurchaseAmount}</p>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-4 mt-2 text-xs text-zinc-400">
                                                    <span className="font-semibold text-green-600">
                                                        {offer.discountType === 'FLAT' ? `₹${offer.discountValue} OFF` : `${offer.discountPercent}% OFF`}
                                                    </span>
                                                    {offer.validUntil && (
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            Expires: {new Date(offer.validUntil).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => toggleStatus(offer._id)}
                                                className={`p-2 rounded-lg transition-colors ${offer.isActive ? 'text-green-600 hover:bg-green-50' : 'text-zinc-400 hover:bg-zinc-100'}`}
                                                title={offer.isActive ? "Deactivate" : "Activate"}
                                            >
                                                <Power className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => deleteOfferHandler(offer._id)}
                                                className="p-2 rounded-lg transition-colors text-red-600 hover:bg-red-50"
                                                title="Delete Offer"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
