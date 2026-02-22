import { prisma } from "@/lib/prisma";
import { ShoppingBag, Users, CreditCard, TrendingUp } from "lucide-react";

export default async function AdminDashboard() {
    const [productCount, orderCount, totalSales, categoryCount] = await Promise.all([
        prisma.product.count(),
        prisma.order.count(),
        prisma.order.aggregate({
            _sum: { total: true },
            where: { status: "PAID" }
        }),
        prisma.category.count(),
    ]);

    const stats = [
        { label: "Productos", value: productCount, icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-100" },
        { label: "Pedidos", value: orderCount, icon: CreditCard, color: "text-green-600", bg: "bg-green-100" },
        { label: "Ventas Totales", value: `$${(totalSales._sum.total || 0).toLocaleString()}`, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-100" },
        { label: "Categorías", value: categoryCount, icon: Users, color: "text-orange-600", bg: "bg-orange-100" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard de Administración</h1>
                <p className="text-gray-500 mt-2">Bienvenido de nuevo. Aquí tienes un resumen de tu tienda.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold mb-4">Estado de la Tienda</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Límite de Productos</span>
                            <span className="font-medium">{productCount} / 24</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-600 rounded-full transition-all"
                                style={{ width: `${(productCount / 24) * 100}%` }}
                            />
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Límite de Categorías</span>
                            <span className="font-medium">{categoryCount} / 5</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-orange-600 rounded-full transition-all"
                                style={{ width: `${(categoryCount / 5) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold mb-4">Acciones Rápidas</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <a href="/admin/products" className="p-4 border rounded-xl hover:bg-gray-50 transition-colors text-center text-sm font-medium">Ver Productos</a>
                        <a href="/admin/settings" className="p-4 border rounded-xl hover:bg-gray-50 transition-colors text-center text-sm font-medium">Configurar Tema</a>
                        <a href="/admin/images" className="p-4 border rounded-xl hover:bg-gray-50 transition-colors text-center text-sm font-medium">Subir Imágenes</a>
                        <a href="/admin/orders" className="p-4 border rounded-xl hover:bg-gray-50 transition-colors text-center text-sm font-medium">Gestionar Pedidos</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
