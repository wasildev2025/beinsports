import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

// Helper to generate 16-character alphanumeric code
function generateCode() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 16; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export async function POST(request: Request) {
    try {
        // Simple security check (could be expanded)
        const cookieStore = await cookies();
        const session = cookieStore.get('session');
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { packageType, quantity } = body;

        if (!packageType || !quantity || quantity < 1 || quantity > 100) {
            return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
        }

        const codes: string[] = [];
        const codeRecords = [];

        for (let i = 0; i < quantity; i++) {
            const codeStr = generateCode();
            codes.push(codeStr);
            codeRecords.push({
                code: codeStr,
                type: packageType,
                createdBy: "admin",
            });
        }

        // Batch insert into DB
        await prisma.code.createMany({
            data: codeRecords,
        });

        return NextResponse.json({ success: true, codes });

    } catch (error) {
        console.error("Code generation error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
