import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            where: { role: { not: 'admin' } }, // Hide admin from list
            select: {
                id: true,
                username: true,
                email: true,
                balance: true,
                role: true,
                // status is not in schema yet, assuming active for now
            }
        });

        const mappedUsers = users.map((u: any) => ({
            id: u.username,
            email: u.email || "N/A",
            credits: u.balance.toFixed(2) + " $",
            status: "Active"
        }));

        return NextResponse.json(mappedUsers);

    } catch (error) {
        console.error(error);
        return NextResponse.json([], { status: 500 });
    }
}
