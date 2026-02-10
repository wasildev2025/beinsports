"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export default function ManualAuthPage() {
    const router = useRouter();
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Attempt to parse as JSON first
            let tokens: any = {};
            try {
                if (input.trim().startsWith('{')) {
                    tokens = JSON.parse(input);
                } else {
                    // Try parsing raw text "key=value" lines or similar
                    // For now, assume the user might paste the raw "user: ... access: ..." block
                    // or just a list of cookies.
                    // Let's rely on specific keys if possible.

                    // Simple parser for "key = value" or "key: value"
                    input.split('\n').forEach(line => {
                        const parts = line.split(/[=:]/);
                        if (parts.length >= 2) {
                            const key = parts[0].trim().replace(/['"]/g, '');
                            const value = parts.slice(1).join('=').trim().replace(/['"]/g, '');
                            tokens[key] = value;
                        }
                    });
                }
            } catch (e) {
                console.error("Parse error", e);
            }

            // Normalizing keys
            const normalizedTokens = {
                session: tokens.session || tokens.Session,
                uid: tokens.uid || tokens.UID || tokens.user_id,
                access: tokens.access || tokens.Access || tokens.accessToken,
                token: tokens.token || tokens.Token,
                _csrf: tokens._csrf || tokens.csrf,
                'XSRF-TOKEN': tokens['XSRF-TOKEN'] || tokens.xsrf_token
            };

            if (!normalizedTokens.session && !normalizedTokens.uid) {
                throw new Error("Could not find 'session' or 'uid' in input. Please paste JSON or key=value pairs.");
            }

            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ manual: true, ...normalizedTokens })
            });

            if (res.ok) {
                router.push('/dashboard');
            } else {
                throw new Error("Failed to set session");
            }

        } catch (err: any) {
            setError(err.message || "Failed to process tokens");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-lg w-full">
                <div className="flex items-center justify-center mb-6 text-blue-600">
                    <ShieldCheck size={48} />
                </div>
                <h1 className="text-2xl font-bold text-center mb-2">Manual Authentication</h1>
                <p className="text-gray-500 text-center mb-6">
                    Paste your valid session tokens (JSON or key=value) to bypass login.
                </p>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-center mb-4">
                        <AlertCircle className="mr-2" size={18} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <textarea
                            className="w-full h-48 p-3 border border-gray-300 rounded-md font-mono text-xs"
                            placeholder='{"session": "...", "uid": "..."} or session=...'
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Authenticate'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/')}
                        className="w-full text-gray-500 text-sm hover:underline"
                    >
                        Back to Login
                    </button>
                </form>
            </div>
        </div>
    );
}
