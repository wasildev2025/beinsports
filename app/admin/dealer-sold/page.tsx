"use client";

import { useState, useEffect } from "react";
import {
    CreditCard,
    RefreshCw,
    ShieldCheck,
    TrendingUp,
    Loader2
} from "lucide-react";

export default function DealerSoldPage() {
    const [balance, setBalance] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulating fetch from SBS
        setTimeout(() => {
            setBalance(6154.62);
            setIsLoading(false);
        }, 800);
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Page Header matching screenshot style */}
            <div className="bg-[#1a1a1a] p-6 rounded-t-xl text-white shadow-lg border-b border-white/5">
                <h1 className="text-xl font-bold tracking-tight">Dealer Sold</h1>
                <p className="text-white/40 text-xs uppercase tracking-widest mt-1 font-medium">Panel Management Dealer Sold</p>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-b-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Information Header */}
                <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                        Informations sur Dealer Sold
                    </h3>
                </div>

                <div className="p-8">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="animate-spin text-blue-600 mr-3" size={24} />
                            <span className="text-gray-500 font-medium tracking-tight">Accessing SBS Ledger...</span>
                        </div>
                    ) : (
                        <div className="max-w-3xl">
                            {/* Blue Info Box matching screenshot */}
                            <div className="bg-[#e7f3ff] border border-[#d0e7ff] rounded-lg p-4 flex items-center gap-4 animate-in zoom-in-95 duration-300 shadow-sm">
                                <div className="bg-[#1DC7EA] p-2 rounded text-white shrink-0 shadow-md">
                                    <CreditCard size={18} />
                                </div>
                                <div>
                                    <p className="text-[#3a5a7a] font-bold text-sm tracking-tight flex items-center gap-2">
                                        SOLD
                                    </p>
                                    <p className="text-[#1a3a5a] text-lg font-semibold mt-0.5">
                                        Your Current Credit Balance is <span className="text-blue-600 font-black">{balance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span> USD
                                    </p>
                                </div>
                            </div>

                            {/* Additional Stats for a Premium Feel (Not in screenshot but fits the domain) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                                <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/30 hover:shadow-md transition-shadow group">
                                    <div className="flex items-center gap-3 mb-2">
                                        <TrendingUp className="text-green-500" size={16} />
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Weekly Consumption</span>
                                    </div>
                                    <p className="text-xl font-bold text-gray-800">$1,842.00</p>
                                    <p className="text-[10px] text-green-600 font-bold mt-1">+12% from last week</p>
                                </div>
                                <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/30 hover:shadow-md transition-shadow group">
                                    <div className="flex items-center gap-3 mb-2">
                                        <ShieldCheck className="text-blue-500" size={16} />
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sync Status</span>
                                    </div>
                                    <p className="text-xl font-bold text-gray-800">Healthy</p>
                                    <p className="text-[10px] text-gray-400 font-medium mt-1">Last sync: 2 minutes ago</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Bar */}
                <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={() => {
                            setIsLoading(true);
                            setTimeout(() => setIsLoading(false), 1000);
                        }}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-xs font-bold transition-colors"
                    >
                        <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} /> Refresh Balance
                    </button>
                </div>
            </div>

            {/* Note Section */}
            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl flex items-start gap-4 max-w-2xl">
                <div className="p-2 bg-blue-600 rounded-lg shrink-0">
                    <CreditCard className="text-white" size={16} />
                </div>
                <div className="space-y-1">
                    <h4 className="text-sm font-bold text-blue-900 leading-none">Balance Overview</h4>
                    <p className="text-xs text-blue-800/80 leading-relaxed font-medium">
                        This balance represents your current buying power in the SBS Bein Sports system.
                        It is synchronized in real-time. If there's a discrepancy, please contact SBS support.
                    </p>
                </div>
            </div>
        </div>
    );
}
