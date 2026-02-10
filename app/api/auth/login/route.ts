import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // 1. Prepare form data for NewHD
        // Verified field names via curl: username, password, login
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);
        formData.append('login', 'Login');

        const loginRes = await fetch("https://bein.newhd.info/Activation/login.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "Referer": "https://bein.newhd.info/",
                "Origin": "https://bein.newhd.info"
            },
            body: formData,
            redirect: "manual"
        });

        // Extract cookies
        const setCookieHeader = loginRes.headers.get("set-cookie");
        console.log("Login Response Status:", loginRes.status);
        console.log("Set-Cookie:", setCookieHeader);

        if (!setCookieHeader) {
            // Even if failed, we might want to check the body or status.
            // But typically a successful login sets a session cookie.
            // If status is 200 and no cookie, it's failed.
            return NextResponse.json({ success: false, message: "Login failed - No session cookie received from upstream" }, { status: 401 });
        }

        // Parse cookies
        // The upstream sets multiple cookies. We need to forward them.
        // Simplified parsing:
        const cookies = setCookieHeader.split(',').map(c => c.split(';')[0]).join('; ');

        // We also need to extract specific cookies if possible to match what the stats API needs (uid, access, token).
        // However, `set-cookie` header merging in node-fetch/Next.js might make this tricky if they are comma-separated.
        // Let's assume `cookies` string captures the necessary parts for now.

        const response = NextResponse.json({
            success: true,
            user: {
                name: "Reseller",
                email: email,
                role: "Reseller"
            }
        });

        // Set the session cookie for our domain
        response.cookies.set('session', cookies, { httpOnly: true, path: '/' });

        // Also try to parse out uid/token/access if they exist in the string to set them individually for the stats route
        // The stats route expects: session, uid, access, token
        // We can try to regex them out of `setCookieHeader`

        const uidMatch = setCookieHeader.match(/uid=([^;]+)/);
        if (uidMatch) response.cookies.set('uid', uidMatch[1], { httpOnly: true, path: '/' });

        const accessMatch = setCookieHeader.match(/access=([^;]+)/);
        if (accessMatch) response.cookies.set('access', accessMatch[1], { httpOnly: true, path: '/' });

        const tokenMatch = setCookieHeader.match(/token=([^;]+)/);
        if (tokenMatch) response.cookies.set('token', tokenMatch[1], { httpOnly: true, path: '/' });

        return response;


    } catch (e) {
        return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
    }
}
