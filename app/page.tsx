"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        router.push("/dashboard");
    };

    return (
        <div className="min-h-screen relative overflow-hidden font-['Montserrat']">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-purple-900/40 mix-blend-multiply z-10" />
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: "url('/img/10101.jpg')" }}
                />
            </div>

            {/* Navbar */}
            <nav className="relative z-20 w-full p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <Link href="/" className="flex items-center text-white text-lg font-light tracking-wide hover:opacity-80 transition-opacity">
                        <div className="relative h-[30px] w-auto aspect-[3/1] mr-2">
                            {/* Using standard img tag for robust local file handling if Next.js Image has issues with aspect ratio without defined width */}
                            <img src="/img/logo.png" alt="New HD Logo" className="h-[30px] w-auto object-contain" />
                        </div>
                        || Login
                    </Link>

                    <div className="hidden md:block">
                        <ul className="flex space-x-6">
                            <li>
                                <Link href="#" className="flex items-center text-white hover:text-gray-200 transition-colors">
                                    <span className="mr-2">📱</span> Login
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Mobile Menu Button Placeholder */}
                    <button className="md:hidden text-white">
                        <span className="block w-6 h-0.5 bg-white mb-1"></span>
                        <span className="block w-6 h-0.5 bg-white mb-1"></span>
                        <span className="block w-6 h-0.5 bg-white"></span>
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <div className="relative z-20 container mx-auto px-4 flex flex-col justify-center min-h-[calc(100vh-140px)]">
                <div className="w-full max-w-md mx-auto">
                    {/* Card */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-500 hover:-translate-y-1">
                        <div className="p-6 text-center border-b border-gray-100">
                            <div className="relative w-[200px] h-[200px] mx-auto mb-2">
                                <img src="/img/apple-icon.png" alt="Logo" className="w-[200px] h-[200px] object-contain mx-auto" style={{ marginBottom: '10px' }} />
                            </div>
                        </div>

                        <div className="p-8 pt-2">
                            <form onSubmit={handleLogin} className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">
                                            E-Mail Address
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                                            placeholder="Please enter your Email"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                                            placeholder="Please enter your Password"
                                            required
                                        />
                                    </div>

                                    {/* ReCAPTCHA Placeholder */}
                                    <div className="flex justify-center py-2">
                                        <div className="bg-[#f9f9f9] border border-[#d3d3d3] rounded p-3 flex items-center shadow-sm w-[304px]">
                                            <div className="flex items-center space-x-2 mr-auto">
                                                <div className="w-6 h-6 border-2 border-gray-300 rounded bg-white"></div>
                                                <span className="text-sm font-medium text-gray-600">I'm not a robot</span>
                                            </div>
                                            <div className="flex flex-col items-center ml-2">
                                                <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" className="w-8 h-8 opacity-70" alt="reCAPTCHA" />
                                                <span className="text-[10px] text-gray-500">reCAPTCHA</span>
                                                <div className="text-[8px] text-gray-500 leading-tight">
                                                    <span className="mr-1">Privacy</span>-<span>Terms</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center pt-2">
                                    <button
                                        type="submit"
                                        className="px-8 py-3 bg-white text-gray-800 font-medium border border-gray-300 rounded hover:bg-gray-50 hover:text-purple-700 transition-colors uppercase tracking-wide text-sm"
                                    >
                                        Login
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="relative z-20 py-6 text-center text-white/90 text-sm">
                <div className="container mx-auto">
                    <p>
                        © 2025{" "}
                        <a href="#" className="font-bold hover:text-white transition-colors">
                            New HD
                        </a>{" "}
                        , Made BeinSport Life Easy
                    </p>
                </div>
            </footer>
        </div>
    );
}
