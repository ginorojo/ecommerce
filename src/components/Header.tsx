"use client";

import Link from "next/link";
import { useCart } from "@/store/useCart";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

interface NavbarProps {
    categories: { id: string; name: string }[];
    primaryColor: string;
}

export default function Header({ categories, primaryColor }: NavbarProps) {
    const { items, setIsOpen } = useCart();
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const cartCount = mounted ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold" style={{ color: primaryColor }}>
                    E-STORE
                </Link>

                {/* Desktop Navbar */}
                <nav className="hidden md:flex items-center space-x-8">
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/category/${cat.id}`}
                            className="text-gray-600 hover:text-black transition-colors"
                        >
                            {cat.name}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center space-x-4">
                    <button onClick={() => setIsOpen(true)} className="relative p-2">
                        <ShoppingCart className="w-6 h-6" />
                        {cartCount > 0 && (
                            <span
                                className="absolute top-0 right-0 w-5 h-5 flex items-center justify-center text-[10px] text-white rounded-full"
                                style={{ backgroundColor: primaryColor }}
                            >
                                {cartCount}
                            </span>
                        )}
                    </button>

                    {session ? (
                        <div className="flex items-center space-x-2">
                            <Link href={session.user.role === 'ADMIN' ? '/admin' : '/account'}>
                                <User className="w-6 h-6 cursor-pointer" />
                            </Link>
                            <button
                                onClick={() => signOut()}
                                className="text-sm text-gray-500 hover:text-red-500"
                            >
                                Salir
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => signIn()}
                            className="px-4 py-2 rounded-lg text-white text-sm"
                            style={{ backgroundColor: primaryColor }}
                        >
                            Login
                        </button>
                    )}

                    <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-b p-4 space-y-4">
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/category/${cat.id}`}
                            className="block text-gray-600 font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {cat.name}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    );
}
