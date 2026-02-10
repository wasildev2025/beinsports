import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SBSClient } from '@/lib/sbs-client';

export async function POST(request: Request) {
    const cookieStore = await cookies();

    // Retrieve SBS cookies (set manually or via a new login route)
    // For now, we assume the user has set them in the browser as instructed
    const sessionId = cookieStore.get('ASP.NET_SessionId')?.value;
    const authCookie = cookieStore.get('SBSDealerAuthCookieD8')?.value;
    const ticket = cookieStore.get('SBSDealerAuthCookieD8Ticket')?.value;

    if (!sessionId || !authCookie || !ticket) {
        return NextResponse.json({
            error: "Missing SBS Session Cookies. Please set ASP.NET_SessionId, SBSDealerAuthCookieD8, and Ticket."
        }, { status: 401 });
    }

    const client = new SBSClient({ sessionId, authCookie, ticket });

    try {
        const body = await request.json();
        if (!body.serial) {
            return NextResponse.json({ error: "Serial number required" }, { status: 400 });
        }

        console.log(`Checking serial ${body.serial} on SBS...`);
        const data = await client.checkCard(body.serial);

        return NextResponse.json(data);

    } catch (error) {
        console.error("Check API Error:", error);
        return NextResponse.json({ error: "Check failed on upstream provider" }, { status: 500 });
    }
}
