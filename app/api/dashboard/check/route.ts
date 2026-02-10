import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    const uid = cookieStore.get('uid')?.value;
    const access = cookieStore.get('access')?.value;
    const token = cookieStore.get('token')?.value;

    if (!session || !uid) {
        return NextResponse.json({ error: "Missing session cookies" }, { status: 401 });
    }

    const cookieHeader = `session=${session}; uid=${uid}; access=${access}; token=${token}`;

    try {
        const body = await request.json();
        const { serial } = body;

        if (!serial) {
            return NextResponse.json({ error: "Serial number required" }, { status: 400 });
        }

        // TODO: confirm actual endpoint. Assuming /Activation/check.php or similar based on pattern
        // It might be a form post to check.php or specific json endpoint
        const targetUrl = "https://bein.newhd.info/Activation/check.php"; // Placeholder

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const res = await fetch(targetUrl, {
            method: "POST",
            headers: {
                "Cookie": cookieHeader,
                "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "Referer": "https://bein.newhd.info/check.php", // Assumed referer
                "Origin": "https://bein.newhd.info"
            },
            body: `serial=${serial}`, // Adjust body param name if needed
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!res.ok) {
            return NextResponse.json({ error: `Upstream error: ${res.status}` }, { status: res.status });
        }

        const text = await res.text();
        // parsing logic depends on response (JSON vs HTML)
        // For now returning raw text or simple success to frontend
        return NextResponse.json({ success: true, verified: true, raw: text.substring(0, 200) });

    } catch (error: any) {
        console.error("Check Proxy Error:", error);
        if (error.name === 'AbortError') {
            return NextResponse.json({ error: "Request timed out" }, { status: 504 });
        }
        return NextResponse.json({ error: "Failed to check card" }, { status: 500 });
    }
}
