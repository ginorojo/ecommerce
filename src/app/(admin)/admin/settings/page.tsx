"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Save } from "lucide-react";

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        primaryColor: "#3b82f6",
        fontSelection: "Inter",
        heroTitle: "",
        heroSubtitle: "",
        contactPhone: "",
        contactEmail: "",
        contactAddress: "",
    });

    useEffect(() => {
        axios.get("/api/settings").then((res) => {
            if (res.data) setSettings(res.data);
            setLoading(false);
        });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await axios.patch("/api/settings", settings);
            toast.success("Configuración guardada");
        } catch (error) {
            toast.error("Error al guardar");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Theme Builder & Ajustes</h1>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-blue-600 text-white px-6 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    <Save className="w-4 h-4" />
                    {saving ? "Guardando..." : "Guardar Cambios"}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Apariencia */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
                    <h2 className="text-xl font-semibold mb-4">Apariencia Visual</h2>
                    <div>
                        <label className="block text-sm font-medium mb-1">Color Primario</label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={settings.primaryColor}
                                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                className="h-10 w-20 rounded border cursor-pointer"
                            />
                            <input
                                type="text"
                                value={settings.primaryColor}
                                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                className="flex-1 px-4 py-2 border rounded-lg"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Fuente</label>
                        <select
                            value={settings.fontSelection}
                            onChange={(e) => setSettings({ ...settings, fontSelection: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg"
                        >
                            <option value="Inter">Inter (Elegante y moderna)</option>
                            <option value="Outfit">Outfit (Geométrica / Premium)</option>
                            <option value="Roboto">Roboto (Clásica / Profesional)</option>
                        </select>
                    </div>
                </div>

                {/* Hero Content */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
                    <h2 className="text-xl font-semibold mb-4">Contenido Hero</h2>
                    <div>
                        <label className="block text-sm font-medium mb-1">Título Principal</label>
                        <input
                            type="text"
                            value={settings.heroTitle}
                            onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Subtítulo</label>
                        <textarea
                            value={settings.heroSubtitle}
                            onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg h-24"
                        />
                    </div>
                </div>

                {/* Contacto */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4 md:col-span-2">
                    <h2 className="text-xl font-semibold mb-4">Información de Contacto (Footer)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Teléfono</label>
                            <input
                                type="text"
                                value={settings.contactPhone}
                                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input
                                type="email"
                                value={settings.contactEmail}
                                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Dirección</label>
                            <input
                                type="text"
                                value={settings.contactAddress}
                                onChange={(e) => setSettings({ ...settings, contactAddress: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
