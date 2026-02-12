"use client";

import { useState, useEffect } from "react";
import {
    Megaphone,
    Send,
    Loader2,
    CheckCircle,
    Globe,
    User,
    History,
    Trash2,
    Clock,
    X,
    Bell,
    RefreshCw
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, limit, deleteDoc, doc } from "firebase/firestore";

interface Notification {
    id: string;
    text: string;
    type: string;
    createdAt: any;
}

export default function AddNotificationPage() {
    const [text, setText] = useState("");
    const [targetType, setTargetType] = useState("global");
    const [isLoading, setIsLoading] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isFetching, setIsFetching] = useState(true);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    const fetchNotifications = async () => {
        setIsFetching(true);
        try {
            const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"), limit(10));
            const querySnapshot = await getDocs(q);
            const fetched: Notification[] = [];
            querySnapshot.forEach((doc) => {
                fetched.push({ id: doc.id, ...doc.data() } as Notification);
            });
            setNotifications(fetched);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        setIsLoading(true);
        setMessage(null);

        try {
            // Push to Firebase Firestore
            await addDoc(collection(db, "notifications"), {
                text,
                type: targetType,
                createdAt: serverTimestamp(),
                author: "System Admin"
            });

            // Also push to Prisma via API for persistence/logging (optional but good)
            await fetch("/api/admin/notifications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, targetType }),
            });

            setMessage({ text: "Notification pushed successfully!", type: "success" });
            setText("");
            fetchNotifications();
        } catch (error) {
            console.error("Firebase Notification Error:", error);
            setMessage({ text: "Failed to push to Firebase", type: "error" });
        } finally {
            setIsLoading(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Remove this notification?")) return;
        try {
            await deleteDoc(doc(db, "notifications", id));
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (error) {
            console.error("Delete failed");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Add Notification</h1>
                    <p className="text-sm text-gray-500 font-medium">Push real-time system alerts and announcements to all users.</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-full">
                    <Bell className="text-blue-600" size={24} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-[#1a1a1a] p-6 text-white">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <Megaphone className="text-blue-500" size={20} />
                                Create Announcement
                            </h2>
                        </div>

                        <div className="p-8">
                            <form onSubmit={handleSend} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Target Audience</label>
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setTargetType("global")}
                                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-bold text-sm ${targetType === 'global' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'}`}
                                        >
                                            <Globe size={18} /> Global Message
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setTargetType("admins")}
                                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-bold text-sm ${targetType === 'admins' ? 'border-purple-600 bg-purple-50 text-purple-600' : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'}`}
                                        >
                                            <User size={18} /> Admin Only
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Message Content</label>
                                    <textarea
                                        rows={4}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 px-4 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                                        placeholder="Enter notification text here..."
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading || !text.trim()}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                                    <span>{isLoading ? "Broadcasting..." : "Broadcast Real-time Notification"}</span>
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Pro Tip */}
                    <div className="p-5 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-600/20 flex gap-4 items-center">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <CheckCircle size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest opacity-60">Firebase Powered</p>
                            <p className="text-sm font-bold mt-1">Notifications are delivered instantly to active users without page refresh.</p>
                        </div>
                    </div>
                </div>

                {/* History Section */}
                <div className="space-y-6 text-gray-800">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full h-[600px]">
                        <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                            <h3 className="text-sm font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                                <History size={16} /> Recent Activity
                            </h3>
                            <button onClick={fetchNotifications} className="text-blue-600 hover:rotate-180 transition-transform">
                                <RefreshCw size={14} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {isFetching ? (
                                <div className="flex flex-col items-center justify-center h-48 gap-3 opacity-40">
                                    <Loader2 className="animate-spin" size={32} />
                                    <span className="text-xs font-black uppercase tracking-widest">Loading Feed...</span>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="text-center py-12 opacity-30 italic text-sm">No recent messages found.</div>
                            ) : notifications.map((notif) => (
                                <div key={notif.id} className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm group hover:border-blue-100 transition-all relative">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${notif.type === 'global' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                            {notif.type}
                                        </span>
                                        <button onClick={() => handleDelete(notif.id)} className="opacity-0 group-hover:opacity-100 text-red-500 p-1 hover:bg-red-50 rounded transition-all">
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                    <p className="text-sm font-medium text-gray-700 leading-relaxed mb-3">{notif.text}</p>
                                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                                        <Clock size={10} /> {notif.createdAt?.toDate ? notif.createdAt.toDate().toLocaleString() : "Just now"}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast */}
            {message && (
                <div className={`p-4 rounded-xl border flex items-center gap-3 animate-in slide-in-from-right-full duration-300 fixed bottom-6 right-6 z-50 shadow-2xl ${message.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                    {message.type === 'success' ? <CheckCircle size={18} /> : <X size={18} />}
                    <span className="text-sm font-black tracking-tight">{message.text}</span>
                </div>
            )}
        </div>
    );
}
