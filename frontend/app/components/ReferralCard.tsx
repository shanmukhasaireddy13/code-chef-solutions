"use client";

import { useState, useEffect } from 'react';
import { Gift, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ReferralStats {
    referralCode: string;
    referralCount: number;
    totalEarnings: number;
}

interface ReferralCardProps {
    stats?: ReferralStats;
}

export default function ReferralCard({ stats }: ReferralCardProps) {
    const [referralData, setReferralData] = useState<ReferralStats>(stats || {
        referralCode: 'LOADING...',
        referralCount: 0,
        totalEarnings: 0
    });
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (stats) {
            setReferralData(stats);
        }
    }, [stats]);

    const copyToClipboard = () => {
        // Construct the full referral link
        const link = `${window.location.origin}/?ref=${referralData.referralCode}&action=signup`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        toast.success("Referral link copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                    <Gift className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                    <h2 className="font-bold text-zinc-900">Refer & Earn</h2>
                    <div className="flex gap-3 text-sm text-zinc-500">
                        <span>{referralData.referralCount} Referrals</span>
                        <span>•</span>
                        <span className="text-blue-600 font-medium">{referralData.totalEarnings} Credits Earned</span>
                    </div>
                </div>
            </div>

            <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors flex items-center gap-2"
            >
                {copied ? (
                    <>
                        <Check className="w-4 h-4" />
                        Copied
                    </>
                ) : (
                    <>
                        <Copy className="w-4 h-4" />
                        Copy Link
                    </>
                )}
            </button>
        </div>
    );
}
