import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        // Fetch 'ajmalksa' user to get their notifications
        // In prod, use session user ID
        const user = await prisma.user.findUnique({
            where: { username: 'ajmalksa' },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const notifications = await prisma.notification.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        const formattedNotifications = notifications.map(notif => {
            // Format date as "YYYY/MM/DD - HH:mm"
            const date = new Date(notif.createdAt);
            const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '/');
            const timeStr = date.toISOString().slice(11, 16);

            return {
                id: notif.id,
                notification: notif.text,
                created_date: `${dateStr} - ${timeStr}`
            };
        });

        return NextResponse.json(formattedNotifications);

    } catch (error) {
        console.error('Error fetching notifications:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
