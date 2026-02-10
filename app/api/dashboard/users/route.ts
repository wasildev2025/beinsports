import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Use a global prisma client to avoid connection limit issues in dev
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                balance: true,
                role: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(users);
    } catch (error) {
        console.error("Users GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password, email, role, balance } = body;

        if (!username || !password) {
            return NextResponse.json({ error: "Username and password required" }, { status: 400 });
        }

        const newUser = await prisma.user.create({
            data: {
                username,
                password, // TODO: Hash this in production!
                email,
                role: role || 'user',
                balance: parseFloat(balance) || 0.0
            }
        });

        // Remove password from response
        const { password: _, ...userWithoutPassword } = newUser;

        return NextResponse.json(userWithoutPassword, { status: 201 });
    } catch (error: any) {
        console.error("Users POST Error:", error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "Username already exists" }, { status: 409 });
        }
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }
}
