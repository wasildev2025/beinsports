import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Use a global prisma client to avoid connection limit issues in dev
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = parseInt((await params).id);

        // Prevent deleting self or super admin if needed
        // For now, just delete

        await prisma.user.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("User DELETE Error:", error);
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = parseInt((await params).id);
        const body = await request.json();
        const { balance, password, role } = body;

        const updateData: any = {};
        if (balance !== undefined) updateData.balance = parseFloat(balance);
        if (password) updateData.password = password; // TODO: Hash
        if (role) updateData.role = role;

        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData
        });

        // Remove password
        const { password: _, ...userWithoutPassword } = updatedUser;

        return NextResponse.json(userWithoutPassword);

    } catch (error) {
        console.error("User PUT Error:", error);
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}
