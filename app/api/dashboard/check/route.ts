import { NextResponse } from 'next/server';
import { SBSClient } from '@/lib/sbs-client';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { serial } = body;

        if (!serial) {
            return NextResponse.json({ error: "Serial number required" }, { status: 400 });
        }

        // Get SBS dealer credentials from environment
        const sessionId = process.env.SBS_SESSION_ID;
        const authCookie = process.env.SBS_AUTH_COOKIE;
        const ticket = process.env.SBS_TICKET;

        if (!sessionId || !authCookie || !ticket) {
            return NextResponse.json({
                error: "SBS credentials not configured. Set SBS_SESSION_ID, SBS_AUTH_COOKIE, SBS_TICKET in .env"
            }, { status: 500 });
        }

        const sbs = new SBSClient({
            sessionId,
            authCookie,
            ticket
        });

        const result = await sbs.checkCard(serial);

        return NextResponse.json(result);

    } catch (error: any) {
        console.error("Check API Error:", error);
        return NextResponse.json({ error: "Failed to check card" }, { status: 500 });
    }
}
