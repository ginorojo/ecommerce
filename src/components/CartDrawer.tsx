"use client";

import { useCart } from "@/store/useCart";
import { X, Trash2, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useState, useEffect } from "react";

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    primaryColor: string;
}

export default function CartDrawer({ isOpen, onClose, primaryColor }: CartDrawerProps) {
    const { items, removeItem, updateQuantity, getTotal } = useCart();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleCheckout = async () => {
        try {
            const response = await axios.post("/api/checkout", { items });
            const { init_point } = response.data;
            window.location.href = init_point;
        } catch (error) {
            console.error("Error al iniciar el checkout", error);
            alert("Hubo un error al procesar el pago");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 z-[60]"
                    />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
                    >
                        <div className="p-6 border-b flex items-center justify-between">
                            <h2 className="text-xl font-bold">Tu Carrito</h2>
                            <button onClick={onClose}><X /></button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {!mounted ? null : items.length === 0 ? (
                                <div className="text-center py-20 text-gray-500">
                                    <p>Tu carrito está vacío</p>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <img
                                            src={item.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30"}
                                            alt={item.title}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-medium">{item.title}</h4>
                                            <p className="font-bold" style={{ color: primaryColor }}>${item.price.toLocaleString()}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-8 h-8 flex items-center justify-center border rounded"
                                                >-</button>
                                                <span>{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-8 h-8 flex items-center justify-center border rounded"
                                                >+</button>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="ml-auto text-red-500"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {mounted && items.length > 0 && (
                            <div className="p-6 border-t bg-gray-50">
                                <div className="flex justify-between mb-4">
                                    <span className="text-gray-600">Total</span>
                                    <span className="text-2xl font-bold">${getTotal().toLocaleString()}</span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-transform active:scale-95"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    <CreditCard className="w-5 h-5" />
                                    Pagar con Mercado Pago
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
