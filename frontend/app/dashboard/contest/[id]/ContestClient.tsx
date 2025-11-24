"use client";

import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, ShoppingCart, Tag, Gift, Sparkles, Check, X, Lock, Unlock, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Problem {
    _id: string;
    name: string;
    difficulty: string;
    price: number;
    contestId: string;
    problemId: string;
}

interface Offer {
    _id: string;
    code: string;
    title: string;
    description: string;
    offerType: 'DISCOUNT' | 'BOGO' | 'FIRST_TIME' | 'REFERRAL_UNLOCK';
    discountType: 'FLAT' | 'PERCENTAGE';
    discountValue: number;
    discountPercent: number;
    conditions?: {
        minPurchaseAmount?: number;
        minReferrals?: number;
    };
    bogoRules?: {
        buyCount: number;
        getFreeCount: number;
        maxFreePrice: number;
    };
    autoApply: boolean;
    isActive: boolean;
    usageLimit: number;
    usageCount?: number;
    hasUsed?: boolean;
}

interface ContestClientProps {
    contestId: string;
    initialCredits: number;
    purchasedSolutionIds: string[];
    contestProblemsUrl: string;
    activeOffersUrl: string;
    validateOfferUrl: string;
    buyCartUrl: string;
}

export default function ContestClient({
    contestId,
    initialCredits,
    purchasedSolutionIds,
    contestProblemsUrl,
    activeOffersUrl,
    validateOfferUrl,
    buyCartUrl
}: ContestClientProps) {
    const router = useRouter();
    const [problems, setProblems] = useState<Problem[]>([]);
    const [localPurchasedIds, setLocalPurchasedIds] = useState<string[]>(purchasedSolutionIds); // Initialize with props
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState<Problem[]>([]);
    const [credits, setCredits] = useState(initialCredits);
    const [offers, setOffers] = useState<Offer[]>([]);
    const [couponCode, setCouponCode] = useState('');
    const [appliedOffer, setAppliedOffer] = useState<Offer | null>(null);
    const [validatingCoupon, setValidatingCoupon] = useState(false);
    const [couponError, setCouponError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [problemsRes, offersRes] = await Promise.all([
                    fetch(contestProblemsUrl, { credentials: 'include' }),
                    fetch(activeOffersUrl, { credentials: 'include' })
                ]);

                if (problemsRes.ok) {
                    const data = await problemsRes.json();
                    setProblems(data);
                }
                if (offersRes.ok) {
                    const data = await offersRes.json();
                    setOffers(data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to load contest data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [contestId]);

    // Cart Calculations
    const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.price, 0), [cart]);

    const { discount, finalPrice, freeItemIds, activeOffer } = useMemo(() => {
        let currentDiscount = 0;
        let freeIds: string[] = [];
        let active: Offer | null | undefined = appliedOffer;

        // 1. Check Auto-Apply Offers if no manual coupon
        if (!active) {
            const autoOffers = offers.filter(o => o.autoApply);
            // Simple logic: pick the best one or first one
            // Prioritize BOGO
            const bogoOffer = autoOffers.find(o => o.offerType === 'BOGO');
            if (bogoOffer && bogoOffer.bogoRules && !bogoOffer.hasUsed) {
                if (cart.length >= bogoOffer.bogoRules.buyCount + bogoOffer.bogoRules.getFreeCount) {
                    active = bogoOffer;
                }
            }

            // If no BOGO, check First Time
            if (!active) {
                active = autoOffers.find(o => o.offerType === 'FIRST_TIME' && !o.hasUsed);
            }
        }

        // 2. Calculate Discount based on 'active' offer
        if (active) {
            if (active.offerType === 'BOGO' && active.bogoRules) {
                const requiredCount = active.bogoRules.buyCount + active.bogoRules.getFreeCount;
                if (cart.length >= requiredCount) {
                    // Sort by price ascending
                    const sortedCart = [...cart].sort((a, b) => a.price - b.price);
                    // Free items are the cheapest ones
                    for (let i = 0; i < active.bogoRules.getFreeCount; i++) {
                        if (sortedCart[i].price <= active.bogoRules.maxFreePrice) {
                            currentDiscount += sortedCart[i].price;
                            freeIds.push(sortedCart[i]._id);
                        }
                    }
                }
            } else if (active.offerType === 'DISCOUNT' || active.offerType === 'FIRST_TIME' || active.offerType === 'REFERRAL_UNLOCK') {
                if (active.conditions?.minPurchaseAmount && cartTotal < active.conditions.minPurchaseAmount) {
                    // Condition not met
                    currentDiscount = 0;
                } else {
                    if (active.discountType === 'PERCENTAGE') {
                        currentDiscount = (cartTotal * active.discountPercent) / 100;
                    } else {
                        currentDiscount = active.discountValue;
                    }
                }
            }
        }

        // Cap discount
        if (currentDiscount > cartTotal) currentDiscount = cartTotal;

        return {
            discount: currentDiscount,
            finalPrice: cartTotal - currentDiscount,
            freeItemIds: freeIds,
            activeOffer: active
        };
    }, [cart, appliedOffer, offers, cartTotal]);

    const bogoInstruction = useMemo(() => {
        const bogoOffer = offers.find(o => o.isActive && o.offerType === 'BOGO');
        if (!bogoOffer || !bogoOffer.bogoRules) return null;

        if (bogoOffer.hasUsed) {
            return {
                type: 'warning',
                text: 'Offer already claimed! You have reached the usage limit for this offer.'
            };
        }

        const { buyCount, getFreeCount, maxFreePrice } = bogoOffer.bogoRules;
        const totalNeeded = buyCount + getFreeCount;
        const currentCount = cart.length;

        if (currentCount < buyCount) {
            return {
                type: 'info',
                text: `Add ${buyCount - currentCount} more item${buyCount - currentCount > 1 ? 's' : ''} to unlock Buy ${buyCount} Get ${getFreeCount} Free!`
            };
        } else if (currentCount < totalNeeded) {
            return {
                type: 'success',
                text: `You qualified! Select ${totalNeeded - currentCount} more free item${totalNeeded - currentCount > 1 ? 's' : ''} (Max ${maxFreePrice} Credits)`
            };
        } else {
            // Check if any item qualifies for free (price <= maxFreePrice)
            const sortedCart = [...cart].sort((a, b) => a.price - b.price);
            const potentialFreeItems = sortedCart.slice(0, getFreeCount);
            const hasFreeItem = potentialFreeItems.some(item => item.price <= maxFreePrice);

            if (!hasFreeItem) {
                return {
                    type: 'warning',
                    text: `Sorry, selected items are too expensive! Add an item under ${maxFreePrice} credits to get it for FREE.`
                };
            }

            return {
                type: 'applied',
                text: `🎉 BOGO Offer Applied! You got ${getFreeCount} free item${getFreeCount > 1 ? 's' : ''}!`
            };
        }
    }, [offers, cart]);

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setValidatingCoupon(true);
        setCouponError('');

        try {
            const response = await fetch(validateOfferUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    code: couponCode,
                    cartValue: cartTotal,
                    cartItems: cart
                })
            });

            const data = await response.json();
            if (response.ok) {
                setAppliedOffer(data.offer);
                toast.success("Coupon applied successfully!");
            } else {
                setCouponError(data.message);
                setAppliedOffer(null);
            }
        } catch (error) {
            setCouponError("Failed to validate coupon");
        } finally {
            setValidatingCoupon(false);
        }
    };

    const handleBuy = async () => {
        if (cart.length === 0) return;
        if (credits < finalPrice) {
            toast.error("Insufficient credits. Please add more credits.");
            return;
        }

        try {
            const response = await fetch(buyCartUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    items: cart.map(p => ({ problemId: p.problemId, price: p.price })),
                    couponCode: activeOffer?.code || (activeOffer?.autoApply ? null : couponCode) // Send code if manual, or if auto-apply has code
                })
            });

            const data = await response.json();
            if (response.ok) {
                toast.success("Purchase successful! 🎉");
                setCredits(data.credits);

                // Update local state to show "View Solution" button immediately
                const newPurchasedIds = cart.map(p => p._id);
                setLocalPurchasedIds(prev => [...prev, ...newPurchasedIds]);

                setCart([]);
                setAppliedOffer(null);
                setCouponCode('');

                // Trigger global credit update event
                window.dispatchEvent(new CustomEvent('creditsUpdated', { detail: data.credits }));

                // If tour is active, DO NOT redirect.
                if (!window.location.search.includes('tour=true')) {
                    router.push('/dashboard/solutions');
                }
            } else {
                toast.error(data.message || "Purchase failed");
            }
        } catch (error) {
            toast.error("Purchase failed");
        }
    };

    const toggleCart = (problem: Problem) => {
        if (cart.find(p => p._id === problem._id)) {
            setCart(cart.filter(p => p._id !== problem._id));
        } else {
            setCart([...cart, problem]);
        }
    };

    const filteredProblems = problems.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-900"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 pt-8 pb-12 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Main Content - Problems List */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-zinc-900">Contest Problems</h1>
                            <p className="text-zinc-500">Select solutions to unlock.</p>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Search problems..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 w-64"
                            />
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {filteredProblems.map((problem, index) => {
                            const isPurchased = localPurchasedIds.includes(problem._id);
                            const inCart = cart.some(p => p._id === problem._id);
                            const isFree = freeItemIds.includes(problem._id);

                            return (
                                <motion.div
                                    key={problem._id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`bg-white p-4 rounded-xl border transition-all ${inCart ? 'border-zinc-900 ring-1 ring-zinc-900 shadow-md' : 'border-zinc-200 hover:border-zinc-300'} ${isPurchased ? 'bg-zinc-50/50' : ''}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${problem.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                                <span className="text-xs font-bold">{problem.difficulty[0]}</span>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-zinc-900">{problem.name}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-zinc-500">ID: {problem.problemId}</span>
                                                    {isFree && (
                                                        <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full flex items-center gap-1">
                                                            <Gift className="w-3 h-3" /> FREE (BOGO)
                                                        </span>
                                                    )}
                                                    {isPurchased && (
                                                        <span className="text-[10px] font-bold px-2 py-0.5 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                                                            <Check className="w-3 h-3" /> Owned
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                {isPurchased ? (
                                                    <span className="text-sm font-medium text-zinc-500">Purchased</span>
                                                ) : isFree ? (
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-sm font-bold text-purple-600">FREE</span>
                                                        <span className="text-xs text-zinc-400 line-through">{problem.price} Credits</span>
                                                    </div>
                                                ) : (
                                                    <span className="font-bold text-zinc-900">{problem.price} Credits</span>
                                                )}
                                            </div>

                                            {isPurchased ? (
                                                <button
                                                    id={index === 0 ? "tour-view-solution-btn" : undefined}
                                                    onClick={() => router.push(window.location.search.includes('tour=true') ? '/dashboard/solutions?tour=true&tourStep=9' : '/dashboard/solutions')}
                                                    className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                                >
                                                    View Solution <ChevronRight className="w-4 h-4" />
                                                </button>
                                            ) : (
                                                <button
                                                    id={index === 0 ? "tour-add-to-cart-btn" : undefined}
                                                    onClick={() => toggleCart(problem)}
                                                    className={`p-2 rounded-lg transition-colors ${inCart ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}
                                                >
                                                    {inCart ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Sidebar - Cart & Offers */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Offers Widget */}
                    <div className="bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Gift className="w-24 h-24 rotate-12" />
                        </div>
                        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                            <Sparkles className="w-5 h-5" /> Active Offers
                        </h3>
                        <div className="space-y-3 relative z-10">
                            {offers.filter(o => o.isActive).length === 0 ? (
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center">
                                    <p className="text-sm font-medium opacity-90">Sorry, no offers at present.</p>
                                    <p className="text-xs opacity-70 mt-1">Maybe next time! ✨</p>
                                </div>
                            ) : (
                                offers.filter(o => o.isActive).slice(0, 2).map((offer) => (
                                    <div key={offer._id} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-bold text-sm">{offer.title}</span>
                                            {offer.offerType === 'REFERRAL_UNLOCK' && <Lock className="w-3 h-3 opacity-70" />}
                                        </div>
                                        <p className="text-xs opacity-80 mb-2">{offer.description}</p>
                                        {offer.code && (
                                            <div className="inline-block bg-white/20 px-2 py-1 rounded text-xs font-mono font-bold mb-2">
                                                {offer.code}
                                            </div>
                                        )}
                                        {/* Suggestion based on offer type */}
                                        <div className="mt-2 pt-2 border-t border-white/20">
                                            {offer.offerType === 'REFERRAL_UNLOCK' && (
                                                <a href="/dashboard" className="text-xs text-white/90 hover:text-white underline flex items-center gap-1">
                                                    → Go to Dashboard to refer friends
                                                </a>
                                            )}
                                            {(offer.offerType === 'DISCOUNT' || offer.offerType === 'FIRST_TIME') && (
                                                <a href="/payment" className="text-xs text-white/90 hover:text-white underline flex items-center gap-1">
                                                    → Add credits to use this offer
                                                </a>
                                            )}
                                            {offer.offerType === 'BOGO' && (
                                                <p className="text-xs text-white/80">
                                                    → Add {offer.bogoRules?.buyCount} items to cart to get {offer.bogoRules?.getFreeCount} free!
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Cart Summary */}
                    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 sticky top-8">
                        <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5" /> Cart Summary
                        </h3>

                        {/* BOGO Instructions */}
                        {bogoInstruction && (
                            <div className={`mb-4 p-3 rounded-lg text-xs font-bold border flex items-center gap-2 ${bogoInstruction.type === 'applied' ? 'bg-green-50 text-green-700 border-green-200' :
                                bogoInstruction.type === 'success' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                    bogoInstruction.type === 'warning' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                        'bg-blue-50 text-blue-700 border-blue-200'
                                }`}>
                                {bogoInstruction.type === 'warning' ? <AlertCircle className="w-4 h-4" /> : <Gift className="w-4 h-4" />}
                                {bogoInstruction.text}
                            </div>
                        )}

                        <div className="space-y-3 mb-6">
                            {cart.map((item) => (
                                <div key={item._id} className="flex justify-between text-sm">
                                    <span className="text-zinc-600 truncate max-w-[180px]">{item.name}</span>
                                    <span className={freeItemIds.includes(item._id) ? "text-purple-600 font-bold" : "text-zinc-900"}>
                                        {freeItemIds.includes(item._id) ? "FREE" : item.price}
                                    </span>
                                </div>
                            ))}
                            {cart.length === 0 && (
                                <p className="text-sm text-zinc-400 italic text-center py-4">Your cart is empty</p>
                            )}
                        </div>

                        <div className="border-t border-zinc-100 pt-4 space-y-2 mb-6">
                            <div className="flex justify-between text-sm text-zinc-500">
                                <span>Subtotal</span>
                                <span>{cartTotal} Credits</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-sm text-green-600 font-medium">
                                    <span className="flex items-center gap-1">
                                        <Tag className="w-3 h-3" /> Discount
                                        {activeOffer && <span className="text-[10px] bg-green-100 px-1.5 rounded-full ml-1">{activeOffer.code || 'AUTO'}</span>}
                                    </span>
                                    <span>-{discount} Credits</span>
                                </div>
                            )}
                            <div className="flex justify-between text-base font-bold text-zinc-900 pt-2 border-t border-zinc-100">
                                <span>Total</span>
                                <span>{finalPrice} Credits</span>
                            </div>
                        </div>

                        <button
                            id="tour-unlock-btn"
                            onClick={handleBuy}
                            disabled={cart.length === 0 || credits < finalPrice}
                            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-zinc-900/20 active:scale-95 flex items-center justify-center gap-2"
                        >
                            {credits < finalPrice ? 'Insufficient Credits' : 'Unlock Solutions'}
                            <ChevronRight className="w-4 h-4" />
                        </button>

                        <p className="text-xs text-center text-zinc-400 mt-3">
                            Available Balance: {credits} Credits
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
