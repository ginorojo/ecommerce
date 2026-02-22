"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { LogIn, UserPlus, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function SignInPage() {
    const [isRegister, setIsRegister] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isRegister) {
                const res = await fetch("/api/register", {
                    method: "POST",
                    body: JSON.stringify(formData),
                    headers: { "Content-Type": "application/json" }
                });

                if (res.ok) {
                    toast.success("Cuenta creada. Ahora puedes ingresar.");
                    setIsRegister(false);
                } else {
                    toast.error("Error al crear cuenta");
                }
            } else {
                const res = await signIn("credentials", {
                    email: formData.email,
                    password: formData.password,
                    callbackUrl: "/admin",
                    redirect: false
                });

                if (res?.error) {
                    toast.error("Credenciales inválidas");
                } else {
                    window.location.href = "/admin";
                }
            }
        } catch (error) {
            toast.error("Ocurrió un error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8 text-white shadow-lg shadow-blue-200">
                    {isRegister ? <UserPlus className="w-8 h-8" /> : <LogIn className="w-8 h-8" />}
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                    {isRegister ? "Crear cuenta" : "Bienvenido"}
                </h1>
                <p className="text-gray-500 mb-8 text-center px-4">
                    {isRegister ? "Regístrate para gestionar tu tienda" : "Ingresa tus credenciales para continuar"}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {isRegister && (
                        <div>
                            <label className="text-sm font-medium text-gray-700 ml-1">Nombre</label>
                            <input
                                type="text"
                                required
                                className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="Tu nombre"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    )}
                    <div>
                        <label className="text-sm font-medium text-gray-700 ml-1">Correo electrónico</label>
                        <input
                            type="email"
                            required
                            className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="correo@ejemplo.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 ml-1">Contraseña</label>
                        <input
                            type="password"
                            required
                            className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-[0.98] shadow-lg shadow-blue-100 flex items-center justify-center gap-2 group"
                    >
                        {loading ? "Procesando..." : (isRegister ? "Registrarse" : "Ingresar")}
                        {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-100"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-4 text-gray-400 font-medium">O también</span>
                    </div>
                </div>

                <button
                    onClick={() => signIn("google", { callbackUrl: "/admin" })}
                    className="w-full flex items-center justify-center gap-4 bg-white border-2 border-gray-200 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all hover:border-gray-300 active:scale-[0.98]"
                >
                    <img src="https://www.ready-to-use.com/wp-content/uploads/2021/01/google-logo-png-29530.png" alt="Google" className="w-6 h-6 object-contain" />
                    Google
                </button>

                <p className="mt-8 text-center text-gray-500 text-sm">
                    {isRegister ? "¿Ya tienes cuenta?" : "¿No tienes cuenta aún?"}
                    <button
                        onClick={() => setIsRegister(!isRegister)}
                        className="ml-2 text-blue-600 font-bold hover:underline"
                    >
                        {isRegister ? "Inicia sesión" : "Regístrate aquí"}
                    </button>
                </p>
            </div>
        </div>
    );
}
