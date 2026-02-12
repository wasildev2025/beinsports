"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Wrench,
    Key,
    History,
    Menu,
    Settings,
    LogOut,
    ChevronDown,
    ChevronRight,
    Plus,
    UserCog,
    CreditCard,
    Ticket,
    MousePointer2,
    ClipboardList,
    Megaphone,
    Hammer
} from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
        users: false,
        dealer: false,
        operations: false,
        codes: false
    });
    const pathname = usePathname();
    const [adminProfile, setAdminProfile] = useState<{ fullname?: string; role?: string } | null>(null);

    useEffect(() => {
        // Fetch admin profile data
        fetch('/api/dashboard/profile')
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    setAdminProfile(data[0]);
                }
            })
            .catch(err => console.error("Failed to fetch profile", err));
    }, []);

    const toggleMenu = (menu: string) => {
        setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
    };

    return (
        <div className="flex h-screen bg-[#f7f7f8] font-['Montserrat']">
            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? "w-[260px]" : "w-[80px]"
                    } transition-all duration-300 ease-in-out relative flex flex-col shadow-xl z-30`}
                style={{
                    backgroundColor: "#1a1a1a", // Darker for admin
                    color: "white"
                }}
            >
                {/* Overlay for aesthetic consistency with user panel */}
                <div className="absolute inset-0 bg-blue-600/10 mix-blend-multiply z-0 pointer-events-none" />

                <div className="relative z-10 flex flex-col h-full">
                    {/* Logo Section */}
                    <div className="py-5 px-6 border-b border-white/10 flex items-center justify-between">
                        <Link href="/admin" className="text-lg font-bold tracking-wider uppercase block">
                            {isSidebarOpen ? "NEW HD ADMIN" : "AD"}
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
                        <div className={`px-4 py-2 text-[10px] font-bold text-white/40 uppercase tracking-widest ${!isSidebarOpen && "hidden"}`}>
                            Administration
                        </div>

                        <NavItem href="/admin" icon={<LayoutDashboard size={18} />} label="Dashboard" isActive={pathname === "/admin"} isOpen={isSidebarOpen} />

                        {/* Users Group */}
                        <CollapsibleMenu
                            label="Users"
                            icon={<Users size={18} />}
                            isOpen={isSidebarOpen}
                            isExpanded={openMenus.users}
                            onToggle={() => toggleMenu('users')}
                        >
                            <NavItem href="/admin/users" icon={<UserCog size={16} />} label="Resellers Management" isActive={pathname === "/admin/users"} isOpen={isSidebarOpen} isSubItem />
                            <NavItem href="/admin/other-users" icon={<Users size={16} />} label="Others Management" isActive={pathname === "/admin/other-users"} isOpen={isSidebarOpen} isSubItem />
                        </CollapsibleMenu>

                        {/* Bein Dealer Group */}
                        <CollapsibleMenu
                            label="Bein Dealer"
                            icon={<Hammer size={18} />}
                            isOpen={isSidebarOpen}
                            isExpanded={openMenus.dealer}
                            onToggle={() => toggleMenu('dealer')}
                        >
                            <NavItem href="/admin/dealer-login" icon={<Wrench size={16} />} label="Dealer Login" isActive={pathname === "/admin/dealer-login"} isOpen={isSidebarOpen} isSubItem />
                            <NavItem href="/admin/promo-code" icon={<Ticket size={16} />} label="Promo Code" isActive={pathname === "/admin/promo-code"} isOpen={isSidebarOpen} isSubItem />
                            <NavItem href="/admin/dealer-sold" icon={<CreditCard size={16} />} label="Dealer Sold" isActive={pathname === "/admin/dealer-sold"} isOpen={isSidebarOpen} isSubItem />
                        </CollapsibleMenu>

                        {/* Operations Group (Simplified direct items per screenshot but grouped here mentally) */}
                        <NavItem href="/admin/sold-orders" icon={<MousePointer2 size={18} />} label="Sold Orders" isActive={pathname === "/admin/sold-orders"} isOpen={isSidebarOpen} />
                        <NavItem href="/admin/operations-list" icon={<MousePointer2 size={18} />} label="Operations List" isActive={pathname === "/admin/operations-list"} isOpen={isSidebarOpen} />
                        <NavItem href="/admin/operations-dealer" icon={<MousePointer2 size={18} />} label="Operations Dealer" isActive={pathname === "/admin/operations-dealer"} isOpen={isSidebarOpen} />

                        {/* Code Management Group */}
                        <CollapsibleMenu
                            label="Code Management"
                            icon={<Hammer size={18} />}
                            isOpen={isSidebarOpen}
                            isExpanded={openMenus.codes}
                            onToggle={() => toggleMenu('codes')}
                        >
                            <NavItem href="/admin/generate-codes" icon={<Plus size={16} />} label="Generate Codes" isActive={pathname === "/admin/generate-codes"} isOpen={isSidebarOpen} isSubItem />
                            <NavItem href="/admin/codes-list" icon={<Key size={16} />} label="Codes List" isActive={pathname === "/admin/codes-list"} isOpen={isSidebarOpen} isSubItem />
                            <NavItem href="/admin/codes-activated" icon={<ClipboardList size={16} />} label="Codes Activated" isActive={pathname === "/admin/codes-activated"} isOpen={isSidebarOpen} isSubItem />
                        </CollapsibleMenu>

                        <NavItem href="/admin/add-notification" icon={<Megaphone size={18} />} label="Add Notification" isActive={pathname === "/admin/add-notification"} isOpen={isSidebarOpen} />
                        <NavItem href="/admin/history" icon={<History size={18} />} label="History Connection" isActive={pathname === "/admin/history"} isOpen={isSidebarOpen} />
                    </nav>

                    {/* Footer / Profile */}
                    <div className="p-4 border-t border-white/10">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
                                {adminProfile?.fullname?.charAt(0) || "A"}
                            </div>
                            {isSidebarOpen && (
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-xs font-medium truncate">{adminProfile?.fullname || "Admin"}</p>
                                    <p className="text-[10px] opacity-50 uppercase tracking-tighter">System Administrator</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Admin Navbar */}
                <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm">
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors focus:outline-none"
                        >
                            <Menu size={20} />
                        </button>
                        <nav className="ml-6 flex items-center space-x-2 text-sm text-gray-500">
                            <span className="hover:text-blue-600 transition-colors cursor-pointer">Admin</span>
                            <span className="text-gray-300">/</span>
                            <span className="text-gray-900 font-medium capitalize">
                                {pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
                            </span>
                        </nav>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="hidden md:flex flex-col items-end mr-2">
                            <span className="text-xs font-semibold text-gray-700 capitalize">{adminProfile?.role || 'Admin'}</span>
                            <span className="text-[10px] text-green-500 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                Secure Session
                            </span>
                        </div>
                        <div className="h-8 w-px bg-gray-200"></div>
                        <Link href="/dashboard" className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors">
                            Switch to User Panel
                        </Link>
                        <button className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors">
                            <LogOut size={18} />
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-6 bg-[#f7f7f8]">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>

                    <footer className="mt-12 py-6 border-t border-gray-200 text-center text-gray-400 text-[10px] uppercase tracking-widest font-medium">
                        <p>© {new Date().getFullYear()} <span className="text-blue-600">New HD</span> Administrative Control Panel</p>
                    </footer>
                </main>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    );
}

function NavItem({ href, icon, label, isActive, isOpen, isSubItem }: { href: string; icon: React.ReactNode; label: string; isActive: boolean; isOpen: boolean; isSubItem?: boolean }) {
    return (
        <Link
            href={href}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive
                    ? "bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/20"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }
                ${isOpen ? "justify-start" : "justify-center"}
                ${isSubItem && isOpen ? "ml-4" : ""}
            `}
        >
            <div className={`${isActive ? "text-white" : "text-white/40 group-hover:text-white"}`}>
                {icon}
            </div>
            {isOpen && <span className="truncate text-[13px]">{label}</span>}
        </Link>
    );
}

function CollapsibleMenu({ label, icon, isOpen, isExpanded, onToggle, children }: { label: string, icon: React.ReactNode, isOpen: boolean, isExpanded: boolean, onToggle: () => void, children: React.ReactNode }) {
    if (!isOpen) {
        return (
            <div className="p-1 flex justify-center">
                <button
                    onClick={onToggle}
                    className="p-3 text-white/40 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                >
                    {icon}
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-1">
            <button
                onClick={onToggle}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-white/60 hover:bg-white/5 hover:text-white`}
            >
                <div className="flex items-center space-x-3">
                    <div className="text-white/40 group-hover:text-white">{icon}</div>
                    <span className="text-[13px]">{label}</span>
                </div>
                <div className="transition-transform duration-200">
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </div>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="py-1 space-y-1">
                    {children}
                </div>
            </div>
        </div>
    );
}
