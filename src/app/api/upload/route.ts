import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(req: Request) {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return new NextResponse("No file provided", { status: 400 });
        }

        // Validación de tamaño: 200kb = 200 * 1024 bytes
        if (file.size > 200 * 1024) {
            return new NextResponse("El archivo es demasiado grande (máx 200kb)", { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Convertir a base64 para Cloudinary
        const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;
        const imageUrl = await uploadImage(base64Image);

        return NextResponse.json({ url: imageUrl });
    } catch (error) {
        console.error("Upload error", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
