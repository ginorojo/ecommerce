import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const dataId = searchParams.get("data.id");

    if (type === "payment" && dataId) {
        // Consultar el estado del pago en Mercado Pago
        const response = await axios.get(
            `https://api.mercadopago.com/v1/payments/${dataId}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
                },
            }
        );

        const payment = response.data;

        if (payment.status === "approved") {
            const orderId = payment.external_reference;

            // Usar una transacción de Prisma para asegurar consistencia
            await prisma.$transaction(async (tx: any) => {
                const order = await tx.order.findUnique({
                    where: { id: orderId },
                });

                if (!order || order.status === "PAID") return;

                // Actualizar estado de la orden
                await tx.order.update({
                    where: { id: orderId },
                    data: { status: "PAID" },
                });

                // Restar stock
                const items = order.items as any[];
                for (const item of items) {
                    await tx.product.update({
                        where: { id: item.id },
                        data: {
                            stock: {
                                decrement: item.quantity,
                            },
                        },
                    });
                }
            });
        }
    }

    return new NextResponse("OK", { status: 200 });
}
