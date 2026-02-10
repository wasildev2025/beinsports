import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

// Use a global prisma client to avoid connection limit issues in dev
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function GET() {
    try {
        // 1. Fetch Local Operations
        const localOps = await prisma.operation.findMany({
            orderBy: { createdAt: 'desc' },
            take: 20
        });

        const formattedLocalOps = localOps.map((op: any) => ({
            id: `local-${op.id}`,
            title: op.type,
            date: op.createdAt.toISOString().split('T')[0],
            details: op.details,
            status: op.status,
            source: 'Local'
        }));

        // 2. Fetch Remote Operations (NewHD)
        let remoteOps: any[] = [];
        const cookieStore = await cookies();
        const session = cookieStore.get('session')?.value;
        const uid = cookieStore.get('uid')?.value;

        if (session && uid) {
            const csrf = cookieStore.get('_csrf')?.value;
            const xsrf = cookieStore.get('XSRF-TOKEN')?.value;

            let cookieHeader = `session=${session}; uid=${uid}; access=${cookieStore.get('access')?.value}; token=${cookieStore.get('token')?.value}`;
            if (csrf) cookieHeader += `; _csrf=${csrf}`;
            if (xsrf) cookieHeader += `; XSRF-TOKEN=${xsrf}`;

            try {
                // Placeholder endpoint - likely Activation/json/get_operations or similar
                // Based on `get_Notification_resseler` pattern
                const remoteRes = await fetch("https://bein.newhd.info/Activation/json/get_operations", {
                    method: "POST",
                    headers: {
                        "Cookie": cookieHeader,
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "X-Requested-With": "XMLHttpRequest",
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                        "Referer": "https://bein.newhd.info/history.php",
                        "Origin": "https://bein.newhd.info",
                        ...(xsrf ? { "X-XSRF-TOKEN": xsrf } : {})
                    },
                    body: "id=1" // Dummy body
                });

                if (remoteRes.ok) {
                    const data = await remoteRes.json();
                    if (Array.isArray(data)) {
                        remoteOps = data.map((op: any) => ({
                            id: `remote-${op.id}`,
                            title: op.type || "Operation",
                            date: op.date,
                            details: op.details || op.message,
                            status: op.status || "Completed",
                            source: "NewHD"
                        }));
                    }
                }
            } catch (e) {
                console.warn("Failed to fetch remote operations:", e);
                // Continue without remote ops
            }
        }

        // 3. Merge and Sort
        const allOps = [...formattedLocalOps, ...remoteOps].sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        return NextResponse.json(allOps);

    } catch (error) {
        console.error("Operations API Error:", error);
        return NextResponse.json([], { status: 500 });
    }
}
