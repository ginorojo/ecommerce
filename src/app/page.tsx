import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PromotionalCarousel from "@/components/PromotionalCarousel";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import MainLayoutWrapper from "@/components/MainLayoutWrapper";

export default async function HomePage() {
  const settings = await getSiteSettings();
  const categories = await prisma.category.findMany();
  const products = await prisma.product.findMany({
    take: 24, // Limite de negocio
    include: { category: true }
  });

  return (
    <MainLayoutWrapper settings={settings} categories={categories}>
      <Hero
        title={settings.heroTitle}
        subtitle={settings.heroSubtitle}
        image={settings.heroImage}
        primaryColor={settings.primaryColor}
      />

      <div className="max-w-7xl mx-auto px-4 mt-8">
        <PromotionalCarousel images={settings.carouselImages} />
      </div>

      <ProductGrid
        initialProducts={products}
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
