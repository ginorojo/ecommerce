"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit, Trash, Package } from "lucide-react";
import ProductForm from "@/components/admin/ProductForm";

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);

    const fetchData = async () => {
        const [pRes, cRes] = await Promise.all([
            axios.get("/api/products"),
            axios.get("/api/categories")
        ]);
        setProducts(pRes.data);
        setCategories(cRes.data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar este producto?")) return;
        await axios.delete(`/api/products/${id}`);
        fetchData();
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Mis Productos ({products.length}/24)</h1>
                <button
                    onClick={() => { setEditingProduct(null); setShowForm(true); }}
                    className="bg-gray-900 text-white px-6 py-2 rounded-xl flex items-center gap-2 hover:bg-black transition-all"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Producto
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6">{editingProduct ? "Editar" : "Crear"} Producto</h2>
                        <ProductForm
                            categories={categories}
                            product={editingProduct}
                            onSuccess={() => { setShowForm(false); fetchData(); }}
                        />
                        <button
                            onClick={() => setShowForm(false)}
                            className="mt-4 w-full text-gray-500 text-sm"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 text-left">
                            <th className="px-6 py-4 font-semibold text-gray-600">Producto</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Categoría</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Precio</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Stock</th>
                            <th className="px-6 py-4 font-semibold text-gray-600 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {products.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img src={p.image} className="w-10 h-10 rounded-lg object-cover" />
                                        <span className="font-medium text-gray-800">{p.title}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{p.category?.name}</td>
                                <td className="px-6 py-4 font-bold text-gray-900">${p.price.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-sm ${p.stock < 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                        {p.stock} unid.
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => { setEditingProduct(p); setShowForm(true); }}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(p.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                        >
                                            <Trash className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {products.length === 0 && (
                    <div className="py-20 text-center text-gray-400">
                        <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>No hay productos registrados</p>
                    </div>
                )}
            </div>
        </div>
    );
}
