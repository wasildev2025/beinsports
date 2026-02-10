import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    const uid = cookieStore.get('uid')?.value;
    const access = cookieStore.get('access')?.value;
    const token = cookieStore.get('token')?.value;

    const csrf = cookieStore.get('_csrf')?.value;
    const xsrf = cookieStore.get('XSRF-TOKEN')?.value;

    if (!session || !uid) {
        return NextResponse.json({ error: "Missing session cookies" }, { status: 401 });
    }

    let cookieHeader = `session=${session}; uid=${uid}; access=${access}; token=${token}`;
    if (csrf) cookieHeader += `; _csrf=${csrf}`;
    if (xsrf) cookieHeader += `; XSRF-TOKEN=${xsrf}`;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const headers: Record<string, string> = {
            "Cookie": cookieHeader,
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Requested-With": "XMLHttpRequest",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Referer": "https://bein.newhd.info/home.php",
            "Origin": "https://bein.newhd.info"
        };

        if (xsrf) {
            headers["X-XSRF-TOKEN"] = xsrf;
        }

        // 1. Fetch User Data (Balance, etc.)
        const userRes = await fetch("https://bein.newhd.info/Activation/json/get_user", {
            method: "POST",
            headers: headers,
            body: "id=1",
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!userRes.ok) throw new Error(`User data fetch failed: ${userRes.status}`);

        const userText = await userRes.text();
        let userData;
        try {
            userData = JSON.parse(userText);
        } catch (e) {
            console.error("Failed to parse user data JSON:", userText.substring(0, 100));
            return NextResponse.json({ error: "Invalid response from upstream", details: "Session likely expired" }, { status: 401 });
        }

        // 2. Fetch Notifications
        // We can run this in parallel but for safety let's keep it sequential or Promise.all
        // Let's use a new timeout for this request
        const notifController = new AbortController();
        const notifTimeoutId = setTimeout(() => notifController.abort(), 10000);

        const notifRes = await fetch("https://bein.newhd.info/Activation/json/get_Notification_resseler", {
            method: "POST",
            headers: headers,
            signal: notifController.signal
        });
        clearTimeout(notifTimeoutId);

        let notifData = [];
        if (notifRes.ok) {
            try {
                notifData = await notifRes.json();
            } catch (e) {
                console.warn("Failed to parse notifications, defaulting to empty");
            }
        }

        return NextResponse.json({
            balance: userData.sold || "0.00 $",
            operations: {
                check: userData.CheckData || 0,
                renew: userData.RenewData || 0,
                buy: userData.BuyData || 0,
                sold_orders: userData.SoldData || "0.00 $"
            },
            notifications: Array.isArray(notifData) ? notifData.map((n: any) => ({
                id: n.id,
                date: n.date,
                title: n.subject,
                description: n.message
            })) : []
        });

    } catch (error: any) {
        console.error("Proxy Error:", error);
        if (error.name === 'AbortError') {
            return NextResponse.json({ error: "Request timed out" }, { status: 504 });
        }
        return NextResponse.json({ error: "Failed to fetch data from backend", details: error.message }, { status: 500 });
    }
}
