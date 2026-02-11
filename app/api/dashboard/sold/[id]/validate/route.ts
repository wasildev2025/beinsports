import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const operationId = parseInt(id);

        if (!operationId) {
            return NextResponse.json({ error: 'Invalid Operation ID' }, { status: 400 });
        }

        const operation = await prisma.operation.findUnique({
            where: { id: operationId },
            include: { user: true }
        });

        if (!operation) {
            return NextResponse.json({ error: 'Operation not found' }, { status: 404 });
        }

        if (operation.status !== 'PENDING') {
            return NextResponse.json({ error: 'Operation is not pending' }, { status: 400 });
        }

        // Transaction: Update Operation Status AND Update User Balance
        await prisma.$transaction([
            prisma.operation.update({
                where: { id: operationId },
                data: { status: 'SUCCESS' }
            }),
            prisma.user.update({
                where: { id: operation.userId },
                data: { balance: { increment: (operation as any).amount ?? 0 } }
            })
        ]);

        return NextResponse.json({ success: true, message: 'Operation validated' });

    } catch (error) {
        console.error('Error validating operation:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
