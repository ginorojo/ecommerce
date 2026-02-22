import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { preference } from "@/lib/mercadopago";

export async function POST(req: Request) {
    const session = await auth();
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { items } = await req.json();

    // Crear la orden en la BD
    const order = await prisma.order.create({
        data: {
            userId: session.user.id,
            total: items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0),
            items: items,
            status: "PENDING",
        }
    });

    const body = {
        items: items.map((item: any) => ({
            id: item.id,
            title: item.title,
            quantity: item.quantity,
            unit_price: item.price,
            currency_id: "ARS", // O la moneda correspondiente
        })),
        back_urls: {
            success: `${process.env.NEXTAUTH_URL}/checkout/success`,
            failure: `${process.env.NEXTAUTH_URL}/checkout/failure`,
            pending: `${process.env.NEXTAUTH_URL}/checkout/pending`,
        },
        auto_return: "approved" as const,
        notification_url: `${process.env.NEXTAUTH_URL}/api/webhooks/mercadopago`,
        external_reference: order.id,
    };

    const response = await preference.create({ body });

    return NextResponse.json({ init_point: response.init_point });
}
