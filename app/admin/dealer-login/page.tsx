"use client";

import { useState, useEffect } from "react";
import {
    Search,
    Edit,
    Trash2,
    Settings,
    Eye,
    EyeOff,
    Save,
    X,
    Loader2,
    ShieldAlert
} from "lucide-react";

interface DealerConfig {
    id: number;
    username: string;
    password: string;
    secret: string;
}

export default function DealerLoginPage() {
    const [config, setConfig] = useState<DealerConfig | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showSecret, setShowSecret] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        secret: ""
    });

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/dealer-config');
            if (res.ok) {
                const data = await res.json();
                if (data) {
                    setConfig(data);
                    setFormData({
                        username: data.username,
                        password: data.password,
                        secret: data.secret
                    });
                }
            }
        } catch (error) {
            console.error("Failed to fetch dealer config", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSubmitting(true);
        setMessage(null);
        try {
            const res = await fetch('/api/admin/dealer-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setMessage({ text: "Credentials updated successfully", type: 'success' });
                setIsEditing(false);
                fetchConfig();
            } else {
                setMessage({ text: "Failed to update credentials", type: 'error' });
            }
        } catch (error) {
            setMessage({ text: "An error occurred", type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleEdit = () => {
        if (isEditing) {
            // Reset form if canceling
            setFormData({
                username: config?.username || "",
                password: config?.password || "",
                secret: config?.secret || ""
            });
        }
        setIsEditing(!isEditing);
        setMessage(null);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Page Header */}
            <div className="bg-[#1a1a1a] p-6 rounded-t-xl text-white flex justify-between items-center shadow-lg border-b border-white/5">
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Dealer Login</h1>
                    <p className="text-white/40 text-xs uppercase tracking-widest mt-1 font-medium">Panel Management Dealer Login</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleEdit}
                        className={`p-2 rounded-lg transition-all ${isEditing ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'}`}
                    >
                        {isEditing ? <X size={18} /> : <Edit size={18} />}
                    </button>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-b-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Search Bar matching screenshot aesthetic (though mock for single row) */}
                <div className="p-4 border-b border-gray-50 flex justify-end items-center bg-gray-50/50">
                    <div className="relative w-64">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full bg-white border border-gray-200 rounded-md py-1.5 pl-3 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <Search size={14} className="absolute right-2.5 top-2.5 text-gray-400" />
                    </div>
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[11px] text-gray-400 uppercase font-bold tracking-wider border-b border-gray-100">
                                <th className="py-4 px-6">Username</th>
                                <th className="py-4 px-6">Password</th>
                                <th className="py-4 px-6">Secret</th>
                                <th className="py-4 px-6 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="py-12 text-center text-gray-400">
                                        <Loader2 className="animate-spin inline-block mr-2" size={18} />
                                        Loading credentials...
                                    </td>
                                </tr>
                            ) : config || isEditing ? (
                                <tr className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="py-5 px-6">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={formData.username}
                                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                                className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            />
                                        ) : (
                                            <span className="text-sm font-medium text-gray-700">{config?.username || "Not Set"}</span>
                                        )}
                                    </td>
                                    <td className="py-5 px-6">
                                        <div className="flex items-center gap-2 max-w-[150px]">
                                            {isEditing ? (
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    value={formData.password}
                                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                    className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                />
                                            ) : (
                                                <span className="text-sm text-gray-500 font-mono">
                                                    {showPassword ? config?.password : "••••••••"}
                                                </span>
                                            )}
                                            <button
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="bg-green-500 text-white p-1 rounded-md hover:bg-green-600 transition-colors shrink-0"
                                            >
                                                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                            </button>
                                        </div>
                                    </td>
                                    <td className="py-5 px-6">
                                        <div className="flex items-center gap-2 max-w-[250px]">
                                            {isEditing ? (
                                                <input
                                                    type={showSecret ? "text" : "password"}
                                                    value={formData.secret}
                                                    onChange={(e) => setFormData({ ...formData, secret: e.target.value })}
                                                    className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                />
                                            ) : (
                                                <span className="text-sm text-gray-500 font-mono truncate">
                                                    {showSecret ? config?.secret : "••••••••••••••••••••••••"}
                                                </span>
                                            )}
                                            <button
                                                onClick={() => setShowSecret(!showSecret)}
                                                className="bg-green-500 text-white p-1 rounded-md hover:bg-green-600 transition-colors shrink-0"
                                            >
                                                {showSecret ? <EyeOff size={14} /> : <Eye size={14} />}
                                            </button>
                                        </div>
                                    </td>
                                    <td className="py-5 px-6 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            {isEditing ? (
                                                <>
                                                    <button
                                                        onClick={handleSave}
                                                        disabled={isSubmitting}
                                                        className="bg-blue-500 text-white p-1.5 rounded-md hover:bg-blue-600 transition-colors"
                                                        title="Save"
                                                    >
                                                        {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                                                    </button>
                                                    <button
                                                        onClick={toggleEdit}
                                                        className="bg-gray-100 text-gray-400 p-1.5 rounded-md hover:bg-gray-200 hover:text-gray-600 transition-colors"
                                                        title="Cancel"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={toggleEdit}
                                                        className="bg-blue-400 text-white p-1.5 rounded-md hover:bg-blue-500 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit size={14} />
                                                    </button>
                                                    <button className="bg-orange-400 text-white p-1.5 rounded-md hover:bg-orange-500 transition-colors" title="Sync Status">
                                                        <Settings size={14} />
                                                    </button>
                                                    <button className="bg-red-400 text-white p-1.5 rounded-md hover:bg-red-500 transition-colors" title="Remove">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                <tr>
                                    <td colSpan={4} className="py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <ShieldAlert className="text-orange-400" size={32} />
                                            <p className="text-gray-500 text-sm font-medium">No credentials configured yet.</p>
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="mt-2 bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95"
                                            >
                                                ADD CREDENTIALS
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                <div className="p-4 bg-gray-50/50 border-t border-gray-100 text-[11px] text-gray-400 font-medium">
                    Showing {config ? 1 : 0} to {config ? 1 : 0} of {config ? 1 : 0} rows
                </div>
            </div>

            {/* Notification Toast */}
            {message && (
                <div className={`p-4 rounded-xl border flex items-center gap-3 animate-in slide-in-from-right-full duration-300 fixed bottom-6 right-6 z-50 shadow-2xl ${message.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                    <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm font-semibold">{message.text}</span>
                    <button onClick={() => setMessage(null)} className="ml-4 opacity-50 hover:opacity-100 transition-opacity">
                        <X size={14} />
                    </button>
                </div>
            )}

            {/* Warning Message Box */}
            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl flex items-start gap-4">
                <div className="p-2 bg-blue-600 rounded-lg shrink-0">
                    <Settings className="text-white" size={16} />
                </div>
                <div className="space-y-1">
                    <h4 className="text-sm font-bold text-blue-900 leading-none">Security Note</h4>
                    <p className="text-xs text-blue-800/80 leading-relaxed font-medium">
                        These credentials are used to securely connect to the SBS Bein Sports dealer system.
                        The <span className="font-bold">Secret</span> field usually requires the latest Session ID or API Token to maintain a valid connection.
                    </p>
                </div>
            </div>
        </div>
    );
}
