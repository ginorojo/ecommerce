import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import ProductGrid from "@/components/ProductGrid";
import MainLayoutWrapper from "@/components/MainLayoutWrapper";
import Footer from "@/components/Footer";

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const settings = await getSiteSettings();
    const categories = await prisma.category.findMany();
    const category = await prisma.category.findUnique({
        where: { id },
        include: { products: true }
    });

    if (!category) return <div>Categoría no encontrada</div>;

    return (
        <MainLayoutWrapper settings={settings} categories={categories}>
            <div className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
                    <p className="text-gray-500">Explora nuestra colección de {category.name.toLowerCase()}</p>
                </div>
            </div>

            <ProductGrid
                initialProducts={category.products}
                primaryColor={settings.primaryColor}
            />

            <Footer
                contact={{
                    phone: settings.contactPhone,
                    email: settings.contactEmail,
                    address: settings.contactAddress
                }}
                primaryColor={settings.primaryColor}
            />
        </MainLayoutWrapper>
    );
}
