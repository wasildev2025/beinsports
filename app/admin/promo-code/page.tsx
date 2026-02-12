"use client";

import { useState, useEffect } from "react";
import {
    Ticket,
    RefreshCw,
    CheckCircle2,
    Loader2,
    ShieldCheck
} from "lucide-react";

export default function PromoCodePage() {
    const [promoCode, setPromoCode] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        fetchPromoCode();
    }, []);

    const fetchPromoCode = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/dealer-config');
            if (res.ok) {
                const data = await res.json();
                if (data) {
                    setPromoCode(data.promoCode || "");
                }
            }
        } catch (error) {
            console.error("Failed to fetch promo code", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async () => {
        setIsSubmitting(true);
        setMessage(null);
        try {
            // Reusing dealer-config API which handles upsert
            const currentRes = await fetch('/api/admin/dealer-config');
            const currentData = currentRes.ok ? await currentRes.json() : {};

            const res = await fetch('/api/admin/dealer-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...currentData,
                    promoCode: promoCode
                }),
            });

            if (res.ok) {
                setMessage({ text: "Tokens updated successfully", type: 'success' });
            } else {
                setMessage({ text: "Failed to update tokens", type: 'error' });
            }
        } catch {
            setMessage({ text: "An error occurred", type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Page Header matching screenshot */}
            <div className="bg-[#1a1a1a] p-6 rounded-t-xl text-white shadow-lg border-b border-white/5">
                <h1 className="text-xl font-bold tracking-tight">Promo Code</h1>
                <p className="text-white/40 text-xs uppercase tracking-widest mt-1 font-medium">Panel Management Dealer Tokens</p>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-b-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Information Header */}
                <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                        Informations sur Dealer Tokens
                    </h3>
                </div>

                <div className="p-8">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="animate-spin text-blue-600 mr-3" size={24} />
                            <span className="text-gray-500 font-medium tracking-tight">Accessing Tokens...</span>
                        </div>
                    ) : (
                        <div className="max-w-4xl space-y-6">
                            {/* Input Field matching screenshot */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <Ticket size={14} className="text-blue-500" />
                                    Promo Code
                                </label>
                                <input
                                    type="text"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 transition-all shadow-inner"
                                    placeholder="Enter Token / Promo Code e.g. Ko2025"
                                />
                            </div>

                            {/* Update Button matching screenshot */}
                            <div className="flex justify-end">
                                <button
                                    onClick={handleUpdate}
                                    disabled={isSubmitting}
                                    className="bg-[#3a3a3a] text-white px-6 py-2.5 rounded-lg text-xs font-black shadow-xl hover:bg-black transition-all active:scale-95 flex items-center gap-2 group"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="animate-spin" size={14} />
                                    ) : (
                                        <CheckCircle2 size={14} className="text-green-400 group-hover:scale-110 transition-transform" />
                                    )}
                                    Update Tokens Login
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Bar */}
                <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={fetchPromoCode}
                        className="flex items-center gap-2 text-gray-400 hover:text-blue-600 text-xs font-bold transition-colors"
                    >
                        <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} /> Reload
                    </button>
                </div>
            </div>

            {/* Note Section */}
            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl flex items-start gap-4 max-w-2xl">
                <div className="p-2 bg-blue-600 rounded-lg shrink-0">
                    <ShieldCheck className="text-white" size={16} />
                </div>
                <div className="space-y-1">
                    <h4 className="text-sm font-bold text-blue-900 leading-none">Token Logic</h4>
                    <p className="text-xs text-blue-800/80 leading-relaxed font-medium">
                        The Promo Code acts as a secondary authentication token for dealer verification.
                        Ensure it matches the one currently active in your SBS environment to avoid desynchronization.
                    </p>
                </div>
            </div>
        </div>
    );
}
