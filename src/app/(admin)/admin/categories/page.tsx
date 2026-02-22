"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash, List } from "lucide-react";
import { toast } from "react-hot-toast";

export default function CategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [newCategory, setNewCategory] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchCategories = async () => {
        const res = await axios.get("/api/categories");
        setCategories(res.data);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategory.trim()) return;

        setLoading(true);
        try {
            await axios.post("/api/categories", { name: newCategory });
            setNewCategory("");
            fetchCategories();
            toast.success("Categoría creada");
        } catch (error: any) {
            toast.error(error.response?.data || "Error al crear");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar categoría? Los productos asociados podrían quedar huérfanos.")) return;
        await axios.delete(`/api/categories/${id}`);
        fetchCategories();
    };

    return (
        <div className="space-y-8 max-w-2xl">
            <h1 className="text-3xl font-bold">Gestor de Categorías</h1>

            <div className="bg-white p-6 rounded-2xl shadow-sm border">
                <h2 className="text-xl font-semibold mb-6">Nueva Categoría ({categories.length}/5)</h2>
                <form onSubmit={handleCreate} className="flex gap-2">
                    <input
                        disabled={categories.length >= 5}
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder={categories.length >= 5 ? "Límite alcanzado" : "Eje: Calzado, Tecnología..."}
                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button
                        type="submit"
                        disabled={loading || categories.length >= 5 || !newCategory.trim()}
                        className="bg-gray-900 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 disabled:opacity-50"
                    >
                        <Plus className="w-4 h-4" />
                        Crear
                    </button>
                </form>
                {categories.length >= 5 && (
                    <p className="mt-2 text-xs text-red-500">Has alcanzado el máximo de 5 categorías para esta tienda.</p>
                )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                <ul className="divide-y">
                    {categories.map((cat) => (
                        <li key={cat.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                            <span className="font-medium text-gray-800">{cat.name}</span>
                            <button
                                onClick={() => handleDelete(cat.id)}
                                className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
                            >
                                <Trash className="w-4 h-4" />
                            </button>
                        </li>
                    ))}
                    {categories.length === 0 && (
                        <li className="py-10 text-center text-gray-400">
                            <List className="w-8 h-8 mx-auto mb-2 opacity-20" />
                            No hay categorías
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}
