import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get('session')?.value;
        const uid = cookieStore.get('uid')?.value;

        if (!session || !uid) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const password = body.password;

        if (!password) {
            return NextResponse.json({ error: "All fields Required!" }, { status: 400 });
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
            "Referer": "https://bein.newhd.info/Activation/Sous-Resseler/Change_Password",
            "Origin": "https://bein.newhd.info",
        };
        if (xsrf) headers["X-XSRF-TOKEN"] = xsrf;

        const res = await fetch("https://bein.newhd.info/Activation/Sous-Resseler/Change", {
            method: "POST",
            headers,
            body: `password=${encodeURIComponent(password)}`,
            redirect: "manual",
        });

        // The upstream redirects with ?status=N query params
        const location = res.headers.get("location") || "";
        if (location.includes("status=4")) {
            return NextResponse.json({ success: true, message: "Password was Changed successfully!" });
        } else if (location.includes("status=3")) {
            return NextResponse.json({ error: "All fields Required!" }, { status: 400 });
        }

        // If no redirect with known status
        if (res.ok || res.status === 302 || res.status === 301) {
            return NextResponse.json({ success: true, message: "Password changed successfully" });
        }

        return NextResponse.json({ error: "Password change failed" }, { status: res.status });

    } catch (error) {
        console.error("Change Password API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
