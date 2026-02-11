import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { fullname, email, password } = body;

        if (!fullname || !email || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { username: email.split('@')[0] } // specific logic: username = email prefix
                ]
            }
        });

        if (existingUser) {
            return NextResponse.json({ error: 'User with this email or username already exists' }, { status: 409 });
        }

        // Create User
        // Note: In production, password must be hashed!
        const newUser = await prisma.user.create({
            data: {
                fullname,
                email,
                password, // Storing as plain text for now as per replica request/seed
                username: email.split('@')[0], // Generating username from email
                role: 'user', // Default role
                balance: 0.0,
            }
        });

        return NextResponse.json({ success: true, user: newUser }, { status: 201 });

    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
