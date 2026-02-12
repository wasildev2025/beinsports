import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const config = await prisma.sbsConfig.findFirst();
        return NextResponse.json(config);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch config" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password, secret } = body;

        const config = await prisma.sbsConfig.upsert({
            where: { id: 1 },
            update: { username, password, secret },
            create: { id: 1, username, password, secret },
        });

        return NextResponse.json(config);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update config" }, { status: 500 });
    }
}
