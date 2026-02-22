import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    // Nota: Esto fallará si hay productos vinculados. En un SaaS real se manejaría con soft-delete o reasignación.
    await prisma.category.delete({
        where: { id },
    });

    return new NextResponse(null, { status: 204 });
}
