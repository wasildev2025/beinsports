"use client";

import { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function CheckPage() {
    const [serial, setSerial] = useState('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCheck = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const res = await fetch('/api/dashboard/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ serial })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Check failed');
            setResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Check Subscription</h1>
            <p className="text-gray-600">Enter a serial number to check status via NewHD.</p>

            <form onSubmit={handleCheck} className="bg-white p-6 rounded-lg shadow space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Smart Card Serial Number</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={serial}
                            onChange={(e) => setSerial(e.target.value)}
                            placeholder="Enter serial number..."
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 outline-none transition-all"
                            required
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Checking...</span>
                        </>
                    ) : (
                        <span>Check Status</span>
                    )}
                </button>
            </form>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-start space-x-3 border border-red-100">
                    <AlertCircle className="flex-shrink-0 mt-0.5" size={20} />
                    <span>{error}</span>
                </div>
            )}

            {result && (
                <div className="bg-white p-6 rounded-lg shadow border border-gray-100 animate-fade-in">
                    <div className="flex items-center space-x-2 text-green-600 mb-4">
                        <CheckCircle size={24} />
                        <h3 className="text-lg font-semibold">Check Complete</h3>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200 font-mono text-sm overflow-auto max-h-96 whitespace-pre-wrap">
                        {/* 
                           Ideally, we would parse returning HTML/JSON into a nice table.
                           For now, showing raw output or structured if available.
                        */}
                        {result.raw || JSON.stringify(result, null, 2)}
                    </div>
                </div>
            )}
        </div>
    );
}
