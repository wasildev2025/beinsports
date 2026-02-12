import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get('session');
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { text, targetType } = body;

        // Save to local SQL DB for history/fallback
        // Note: userId null means global notification in our schema
        const notification = await prisma.notification.create({
            data: {
                text,
                userId: targetType === "admins" ? 1 : null, // Assuming 1 is the main admin or just using null as global
            },
        });

        return NextResponse.json(notification);

    } catch (error) {
        console.error("Local Notification Error:", error);
        return NextResponse.json({ error: "Failed to log locally" }, { status: 500 });
    }
}
