"use client";

import { useState } from 'react';
import { RefreshCw, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';

export default function RenewPage() {
    const [serial, setSerial] = useState('');
    const [period, setPeriod] = useState('1'); // Default 1 month? confirm packages
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');

    const handleRenew = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!confirm('Are you sure you want to renew this subscription?')) return;

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const res = await fetch('/api/dashboard/renew', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ serial, period })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Renewal failed');
            setResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Renew Subscription</h1>
            <p className="text-gray-600">Extend subscription via NewHD proxy.</p>

            <form onSubmit={handleRenew} className="bg-white p-6 rounded-lg shadow space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Smart Card Serial Number</label>
                    <input
                        type="text"
                        value={serial}
                        onChange={(e) => setSerial(e.target.value)}
                        placeholder="Enter serial number..."
                        className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Period (Months)</label>
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="1">1 Month</option>
                        <option value="3">3 Months</option>
                        <option value="6">6 Months</option>
                        <option value="12">12 Months</option>
                    </select>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg flex items-start space-x-2">
                    <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                    <p className="text-sm text-yellow-700">
                        Please verifying checking the card status in the "Check" page before renewing to ensure compatibility.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white font-medium py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Processing Renewal...</span>
                        </>
                    ) : (
                        <>
                            <RefreshCw size={20} />
                            <span>Confirm Renewal</span>
                        </>
                    )}
                </button>
            </form>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center space-x-2 border border-red-100">
                    <XCircle className="flex-shrink-0" size={20} />
                    <span>{error}</span>
                </div>
            )}

            {result && (
                <div className="bg-white p-6 rounded-lg shadow border border-green-100">
                    <div className="flex items-center space-x-2 text-green-600 mb-2">
                        <CheckCircle size={24} />
                        <h3 className="text-lg font-semibold">Renewal Successful</h3>
                    </div>
                    <div className="bg-gray-50 p-4 rounded border text-sm font-mono overflow-auto">
                        {result.raw || JSON.stringify(result, null, 2)}
                    </div>
                </div>
            )}
        </div>
    );
}

function XCircle({ className, size }: { className?: string, size?: number }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
    )
}
