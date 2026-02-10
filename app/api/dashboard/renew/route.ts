import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    const uid = cookieStore.get('uid')?.value;

    if (!session || !uid) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cookieHeader = `session=${session}; uid=${uid}; access=${cookieStore.get('access')?.value}; token=${cookieStore.get('token')?.value}`;

    try {
        const body = await request.json();
        // Expected payload: { serial, period, type? }

        const targetUrl = "https://bein.newhd.info/Activation/renew.php"; // Verify endpoint

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000); // Longer timeout for renewal

        const res = await fetch(targetUrl, {
            method: "POST",
            headers: {
                "Cookie": cookieHeader,
                "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "Referer": "https://bein.newhd.info/renew.php",
                "Origin": "https://bein.newhd.info"
            },
            body: new URLSearchParams(body).toString(),
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!res.ok) {
            return NextResponse.json({ error: `Upstream error: ${res.status}` }, { status: res.status });
        }

        const text = await res.text();
        return NextResponse.json({ success: true, message: "Renewal processed ( verify response content)", raw: text.substring(0, 100) });

    } catch (error: any) {
        console.error("Renew Proxy Error:", error);
        return NextResponse.json({ error: "Renewal failed" }, { status: 500 });
    }
}
