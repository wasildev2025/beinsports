"use client";

import { useEffect, useState } from "react";

interface Operation {
    id: number;
    title: string;
    date: string;
    details: string;
    status: 'Success' | 'Pending' | 'Failed';
}

export default function OperationsPage() {
    const [operations, setOperations] = useState<Operation[]>([]);

    useEffect(() => {
        fetch('/api/dashboard/operations')
            .then(res => res.json())
            .then(data => setOperations(data))
            .catch(console.error);
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Operations History</h1>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <input
                        type="text"
                        placeholder="Search operations..."
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <ul className="divide-y divide-gray-200">
                    {operations.map(op => (
                        <OperationItem
                            key={op.id}
                            title={op.title}
                            date={op.date}
                            details={op.details}
                            status={op.status}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
}

function OperationItem({ title, date, details, status }: { title: string; date: string; details: string; status: 'Success' | 'Pending' | 'Failed' }) {
    const statusColor = {
        Success: 'bg-green-100 text-green-800',
        Pending: 'bg-yellow-100 text-yellow-800',
        Failed: 'bg-red-100 text-red-800',
    };

    return (
        <li className="p-4 hover:bg-gray-50 flex items-center justify-between">
            <div>
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900">{title}</p>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor[status]}`}>
                        {status}
                    </span>
                </div>
                <p className="text-sm text-gray-500">{details}</p>
            </div>
            <p className="text-xs text-gray-400">{date}</p>
        </li>
    )
}
