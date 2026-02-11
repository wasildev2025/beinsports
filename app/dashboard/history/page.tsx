"use client";

import { useEffect, useState } from "react";
import { History, Loader2, AlertCircle, Globe, Monitor } from "lucide-react";

interface ConnectionEntry {
    browser: string;
    ip: string;
    date: string;
}

export default function HistoryPage() {
    const [entries, setEntries] = useState<ConnectionEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("/api/dashboard/history")
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch connection history");
                return res.json();
            })
            .then((data) => setEntries(data))
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
                        <History className="w-5 h-5" />
                        Connection History
                    </h2>
                    <p className="text-purple-200 text-sm mt-1">
                        Connections Management List
                    </p>
                </div>

                <div className="p-4">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3">Browser</th>
                                    <th className="px-6 py-3">IP</th>
                                    <th className="px-6 py-3">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entries.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-gray-400">
                                            No connection history found
                                        </td>
                                    </tr>
                                ) : (
                                    entries.map((entry, index) => (
                                        <tr
                                            key={index}
                                            className="bg-white border-b hover:bg-gray-50 transition-colors even:bg-gray-50/50"
                                        >
                                            <td className="px-6 py-3 text-gray-700">
                                                <div className="flex items-center gap-2">
                                                    <Monitor className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                    <span className="truncate max-w-md" title={entry.browser}>
                                                        {entry.browser}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-2">
                                                    <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                    <span className="font-mono text-gray-700">{entry.ip}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 text-gray-500">
                                                {entry.date}
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
