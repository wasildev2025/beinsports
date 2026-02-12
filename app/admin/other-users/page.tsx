"use client";

import { useState, useEffect } from "react";
import {
    Search,
    Plus,
    Trash2,
    Key,
    Ban,
    Check,
    DollarSign,
    X,
    Loader2,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

interface User {
    id: number;
    fullname: string;
    email: string;
    reseller: string;
    type: string;
    sold: number;
    max: number;
    disabled: boolean;
}

export default function OthersManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        // Mock data matching the "Other Users" screenshot (Activation/Other-Users)
        setTimeout(() => {
            const mockData: User[] = [
                { id: 1, fullname: "Nito", email: "lahmed555@gmail.com", reseller: "Sohail Hail", type: "Sous-Resseler", sold: 29.50, max: 0, disabled: false },
                { id: 2, fullname: "Abdullah", email: "abdullah123@gmail.com", reseller: "Yasir Khan", type: "Sous-Resseler", sold: 0.00, max: 0, disabled: false },
                { id: 3, fullname: "mahiirstore.keb@gmail.com", email: "mahiirstore.keb@gmail.com", reseller: "Faisal Dusri", type: "Sous-Resseler", sold: 0.00, max: 0, disabled: false },
                { id: 4, fullname: "test", email: "husain_amro1984@hq.com", reseller: "tntwolve", type: "Sous-Resseler", sold: 0.00, max: 0, disabled: false },
                { id: 5, fullname: "salle", email: "mazinabdullah25@gmail.com", reseller: "Gulzar", type: "Sous-Resseler", sold: 1.53, max: 0, disabled: false },
                { id: 6, fullname: "test2", email: "husain_amro@hotmail.com", reseller: "tntwolve", type: "Sous-Resseler", sold: 0.00, max: 0, disabled: false },
            ];
            setUsers(mockData);
            setIsLoading(false);
        }, 600);
    }, []);

    const toggleStatus = (id: number) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, disabled: !u.disabled } : u));
        setMessage({ text: "User status updated", type: 'success' });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this sub-reseller?")) {
            setUsers(prev => prev.filter(u => u.id !== id));
            setMessage({ text: "Sub-reseller deleted successfully", type: 'success' });
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const filteredUsers = users.filter(user =>
        user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Others Management</h1>
                    <p className="text-sm text-gray-500 font-medium tracking-tight">Managing Sub-Resellers Accounts</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search sub-resellers..."
                            className="bg-white border border-gray-200 rounded-lg py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64 shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search size={16} className="absolute right-3 top-2.5 text-gray-400" />
                    </div>
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1200px]">
                        <thead>
                            <tr className="text-[10px] text-gray-400 uppercase font-black tracking-widest border-b border-gray-100 bg-gray-50/50">
                                <th className="py-5 px-8">ID APP</th>
                                <th className="py-5 px-6">Fullname</th>
                                <th className="py-5 px-6">Email</th>
                                <th className="py-5 px-6">Resseler</th>
                                <th className="py-5 px-6">Type</th>
                                <th className="py-5 px-6">Sold</th>
                                <th className="py-5 px-6">Max</th>
                                <th className="py-5 px-4 text-center" colSpan={4}>Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={11} className="py-24 text-center">
                                        <Loader2 className="animate-spin text-blue-600 mx-auto" size={32} />
                                    </td>
                                </tr>
                            ) : filteredUsers.map((user, idx) => (
                                <tr
                                    key={user.id}
                                    className={`${idx % 2 === 0 ? 'bg-white' : 'bg-[#f0f7ff]'} group hover:bg-blue-50/80 transition-all duration-300`}
                                >
                                    <td className="py-4 px-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center p-1.5 shadow-md">
                                                <img src="/img/apple-icon.png" alt="Logo" className="w-full h-full object-contain invert" />
                                            </div>
                                            <span className="text-[10px] font-black text-gray-900">NEW HD</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-sm font-bold text-blue-600 hover:underline cursor-pointer">{user.fullname}</td>
                                    <td className="py-4 px-6 text-xs font-medium text-gray-500">{user.email}</td>
                                    <td className="py-4 px-6 text-xs font-bold text-gray-700">{user.reseller}</td>
                                    <td className="py-4 px-6">
                                        <span className="text-[10px] font-black px-2 py-1 rounded-md bg-gray-100 text-gray-500 uppercase">
                                            {user.type}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-xs font-black text-gray-900">{user.sold.toFixed(2)}</td>
                                    <td className="py-4 px-4">
                                        <button className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-md shadow-md">
                                            Max ({user.max})
                                        </button>
                                    </td>
                                    <td className="py-4 px-2">
                                        <button className="bg-[#3a3a3a] text-white text-[10px] font-black px-4 py-1.5 rounded-md shadow-md hover:bg-black transition-all flex items-center gap-2">
                                            <DollarSign size={10} /> Edit Sold
                                        </button>
                                    </td>
                                    <td className="py-4 px-2">
                                        <button className="bg-blue-500 text-white text-[10px] font-black px-4 py-1.5 rounded-md shadow-md hover:bg-blue-600 transition-all flex items-center gap-2">
                                            <Key size={10} /> Mot de passe
                                        </button>
                                    </td>
                                    <td className="py-4 px-2">
                                        <button
                                            onClick={() => toggleStatus(user.id)}
                                            className={`${user.disabled ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white text-[10px] font-black px-4 py-1.5 rounded-md shadow-md transition-all flex items-center gap-2`}
                                        >
                                            <Ban size={10} /> {user.disabled ? 'Enable' : 'Disable'}
                                        </button>
                                    </td>
                                    <td className="py-4 px-4">
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="bg-red-600 text-white text-[10px] font-black px-4 py-1.5 rounded-md shadow-md hover:bg-red-700 transition-all flex items-center gap-2"
                                        >
                                            <Trash2 size={10} /> Delete
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
                    <Check size={18} />
                    <span className="text-sm font-black tracking-tight">{message.text}</span>
                    <button onClick={() => setMessage(null)} className="ml-4 opacity-50 hover:opacity-100 transition-opacity">
                        <X size={14} />
                    </button>
                </div>
            )}
        </div>
    );
}
