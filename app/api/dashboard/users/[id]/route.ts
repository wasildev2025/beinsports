import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const userId = parseInt(params.id);
        const body = await request.json();
        const { action } = body;

        if (!userId) {
            return NextResponse.json({ error: 'Invalid User ID' }, { status: 400 });
        }

        if (action === 'toggle_status') {
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: { disabled: !user.disabled },
            });
            return NextResponse.json({ success: true, user: updatedUser });
        }

        if (action === 'update_password') {
            const { password } = body;
            if (!password) return NextResponse.json({ error: 'Password required' }, { status: 400 });

            // In production, HASH THIS PASSWORD
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: { password: password },
            });
            return NextResponse.json({ success: true, message: 'Password updated' });
        }

        if (action === 'add_balance') {
            const { amount } = body;
            if (amount === undefined || amount === null) return NextResponse.json({ error: 'Amount required' }, { status: 400 });

            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: { balance: { increment: parseFloat(amount) } },
            });

            // Log operation
            await prisma.operation.create({
                data: {
                    type: 'ADD_BALANCE', // Or generic 'ADMIN_OP'
                    details: `Added ${amount} to balance`,
                    status: 'SUCCESS',
                    userId: userId,
                    cost: parseFloat(amount)
                }
            });

            return NextResponse.json({ success: true, user: updatedUser });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
