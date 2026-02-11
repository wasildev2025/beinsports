import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get('session')?.value;
        const uid = cookieStore.get('uid')?.value;

        if (!session || !uid) {
            return NextResponse.json([], { status: 401 });
        }

        const csrf = cookieStore.get('_csrf')?.value;
        const xsrf = cookieStore.get('XSRF-TOKEN')?.value;

        let cookieHeader = `session=${session}; uid=${uid}; access=${cookieStore.get('access')?.value}; token=${cookieStore.get('token')?.value}`;
        if (csrf) cookieHeader += `; _csrf=${csrf}`;
        if (xsrf) cookieHeader += `; XSRF-TOKEN=${xsrf}`;

        const headers: Record<string, string> = {
            "Cookie": cookieHeader,
            "X-Requested-With": "XMLHttpRequest",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Referer": "https://bein.newhd.info/Activation/Sous-Resseler/2FA",
            "Origin": "https://bein.newhd.info",
        };
        if (xsrf) headers["X-XSRF-TOKEN"] = xsrf;

        const res = await fetch("https://bein.newhd.info/Activation/Sous-Resseler/get_qrcode", {
            method: "GET",
            headers,
        });

        if (!res.ok) {
            console.warn("Upstream 2FA QR returned:", res.status);
            return NextResponse.json([]);
        }

        const data = await res.json();
        return NextResponse.json(Array.isArray(data) ? data : []);

    } catch (error) {
        console.error("2FA QR API Error:", error);
        return NextResponse.json([], { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get('session')?.value;
        const uid = cookieStore.get('uid')?.value;

        if (!session || !uid) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const code = body.code;

        if (!code || !/^\d{6}$/.test(code)) {
            return NextResponse.json({ error: "Code must be exactly 6 digits" }, { status: 400 });
        }

        const csrf = cookieStore.get('_csrf')?.value;
        const xsrf = cookieStore.get('XSRF-TOKEN')?.value;

        let cookieHeader = `session=${session}; uid=${uid}; access=${cookieStore.get('access')?.value}; token=${cookieStore.get('token')?.value}`;
        if (csrf) cookieHeader += `; _csrf=${csrf}`;
        if (xsrf) cookieHeader += `; XSRF-TOKEN=${xsrf}`;

        const headers: Record<string, string> = {
            "Cookie": cookieHeader,
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Requested-With": "XMLHttpRequest",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Referer": "https://bein.newhd.info/Activation/Sous-Resseler/2FA",
            "Origin": "https://bein.newhd.info",
        };
        if (xsrf) headers["X-XSRF-TOKEN"] = xsrf;

        const res = await fetch("https://bein.newhd.info/Activation/Sous-Resseler/Update_2FA", {
            method: "POST",
            headers,
            body: `code=${encodeURIComponent(code)}`,
            redirect: "manual",
        });

        const location = res.headers.get("location") || "";
        if (location.includes("status=3")) {
            return NextResponse.json({ success: true, message: "2FA Enabled Successfully!" });
        } else if (location.includes("status=1")) {
            return NextResponse.json({ success: true, message: "2FA Disabled Successfully!" });
        } else if (location.includes("status=2")) {
            return NextResponse.json({ error: "Incorrect code!" }, { status: 400 });
        }

        if (res.ok || res.status === 302 || res.status === 301) {
            return NextResponse.json({ success: true, message: "2FA updated successfully" });
        }

        return NextResponse.json({ error: "2FA update failed" }, { status: res.status });

    } catch (error) {
        console.error("2FA Update API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
