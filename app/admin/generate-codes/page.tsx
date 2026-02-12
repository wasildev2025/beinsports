"use client";

import { useState } from "react";
import {
    Ticket,
    Plus,
    Loader2,
    CheckCircle,
    Copy,
    RefreshCw,
    AlertCircle,
    Package
} from "lucide-react";

export default function GenerateCodesPage() {
    const [packageType, setPackageType] = useState("1 Month");
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            const res = await fetch("/api/admin/codes/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ packageType, quantity }),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage({ text: data.error || "Failed to generate codes", type: "error" });
            } else {
                setGeneratedCodes(data.codes);
                setMessage({ text: `${data.codes.length} codes generated successfully!`, type: "success" });
            }
        } catch (error) {
            setMessage({ text: "An error occurred during generation", type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Simple visual feedback could be added here
    };

    const copyAll = () => {
        navigator.clipboard.writeText(generatedCodes.join("\n"));
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Generate Codes</h1>
                <p className="text-sm text-gray-500 font-medium">Create new activation codes for your resellers and users.</p>
            </div>

            {/* Generation Form Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-[#1a1a1a] p-6 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600/20 p-2 rounded-lg">
                            <Ticket className="text-blue-500" size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">New Activation Codes</h2>
                            <p className="text-xs text-white/40 uppercase tracking-widest font-bold mt-0.5">Configure generation parameters</p>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    <form onSubmit={handleGenerate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <Package size={14} /> Package Type
                                </label>
                                <select
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none"
                                    value={packageType}
                                    onChange={(e) => setPackageType(e.target.value)}
                                >
                                    <option>1 Month</option>
                                    <option>3 Months</option>
                                    <option>6 Months</option>
                                    <option>12 Months</option>
                                    <option>Full Package</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <Plus size={14} /> Quantity
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    value={quantity}
                                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                                />
                                <p className="text-[10px] text-gray-400 font-medium">Maximum 100 codes per batch.</p>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:grayscale"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        <span>Generating Secure Codes...</span>
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw size={20} />
                                        <span>Generate Codes Now</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Results Section */}
            {generatedCodes.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                        <div className="flex items-center gap-2">
                            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                            <h3 className="text-sm font-black text-gray-700 uppercase tracking-widest">Generated Results ({generatedCodes.length})</h3>
                        </div>
                        <button
                            onClick={copyAll}
                            className="bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-50 transition-all flex items-center gap-2"
                        >
                            <Copy size={14} /> Copy All
                        </button>
                    </div>

                    <div className="p-4 bg-gray-50/30">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto custom-scrollbar p-2">
                            {generatedCodes.map((code, idx) => (
                                <div key={idx} className="bg-white border border-gray-100 p-4 rounded-xl flex items-center justify-between group shadow-sm hover:border-blue-200 transition-all">
                                    <code className="text-blue-600 font-mono font-black text-sm">{code}</code>
                                    <button
                                        onClick={() => copyToClipboard(code)}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <Copy size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Warning Message */}
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-4">
                <div className="p-2 bg-amber-500 rounded-lg shrink-0 mt-1">
                    <AlertCircle className="text-white" size={16} />
                </div>
                <div>
                    <h4 className="text-xs font-black text-amber-800 uppercase tracking-widest mb-1">Attention Required</h4>
                    <p className="text-[11px] text-amber-800/80 leading-relaxed font-medium">
                        Make sure to store these codes securely. Once generated, they are active and can be used by anyone with terminal access. You can monitor their status in the "Codes List" section.
                    </p>
                </div>
            </div>

            {/* Toast Message */}
            {message && (
                <div className={`p-4 rounded-xl border flex items-center gap-3 animate-in slide-in-from-right-full duration-300 fixed bottom-6 right-6 z-50 shadow-2xl ${message.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                    <CheckCircle size={18} />
                    <span className="text-sm font-black tracking-tight">{message.text}</span>
                </div>
            )}
        </div>
    );
}
