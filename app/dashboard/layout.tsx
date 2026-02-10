import Link from "next/link";
import { User, CreditCard, ShoppingBag, List, FileText, History, Settings } from "lucide-react"; // Assuming we install lucide-react or use placeholders

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md flex flex-col">
                <div className="p-4 border-b">
                    <h1 className="text-xl font-bold text-blue-600">New HD Panel</h1>
                </div>
                <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                    <NavItem href="/dashboard" icon={<FileText size={20} />} label="Dashboard" />
                    <NavItem href="/dashboard/users" icon={<User size={20} />} label="Users" />
                    <NavItem href="/dashboard/check" icon={<Settings size={20} />} label="Check" />
                    <NavItem href="/dashboard/buy" icon={<ShoppingBag size={20} />} label="Buy Package" />
                    <NavItem href="/dashboard/operations" icon={<List size={20} />} label="List Operations" />
                    <NavItem href="/dashboard/sold" icon={<CreditCard size={20} />} label="Sold Orders" />
                    <NavItem href="/dashboard/activation" icon={<FileText size={20} />} label="Activation Code" />
                    <NavItem href="/dashboard/history" icon={<History size={20} />} label="History Connection" />
                </nav>
                <div className="p-4 border-t">
                    <div className="text-sm text-gray-500">v1.2.3</div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
                    <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-700">Ajmal KSA (0.00 $)</span>
                        <button className="text-sm text-red-600 hover:text-red-800">Logout</button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}

function NavItem({ href, icon, label }: { href: string; icon: any; label: string }) {
    return (
        <Link href={href} className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors">
            {icon}
            <span>{label}</span>
        </Link>
    );
}
