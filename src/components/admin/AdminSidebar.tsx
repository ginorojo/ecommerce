"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, List, Palette, Image as ImageIcon, ShoppingCart, Home } from "lucide-react";

const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Productos", href: "/admin/products", icon: ShoppingBag },
    { name: "Categorías", href: "/admin/categories", icon: List },
    { name: "Apariencia", href: "/admin/settings", icon: Palette },
    { name: "Imágenes", href: "/admin/images", icon: ImageIcon },
    { name: "Pedidos", href: "/admin/orders", icon: ShoppingCart },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-gray-900 text-white min-h-screen p-6 flex flex-col">
            <div className="text-xl font-bold mb-10 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm">CMS</div>
                Admin Panel
            </div>

            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto pt-6 border-t border-gray-800">
                <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white">
                    <Home className="w-5 h-5" />
                    Volver a la Tienda
                </Link>
            </div>
        </aside>
    );
}
