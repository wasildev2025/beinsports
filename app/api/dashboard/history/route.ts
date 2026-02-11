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
            "Referer": "https://bein.newhd.info/Activation/Sous-Resseler/History",
            "Origin": "https://bein.newhd.info",
        };
        if (xsrf) headers["X-XSRF-TOKEN"] = xsrf;

        const res = await fetch("https://bein.newhd.info/Activation/Sous-Resseler/get_connection_history", {
            method: "GET",
            headers,
        });

        if (!res.ok) {
            console.warn("Upstream connection history returned:", res.status);
            return NextResponse.json([]);
        }

        const data = await res.json();
        return NextResponse.json(Array.isArray(data) ? data : []);

    } catch (error) {
        console.error("History API Error:", error);
        return NextResponse.json([], { status: 500 });
    }
}
