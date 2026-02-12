"use client";

import { useState, useEffect } from "react";
import {
    Users,
    CreditCard,
    Key,
    Activity,
    AlertCircle,
    CheckCircle2,
    RefreshCw,
    ShieldCheck,
    Plus,
    ChevronRight
} from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeCodes: 0,
        todaySales: 0,
        sbsStatus: "Disconnected",
        lastSync: "Never"
    });

    useEffect(() => {
        // Mock fetching stats for now
        setStats({
            totalUsers: 42,
            activeCodes: 156,
            todaySales: 1240.50,
            sbsStatus: "Connected",
            lastSync: new Date().toLocaleTimeString()
        });
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">System Overview</h1>
                <p className="text-gray-500 text-sm">Welcome back, Administrator. Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Resellers"
                    value={stats.totalUsers}
                    icon={<Users className="text-blue-600" size={24} />}
                    color="bg-blue-50"
                />
                <StatCard
                    title="Active Codes"
                    value={stats.activeCodes}
                    icon={<Key className="text-purple-600" size={24} />}
                    color="bg-purple-50"
                />
                <StatCard
                    title="Today's Sales"
                    value={`$${stats.todaySales.toLocaleString()}`}
                    icon={<CreditCard className="text-green-600" size={24} />}
                    color="bg-green-50"
                />
                <StatCard
                    title="SBS Connection"
                    value={stats.sbsStatus}
                    icon={<Activity className="text-orange-600" size={24} />}
                    color="bg-orange-50"
                    status={stats.sbsStatus === "Connected" ? "success" : "warning"}
                />
            </div>

            {/* Main Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* SBS Status Card */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-600 rounded-lg">
                                <ShieldCheck className="text-white" size={20} />
                            </div>
                            <h3 className="font-bold text-gray-800">SBS Dealer Integration</h3>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center gap-1 transition-colors">
                            <RefreshCw size={14} /> Force Sync
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Connection Status</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className={`w-2 h-2 rounded-full ${stats.sbsStatus === "Connected" ? "bg-green-500" : "bg-red-500"}`}></div>
                                    <span className="font-semibold text-gray-700">{stats.sbsStatus}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Last Pulse</p>
                                <p className="text-sm font-medium text-gray-700 mt-1">{stats.lastSync}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 border border-gray-100 rounded-xl">
                                <p className="text-xs text-gray-500 mb-1">Authenticated Account</p>
                                <p className="font-medium text-gray-800">sbs_admin_dealer</p>
                            </div>
                            <div className="p-4 border border-gray-100 rounded-xl">
                                <p className="text-xs text-gray-500 mb-1">Active Session ID</p>
                                <p className="font-mono text-xs text-blue-600 truncate">7d8a9s...f2e1</p>
                            </div>
                        </div>

                        <div className="p-4 bg-blue-50 rounded-xl flex items-start gap-3">
                            <AlertCircle className="text-blue-600 shrink-0" size={18} />
                            <p className="text-xs text-blue-800 leading-relaxed">
                                The system is currently fetching data from SBS Bein Sports in real-time. If you experience delays, please verify your Session ID in the <span className="font-bold">Bein Dealer Login</span> settings.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-800 mb-6">Quick Administrative Actions</h3>
                    <div className="space-y-3">
                        <QuickAction label="Generate Bulk Codes" icon={<Plus size={16} />} color="text-purple-600" bgColor="bg-purple-50" />
                        <QuickAction label="Broadcast Notification" icon={<Megaphone className="text-blue-600" size={16} />} color="text-blue-600" bgColor="bg-blue-50" />
                        <QuickAction label="Check Dealer Balance" icon={<CreditCard size={16} />} color="text-green-600" bgColor="bg-green-50" />
                        <QuickAction label="View System Audit" icon={<ClipboardList size={16} />} color="text-gray-600" bgColor="bg-gray-50" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color, status }: { title: string, value: any, icon: any, color: string, status?: string }) {
    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`p-4 rounded-xl ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-xs text-gray-500 font-medium mb-1 capitalize">{title}</p>
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-gray-800">{value}</span>
                    {status === "success" && <CheckCircle2 className="text-green-500" size={14} />}
                </div>
            </div>
        </div>
    );
}

function QuickAction({ label, icon, color, bgColor }: { label: string, icon: any, color: string, bgColor: string }) {
    return (
        <button className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-50 hover:border-blue-200 hover:bg-blue-50/50 transition-all group">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${bgColor} ${color}`}>
                    {icon}
                </div>
                <span className="text-sm font-medium text-gray-700">{label}</span>
            </div>
            <ChevronRight className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" size={16} />
        </button>
    );
}

function ClipboardList({ size, className }: { size?: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <path d="M12 11h4" /><path d="M12 16h4" /><path d="M8 11h.01" /><path d="M8 16h.01" />
        </svg>
    )
}

function Megaphone({ size, className }: { size?: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="m3 11 18-5v12L3 14v-3z" />
            <path d="M11.6 16.8 a3 3 0 1 1-5.8-1.2" />
        </svg>
    )
}
