"use client";

import { useEffect, useState } from "react";
import { CreditCard, Loader2, AlertCircle, CheckCircle, Clock } from "lucide-react";

interface SoldOrder {
    id: number;
    order_id?: string | number;
    oldsold?: number;
    sold?: number;
    statut?: string;
    created_date?: string;
}

export default function SoldOrdersPage() {
    const [orders, setOrders] = useState<SoldOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("/api/dashboard/sold")
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch sold orders");
                return res.json();
            })
            .then((data) => setOrders(data))
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-[#5e2d91] px-6 py-4">
                    <h2 className="text-white text-lg font-semibold flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        List Orders Sold
                    </h2>
                    <p className="text-purple-200 text-sm mt-1">
                        List Orders Sold
                    </p>
                </div>

                <div className="p-4">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3">Id</th>
                                    <th className="px-6 py-3">Order Id</th>
                                    <th className="px-6 py-3">Old Sold</th>
                                    <th className="px-6 py-3">Sold</th>
                                    <th className="px-6 py-3">Statut</th>
                                    <th className="px-6 py-3">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                                            No sold orders found
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="bg-white border-b hover:bg-gray-50 transition-colors even:bg-gray-50/50"
                                        >
                                            <td className="px-6 py-3 font-medium text-gray-900">
                                                {order.id}
                                            </td>
                                            <td className="px-6 py-3 font-mono text-gray-700">
                                                {order.order_id ?? "—"}
                                            </td>
                                            <td className="px-6 py-3 text-gray-700">
                                                {order.oldsold != null
                                                    ? Number(order.oldsold).toLocaleString("en-US", { minimumFractionDigits: 2 })
                                                    : "0.00"}
                                            </td>
                                            <td className="px-6 py-3 font-medium text-gray-900">
                                                {order.sold != null
                                                    ? Number(order.sold).toLocaleString("en-US", { minimumFractionDigits: 2 })
                                                    : "0.00"}
                                            </td>
                                            <td className="px-6 py-3">
                                                {order.statut === "Valid" || order.statut === "SUCCESS" ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                                        <CheckCircle className="w-3 h-3" />
                                                        Valid
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                                                        <Clock className="w-3 h-3" />
                                                        {order.statut || "Pending"}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-3 text-gray-500">
                                                {order.created_date || "—"}
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
