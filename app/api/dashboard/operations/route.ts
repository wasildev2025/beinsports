import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Use a global prisma client to avoid connection limit issues in dev
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function GET() {
    try {
        // In a real app, filter by the logged-in user's ID
        // For now, return all operations
        const ops = await prisma.operation.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        const mappedOps = ops.map((op: any) => ({
            id: op.id,
            title: op.type,
            date: op.createdAt.toISOString().split('T')[0],
            details: op.details,
            status: op.status
        }));

        return NextResponse.json(mappedOps);
    } catch (error) {
        return NextResponse.json([], { status: 500 });
    }
}
