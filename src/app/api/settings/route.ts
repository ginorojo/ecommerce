import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
    const settings = await prisma.siteSettings.findUnique({
        where: { id: "singleton" },
    });
    return NextResponse.json(settings);
}

export async function PATCH(req: Request) {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const values = await req.json();

    const settings = await prisma.siteSettings.upsert({
        where: { id: "singleton" },
        update: values,
        create: {
            id: "singleton",
            ...values,
        },
    });

    return NextResponse.json(settings);
}
