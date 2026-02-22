import type { Metadata } from "next";
import { Inter, Outfit, Roboto } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/lib/settings";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const roboto = Roboto({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-roboto" });

export const metadata: Metadata = {
  title: "E-Store CMS | Tu tienda online premium",
  description: "La mejor selección de productos con un diseño elegante y moderno.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  const fontClass = settings.fontSelection === "Outfit"
    ? outfit.className
    : settings.fontSelection === "Roboto"
      ? roboto.className
      : inter.className;

  return (
    <html lang="es">
      <body className={`${fontClass} antialiased text-gray-900`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
