"use client";

import { useState, useEffect } from "react";
import { Search, CheckCircle, Clock, Loader2 } from "lucide-react";

interface Operation {
    id: number;
    type: string;
    details: string;
    status: string;
    cost: number;
    amount: number;
    oldBalance: number;
    createdAt: string;
    user: {
        fullname: string;
    };
}

export default function SoldUsersPage() {
    const [operations, setOperations] = useState<Operation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [validatingId, setValidatingId] = useState<number | null>(null);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'warning' } | null>(null);

    const fetchOperations = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/dashboard/sold');
            if (res.ok) {
                const data = await res.json();
                setOperations(data);
            }
        } catch (error) {
            console.error("Failed to fetch operations", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOperations();
    }, []);

    const handleValidate = async (id: number) => {
        if (!confirm("Do you want to submit?")) return;

        setValidatingId(id);
        setMessage(null);

        try {
            const res = await fetch(`/api/dashboard/sold/${id}/validate`, {
                method: 'POST',
            });

            if (res.ok) {
                setMessage({ text: "Sold was Updated successfully!", type: 'success' });
                fetchOperations(); // Refresh list
            } else {
                const data = await res.json();
                setMessage({ text: data.error || "Validation failed", type: 'warning' });
            }
        } catch (error) {
            setMessage({ text: "An error occurred", type: 'warning' });
        } finally {
            setValidatingId(null);
        }
    };

    const filteredOperations = operations.filter(op =>
        op.user?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        op.id.toString().includes(searchTerm)
    );

    return (
        <div className="space-y-6 relative">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-[#9368E9] p-4 flex justify-between items-center">
                    <div>
                        <h4 className="text-white text-lg font-normal">List Users Solds</h4>
                        <p className="text-white/80 text-sm font-light">List Users Solds</p>
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
                    {message && (
                        <div className={`mb-4 p-3 rounded text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs text-gray-400 uppercase border-b border-gray-100">
                                    <th className="py-2 px-4 font-semibold">ID</th>
                                    <th className="py-2 px-4 font-semibold">fullname</th>
                                    <th className="py-2 px-4 font-semibold">order id</th>
                                    <th className="py-2 px-4 font-semibold">oldsold</th>
                                    <th className="py-2 px-4 font-semibold">sold</th>
                                    <th className="py-2 px-4 font-semibold">statut</th>
                                    <th className="py-2 px-4 font-semibold">Operation</th>
                                    <th className="py-2 px-4 font-semibold">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan={8} className="py-8 text-center text-gray-500">Loading...</td></tr>
                                ) : filteredOperations.length > 0 ? (
                                    filteredOperations.map((op) => (
                                        <tr key={op.id} className="border-b border-gray-50 hover:bg-gray-50">
                                            <td className="py-3 px-4">
                                                <div className="w-8 h-8 relative">
                                                    <img src="/img/apple-icon.png" alt="Icon" className="w-full h-full object-contain" />
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-700">{op.user.fullname}</td>
                                            <td className="py-3 px-4 text-sm text-gray-500">{op.id}</td>
                                            <td className="py-3 px-4 text-sm text-gray-700">
                                                {op.oldBalance?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
                                            </td>
                                            <td className="py-3 px-4 text-sm font-medium text-gray-700">
                                                {op.amount?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
                                            </td>
                                            <td className="py-3 px-4">
                                                {op.status === 'SUCCESS' ? (
                                                    <span className="bg-green-500 text-white px-3 py-1 rounded text-xs flex items-center w-max">
                                                        <CheckCircle size={12} className="mr-1" /> Valid
                                                    </span>
                                                ) : (
                                                    <span className="bg-yellow-500 text-white px-3 py-1 rounded text-xs flex items-center w-max">
                                                        <Clock size={12} className="mr-1" /> Not Yet
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                {op.status === 'PENDING' && (
                                                    <button
                                                        onClick={() => handleValidate(op.id)}
                                                        disabled={validatingId === op.id}
                                                        className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition-colors flex items-center w-max"
                                                    >
                                                        {validatingId === op.id ? (
                                                            <Loader2 size={12} className="animate-spin mr-1" />
                                                        ) : (
                                                            <CheckCircle size={12} className="mr-1" />
                                                        )}
                                                        Validate
                                                    </button>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-500">
                                                {new Date(op.createdAt).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={8} className="py-8 text-center text-gray-500">No sold operations found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
