"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Upload, X } from "lucide-react";

export default function ImagesPage() {
    const [settings, setSettings] = useState<any>(null);
    const [uploading, setUploading] = useState<string | null>(null);

    useEffect(() => {
        axios.get("/api/settings").then((res) => setSettings(res.data));
    }, []);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string, index?: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 200 * 1024) {
            toast.error("El archivo supera los 200kb");
            return;
        }

        setUploading(field + (index ?? ""));
        const formData = new FormData();
        formData.append("file", file);

        try {
            const { data } = await axios.post("/api/upload", formData);

            let newSettings = { ...settings };
            if (field === "heroImage") {
                newSettings.heroImage = data.url;
            } else if (field === "carousel") {
                const newCarousel = [...settings.carouselImages];
                newCarousel[index!] = data.url;
                newSettings.carouselImages = newCarousel;
            }

            await axios.patch("/api/settings", newSettings);
            setSettings(newSettings);
            toast.success("Imagen actualizada");
        } catch (error: any) {
            toast.error(error.response?.data || "Error al subir");
        } finally {
            setUploading(null);
        }
    };

    if (!settings) return <div>Cargando...</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Gestor de Imágenes</h1>
            <p className="text-gray-500">Sube imágenes para el Hero y el Carrusel. Límite estricto de 200kb por imagen.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Hero Image */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border">
                    <h2 className="text-xl font-semibold mb-4">Imagen del Hero</h2>
                    <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden mb-4 border-2 border-dashed">
                        {settings.heroImage ? (
                            <img src={settings.heroImage} className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">Sin imagen</div>
                        )}
                        {uploading === "heroImage" && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">Subiendo...</div>
                        )}
                    </div>
                    <input
                        type="file"
                        id="hero-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleUpload(e, "heroImage")}
                    />
                    <label
                        htmlFor="hero-upload"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-gray-900 text-white rounded-xl cursor-pointer hover:bg-black"
                    >
                        <Upload className="w-4 h-4" />
                        Cambiar Hero
                    </label>
                </div>

                {/* Carousel Images */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border md:col-span-2">
                    <h2 className="text-xl font-semibold mb-4">Imágenes del Carrusel (Máx 3)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[0, 1, 2].map((i) => (
                            <div key={i} className="space-y-4">
                                <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed">
                                    {settings.carouselImages[i] ? (
                                        <img src={settings.carouselImages[i]} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400">Slot {i + 1}</div>
                                    )}
                                    {uploading === ("carousel" + i) && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm">Subiendo...</div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    id={`carousel-${i}`}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => handleUpload(e, "carousel", i)}
                                />
                                <label
                                    htmlFor={`carousel-${i}`}
                                    className="flex items-center justify-center gap-2 w-full py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200"
                                >
                                    <Upload className="w-4 h-4" />
                                    Subir Foto {i + 1}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
