"use client";

import { useCart } from "@/store/useCart";
import Header from "./Header";
import CartDrawer from "./CartDrawer";

interface WrapperProps {
    children: React.ReactNode;
    settings: any;
    categories: any[];
}

export default function MainLayoutWrapper({ children, settings, categories }: WrapperProps) {
    const { isOpen, setIsOpen } = useCart();

    return (
        <>
            <Header
                categories={categories}
                primaryColor={settings.primaryColor}
            />
            <CartDrawer
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                primaryColor={settings.primaryColor}
            />
            <main className="pt-16">
                {children}
            </main>
        </>
    );
}
