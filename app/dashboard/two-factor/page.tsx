"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Shield, Loader2, AlertCircle, CheckCircle } from "lucide-react";

interface QrData {
    user_id: string;
    email: string;
    google: number; // 1 = enabled, 0 = disabled
}

function encodeBase32(input: string): string {
    const base32Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let output = "";
    let buffer = 0;
    let bitsLeft = 0;

    for (let i = 0; i < input.length; i++) {
        buffer = (buffer << 8) | input.charCodeAt(i);
        bitsLeft += 8;

        while (bitsLeft >= 5) {
            const index = (buffer >>> (bitsLeft - 5)) & 31;
            output += base32Alphabet[index];
            bitsLeft -= 5;
        }
    }

    if (bitsLeft > 0) {
        const index = (buffer << (5 - bitsLeft)) & 31;
        output += base32Alphabet[index];
    }

    return output;
}

export default function TwoFactorPage() {
    const [qrData, setQrData] = useState<QrData | null>(null);
    const [loading, setLoading] = useState(true);
    const [code, setCode] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

    const fetchQrData = () => {
        setLoading(true);
        fetch("/api/dashboard/two-factor")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    setQrData(data[0]);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchQrData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!confirm("Do you want to submit?")) return;

        setSubmitting(true);
        setMessage(null);

        try {
            const res = await fetch("/api/dashboard/two-factor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }),
            });
            const data = await res.json();

            if (!res.ok) {
                setMessage({ text: data.error || "2FA update failed", type: "error" });
            } else {
                setMessage({ text: data.message || "2FA updated!", type: "success" });
                setCode("");
                fetchQrData(); // Refresh state
            }
        } catch {
            setMessage({ text: "An error occurred", type: "error" });
        } finally {
            setSubmitting(false);
        }
    };

    const issuer = "MD-SAT";
    const secret = qrData ? encodeBase32(qrData.user_id) : "";
    const accountName = qrData?.email || "";
    const otpauthUrl = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${secret}&issuer=${issuer}`;
    const is2FAEnabled = qrData?.google === 1;

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden max-w-2xl mx-auto">
                <div className="bg-[#5e2d91] px-6 py-4">
                    <h2 className="text-white text-lg font-semibold flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Activate 2FA
                    </h2>
                    <p className="text-purple-200 text-sm mt-1">
                        Activate 2FA Management App
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

                    <h6 className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-6 border-b pb-2">
                        Informations on App Activate 2FA
                    </h6>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-[#9368E9]" />
                        </div>
                    ) : qrData ? (
                        <form onSubmit={handleSubmit}>
                            {/* QR Code */}
                            <div className="mb-8">
                                <label className="block text-gray-700 font-medium mb-3 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-gray-400" />
                                    Scan QR Code
                                </label>
                                <div className="flex justify-center">
                                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm inline-block">
                                        <QRCodeSVG value={otpauthUrl} size={200} />
                                    </div>
                                </div>
                                {is2FAEnabled && (
                                    <p className="text-center mt-3 text-sm text-green-600 font-medium flex items-center justify-center gap-1">
                                        <CheckCircle className="w-4 h-4" />
                                        2FA is currently enabled
                                    </p>
                                )}
                            </div>

                            {/* Google Code Input */}
                            <div className="mb-6 max-w-md mx-auto">
                                <label
                                    htmlFor="google-code"
                                    className="block text-gray-700 font-medium mb-2 flex items-center gap-2"
                                >
                                    <Shield className="w-5 h-5 text-gray-400" />
                                    Google Code
                                </label>
                                <input
                                    id="google-code"
                                    type="text"
                                    inputMode="numeric"
                                    pattern="\d{6}"
                                    maxLength={6}
                                    value={code}
                                    onChange={(e) => {
                                        const v = e.target.value.replace(/\D/g, "");
                                        setCode(v);
                                    }}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-2xl font-mono tracking-[0.5em] text-center"
                                    placeholder="000000"
                                    required
                                />
                            </div>

                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    disabled={submitting || code.length !== 6}
                                    className={`${is2FAEnabled
                                            ? "bg-red-600 hover:bg-red-700"
                                            : "bg-[#5e2d91] hover:bg-[#4a2373]"
                                        } text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200`}
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Shield className="w-5 h-5" />
                                            {is2FAEnabled ? "Deactivate 2FA" : "Activate 2FA"}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center py-8 text-gray-400">
                            Failed to load 2FA data
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
