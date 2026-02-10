"use client";

import { useState } from 'react';
import { CreditCard, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';

export default function BuyPage() {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');

    const handleBuy = async (e: React.FormEvent) => {
        e.preventDefault();
        // Warn user
        if (!confirm(`Confirm purchase of ${amount} credit?`)) return;

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const res = await fetch('/api/dashboard/buy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Purchase failed');
            setResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Buy Credit</h1>
            <p className="text-gray-600">Purchase credit for your reseller account.</p>

            <form onSubmit={handleBuy} className="bg-white p-6 rounded-lg shadow space-y-6">

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <DollarSign className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            min="1"
                            step="0.01"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 outline-none"
                            required
                        />
                    </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg flex items-start space-x-2">
                    <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                    <p className="text-sm text-blue-700">
                        This operation will charge your registered payment method on NewHD. Please verify your balance afterwards.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-purple-600 text-white font-medium py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Processing...</span>
                        </>
                    ) : (
                        <>
                            <CreditCard size={20} />
                            <span>Purchase Credit</span>
                        </>
                    )}
                </button>
            </form>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center space-x-2 border border-red-100">
                    <AlertCircle className="flex-shrink-0" size={20} />
                    <span>{error}</span>
                </div>
            )}

            {result && (
                <div className="bg-white p-6 rounded-lg shadow border border-green-100">
                    <div className="flex items-center space-x-2 text-green-600 mb-2">
                        <CheckCircle size={24} />
                        <h3 className="text-lg font-semibold">Purchase Successful</h3>
                    </div>
                    <div className="bg-gray-50 p-4 rounded border text-sm font-mono overflow-auto">
                        {result.raw || JSON.stringify(result, null, 2)}
                    </div>
                </div>
            )}
        </div>
    );
}
