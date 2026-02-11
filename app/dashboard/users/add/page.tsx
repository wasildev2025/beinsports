"use client";

import { useState, useEffect } from "react";
import { User, Mail, Lock, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";

export default function AddUserPage() {
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState<any[]>([]);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    // Fetch users on mount
    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/dashboard/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const generatePassword = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        let generated = "";
        for (let i = 0; i < 12; i++) {
            generated += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setPassword(generated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            const res = await fetch('/api/dashboard/users/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullname, email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ text: "User added successfully!", type: 'success' });
                // Reset form
                setFullname("");
                setEmail("");
                setPassword("");
                // Refresh list
                fetchUsers();
            } else {
                setMessage({ text: data.error || "Failed to add user", type: 'error' });
            }
        } catch (error) {
            setMessage({ text: "An error occurred", type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Add User Form Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-[#9368E9] p-4">
                    <h4 className="text-white text-lg font-normal">Utilisateurs</h4>
                    <p className="text-white/80 text-sm font-light">Panneau de gestion des utilisateurs</p>
                </div>

                <div className="p-8">
                    <div className="mb-6">
                        <h6 className="text-xs uppercase text-gray-400 font-bold tracking-wider mb-4">Informations sur les utilisateurs</h6>

                        {message && (
                            <div className={`p-4 rounded-md flex items-center mb-4 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {message.type === 'success' ? <CheckCircle size={18} className="mr-2" /> : <AlertCircle size={18} className="mr-2" />}
                                {message.text}
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <User size={16} className="mr-2 text-gray-400" /> Fullname
                                </label>
                                <input
                                    type="text"
                                    value={fullname}
                                    onChange={(e) => setFullname(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9368E9] focus:border-transparent"
                                    placeholder="Fullname"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <Mail size={16} className="mr-2 text-gray-400" /> Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9368E9] focus:border-transparent"
                                    placeholder="email"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <Lock size={16} className="mr-2 text-gray-400" /> Password
                                </label>
                                <div className="flex">
                                    <button
                                        type="button"
                                        onClick={generatePassword}
                                        className="px-4 py-2 bg-yellow-400 text-white font-medium rounded-l-md hover:bg-yellow-500 transition-colors flex items-center"
                                    >
                                        <RefreshCw size={16} className="mr-2" /> Generate
                                    </button>
                                    <input
                                        type="text"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-[#9368E9] focus:border-transparent border-l-0"
                                        placeholder="password"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center pt-4">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded hover:bg-gray-200 transition-colors flex items-center border border-gray-300"
                                disabled={isLoading}
                            >
                                <CheckCircle size={16} className="mr-2" />
                                {isLoading ? "Ajout..." : "Ajouter utilisateurs"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Users Table Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-[#9368E9] p-4">
                    <h4 className="text-white text-lg font-normal">Utilisateurs</h4>
                    <p className="text-white/80 text-sm font-light">Liste de gestion des utilisateurs</p>
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
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? (
                                    users.map((user) => (
                                        <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50">
                                            <td className="py-3 px-4">
                                                <div className="w-10 h-10 relative">
                                                    <img src="/img/apple-icon.png" alt="App Icon" className="w-full h-full object-contain" />
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{user.fullname}</td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{user.email}</td>
                                            <td className="py-3 px-4 text-sm text-gray-600 capitalize">{user.role}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="py-8 text-center text-sm text-gray-500">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    );
}
