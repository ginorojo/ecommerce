"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle, Clock, XCircle, Eye } from "lucide-react";

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("/api/orders").then((res) => {
            setOrders(res.data);
            setLoading(false);
        });
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PAID":
                return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle className="w-3 h-3" /> PAGADO</span>;
            case "PENDING":
                return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Clock className="w-3 h-3" /> PENDIENTE</span>;
            default:
                return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><XCircle className="w-3 h-3" /> FALLIDO</span>;
        }
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Gestión de Pedidos</h1>

            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 text-left">
                            <th className="px-6 py-4 font-semibold text-gray-600">ID Orden</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Cliente</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Total</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Estado</th>
                            <th className="px-6 py-4 font-semibold text-gray-600 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-mono text-sm text-gray-500 uppercase">
                                    #{order.id.slice(-8)}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium">{order.user?.name || 'Cliente Invitado'}</div>
                                    <div className="text-xs text-gray-400">{order.user?.email}</div>
                                </td>
                                <td className="px-6 py-4 font-bold">
                                    ${order.total.toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    {getStatusBadge(order.status)}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                        <Eye className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {orders.length === 0 && (
                    <div className="py-20 text-center text-gray-400">
                        No hay pedidos registrados
                    </div>
                )}
            </div>
        </div>
    );
}
