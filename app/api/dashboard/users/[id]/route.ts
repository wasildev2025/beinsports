import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const userId = parseInt(id);
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
                data: { disabled: !(user as any).disabled } as any,
            });
            return NextResponse.json({ success: true, user: updatedUser });
        }

        if (action === 'update_password') {
            const { password } = body;
            if (!password) return NextResponse.json({ error: 'Password required' }, { status: 400 });

            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: { password: password },
            });
            return NextResponse.json({ success: true, message: 'Password updated' });
        }

        if (action === 'add_balance') {
            const { amount, status } = body; // status: 1 = Payed, 0 = Not Payed
            if (amount === undefined || amount === null) return NextResponse.json({ error: 'Amount required' }, { status: 400 });

            const amountFloat = parseFloat(amount);
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

            let updatedUser = user;
            const oldBalance = user.balance;

            // If status is 1 (Payed), update balance immediately
            const isPayed = String(status) === '1';

            if (isPayed) {
                updatedUser = await prisma.user.update({
                    where: { id: userId },
                    data: { balance: { increment: amountFloat } },
                });
            }

            // Log operation
            await prisma.operation.create({
                data: {
                    type: 'ADD_BALANCE',
                    details: `Added ${amountFloat} to balance (Status: ${isPayed ? 'Payed' : 'Not Payed'})`,
                    status: isPayed ? 'SUCCESS' : 'PENDING',
                    userId: userId,
                    cost: 0,
                    amount: amountFloat,
                    oldBalance: oldBalance,
                } as any
            });

            return NextResponse.json({ success: true, user: updatedUser });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
