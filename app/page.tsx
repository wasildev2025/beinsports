"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isMounted, setIsMounted] = useState(false);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!captchaToken) {
            setError("Please verify that you are not a robot.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, captchaToken }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Login failed. Please try again.");
                setIsLoading(false);
                return;
            }

            // Redirect based on role
            if (data.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/dashboard');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError("An unexpected error occurred. Please try again.");
            setIsLoading(false);
        }
    };


    const handleCaptchaChange = (token: string | null) => {
        setCaptchaToken(token);
        if (token) setError("");
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
                            {isMounted ? (
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
                                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors text-gray-900 placeholder-gray-400"
                                                placeholder="Please enter your Email"
                                                autoComplete="email"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                                Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors text-gray-900 placeholder-gray-400"
                                                    placeholder="Please enter your Password"
                                                    autoComplete="current-password"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                                    tabIndex={-1}
                                                >
                                                    {showPassword ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>


                                        {/* Real reCAPTCHA Widget */}
                                        <div className="flex justify-center py-2">
                                            <ReCAPTCHA
                                                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6Ld54WgsAAAAAHltg3AEdyRQofPmUKkelNIWGYul"}
                                                onChange={handleCaptchaChange}
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="text-center text-red-600 text-sm font-medium bg-red-50 border border-red-200 rounded p-2">
                                            {error}
                                        </div>
                                    )}

                                    <div className="flex justify-center pt-2">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="px-8 py-3 bg-white text-gray-800 font-medium border border-gray-300 rounded hover:bg-gray-50 hover:text-purple-700 transition-colors uppercase tracking-wide text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? (
                                                <span className="flex items-center gap-2">
                                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                                    Logging in...
                                                </span>
                                            ) : "Login"}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-6 h-[300px] flex items-center justify-center">
                                    <div className="animate-pulse flex flex-col items-center">
                                        <div className="h-10 w-48 bg-gray-200 rounded mb-4"></div>
                                        <div className="h-10 w-48 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            )}
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
