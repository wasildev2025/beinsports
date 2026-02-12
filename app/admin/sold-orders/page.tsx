"use client";

import { useState, useEffect } from "react";
import {
    Search,
    Download,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Loader2,
    DollarSign,
    Filter
} from "lucide-react";

interface SoldOrder {
    id: string;
    fullname: string;
    idExternal: string;
    oldAmount: number;
    newAmount: number;
    status: string;
    date: string;
}

interface SousResellerSold {
    id: string;
    reseller: string;
    sousReseller: string;
    oldSold: number;
    sold: number;
    date: string;
}

export default function SoldOrdersPage() {
    const [orders, setOrders] = useState<SoldOrder[]>([]);
    const [sousResellers, setSousResellers] = useState<SousResellerSold[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        // Mock data matching the screenshot
        setTimeout(() => {
            const mockOrders: SoldOrder[] = [
                { id: "1", fullname: "Bhutto", idExternal: "id-1749067422990", oldAmount: 0.00, newAmount: 2000.00, status: "Valid", date: "2025/06/04 - 22:03" },
                { id: "2", fullname: "Mazin", idExternal: "id-1749068770808", oldAmount: 92.90, newAmount: 500.00, status: "Valid", date: "2025/06/04 - 22:20" },
                { id: "3", fullname: "Ayman hail city", idExternal: "id-1749088429989", oldAmount: 0.00, newAmount: 1000.00, status: "Valid", date: "2025/06/04 - 22:37" },
                { id: "4", fullname: "Sohail Hail", idExternal: "id-1749089074828", oldAmount: 0.00, newAmount: 1000.00, status: "Valid", date: "2025/06/04 - 22:41" },
            ];

            const mockSous: SousResellerSold[] = [
                { id: "1", reseller: "Sohail Hail", sousReseller: "Nito", oldSold: 0.00, sold: 500.00, date: "2025/06/11 - 20:25" }
            ];

            setOrders(mockOrders);
            setSousResellers(mockSous);
            setIsLoading(false);
        }, 600);
    }, []);

    const filteredOrders = orders.filter(order =>
        order.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.idExternal.includes(searchTerm)
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Top Section Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Sold Orders</h1>
                    <p className="text-sm text-gray-500 font-medium tracking-tight">Managing global and sub-reseller sales records</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="bg-white border border-gray-200 p-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
                        <Download size={18} />
                    </button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-all active:scale-95">
                        Refresh Orders
                    </button>
                </div>
            </div>

            {/* Main Orders Table Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Find by Name or Transaction ID..."
                            className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search size={16} className="absolute right-3 top-2.5 text-gray-400" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="text-[10px] text-gray-400 uppercase font-black tracking-widest border-b border-gray-100 bg-white">
                                <th className="py-5 px-8">ID APP</th>
                                <th className="py-5 px-6">Fullname</th>
                                <th className="py-5 px-6">External ID</th>
                                <th className="py-5 px-6">Old Sold</th>
                                <th className="py-5 px-6">New Sold</th>
                                <th className="py-5 px-6 text-center">Status</th>
                                <th className="py-5 px-8 text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="py-24 text-center">
                                        <Loader2 className="animate-spin text-blue-600 mx-auto" size={32} />
                                    </td>
                                </tr>
                            ) : filteredOrders.map((order, idx) => (
                                <tr key={order.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-[#f8faff]'} group hover:bg-blue-50/30 transition-colors`}>
                                    <td className="py-4 px-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center p-1.5 shadow-md">
                                                <img src="/img/apple-icon.png" alt="Logo" className="w-full h-full object-contain invert" />
                                            </div>
                                            <span className="text-[11px] font-black text-gray-900 tracking-tighter">NEW HD</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-sm font-bold text-gray-700">{order.fullname}</td>
                                    <td className="py-4 px-6 text-xs font-mono text-gray-500">{order.idExternal}</td>
                                    <td className="py-4 px-6 text-xs font-black text-gray-400">{order.oldAmount.toFixed(2)}</td>
                                    <td className="py-4 px-6 text-sm font-black text-gray-900">{order.newAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                    <td className="py-4 px-6">
                                        <div className="flex justify-center">
                                            <span className="bg-[#28a745] text-white text-[10px] font-black px-4 py-1.5 rounded-md flex items-center gap-1.5 shadow-sm shadow-green-500/20">
                                                <CheckCircle2 size={10} /> {order.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-8 text-right text-[11px] font-bold text-gray-400 font-mono">
                                        {order.date}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="bg-gray-50 border-t border-gray-100">
                                <td colSpan={4} className="py-4 px-8 text-right">
                                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Total Sold Sent:</span>
                                </td>
                                <td colSpan={3} className="py-4 px-6">
                                    <span className="text-sm font-black text-gray-900">2111862.8799999999 $</span>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Pagination matching screenshot */}
                <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                        <span>Showing 1 to {filteredOrders.length} of 1315 rows</span>
                        <select className="bg-gray-100 border-none rounded px-2 py-1 text-[10px]">
                            <option>10</option>
                            <option>25</option>
                        </select>
                        <span>records per page</span>
                    </div>
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(p => (
                            <button key={p} className={`w-8 h-8 rounded-full text-[11px] font-black ${p === 1 ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                                {p}
                            </button>
                        ))}
                        <ChevronRight size={18} className="text-gray-300 ml-2" />
                    </div>
                </div>
            </div>

            {/* Sous Reseller Section matching screenshot dark header */}
            <div className="space-y-4">
                <div className="bg-[#1a1a1a] p-5 rounded-t-2xl shadow-xl flex items-center justify-between border-b border-white/5">
                    <div>
                        <h2 className="text-white text-lg font-bold tracking-tight">Sold Sous Resselers</h2>
                        <p className="text-white/40 text-[10px] uppercase font-medium tracking-[0.2em] mt-0.5">Liste de gestion des Sold Sous Resselers</p>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                        <Filter className="text-white" size={18} />
                    </div>
                </div>

                <div className="bg-white rounded-b-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                            <thead>
                                <tr className="text-[10px] text-gray-400 uppercase font-black tracking-widest border-b border-gray-100 bg-gray-50/50">
                                    <th className="py-5 px-8">ID</th>
                                    <th className="py-5 px-6">Reseller</th>
                                    <th className="py-5 px-6">Sous-Reseller</th>
                                    <th className="py-5 px-6">Old Sold</th>
                                    <th className="py-5 px-6">Sold</th>
                                    <th className="py-5 px-8 text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {sousResellers.map((item, idx) => (
                                    <tr key={item.id} className="group hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center p-1.5">
                                                    <img src="/img/apple-icon.png" alt="Logo" className="w-full h-full object-contain invert" />
                                                </div>
                                                <span className="text-[11px] font-black text-gray-400">#SOI-{item.id}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm font-bold text-gray-700">{item.reseller}</td>
                                        <td className="py-4 px-6 text-sm font-medium text-blue-600 underline cursor-pointer">{item.sousReseller}</td>
                                        <td className="py-4 px-6 text-xs font-black text-gray-400">{item.oldSold.toFixed(2)}</td>
                                        <td className="py-4 px-6">
                                            <span className="text-sm font-black text-gray-900 border-b-2 border-green-200">{item.sold.toFixed(2)}</span>
                                        </td>
                                        <td className="py-4 px-8 text-right text-[11px] font-bold text-gray-400 font-mono tracking-tighter">
                                            {item.date}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Summary Note */}
            <div className="p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-4 max-w-3xl">
                <div className="p-2 bg-green-600 rounded-lg shrink-0">
                    <DollarSign className="text-white" size={16} />
                </div>
                <p className="text-xs text-green-800 leading-relaxed font-bold italic tracking-tight">
                    All prices are synchronized with the primary ledger. Sold Sous Reseller amounts are deducted from the parent Reseller&apos;s balance automatically.
                </p>
            </div>
        </div>
    );
}
