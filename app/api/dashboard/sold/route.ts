import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const operations = await prisma.operation.findMany({
            where: {
                type: 'ADD_BALANCE'
            },
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        fullname: true
                    }
                }
            }
        });

        return NextResponse.json(operations);
    } catch (error) {
        console.error('Error fetching sold operations:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
