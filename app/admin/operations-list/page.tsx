"use client";

import { useState, useEffect } from "react";
import {
    Search,
    Trash2,
    Filter,
    Download,
    ChevronLeft,
    ChevronRight,
    Loader2,
    CheckCircle2,
    X
} from "lucide-react";

interface Operation {
    id: string;
    reseller: string;
    serialNo: string;
    type: string;
    amount: number;
    date: string;
}

export default function OperationsListPage() {
    const [operations, setOperations] = useState<Operation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        // Mock data matching the screenshot
        setTimeout(() => {
            const mockData: Operation[] = [
                { id: "1", reseller: "Mazin", serialNo: "751323883", type: "Buy", amount: 43.50, date: "2025/06/03 - 18:43" },
                { id: "2", reseller: "Mazin", serialNo: "751224441", type: "Buy", amount: 108.00, date: "2025/06/03 - 22:05" },
                { id: "3", reseller: "Mazin", serialNo: "751317931", type: "Buy", amount: 216.00, date: "2025/06/03 - 22:23" },
                { id: "4", reseller: "Mazin", serialNo: "751288137", type: "Buy", amount: 216.00, date: "2025/06/03 - 22:34" },
                { id: "5", reseller: "Mazin", serialNo: "751701912", type: "Buy", amount: 44.37, date: "2025/06/04 - 19:13" },
                { id: "6", reseller: "Mazin", serialNo: "751773903", type: "Buy", amount: 110.18, date: "2025/06/04 - 19:20" },
                { id: "7", reseller: "Mazin", serialNo: "751882314", type: "Buy", amount: 43.50, date: "2025/06/04 - 20:45" },
                { id: "8", reseller: "Mazin", serialNo: "751993425", type: "Buy", amount: 54.00, date: "2025/06/05 - 09:12" },
                { id: "9", reseller: "Mazin", serialNo: "751004536", type: "Buy", amount: 108.00, date: "2025/06/05 - 11:30" },
                { id: "10", reseller: "Mazin", serialNo: "751115647", type: "Buy", amount: 43.50, date: "2025/06/05 - 14:15" }
            ];
            setOperations(mockData);
            setIsLoading(false);
        }, 600);
    }, []);

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this operation record?")) {
            setOperations(prev => prev.filter(op => op.id !== id));
            setMessage({ text: "Operation record deleted successfully", type: 'success' });
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const filteredOperations = operations.filter(op =>
        op.reseller.toLowerCase().includes(searchTerm.toLowerCase()) ||
        op.serialNo.includes(searchTerm)
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Operations List</h1>
                    <p className="text-sm text-gray-500 font-medium">A complete history of all system activities</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 flex items-center gap-2 hover:bg-gray-50 transition-colors">
                        <Download size={16} /> Export
                    </button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-all active:scale-95">
                        Refresh List
                    </button>
                </div>
            </div>

            {/* Main Table Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Search & Stats Bar */}
                <div className="p-4 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Find by Serial or Reseller..."
                            className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search size={16} className="absolute right-3 top-2.5 text-gray-400" />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest bg-white border border-gray-200 px-3 py-1.5 rounded-lg">
                            <CheckCircle2 size={12} className="text-green-500" />
                            21,060 Total Logs
                        </div>
                        <button className="p-2 border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-50">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="text-[10px] text-gray-400 uppercase font-bold tracking-[0.15em] border-b border-gray-100 bg-white">
                                <th className="py-5 px-8">Provider</th>
                                <th className="py-5 px-6">Reseller</th>
                                <th className="py-5 px-6">Serial Number</th>
                                <th className="py-5 px-6">Type</th>
                                <th className="py-5 px-6">Amount</th>
                                <th className="py-5 px-6">Action</th>
                                <th className="py-5 px-8 text-right">Date & Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50/50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="py-24 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="animate-spin text-blue-600" size={32} />
                                            <p className="text-sm font-semibold text-gray-500 italic">Querying audit logs...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredOperations.length > 0 ? (
                                filteredOperations.map((op, idx) => (
                                    <tr
                                        key={op.id}
                                        className={`${idx % 2 === 0 ? 'bg-white' : 'bg-[#f8faff]'} group hover:bg-blue-50/50 transition-all duration-200`}
                                    >
                                        <td className="py-4 px-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center p-1.5 shadow-md group-hover:scale-105 transition-transform">
                                                    <img src="/img/apple-icon.png" alt="Logo" className="w-full h-full object-contain invert" />
                                                </div>
                                                <span className="text-[11px] font-black text-gray-900 tracking-tighter">NEW HD</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm font-medium text-gray-600">{op.reseller}</td>
                                        <td className="py-4 px-6 text-[13px] font-mono font-bold text-gray-700 tracking-tight">{op.serialNo}</td>
                                        <td className="py-4 px-6 font-semibold text-blue-600 text-xs uppercase">{op.type}</td>
                                        <td className="py-4 px-6 text-[13px] font-black text-gray-800 tracking-tight">{op.amount.toFixed(2)}</td>
                                        <td className="py-4 px-6">
                                            <button
                                                onClick={() => handleDelete(op.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition-all shadow-sm active:translate-y-0.5"
                                            >
                                                <Trash2 size={12} /> Delete
                                            </button>
                                        </td>
                                        <td className="py-4 px-8 text-right text-[11px] font-bold text-gray-400 font-mono tracking-tighter">
                                            {op.date}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-gray-400 text-sm font-medium italic">
                                        No records found...
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/80 backdrop-blur-sm">
                    <div className="flex items-center gap-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <span>Showing 1 to {filteredOperations.length} of 21,060 rows</span>
                        <select className="bg-gray-100 border-none rounded px-2 py-0.5 text-[10px] focus:ring-0">
                            <option>10</option>
                            <option>25</option>
                            <option>50</option>
                        </select>
                        <span>records per page</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <button className="p-2 text-gray-300 hover:text-gray-600 transition-colors pointer-events-none">
                            <ChevronLeft size={18} />
                        </button>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map(page => (
                                <button
                                    key={page}
                                    className={`w-8 h-8 rounded-full text-[11px] font-black transition-all ${page === 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-gray-500 hover:bg-gray-100'}`}
                                >
                                    {page}
                                </button>
                            ))}
                            <span className="px-1 text-gray-300">...</span>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-all hover:translate-x-0.5">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Notification Toast */}
            {message && (
                <div className={`p-4 rounded-xl border flex items-center gap-3 animate-in slide-in-from-right-full duration-300 fixed bottom-6 right-6 z-50 shadow-2xl ${message.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                    <CheckCircle2 size={18} />
                    <span className="text-sm font-bold tracking-tight">{message.text}</span>
                    <button onClick={() => setMessage(null)} className="ml-4 opacity-50 hover:opacity-100 transition-opacity">
                        <X size={14} />
                    </button>
                </div>
            )}
        </div>
    );
}
