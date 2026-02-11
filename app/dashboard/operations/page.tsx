"use client";

import { useEffect, useState } from "react";
import { PieChart, Loader2, AlertCircle } from "lucide-react";

interface Operation {
    id: number;
    user_id: string;
    type: string;
    serial: string;
    price: number;
    created_date: string;
}

interface UserOperation extends Operation {
    Name?: string;
}

interface OperationsData {
    operations: Operation[];
    userOperations: UserOperation[];
}

export default function OperationsPage() {
    const [data, setData] = useState<OperationsData>({ operations: [], userOperations: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("/api/dashboard/operations")
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch operations");
                return res.json();
            })
            .then((d) => setData(d))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#9368E9]" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Operations List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-[#5e2d91] px-6 py-4">
                    <h2 className="text-white text-lg font-semibold flex items-center gap-2">
                        <PieChart className="w-5 h-5" />
                        Operations List
                    </h2>
                    <p className="text-purple-200 text-sm mt-1">
                        Panel Management Operations List
                    </p>
                </div>

                <div className="p-4">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3">Id</th>
                                    <th className="px-6 py-3">Serial</th>
                                    <th className="px-6 py-3">Price ($)</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.operations.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                                            No operations found
                                        </td>
                                    </tr>
                                ) : (
                                    data.operations.map((op) => (
                                        <tr
                                            key={op.id}
                                            className="bg-white border-b hover:bg-gray-50 transition-colors even:bg-gray-50/50"
                                        >
                                            <td className="px-6 py-3 font-medium text-gray-900">
                                                {op.id}
                                            </td>
                                            <td className="px-6 py-3 font-mono text-gray-700">
                                                {op.serial}
                                            </td>
                                            <td className="px-6 py-3">{op.price}</td>
                                            <td className="px-6 py-3">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${op.type === "Check"
                                                            ? "bg-blue-100 text-blue-700"
                                                            : op.type === "Renew"
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-gray-100 text-gray-700"
                                                        }`}
                                                >
                                                    {op.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-gray-500">
                                                {op.created_date}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Operations Ground Resellers List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-[#5e2d91] px-6 py-4">
                    <h2 className="text-white text-lg font-semibold flex items-center gap-2">
                        <PieChart className="w-5 h-5" />
                        Operations Ground Resellers List
                    </h2>
                    <p className="text-purple-200 text-sm mt-1">
                        Panel Management Operations Ground Resellers List
                    </p>
                </div>

                <div className="p-4">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3">Id</th>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Serial</th>
                                    <th className="px-6 py-3">Price ($)</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.userOperations.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                                            No ground reseller operations found
                                        </td>
                                    </tr>
                                ) : (
                                    data.userOperations.map((op) => (
                                        <tr
                                            key={op.id}
                                            className="bg-white border-b hover:bg-gray-50 transition-colors even:bg-gray-50/50"
                                        >
                                            <td className="px-6 py-3 font-medium text-gray-900">
                                                {op.id}
                                            </td>
                                            <td className="px-6 py-3 text-gray-700">
                                                {op.Name || "—"}
                                            </td>
                                            <td className="px-6 py-3 font-mono text-gray-700">
                                                {op.serial}
                                            </td>
                                            <td className="px-6 py-3">{op.price}</td>
                                            <td className="px-6 py-3">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${op.type === "Check"
                                                            ? "bg-blue-100 text-blue-700"
                                                            : op.type === "Renew"
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-gray-100 text-gray-700"
                                                        }`}
                                                >
                                                    {op.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-gray-500">
                                                {op.created_date}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
