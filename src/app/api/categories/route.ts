import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories);
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const count = await prisma.category.count();
    if (count >= 5) {
        return new NextResponse("Límite de 5 categorías alcanzado", { status: 400 });
    }

    const { name } = await req.json();

    const category = await prisma.category.create({
        data: { name },
    });

    return NextResponse.json(category);
}
