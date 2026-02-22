import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    const products = await prisma.product.findMany({
        include: { category: true },
    });
    return NextResponse.json(products);
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const count = await prisma.product.count();
    if (count >= 24) {
        return new NextResponse("Límite de 24 productos alcanzado", { status: 400 });
    }

    const { title, description, price, stock, image, categoryId } = await req.json();

    const product = await prisma.product.create({
        data: {
            title,
            description,
            price: parseFloat(price),
            stock: parseInt(stock),
            image,
            categoryId,
        },
    });

    return NextResponse.json(product);
}
