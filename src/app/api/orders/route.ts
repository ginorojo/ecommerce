import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const orders = await prisma.order.findMany({
        include: { user: true },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
}
