"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

interface ProductFormProps {
    categories: any[];
    onSuccess: () => void;
    product?: any;
}

export default function ProductForm({ categories, onSuccess, product }: ProductFormProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: product?.title || "",
        description: product?.description || "",
        price: product?.price || "",
        stock: product?.stock || "",
        categoryId: product?.categoryId || "",
        image: product?.image || "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (product) {
                await axios.patch(`/api/products/${product.id}`, formData);
                toast.success("Producto actualizado");
            } else {
                await axios.post("/api/products", formData);
                toast.success("Producto creado");
            }
            onSuccess();
        } catch (error: any) {
            toast.error(error.response?.data || "Error al guardar");
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const data = new FormData();
        data.append("file", file);

        try {
            const res = await axios.post("/api/upload", data);
            setFormData({ ...formData, image: res.data.url });
            toast.success("Imagen subida");
        } catch (error) {
            toast.error("Error al subir imagen");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Título</label>
                <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Precio</label>
                    <input
                        required
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Stock</label>
                    <input
                        required
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Categoría</label>
                <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                >
                    <option value="">Seleccionar categoría</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg h-24"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Imagen del Producto</label>
                <div className="flex gap-4 items-center">
                    {formData.image && <img src={formData.image} className="w-16 h-16 object-cover rounded" />}
                    <input type="file" onChange={handleImageUpload} className="text-sm" />
                </div>
            </div>

            <button
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50"
            >
                {loading ? "Guardando..." : "Guardar Producto"}
            </button>
        </form>
    );
}
