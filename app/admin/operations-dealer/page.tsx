"use client";

import { useState, useEffect } from "react";
import {
    Search,
    Download,
    Filter,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    Loader2
} from "lucide-react";

interface PackageInfo {
    subscriber: string;
    country: string;
    invoiceNo: string;
    serialNo: string;
    itemType: string;
    packageName: string;
    startDate: string;
    expiryDate: string;
    amount: number;
}

export default function OperationsDealerPage() {
    const [packages, setPackages] = useState<PackageInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [summary, setSummary] = useState({
        office: "Akram Al Kash office1",
        totalSold: 1658
    });

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        setIsLoading(true);
        try {
            // This would eventually call /api/admin/sbs/packages
            // For now, providing mock data matching the screenshot style
            const mockData: PackageInfo[] = [
                { subscriber: "MANSOR SAEED NASER", country: "Yemen", invoiceNo: "51186573", serialNo: "751123565", itemType: "Card_CISCO", packageName: "Add Premium 3 Months", startDate: "14/01/2026", expiryDate: "13/04/2026", amount: 43.5 },
                { subscriber: "SALEM ADEL SALIM", country: "Saudi Arabia", invoiceNo: "51186534", serialNo: "751076491", itemType: "Card_CISCO", packageName: "Add Premium 3 Months", startDate: "14/01/2026", expiryDate: "13/04/2026", amount: 43.5 },
                { subscriber: "mohammad alshuabi", country: "Saudi Arabia", invoiceNo: "51186420", serialNo: "751034743", itemType: "Card_CISCO", packageName: "Add Premium 3 Months", startDate: "14/01/2026", expiryDate: "13/04/2026", amount: 43.5 },
                { subscriber: "jad khalil mekdah", country: "Jordan", invoiceNo: "51186400", serialNo: "751174600", itemType: "Card_CISCO", packageName: "Add AFCON 2025 Knockout", startDate: "14/01/2026", expiryDate: "20/01/2026", amount: 25 },
                { subscriber: "SALEM ADEL SALIM", country: "Jordan", invoiceNo: "51186378", serialNo: "751004644", itemType: "Card_CISCO", packageName: "Add Premium 6 Months", startDate: "14/01/2026", expiryDate: "13/07/2026", amount: 108 },
                { subscriber: "Sadiyyah Alzahrani", country: "Saudi Arabia", invoiceNo: "51186226", serialNo: "751135158", itemType: "Card_CISCO", packageName: "Add Premium 3 Months", startDate: "14/01/2026", expiryDate: "13/04/2026", amount: 43.5 },
                { subscriber: "Mustafa Adel Mokhtar", country: "Egypt", invoiceNo: "51186115", serialNo: "751142273", itemType: "Card_CISCO", packageName: "Add Premium 3 Months", startDate: "14/01/2026", expiryDate: "13/04/2026", amount: 43.5 },
                { subscriber: "ABDALLAH MOUSA ALHASANAT", country: "Jordan", invoiceNo: "51186124", serialNo: "751231738", itemType: "Card_CISCO", packageName: "Add AFCON 2025 Knockout", startDate: "14/01/2026", expiryDate: "20/01/2026", amount: 25 },
                { subscriber: "rabie salim milad", country: "Lebanon", invoiceNo: "51186088", serialNo: "751234567", itemType: "Card_CISCO", packageName: "Add Premium 3 Months", startDate: "14/01/2026", expiryDate: "13/04/2026", amount: 54 },
                { subscriber: "Mohamedvali salech mhaimid", country: "Lebanon", invoiceNo: "51181243", serialNo: "751357078", itemType: "Card_CISCO", packageName: "Add Premium 6 Months", startDate: "14/01/2026", expiryDate: "13/07/2026", amount: 108 },
            ];
            setPackages(mockData);
        } catch (error) {
            console.error("Failed to fetch packages", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredPackages = packages.filter(pkg =>
        pkg.subscriber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.invoiceNo.includes(searchTerm) ||
        pkg.serialNo.includes(searchTerm)
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Dealer Packages</h1>
                    <p className="text-sm text-gray-500 font-medium">Monitoring real-time sales from SBS system</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="bg-white border border-gray-200 p-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
                        <Download size={18} />
                    </button>
                    <button
                        onClick={fetchPackages}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-md active:scale-95"
                    >
                        <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} /> Sync Data
                    </button>
                </div>
            </div>

            {/* Summary Banner matching screenshot highlights */}
            <div className="bg-red-500 text-white px-4 py-2 rounded-lg text-xs font-bold flex justify-between items-center shadow-lg">
                <span className="uppercase tracking-wider">{summary.office}</span>
                <span className="uppercase tracking-wider">Total Sold Packages: {summary.totalSold}</span>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Search & Filter Bar */}
                <div className="p-4 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Search by Subscriber, Invoice or Serial..."
                            className="w-full bg-white border border-gray-200 rounded-lg py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search size={16} className="absolute right-3 top-2.5 text-gray-400" />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <select className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none cursor-pointer hover:border-gray-300">
                            <option>All Countries</option>
                            <option>Yemen</option>
                            <option>Saudi Arabia</option>
                            <option>Jordan</option>
                            <option>Lebanon</option>
                        </select>
                        <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                            <Filter size={16} /> Filter
                        </button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="text-[10px] text-gray-400 uppercase font-bold tracking-widest border-b border-gray-100 bg-gray-50">
                                <th className="py-4 px-6">Subscriber</th>
                                <th className="py-4 px-6">Country</th>
                                <th className="py-4 px-6">Invoice No</th>
                                <th className="py-4 px-6">Smart Card / CAM Serial</th>
                                <th className="py-4 px-6">Item Type</th>
                                <th className="py-4 px-6">Package</th>
                                <th className="py-4 px-6">Contract Start</th>
                                <th className="py-4 px-6">Contract Expiry</th>
                                <th className="py-4 px-6 text-right">Amount USD</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={9} className="py-24 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="animate-spin text-blue-600" size={32} />
                                            <p className="text-sm font-medium text-gray-500">Retrieving data from SBS...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredPackages.length > 0 ? (
                                filteredPackages.map((pkg, idx) => (
                                    <tr key={idx} className="group hover:bg-blue-50/30 transition-colors">
                                        <td className="py-3 px-6 text-[13px] font-medium text-gray-700">{pkg.subscriber}</td>
                                        <td className="py-3 px-6 text-[12px] text-gray-500">{pkg.country}</td>
                                        <td className="py-3 px-6 text-[12px] text-blue-600 font-mono font-medium">{pkg.invoiceNo}</td>
                                        <td className="py-3 px-6 text-[12px] text-gray-600 font-mono">{pkg.serialNo}</td>
                                        <td className="py-3 px-6">
                                            <span className="text-[10px] font-bold px-2 py-1 rounded bg-gray-100 text-gray-600 uppercase">
                                                {pkg.itemType}
                                            </span>
                                        </td>
                                        <td className="py-3 px-6 text-[12px] text-gray-600">{pkg.packageName}</td>
                                        <td className="py-3 px-6 text-[12px] text-gray-500">{pkg.startDate}</td>
                                        <td className="py-3 px-6 text-[12px] text-gray-500">{pkg.expiryDate}</td>
                                        <td className="py-3 px-6 text-right text-[13px] font-bold text-gray-800">
                                            ${pkg.amount.toFixed(2)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={9} className="py-12 text-center text-gray-400 text-sm">
                                        No packages found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination matching screenshot footer style */}
                <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
                    <p className="text-xs text-gray-400 font-medium">
                        Showing 1 to {filteredPackages.length} of {summary.totalSold} entries
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="p-2 border border-gray-200 rounded-lg hover:bg-white text-gray-400 transition-all disabled:opacity-50" disabled>
                            <ChevronLeft size={16} />
                        </button>
                        <div className="flex items-center gap-1">
                            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-600/20">1</button>
                            <button className="px-3 py-1 text-gray-500 rounded-lg text-xs font-medium hover:bg-gray-200 transition-all">2</button>
                            <button className="px-3 py-1 text-gray-500 rounded-lg text-xs font-medium hover:bg-gray-200 transition-all">3</button>
                            <span className="text-gray-300 mx-1">...</span>
                            <button className="px-3 py-1 text-gray-500 rounded-lg text-xs font-medium hover:bg-gray-200 transition-all">166</button>
                        </div>
                        <button className="p-2 border border-gray-200 rounded-lg hover:bg-white text-gray-400 transition-all">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Info Note */}
            <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl flex items-start gap-3">
                <div className="p-1.5 bg-orange-500 rounded-full shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
                <p className="text-xs text-orange-800 leading-relaxed font-medium">
                    This data is synchronized directly from <span className="underline decoration-orange-300 font-bold">sbs.beinsports.net</span>.
                    Price amounts are shown in USD and converted based on the official daily rate.
                </p>
            </div>
        </div>
    );
}
