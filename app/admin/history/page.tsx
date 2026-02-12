"use client";

import { useState, useEffect } from "react";
import {
    Search,
    History as HistoryIcon,
    Loader2,
    RefreshCw,
    ShieldCheck,
    ShieldAlert,
    Monitor,
    Smartphone,
    Globe
} from "lucide-react";

interface ConnectionLog {
    id: number;
    username: string;
    ip: string;
    device: string;
    status: string;
    createdAt: string;
}

export default function HistoryConnectionPage() {
    const [logs, setLogs] = useState<ConnectionLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchLogs = async () => {
        setIsLoading(true);
        try {
            // Mocking data based on what it should look like
            setTimeout(() => {
                const mockLogs: ConnectionLog[] = [
                    { id: 1, username: "admin", ip: "192.168.1.1", device: "Chrome / Windows", status: "LOGIN", createdAt: new Date().toISOString() },
                    { id: 2, username: "reseller_01", ip: "103.45.12.9", device: "Safari / iPhone", status: "LOGIN", createdAt: new Date(Date.now() - 3600000).toISOString() },
                    { id: 3, username: "unknown", ip: "185.23.11.2", device: "Firefox / Linux", status: "FAILED", createdAt: new Date(Date.now() - 7200000).toISOString() },
                    { id: 4, username: "admin", ip: "192.168.1.1", device: "Chrome / Windows", status: "LOGOUT", createdAt: new Date(Date.now() - 10800000).toISOString() },
                ];
                setLogs(mockLogs);
                setIsLoading(false);
            }, 600);
        } catch (error) {
            console.error("Failed to fetch logs");
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log =>
        log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ip.includes(searchTerm)
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">History Connection</h1>
                    <p className="text-sm text-gray-500 font-medium tracking-tight">Security monitoring and access logs</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Filter by User or IP..."
                            className="bg-white border border-gray-200 rounded-lg py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64 shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search size={16} className="absolute right-3 top-2.5 text-gray-400" />
                    </div>
                    <button
                        onClick={fetchLogs}
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
                        <HistoryIcon className="text-blue-500" size={18} />
                        <span className="text-white text-sm font-bold tracking-tight">Access Log Buffer</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="text-[10px] text-gray-400 uppercase font-black tracking-widest border-b border-gray-100 bg-gray-50/50">
                                <th className="py-5 px-8">Session ID</th>
                                <th className="py-5 px-6">Username</th>
                                <th className="py-5 px-6">IP Address</th>
                                <th className="py-5 px-6">Device / Agent</th>
                                <th className="py-5 px-6">Status</th>
                                <th className="py-5 px-8 text-right">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 font-medium">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="py-24 text-center">
                                        <Loader2 className="animate-spin text-blue-600 mx-auto" size={32} />
                                    </td>
                                </tr>
                            ) : filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-24 text-center text-gray-400">
                                        No connection records found.
                                    </td>
                                </tr>
                            ) : filteredLogs.map((log, idx) => (
                                <tr
                                    key={log.id}
                                    className={`${idx % 2 === 0 ? 'bg-white' : 'bg-[#f0f7ff]'} group hover:bg-blue-50/50 transition-colors`}
                                >
                                    <td className="py-4 px-8">
                                        <span className="text-[10px] font-black text-gray-400">#LOG-{log.id.toString().padStart(4, '0')}</span>
                                    </td>
                                    <td className="py-4 px-6 text-sm font-bold text-gray-900 flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center p-1">
                                            <img src="/img/apple-icon.png" alt="Logo" className="w-full h-full object-contain invert" />
                                        </div>
                                        {log.username}
                                    </td>
                                    <td className="py-4 px-6 text-xs text-blue-600 font-bold underline cursor-pointer">{log.ip}</td>
                                    <td className="py-4 px-6 text-xs text-gray-500 flex items-center gap-2">
                                        {log.device.includes("iPhone") ? <Smartphone size={14} /> : <Monitor size={14} />}
                                        {log.device}
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`text-[10px] font-black px-3 py-1 rounded-md flex items-center gap-1.5 w-fit ${log.status === 'LOGIN' ? 'bg-green-100 text-green-700' :
                                                log.status === 'LOGOUT' ? 'bg-gray-100 text-gray-600' :
                                                    'bg-red-100 text-red-700'
                                            }`}>
                                            {log.status === 'LOGIN' ? <ShieldCheck size={10} /> : <ShieldAlert size={10} />}
                                            {log.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-8 text-right text-[11px] font-bold text-gray-400 font-mono italic">
                                        {new Date(log.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Security Tip */}
            <div className="p-4 bg-black border border-white/5 rounded-2xl flex items-center gap-4 text-white">
                <div className="p-3 bg-blue-600 rounded-xl">
                    <Globe size={20} />
                </div>
                <div>
                    <h3 className="text-xs font-black uppercase tracking-widest mb-0.5">Global IP Monitoring</h3>
                    <p className="text-[11px] text-white/50 font-medium">System automatically flags unusual login locations. Suspicious activity is logged for 30 days.</p>
                </div>
            </div>
        </div>
    );
}
