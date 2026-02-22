"use client";

import { useCart } from "@/store/useCart";
import { Plus } from "lucide-react";
import Image from "next/image";

interface Product {
    id: string;
    title: string;
    price: number;
    image: string;
    stock: number;
}

interface ProductCardProps {
    product: Product;
    primaryColor: string;
}

export default function ProductCard({ product, primaryColor }: ProductCardProps) {
    const { addItem, setIsOpen } = useCart();

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group border border-gray-100">
            <div className="aspect-square overflow-hidden relative">
                <img
                    src={product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30"}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white font-bold uppercase tracking-widest">Sin Stock</span>
                    </div>
                )}
            </div>

            <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                    {product.title}
                </h3>
                <div className="flex items-center justify-between mt-4">
                    <span className="text-2xl font-bold" style={{ color: primaryColor }}>
                        ${product.price.toLocaleString()}
                    </span>
                    <button
                        disabled={product.stock === 0}
                        onClick={() => {
                            addItem({ ...product, quantity: 1 });
                            setIsOpen(true);
                        }}
                        className="p-3 rounded-full text-white transition-all hover:rotate-90 disabled:bg-gray-300"
                        style={{ backgroundColor: product.stock > 0 ? primaryColor : undefined }}
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
