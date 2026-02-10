"use client";

import { useEffect, useState } from "react";
import { CreditCard, CheckCircle, RefreshCw, ShoppingCart, DollarSign } from "lucide-react";

interface DashboardData {
  balance: string;
  operations: {
    check: number;
    renew: number;
    buy: number;
    sold_orders: string;
  };
  notifications: any[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(async (res) => {
        if (res.status === 401) {
          window.location.href = "/"; // Redirect to login
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(data => {
        if (data) {
          setData(data);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="text-red-500 font-medium">Session expired or connection failed.</div>
        <button
          onClick={() => window.location.href = "/"}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Return to Login
        </button>
      </div>
    );
  }

  // Safety check for operations
  const operations = data.operations || { check: 0, renew: 0, buy: 0, sold_orders: "0.00 $" };


  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Welcome Back, Ajmal KSA</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Balance" value={data.balance} icon={<DollarSign className="text-green-600" size={32} />} color="bg-green-100" />
        <StatCard title="Operations Check" value={operations.check.toString()} icon={<CheckCircle className="text-blue-600" size={32} />} color="bg-blue-100" />
        <StatCard title="Operations Renew" value={operations.renew.toString()} icon={<RefreshCw className="text-orange-600" size={32} />} color="bg-orange-100" />
        <StatCard title="Sold Orders" value={operations.sold_orders} icon={<ShoppingCart className="text-purple-600" size={32} />} color="bg-purple-100" />
      </div>

      {/* Notifications / Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Latest News & Updates</h3>
        <div className="space-y-4">
          {data.notifications.map((notif: any) => (
            <NotificationItem
              key={notif.id}
              date={notif.date}
              title={notif.title}
              description={notif.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: string; icon: any; color: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow flex items-center space-x-4">
      <div className={`p-3 rounded-full ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function NotificationItem({ date, title, description }: { date: string; title: string; description: string }) {
  return (
    <div className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded-r-md">
      <div className="flex justify-between items-start">
        <h4 className="font-bold text-gray-800">{title}</h4>
        <span className="text-xs text-gray-500">{date}</span>
      </div>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
    </div>
  );
}
