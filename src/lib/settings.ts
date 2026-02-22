import { prisma } from "./prisma";

export async function getSiteSettings() {
    const settings = await prisma.siteSettings.upsert({
        where: { id: "singleton" },
        update: {},
        create: {
            id: "singleton",
            primaryColor: "#3b82f6",
            fontSelection: "Inter",
            heroTitle: "Bienvenidos a nuestra tienda",
            heroSubtitle: "Los mejores productos al mejor precio",
            heroImage: "",
            carouselImages: [],
        },
    });

    return settings;
}
