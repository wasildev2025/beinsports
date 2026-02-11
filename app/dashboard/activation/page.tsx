"use client";

import { useEffect, useState } from "react";
import { Key, Loader2, AlertCircle, CheckCircle, Send } from "lucide-react";

interface ActiveCode {
    id_app?: string | number;
    code: string;
    type: string;
    created_date: string;
}

export default function ActivationCodePage() {
    const [codes, setCodes] = useState<ActiveCode[]>([]);
    const [loading, setLoading] = useState(true);
    const [code, setCode] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

    const fetchCodes = () => {
        setLoading(true);
        fetch("/api/dashboard/activation")
            .then((res) => res.json())
            .then((data) => setCodes(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchCodes();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!confirm("Do you want to submit?")) return;

        setSubmitting(true);
        setMessage(null);

        try {
            const res = await fetch("/api/dashboard/activation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }),
            });
            const data = await res.json();

            if (!res.ok) {
                setMessage({ text: data.error || "Activation failed", type: "error" });
            } else {
                setMessage({ text: data.message || "Code activated successfully!", type: "success" });
                setCode("");
                fetchCodes(); // Refresh list
            }
        } catch {
            setMessage({ text: "An error occurred", type: "error" });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Activation Code Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-[#5e2d91] px-6 py-4">
                    <h2 className="text-white text-lg font-semibold flex items-center gap-2">
                        <Key className="w-5 h-5" />
                        Activation Code
                    </h2>
                    <p className="text-purple-200 text-sm mt-1">
                        Panneau de gestion des Activation Code
                    </p>
                </div>

                <div className="p-6">
                    {message && (
                        <div
                            className={`mb-6 p-4 rounded-lg flex items-center gap-3 text-sm ${message.type === "success"
                                    ? "bg-green-50 text-green-700 border border-green-100"
                                    : "bg-red-50 text-red-600 border border-red-100"
                                }`}
                        >
                            {message.type === "success" ? (
                                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                            ) : (
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            )}
                            {message.text}
                        </div>
                    )}

                    <h6 className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-4 border-b pb-2">
                        Informations sur les Activation Code
                    </h6>

                    <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
                        <div className="mb-6">
                            <label
                                htmlFor="activation-code"
                                className="block text-gray-700 font-medium mb-2 flex items-center gap-2"
                            >
                                <Key className="w-5 h-5 text-gray-400" />
                                Code
                            </label>
                            <input
                                id="activation-code"
                                type="text"
                                maxLength={16}
                                minLength={16}
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-lg font-mono tracking-wider"
                                placeholder="Enter 16-character code"
                                required
                                autoFocus
                            />
                        </div>

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                disabled={submitting || code.length !== 16}
                                className="bg-[#5e2d91] hover:bg-[#4a2373] text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Activating...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        Activation Code
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Code Active List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-[#5e2d91] px-6 py-4">
                    <h2 className="text-white text-lg font-semibold flex items-center gap-2">
                        <Key className="w-5 h-5" />
                        Code Active List
                    </h2>
                    <p className="text-purple-200 text-sm mt-1">
                        Liste de gestion des Code Active List
                    </p>
                </div>

                <div className="p-4">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3">ID App</th>
                                    <th className="px-6 py-3">Code</th>
                                    <th className="px-6 py-3">Type</th>
                                    <th className="px-6 py-3">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center">
                                            <Loader2 className="w-6 h-6 animate-spin text-[#9368E9] mx-auto" />
                                        </td>
                                    </tr>
                                ) : codes.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                                            No active codes found
                                        </td>
                                    </tr>
                                ) : (
                                    codes.map((item, index) => (
                                        <tr
                                            key={index}
                                            className="bg-white border-b hover:bg-gray-50 transition-colors even:bg-gray-50/50"
                                        >
                                            <td className="px-6 py-3 font-medium text-gray-900">
                                                {item.id_app ?? "—"}
                                            </td>
                                            <td className="px-6 py-3 font-mono text-gray-700">
                                                {item.code}
                                            </td>
                                            <td className="px-6 py-3">
                                                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                                                    {item.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-gray-500">
                                                {item.created_date}
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
