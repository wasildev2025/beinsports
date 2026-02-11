"use client";

import { PieChart, RefreshCw, ShoppingCart, DollarSign, Clock, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>({ CheckData: 0, RenewData: 0, BuyData: 0, sold: 0 });
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    // Fetch Stats
    fetch('/api/dashboard/profile')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) setStats(data[0]);
      })
      .catch(err => console.error(err));

    // Fetch Notifications
    fetch('/api/dashboard/notifications')
      .then(res => res.json())
      .then(data => setNotifications(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-6">

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatsCard
          title="Operations Check"
          category="Check"
          value={stats.CheckData}
          icon={<PieChart size={24} className="text-orange-400" />}
          footerIcon={<RefreshCw size={14} />}
          footerText="Check Now"
          footerLink="/dashboard/check"
        />

        <StatsCard
          title="Operations Renew"
          category="Renew"
          value={stats.RenewData}
          icon={<RefreshCw size={24} className="text-green-500" />}
          footerIcon={<Clock size={14} />}
          footerText="Renew Now"
          footerLink="/dashboard/renew"
        />

        <StatsCard
          title="Operations Buy"
          category="Buy"
          value={stats.BuyData}
          icon={<ShoppingCart size={24} className="text-blue-400" />}
          footerIcon={<AlertTriangle size={14} />}
          footerText="Buy Now"
          footerLink="/dashboard/buy"
        />

        <StatsCard
          title="Sold"
          category="Sold"
          value={Number(stats.sold).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          icon={<DollarSign size={24} className="text-green-600" />}
          footerIcon={<RefreshCw size={14} />}
          footerText="Update Now"
          footerLink="#"
        />
      </div>

      {/* Notifications Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-[#9368E9] p-4">
          <h4 className="text-white text-lg font-normal">Notifications</h4>
          <p className="text-white/80 text-sm font-light">Liste de gestion des Notifications</p>
        </div>

        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs text-gray-400 uppercase border-b border-gray-100">
                  <th className="py-2 px-4 font-semibold">logo</th>
                  <th className="py-2 px-4 font-semibold">Notification</th>
                  <th className="py-2 px-4 font-semibold">Date</th>
                  <th className="py-2 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {notifications.length > 0 ? (
                  notifications.map((notif: any) => (
                    <tr key={notif.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="w-8 h-8 relative">
                          <img src="/img/apple-icon.png" alt="Icon" className="w-full h-full object-contain" />
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">{notif.notification}</td>
                      <td className="py-3 px-4 text-xs text-gray-500 whitespace-nowrap">{notif.created_date}</td>
                      <td className="py-3 px-4">
                        {/* Action buttons could go here */}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-sm text-gray-500">
                      No notifications available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}

function StatsCard({
  title,
  category,
  value,
  icon,
  footerIcon,
  footerText,
  footerLink
}: {
  title: string;
  category: string;
  value: React.ReactNode;
  icon: any;
  footerIcon: any;
  footerText: string;
  footerLink: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 rounded-md bg-opacity-10">
          {icon}
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 mb-1">{category}</p>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>
      </div>
      <div className="border-t border-gray-100 pt-3">
        <Link href={footerLink} className="flex items-center text-gray-500 hover:text-gray-700 text-sm transition-colors">
          <span className="mr-2">{footerIcon}</span>
          {footerText}
        </Link>
      </div>
    </div>
  );
}
