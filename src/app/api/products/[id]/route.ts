import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const values = await req.json();

    const product = await prisma.product.update({
        where: { id },
        data: {
            ...values,
            price: values.price ? parseFloat(values.price) : undefined,
            stock: values.stock ? parseInt(values.stock) : undefined,
        },
    });

    return NextResponse.json(product);
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    await prisma.product.delete({
        where: { id },
    });

    return new NextResponse(null, { status: 204 });
}
