import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get('session')?.value;
        const uid = cookieStore.get('uid')?.value;

        if (!session || !uid) {
            return NextResponse.json({ operations: [], userOperations: [] }, { status: 401 });
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
            "Referer": "https://bein.newhd.info/Activation/Sous-Resseler/Operations_list",
            "Origin": "https://bein.newhd.info",
        };
        if (xsrf) headers["X-XSRF-TOKEN"] = xsrf;

        // Fetch both endpoints in parallel
        const [opsRes, usersOpsRes] = await Promise.all([
            fetch("https://bein.newhd.info/Activation/Sous-Resseler/get_Operations_List", {
                method: "GET",
                headers,
            }).catch(() => null),
            fetch("https://bein.newhd.info/Activation/Rget_Operations_List_users", {
                method: "GET",
                headers,
            }).catch(() => null),
        ]);

        let operations: any[] = [];
        let userOperations: any[] = [];

        if (opsRes && opsRes.ok) {
            try {
                const data = await opsRes.json();
                if (Array.isArray(data)) operations = data;
            } catch (e) {
                console.warn("Failed to parse operations response:", e);
            }
        }

        if (usersOpsRes && usersOpsRes.ok) {
            try {
                const data = await usersOpsRes.json();
                if (Array.isArray(data)) userOperations = data;
            } catch (e) {
                console.warn("Failed to parse user operations response:", e);
            }
        }

        return NextResponse.json({ operations, userOperations });

    } catch (error) {
        console.error("Operations API Error:", error);
        return NextResponse.json({ operations: [], userOperations: [] }, { status: 500 });
    }
}
