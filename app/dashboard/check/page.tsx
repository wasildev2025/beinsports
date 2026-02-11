"use client";

import { useState } from 'react';
import { Search, CheckCircle, AlertCircle, Calendar, CreditCard, Tv, Star, Monitor } from 'lucide-react';

interface Contract {
    id: string;
    type: string;
    status: string;
    package: string;
    startDate: string;
    endDate: string;
    invoice: string;
}

interface CheckResult {
    success: boolean;
    dealer: {
        name: string;
        balance: string;
    };
    card: {
        serial: string;
        stb: string;
        valid: boolean;
        expiry: string;
        wallet_balance: string;
        premium: boolean;
    };
    contracts: Contract[];
}

export default function CheckPage() {
    const [serial, setSerial] = useState('');
    const [result, setResult] = useState<CheckResult | null>(null);
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
        <div className="space-y-6 animate-fade-in">
            {/* Search Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-[#5e2d91] px-6 py-4">
                    <h2 className="text-white text-lg font-semibold flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Check card
                    </h2>
                    <p className="text-purple-200 text-sm mt-1">Panel of Check card</p>
                </div>

                <div className="p-6">
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6 text-sm hidden">
                        This is a success alert—check it out!
                    </div>

                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-4 border-b pb-2">
                        Informations Check card
                    </h3>

                    <form onSubmit={handleCheck} className="max-w-xl mx-auto">
                        <div className="mb-6">
                            <label htmlFor="serial" className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-gray-400" />
                                Serial (Card / STB)
                            </label>
                            <input
                                id="serial"
                                type="text"
                                maxLength={16}
                                value={serial}
                                onChange={(e) => setSerial(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-lg"
                                placeholder="Enter 16-digit serial number"
                                required
                            />
                        </div>

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-[#5e2d91] hover:bg-[#4a2373] text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                        Checking...
                                    </>
                                ) : (
                                    <>
                                        <Search className="w-5 h-5" />
                                        Check
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3 animate-slide-up">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Results Section */}
            {result && (
                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden animate-slide-up">
                    <div className="bg-[#5e2d91] px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="text-white text-xl font-bold">{result.card.serial}</h2>
                            <p className="text-purple-200">Name client: Mock Client</p>
                        </div>
                        <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 backdrop-blur-sm">
                            <Monitor className="w-4 h-4" />
                            Screen
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Info Card */}
                        <div className="bg-[#ffffcc] border border-[#CCCCCC] rounded-xl p-6 shadow-sm">
                            <div className="flex flex-wrap gap-4 items-center mb-4">
                                {result.card.premium && (
                                    <span className="bg-[#5e2d91] text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-sm">
                                        Premium <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    </span>
                                )}
                                <span className="text-[#000099] font-bold flex items-center gap-2">
                                    <Tv className="w-4 h-4" />
                                    Is paired to STB(s): {result.card.stb}
                                </span>
                            </div>

                            <div className="space-y-2 text-[#000099] font-medium">
                                <p className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    This still Valid and will be Expired on <span className="font-bold">{result.card.expiry}</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <CreditCard className="w-4 h-4" />
                                    Available Wallet balance : <span className="font-bold">${result.card.wallet_balance}</span>
                                </p>
                            </div>
                        </div>

                        {/* Configuration/Action Panel */}
                        <div className="border rounded-xl p-4 bg-gray-50">
                            <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Configuration panel
                            </h4>
                            <div className="flex justify-center">
                                <button disabled className="bg-gray-300 text-gray-500 px-6 py-2 rounded-lg cursor-not-allowed font-medium">
                                    Activate ( 0 / 20 )
                                </button>
                            </div>
                        </div>

                        {/* Contracts Table */}
                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3">Type</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Package</th>
                                        <th className="px-6 py-3">Start Date</th>
                                        <th className="px-6 py-3">Expiry Date</th>
                                        <th className="px-6 py-3">Invoice No</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {result.contracts.map((contract) => (
                                        <tr key={contract.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">{contract.type}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                                    ${contract.status === 'Active' ? 'bg-green-100 text-green-700' :
                                                        contract.status === 'Expired' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-red-100 text-red-700'}`}>
                                                    {contract.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">{contract.package}</td>
                                            <td className="px-6 py-4">{contract.startDate}</td>
                                            <td className="px-6 py-4">{contract.endDate}</td>
                                            <td className="px-6 py-4 font-mono text-gray-500">{contract.invoice}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
