"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";

interface ProductGridProps {
    initialProducts: any[];
    primaryColor: string;
}

export default function ProductGrid({ initialProducts, primaryColor }: ProductGridProps) {
    const [page, setPage] = useState(1);
    const itemsPerPage = 12;

    const startIndex = (page - 1) * itemsPerPage;
    const currentProducts = initialProducts.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(initialProducts.length / itemsPerPage);

    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold mb-12">Nuestros Productos</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {currentProducts.map((product) => (
                    <ProductCard key={product.id} product={product} primaryColor={primaryColor} />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="mt-16 flex items-center justify-center gap-4">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="px-8 py-3 rounded-full border-2 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-30"
                        style={{ borderColor: primaryColor, color: primaryColor }}
                    >
                        Anterior
                    </button>
                    <span className="text-gray-500 font-medium">Página {page} de {totalPages}</span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        className="px-8 py-3 rounded-full border-2 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-30"
                        style={{ borderColor: primaryColor, color: primaryColor }}
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
}
