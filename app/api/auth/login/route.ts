import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        let body: FormData | null = null;
        let manualData: any = null;

        // Try to parse as FormData first
        try {
            // Use request.clone() to allow reading the body multiple times if needed
            body = await request.clone().formData();
        } catch (e) {
            // If formData parsing fails, it might be JSON
        }

        // Check if JSON (manual auth)
        if (!body || body.get('username') === null) {
            const jsonBody = await request.json().catch(() => null);
            if (jsonBody && jsonBody.manual) {
                manualData = jsonBody;
            }
        }

        if (manualData) {
            const { session, uid, access, token, _csrf, 'XSRF-TOKEN': xsrf } = manualData;

            const response = NextResponse.json({
                success: true,
                message: "Manual login successful",
                user: {
                    name: "Reseller",
                    email: "manual@example.com",
                    role: "Reseller"
                }
            });

            if (session) response.cookies.set('session', session, { httpOnly: true, path: '/' });
            if (uid) response.cookies.set('uid', uid, { httpOnly: true, path: '/' });
            if (access) response.cookies.set('access', access, { httpOnly: true, path: '/' });
            if (token) response.cookies.set('token', token, { httpOnly: true, path: '/' });
            if (_csrf) response.cookies.set('_csrf', _csrf, { httpOnly: true, path: '/' });
            if (xsrf) response.cookies.set('XSRF-TOKEN', xsrf, { httpOnly: true, path: '/' });

            return response;
        }

        // If not manual data, proceed with form data login
        if (!body) {
            return NextResponse.json({ success: false, message: "Invalid request body" }, { status: 400 });
        }

        const username = body.get('username');
        const password = body.get('password');

        if (!username || !password) {
            return NextResponse.json({ success: false, message: "Missing username or password" }, { status: 400 });
        }

        // 1. Prepare form data for NewHD
        const formData = new URLSearchParams();
        if (username) formData.append('username', username.toString());
        if (password) formData.append('password', password.toString());
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

        const setCookieHeader = loginRes.headers.get("set-cookie");
        if (!setCookieHeader) {
            return NextResponse.json({ success: false, message: "Login failed - No session cookie received from upstream" }, { status: 401 });
        }

        // Simplified parsing: merge all cookies into one session cookie for now
        // But better to parse them to support the specific cookies expected by stats
        // We will store the raw `setCookieHeader` if manageable, or join them.
        // Actually, the previous implementation stored them all in 'session'.
        // Let's stick to that but also try to extract uid/access/token if present.

        const cookies = setCookieHeader.split(',').map(c => c.split(';')[0]).join('; ');

        const response = NextResponse.json({
            success: true,
            user: {
                name: "Reseller",
                email: username ? username.toString() : "",
                role: "Reseller"
            }
        });

        response.cookies.set('session', cookies, { httpOnly: true, path: '/' });

        // Try regex extraction for specific items
        const uidMatch = setCookieHeader.match(/uid=([^;]+)/);
        if (uidMatch) response.cookies.set('uid', uidMatch[1], { httpOnly: true, path: '/' });

        const accessMatch = setCookieHeader.match(/access=([^;]+)/);
        if (accessMatch) response.cookies.set('access', accessMatch[1], { httpOnly: true, path: '/' });

        const tokenMatch = setCookieHeader.match(/token=([^;]+)/);
        if (tokenMatch) response.cookies.set('token', tokenMatch[1], { httpOnly: true, path: '/' });

        return response;

    } catch (e) {
        console.error("Login Error:", e);
        return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
    }
}
