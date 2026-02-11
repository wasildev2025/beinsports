"use client";

import { useState } from "react";
import { Lock, Loader2, AlertCircle, CheckCircle, RefreshCw } from "lucide-react";

function generatePassword(length: number): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export default function ChangePasswordPage() {
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

    const handleGenerate = () => {
        setPassword(generatePassword(10));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!confirm("Do you want to submit?")) return;

        setSubmitting(true);
        setMessage(null);

        try {
            const res = await fetch("/api/dashboard/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });
            const data = await res.json();

            if (!res.ok) {
                setMessage({ text: data.error || "Password change failed", type: "error" });
            } else {
                setMessage({ text: data.message || "Password changed successfully!", type: "success" });
            }
        } catch {
            setMessage({ text: "An error occurred", type: "error" });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden max-w-2xl mx-auto">
                <div className="bg-[#5e2d91] px-6 py-4">
                    <h2 className="text-white text-lg font-semibold flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        Change Password
                    </h2>
                    <p className="text-purple-200 text-sm mt-1">
                        Panel of Change Password
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
                        Informations Change Password
                    </h6>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label
                                htmlFor="password"
                                className="block text-gray-700 font-medium mb-2 flex items-center gap-2"
                            >
                                <Lock className="w-5 h-5 text-gray-400" />
                                Password
                            </label>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleGenerate}
                                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Generate
                                </button>
                                <input
                                    id="password"
                                    type="text"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-lg font-mono tracking-wider"
                                    placeholder="password"
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                disabled={submitting || !password}
                                className="bg-[#5e2d91] hover:bg-[#4a2373] text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Changing...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        Change Password
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
