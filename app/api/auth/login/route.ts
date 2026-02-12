import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { email, password, captchaToken } = await request.json();

        // 1. Verify reCAPTCHA
        const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
        const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${captchaToken}`;

        const recaptchaResponse = await fetch(recaptchaUrl, { method: 'POST' });
        const recaptchaData = await recaptchaResponse.json();

        if (!recaptchaData.success) {
            return NextResponse.json({ error: 'reCAPTCHA verification failed' }, { status: 400 });
        }

        // 2. Find User (using username or email)
        // Note: Our schema has username as unique, and email as optional.
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: email }, // Try username first
                    { email: email }    // Then try email
                ],
                password: password // In prod, use bcrypt!
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        if (user.disabled) {
            return NextResponse.json({ error: 'Account is disabled' }, { status: 403 });
        }

        // 3. Set Session Cookie (Role included for middleware)
        const response = NextResponse.json({
            success: true,
            role: user.role,
            username: user.username
        });

        // Set cookie manually in the header for more control
        response.cookies.set('session', 'authenticated', {
            path: '/',
            maxAge: 86400,
            httpOnly: false, // Accessible by client-side logic if needed
        });

        response.cookies.set('user_role', user.role, {
            path: '/',
            maxAge: 86400,
            httpOnly: false,
        });

        return response;

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
