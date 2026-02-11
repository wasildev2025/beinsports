"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Search,
    ShoppingCart,
    PieChart,
    CreditCard,
    Key,
    History,
    Menu,
    Settings,
    LogOut,
    ChevronDown,
    ChevronRight,
    Plus,
    UserCog
} from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isUsersMenuOpen, setIsUsersMenuOpen] = useState(true); // Default open as per source
    const pathname = usePathname();
    const [userProfile, setUserProfile] = useState<any>(null);

    useEffect(() => {
        // Fetch user profile data
        fetch('/api/dashboard/profile')
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    setUserProfile(data[0]);
                }
            })
            .catch(err => console.error("Failed to fetch profile", err));
    }, []);

    return (
        <div className="flex h-screen bg-[#f7f7f8] font-['Montserrat']">
            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? "w-[260px]" : "w-[80px]"
                    } transition-all duration-300 ease-in-out relative flex flex-col`}
                style={{
                    backgroundImage: "url('/img/sidebar-5.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}
            >
                <div className="absolute inset-0 bg-[#9368E9]/80 mix-blend-multiply z-0" />

                <div className="relative z-10 flex flex-col h-full text-white">
                    {/* Logo */}
                    <div className="py-4 px-6 border-b border-white/20 flex items-center">
                        <Link href="/dashboard" className="text-lg font-normal tracking-wide uppercase block">
                            {isSidebarOpen ? "New HD" : "NH"}
                        </Link>
                    </div>

                    {/* User Profile */}
                    <div className="py-6 px-4 border-b border-white/20 text-center">
                        <div className="flex items-center space-x-3 px-2">
                            <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white/30 overflow-hidden">
                                <div className="w-full h-full flex items-center justify-center bg-white/20 text-xs">IMG</div>
                            </div>
                            {isSidebarOpen && (
                                <div className="text-left overflow-hidden">
                                    <p className="text-sm font-medium truncate">{userProfile?.fullname || "Loading..."}</p>
                                    <p className="text-xs opacity-80 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span>
                                        Online
                                    </p>
                                </div>
                            )}
                        </div>
                        {isSidebarOpen && (
                            <div className="mt-4 text-center">
                                <div className="text-xs opacity-70 uppercase tracking-wider mb-1">Sold Balance</div>
                                <div className="text-xl font-bold">
                                    {userProfile ?
                                        Number(userProfile.sold).toLocaleString('en-US', { minimumFractionDigits: 2 }) + " $"
                                        : "0.00 $"}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                        <NavItem href="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" isActive={pathname === "/dashboard"} isOpen={isSidebarOpen} />

                        {/* Users Collapsible Group */}
                        <div className="pt-2">
                            <button
                                onClick={() => setIsUsersMenuOpen(!isUsersMenuOpen)}
                                className={`w-full flex items-center px-3 py-3 rounded-md transition-all duration-200 text-white/80 hover:bg-white/10 hover:text-white ${isSidebarOpen ? "justify-between" : "justify-center"}`}
                            >
                                <div className="flex items-center space-x-3">
                                    <Users size={20} />
                                    {isSidebarOpen && <span>Users</span>}
                                </div>
                                {isSidebarOpen && (
                                    <div className="transition-transform duration-200">
                                        {isUsersMenuOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                    </div>
                                )}
                            </button>

                            {/* Submenu */}
                            <div className={`overflow-hidden transition-all duration-300 ${isUsersMenuOpen ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"}`}>
                                <div className={`space-y-1 pt-1 ${isSidebarOpen ? "pl-10" : "pl-0"}`}>
                                    <NavItem
                                        href="/dashboard/users/add"
                                        icon={<Plus size={18} />}
                                        label="Add Users"
                                        isActive={pathname === "/dashboard/users/add"}
                                        isOpen={isSidebarOpen}
                                        isSubItem={true}
                                    />
                                    <NavItem
                                        href="/dashboard/users"
                                        icon={<UserCog size={18} />}
                                        label="Users Management"
                                        isActive={pathname === "/dashboard/users"}
                                        isOpen={isSidebarOpen}
                                        isSubItem={true}
                                    />
                                    <NavItem
                                        href="/dashboard/sold-users"
                                        icon={<CreditCard size={18} />}
                                        label="Sold Users"
                                        isActive={pathname === "/dashboard/sold-users"}
                                        isOpen={isSidebarOpen}
                                        isSubItem={true}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-1">
                            <NavItem href="/dashboard/check" icon={<Search size={20} />} label="Check" isActive={pathname === "/dashboard/check"} isOpen={isSidebarOpen} />
                            <NavItem href="/dashboard/buy" icon={<ShoppingCart size={20} />} label="Buy Package" isActive={pathname === "/dashboard/buy"} isOpen={isSidebarOpen} />
                            <NavItem href="/dashboard/operations" icon={<PieChart size={20} />} label="List Operations" isActive={pathname === "/dashboard/operations"} isOpen={isSidebarOpen} />
                            <NavItem href="/dashboard/sold" icon={<CreditCard size={20} />} label="Sold Orders" isActive={pathname === "/dashboard/sold"} isOpen={isSidebarOpen} />
                            <NavItem href="/dashboard/activation" icon={<Key size={20} />} label="Activation Code" isActive={pathname === "/dashboard/activation"} isOpen={isSidebarOpen} />
                            <NavItem href="/dashboard/history" icon={<History size={20} />} label="History Connection" isActive={pathname === "/dashboard/history"} isOpen={isSidebarOpen} />
                        </div>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Navbar */}
                <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-20">
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 focus:outline-none"
                        >
                            <Menu size={20} />
                        </button>
                        <h2 className="ml-4 text-xl font-light text-gray-700 hidden md:block">
                            {pathname.includes("/users/add") ? "Add Users" : "Dashboard"}
                        </h2>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-gray-600 cursor-pointer hover:text-[#9368E9] transition-colors">
                            <Settings size={18} />
                            <span className="text-sm font-medium hidden sm:block">Settings</span>
                        </div>
                        <div className="h-6 w-px bg-gray-300 mx-2"></div>
                        <button className="flex items-center space-x-1 text-red-500 hover:text-red-700 transition-colors text-sm font-medium">
                            <LogOut size={16} />
                            <span>Log out</span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-6 md:p-8">
                    {children}

                    <footer className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
                        <p>© {new Date().getFullYear()} <span className="text-[#9368E9] font-medium">New HD</span>, Made BeinSport Life Easy</p>
                    </footer>
                </main>
            </div>
        </div>
    );
}

function NavItem({ href, icon, label, isActive, isOpen, isSubItem }: { href: string; icon: any; label: string; isActive: boolean; isOpen: boolean; isSubItem?: boolean }) {
    if (isSubItem && !isOpen) return null; // Hide sub-items when sidebar is collapsed

    return (
        <Link
            href={href}
            className={`flex items-center space-x-3 px-3 py-3 rounded-md transition-all duration-200 group
        ${isActive
                    ? "bg-white text-[#9368E9] font-medium shadow-md"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }
        ${isOpen ? "justify-start" : "justify-center"}
        `}
        >
            <div className={`${isActive ? "text-[#9368E9]" : "text-white/80 group-hover:text-white"}`}>
                {icon}
            </div>
            {isOpen && <span className="truncate text-sm">{label}</span>}
        </Link>
    );
}
