"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Clock, QrCode, ShieldCheck, ArrowRight, CreditCard, Tag, AlertCircle, Frown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import OrderConfirmButton from '../components/OrderConfirmButton';
import { toast } from 'sonner';
import { API_ROUTES } from '@/lib/api';

interface PaymentClientProps { }

export default function PaymentClient({ }: PaymentClientProps) {
    const userMeUrl = API_ROUTES.USER.ME;
    const validateOfferUrl = API_ROUTES.OFFERS.VALIDATE;
    const createOrderUrl = API_ROUTES.PAYMENT.CREATE_ORDER;
    const router = useRouter();
    const [step, setStep] = useState<'select' | 'confirm' | 'pay'>('select');
    const [amount, setAmount] = useState<string>('');
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [utrNumber, setUtrNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (step === 'pay' && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            // Handle timeout
            toast.error("Session expired. Please try again.");
            setStep('select');
            setTimeLeft(300);
        }
        return () => clearInterval(timer);
    }, [step, timeLeft]);

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        if (!amount || Number(amount) <= 0) {
            toast.error("Please enter an amount first");
            return;
        }

        setIsProcessing(true);
        try {
            // First, get the current user to get their ID
            const userResponse = await fetch(userMeUrl, {
                credentials: 'include'
            });

            if (!userResponse.ok) {
                toast.error("Please login to apply coupons");
                setIsProcessing(false);
                return;
            }

            const userData = await userResponse.json();

            const response = await fetch(validateOfferUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    code: couponCode,
                    userId: userData._id,
                    cartValue: Number(amount),
                    cartItems: [] // Payment page doesn't have cart items
                }),
            });

            if (response.ok) {
                const data = await response.json();
                // Calculate discount percentage from the response
                const discountPercent = ((data.discountAmount / Number(amount)) * 100).toFixed(0);
                setDiscount(Number(discountPercent));
                setAppliedCoupon(data.offer.code);
                toast.success(`Coupon applied! ${discountPercent}% off.`);
            } else {
                const data = await response.json();
                toast.error(data.message || "Invalid coupon code");
                setDiscount(0);
                setAppliedCoupon(null);
            }
        } catch (error) {
            console.error("Error applying coupon:", error);
            toast.error("Failed to apply coupon");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleProceedToPay = async () => {
        if (!amount || Number(amount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }
        setIsProcessing(true);

        try {
            // Simulating delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            const finalAmount = appliedCoupon ? Number(amount) * (1 - discount / 100) : Number(amount);

            // Mock QR Code (using a placeholder service or just a div)
            setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PAYMENT-${Date.now()}-${finalAmount}`);

            setStep('pay');
            setIsProcessing(false);
        } catch (error) {
            console.error("Failed to generate QR", error);
            setIsProcessing(false);
            toast.error("Failed to generate QR code");
        }
    };

    const handleConfirmPayment = async () => {
        if (!utrNumber) {
            toast.error("Please enter the UTR number.");
            return;
        }

        setIsProcessing(true);

        try {
            // Calculate the final amount to send to backend
            const finalAmount = appliedCoupon ? Number(amount) * (1 - discount / 100) : Number(amount);

            const response = await fetch(createOrderUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    amount: Number(amount),
                    utr: utrNumber,
                    couponCode: appliedCoupon || undefined
                }),
            });

            if (response.ok) {
                // Success animation or redirect
                // Wait for button animation to finish (handled by OrderConfirmButton callback)
                toast.success("Payment submitted for verification!");
                setTimeout(() => {
                    router.push('/dashboard?payment=pending');
                }, 1000);
            } else {
                const data = await response.json();
                toast.error(data.message || 'Payment verification failed.');
            }
        } catch (error) {
            console.error('Error confirming payment:', error);
            toast.error('Error confirming payment. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left Side: Payment Details / Selection */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Add Credits</h1>
                        <p className="text-zinc-500 mt-2">Secure payment gateway. 1 Credit = ₹1.</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6">
                        {step === 'select' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Enter Amount (₹)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">₹</span>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => {
                                            setAmount(e.target.value);
                                            setErrorMessage(null);
                                        }}
                                        placeholder="Enter amount (e.g. 100)"
                                        className="w-full pl-10 pr-4 py-4 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 focus:border-zinc-500 text-xl font-bold text-zinc-900 placeholder:font-normal transition-all"
                                    />
                                </div>
                                {errorMessage && (
                                    <p className="text-sm text-red-500">{errorMessage}</p>
                                )}

                                <div className="pt-4 border-t border-zinc-100 mt-4">
                                    <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 mb-6">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-zinc-600 text-sm">Amount</span>
                                            <span className="font-semibold text-zinc-900">₹{amount || '0'}</span>
                                        </div>
                                        {appliedCoupon && (
                                            <div className="flex justify-between items-center mb-2 text-green-600 text-sm">
                                                <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> Coupon ({appliedCoupon})</span>
                                                <span className="font-semibold">- {discount}%</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center pt-2 border-t border-zinc-200">
                                            <span className="font-medium text-zinc-900">Total Payable</span>
                                            <span className="text-xl font-bold text-zinc-900">
                                                ₹{appliedCoupon ? (Number(amount) * (1 - discount / 100)).toFixed(2) : (amount || '0')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Coupon Input */}
                                    <div className="flex gap-2 mb-6">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            placeholder="Have a coupon code?"
                                            className="flex-1 px-4 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-500/20 focus:border-zinc-500 uppercase text-sm text-zinc-900"
                                            disabled={!!appliedCoupon}
                                        />
                                        {appliedCoupon ? (
                                            <button
                                                onClick={() => {
                                                    setAppliedCoupon(null);
                                                    setDiscount(0);
                                                    setCouponCode('');
                                                }}
                                                className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors text-sm"
                                            >
                                                Remove
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleApplyCoupon}
                                                disabled={!couponCode || isProcessing}
                                                className="px-4 py-2 bg-zinc-100 text-zinc-900 rounded-xl font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50 text-sm"
                                            >
                                                Apply
                                            </button>
                                        )}
                                    </div>

                                    <button
                                        onClick={handleProceedToPay}
                                        disabled={!amount || Number(amount) <= 0 || isProcessing}
                                        className="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-3.5 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-zinc-900/10"
                                    >
                                        {isProcessing ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                Proceed to Pay <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>

                                    <motion.button
                                        onClick={() => router.push('/dashboard')}
                                        className="w-full py-3 rounded-xl font-medium text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center gap-2 group relative overflow-hidden"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <span className="group-hover:translate-y-[-150%] transition-transform duration-300 absolute inset-0 flex items-center justify-center">
                                            Cancel Transaction
                                        </span>
                                        <span className="translate-y-[150%] group-hover:translate-y-0 transition-transform duration-300 absolute inset-0 flex items-center justify-center gap-2 font-semibold">
                                            <Frown className="w-4 h-4" /> Don't want to buy credits
                                        </span>
                                        <span className="opacity-0">Placeholder</span> {/* Keeps button height */}
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}

                        {step === 'pay' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-zinc-600 border border-zinc-200 shadow-sm">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Session Expires In</p>
                                            <p className="text-xl font-bold text-zinc-900 font-mono">{formatTime(timeLeft)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-3 border-b border-zinc-100">
                                        <span className="text-zinc-500">Amount</span>
                                        <span className="font-bold text-zinc-900">₹{appliedCoupon ? (Number(amount) * (1 - discount / 100)).toFixed(2) : amount}</span>
                                    </div>

                                    {/* UTR Input */}
                                    <div className="space-y-2">
                                        <label htmlFor="utr" className="text-xs font-medium text-zinc-500 uppercase tracking-wider">UTR Number / Transaction ID</label>
                                        <input
                                            type="text"
                                            id="utr"
                                            value={utrNumber}
                                            onChange={(e) => {
                                                setUtrNumber(e.target.value);
                                                setErrorMessage(null); // Clear error on input
                                            }}
                                            placeholder="Enter 12-digit UTR number"
                                            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-zinc-500/20 focus:border-zinc-500 transition-all text-zinc-900 ${errorMessage ? 'border-red-300 bg-red-50' : 'border-zinc-200'
                                                }`}
                                        />
                                        {errorMessage ? (
                                            <p className="text-xs text-red-500 font-medium">{errorMessage}</p>
                                        ) : (
                                            <p className="text-xs text-zinc-400">Enter the UTR number from your payment app after scanning.</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <OrderConfirmButton
                                        onOrderComplete={handleConfirmPayment}
                                        buttonText="I Have Paid"
                                        successText="Verifying..."
                                        className="w-full bg-zinc-900 hover:bg-zinc-800 text-white shadow-lg shadow-zinc-900/10"
                                        disabled={!utrNumber}
                                    />
                                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex gap-2 items-start">
                                        <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                        <p className="text-xs text-blue-700 leading-relaxed">
                                            Verification usually takes a few minutes but can take up to <strong>24 hours</strong>.
                                            If credits are not added after 24 hours, please contact support.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setStep('select')}
                                    className="w-full text-zinc-400 hover:text-zinc-600 text-sm py-2 transition-colors"
                                >
                                    Cancel Transaction
                                </button>
                            </motion.div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 text-zinc-400 text-xs justify-center">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Payments are secure and encrypted</span>
                    </div>
                </div>

                {/* Right Side: Visuals / QR Code */}
                <div className="hidden lg:flex flex-col items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 to-white rounded-3xl -z-10 border border-zinc-100" />

                    <AnimatePresence mode="wait">
                        {step === 'select' ? (
                            <motion.div
                                key="illustration"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="text-center space-y-4 p-8"
                            >
                                <div className="w-32 h-32 bg-zinc-900 rounded-2xl mx-auto flex items-center justify-center shadow-2xl rotate-3 border border-zinc-800">
                                    <CreditCard className="w-12 h-12 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-zinc-900">Instant Credits</h3>
                                <p className="text-zinc-500 max-w-xs mx-auto">
                                    Add credits to your account instantly using UPI or Card. Safe, secure, and fast.
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="qr"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white p-6 rounded-2xl shadow-xl border border-zinc-200 text-center"
                            >
                                <div className="mb-4">
                                    <p className="text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wider">Scan to Pay</p>
                                    <div className="w-64 h-64 bg-zinc-50 rounded-xl overflow-hidden border-2 border-dashed border-zinc-300 flex items-center justify-center relative group">
                                        {qrCodeUrl ? (
                                            <img src={qrCodeUrl} alt="Payment QR Code" className="w-full h-full object-contain p-2" />
                                        ) : (
                                            <div className="animate-pulse w-full h-full bg-zinc-200" />
                                        )}
                                    </div>
                                </div>
                                <p className="text-xs text-zinc-400">
                                    Use any UPI app to scan and pay
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
