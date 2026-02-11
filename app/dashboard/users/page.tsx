"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Key, Ban, Check, DollarSign, X, Loader2 } from "lucide-react";

interface User {
    id: number;
    fullname: string;
    email: string;
    role: string;
    balance: number;
    disabled: boolean;
    username: string;
}

export default function UsersManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal State
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [modalType, setModalType] = useState<'password' | 'balance' | null>(null);

    // Form State
    const [newPassword, setNewPassword] = useState("");
    const [addAmount, setAddAmount] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/dashboard/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = async (userId: number, action: string, payload: any = {}) => {
        setIsSubmitting(true);
        setMessage(null);
        try {
            const res = await fetch(`/api/dashboard/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, ...payload }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ text: "Operation successful", type: 'success' });
                fetchUsers(); // Refresh list
                closeModal();
            } else {
                setMessage({ text: data.error || "Operation failed", type: 'error' });
            }
        } catch (error) {
            setMessage({ text: "An error occurred", type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const openModal = (user: User, type: 'password' | 'balance') => {
        setSelectedUser(user);
        setModalType(type);
        setNewPassword("");
        setAddAmount(0);
        setMessage(null);
    };

    const closeModal = () => {
        setSelectedUser(null);
        setModalType(null);
    };

    const generatePassword = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let generated = "";
        for (let i = 0; i < 10; i++) {
            generated += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setNewPassword(generated);
    };

    const filteredUsers = users.filter(user =>
        user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 relative">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-[#9368E9] p-4 flex justify-between items-center">
                    <div>
                        <h4 className="text-white text-lg font-normal">Users</h4>
                        <p className="text-white/80 text-sm font-light">Panneau de gestion des utilisateurs</p>
                    </div>
                    <div className="bg-white/20 p-2 rounded-md flex items-center">
                        <Search size={18} className="text-white mr-2" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-transparent border-none text-white placeholder-white/70 focus:outline-none text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="p-4">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs text-gray-400 uppercase border-b border-gray-100">
                                    <th className="py-2 px-4 font-semibold">ID app</th>
                                    <th className="py-2 px-4 font-semibold">Fullname</th>
                                    <th className="py-2 px-4 font-semibold">email</th>
                                    <th className="py-2 px-4 font-semibold">type</th>
                                    <th className="py-2 px-4 font-semibold">Sold</th>
                                    <th className="py-2 px-4 font-semibold">Add Sold</th>
                                    <th className="py-2 px-4 font-semibold">Password</th>
                                    <th className="py-2 px-4 font-semibold">Operation</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan={8} className="py-8 text-center text-gray-500">Loading...</td></tr>
                                ) : filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50">
                                            <td className="py-3 px-4">
                                                <div className="w-8 h-8 relative">
                                                    <img src="/img/apple-icon.png" alt="Icon" className="w-full h-full object-contain" />
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-700">{user.fullname || user.username}</td>
                                            <td className="py-3 px-4 text-sm text-gray-500">{user.email}</td>
                                            <td className="py-3 px-4 text-sm text-gray-500 capitalize">{user.role}</td>
                                            <td className="py-3 px-4 text-sm font-medium text-gray-700">
                                                {user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="py-3 px-4">
                                                <button
                                                    onClick={() => openModal(user, 'balance')}
                                                    className="bg-[#1DC7EA] text-white px-3 py-1 rounded text-xs hover:bg-[#1DC7EA]/90 transition-colors flex items-center"
                                                >
                                                    <Plus size={12} className="mr-1" /> Add Sold
                                                </button>
                                            </td>
                                            <td className="py-3 px-4">
                                                <button
                                                    onClick={() => openModal(user, 'password')}
                                                    className="bg-[#3472F7] text-white px-3 py-1 rounded text-xs hover:bg-[#3472F7]/90 transition-colors flex items-center"
                                                >
                                                    <Key size={12} className="mr-1" /> Password
                                                </button>
                                            </td>
                                            <td className="py-3 px-4">
                                                <button
                                                    onClick={() => {
                                                        if (confirm(`Are you sure you want to ${user.disabled ? 'enable' : 'disable'} this user?`)) {
                                                            handleAction(user.id, 'toggle_status');
                                                        }
                                                    }}
                                                    className={`${user.disabled ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white px-3 py-1 rounded text-xs transition-colors flex items-center w-full justify-center`}
                                                >
                                                    {user.disabled ? (
                                                        <><Check size={12} className="mr-1" /> Enable</>
                                                    ) : (
                                                        <><Ban size={12} className="mr-1" /> Disable</>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={8} className="py-8 text-center text-gray-500">No users found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modals Overlay */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden transform transition-all">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h5 className="font-semibold text-gray-800">
                                {modalType === 'password' ? 'Update Password' : 'Add Sold'} : {selectedUser.fullname}
                            </h5>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            {message && (
                                <div className={`mb-4 p-3 rounded text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {message.text}
                                </div>
                            )}

                            {modalType === 'password' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                        <div className="flex">
                                            <button
                                                onClick={generatePassword}
                                                className="bg-primary text-white px-3 py-2 rounded-l-md bg-blue-500 hover:bg-blue-600 text-sm"
                                            >Generate</button>
                                            <input
                                                type="text"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="flex-1 border border-gray-300 rounded-r-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Enter password"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (confirm("Do you want to submit?")) {
                                                handleAction(selectedUser.id, 'update_password', { password: newPassword });
                                            }
                                        }}
                                        disabled={isSubmitting}
                                        className="w-full bg-[#9368E9] text-white py-2 rounded-md hover:bg-[#7a52cc] transition-colors flex justify-center items-center"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Update Password"}
                                    </button>
                                </div>
                            )}

                            {modalType === 'balance' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount to Add</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <DollarSign size={16} className="text-gray-400" />
                                            </div>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={addAmount}
                                                onChange={(e) => setAddAmount(parseFloat(e.target.value))}
                                                className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (confirm("Do you want to submit?")) {
                                                handleAction(selectedUser.id, 'add_balance', { amount: addAmount });
                                            }
                                        }}
                                        disabled={isSubmitting}
                                        className="w-full bg-[#9368E9] text-white py-2 rounded-md hover:bg-[#7a52cc] transition-colors flex justify-center items-center"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Add Balance"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
