import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        // In a real app, you would get the user ID from the session/token
        // For now, we'll fetch the user seeded: 'ajmalksa'
        const user = await prisma.user.findUnique({
            where: { username: 'ajmalksa' },
            include: {
                operations: true
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Calculate aggregated stats from Operations
        const checkCount = user.operations.filter(op => op.type === 'CHECK').length;
        const renewCount = user.operations.filter(op => op.type === 'RENEW').length;
        const buyCount = user.operations.filter(op => op.type === 'BUY').length;

        const profileData = [
            {
                fullname: user.fullname || user.username,
                sold: user.balance,
                RenewData: renewCount,
                BuyData: buyCount,
                CheckData: checkCount,
            }
        ];

        return NextResponse.json(profileData);
    } catch (error) {
        console.error('Error fetching profile:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
