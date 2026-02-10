"use client";

import { useState } from "react";

export default function CheckPage() {
    const [serial, setSerial] = useState("");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleCheck = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        try {
            const formData = new FormData();
            formData.append('serial', serial);

            const res = await fetch("/api/dashboard/check", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ serial })
            });
            const data = await res.json();
            setResult(data);
        } catch (error) {
            console.error(error);
            setResult({ error: "Failed to fetch data" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Check Service</h1>

            <div className="bg-white p-6 rounded-lg shadow max-w-xl">
                <form onSubmit={handleCheck} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Serial Number / Smart Card</label>
                        <input
                            type="text"
                            value={serial}
                            onChange={(e) => setSerial(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter serial number"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:bg-blue-300"
                    >
                        {loading ? "Checking..." : "Check"}
                    </button>
                </form>

                {result && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-md border text-sm overflow-auto">
                        {result.html_snippet ? (
                            <div dangerouslySetInnerHTML={{ __html: result.html_snippet }} />
                        ) : (
                            <pre className="whitespace-pre-wrap text-gray-800">{JSON.stringify(result, null, 2)}</pre>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
