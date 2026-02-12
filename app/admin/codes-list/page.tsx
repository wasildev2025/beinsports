"use client";

import { useState, useEffect } from "react";
import {
    Search,
    Trash2,
    Copy,
    Loader2,
    RefreshCw,
    Ticket,
    X,
    Check
} from "lucide-react";

interface Code {
    id: number;
    code: string;
    type: string;
    createdAt: string;
}

export default function CodesListPage() {
    const [codes, setCodes] = useState<Code[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    const fetchCodes = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/codes?status=list");
            const data = await res.json();
            setCodes(data);
        } catch (error) {
            console.error("Failed to fetch codes");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCodes();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this code?")) return;

        try {
            const res = await fetch(`/api/admin/codes?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setCodes(prev => prev.filter(c => c.id !== id));
                setMessage({ text: "Code deleted successfully", type: "success" });
            } else {
                setMessage({ text: "Failed to delete code", type: "error" });
            }
        } catch (error) {
            setMessage({ text: "Error deleting code", type: "error" });
        }
        setTimeout(() => setMessage(null), 3000);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setMessage({ text: "Code copied to clipboard", type: "success" });
        setTimeout(() => setMessage(null), 2000);
    };

    const filteredCodes = codes.filter(c =>
        c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Codes List</h1>
                    <p className="text-sm text-gray-500 font-medium tracking-tight">Managing available activation codes</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Find code..."
                            className="bg-white border border-gray-200 rounded-lg py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64 shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search size={16} className="absolute right-3 top-2.5 text-gray-400" />
                    </div>
                    <button
                        onClick={fetchCodes}
                        className="bg-white text-gray-600 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                    >
                        <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-[#1a1a1a] px-6 py-4 flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-2">
                        <Ticket className="text-blue-500" size={18} />
                        <span className="text-white text-sm font-bold tracking-tight">Available Codes</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="text-[10px] text-gray-400 uppercase font-black tracking-widest border-b border-gray-100 bg-gray-50/50">
                                <th className="py-5 px-8">ID APP</th>
                                <th className="py-5 px-6">Activation Code</th>
                                <th className="py-5 px-6">Package Type</th>
                                <th className="py-5 px-6">Created At</th>
                                <th className="py-5 px-8 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-24 text-center">
                                        <Loader2 className="animate-spin text-blue-600 mx-auto" size={32} />
                                    </td>
                                </tr>
                            ) : filteredCodes.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-24 text-center text-gray-400 font-medium">
                                        No codes found in this category.
                                    </td>
                                </tr>
                            ) : filteredCodes.map((code, idx) => (
                                <tr
                                    key={code.id}
                                    className={`${idx % 2 === 0 ? 'bg-white' : 'bg-[#f8faff]'} group hover:bg-blue-50/50 transition-colors`}
                                >
                                    <td className="py-4 px-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center p-1.5 shadow-md">
                                                <img src="/img/apple-icon.png" alt="Logo" className="w-full h-full object-contain invert" />
                                            </div>
                                            <span className="text-[11px] font-black text-gray-900 uppercase">NEW HD</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <code className="text-sm font-black text-blue-600 font-mono tracking-wider">{code.code}</code>
                                    </td>
                                    <td className="py-4 px-6 text-xs font-black text-gray-500 uppercase">
                                        {code.type}
                                    </td>
                                    <td className="py-4 px-6 text-[11px] font-bold text-gray-400 font-mono">
                                        {new Date(code.createdAt).toLocaleString()}
                                    </td>
                                    <td className="py-4 px-8 text-right space-x-2">
                                        <button
                                            onClick={() => copyToClipboard(code.code)}
                                            className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-100 transition-all active:scale-95"
                                            title="Copy Code"
                                        >
                                            <Copy size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(code.id)}
                                            className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition-all active:scale-95"
                                            title="Delete Code"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Notification Toast */}
            {message && (
                <div className={`p-4 rounded-xl border flex items-center gap-3 animate-in slide-in-from-right-full duration-300 fixed bottom-6 right-6 z-50 shadow-2xl ${message.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                    {message.type === 'success' ? <Check size={18} /> : <X size={18} />}
                    <span className="text-sm font-black tracking-tight">{message.text}</span>
                </div>
            )}
        </div>
    );
}
