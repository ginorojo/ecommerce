import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteSettings } from "@/lib/settings";
import MainLayoutWrapper from "@/components/MainLayoutWrapper";

export default async function AccountPage() {
    const session = await auth();

    if (!session) {
        redirect("/");
    }

    const settings = await getSiteSettings();
    const categories = await prisma.category.findMany();
    const orders = await prisma.order.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
    });

    return (
        <MainLayoutWrapper settings={settings} categories={categories}>
            <div className="max-w-4xl mx-auto px-4 py-20">
                <h1 className="text-3xl font-bold mb-8">Mi Cuenta</h1>

                <div className="bg-white rounded-2xl border shadow-sm p-6 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-xl font-bold text-gray-400">
                            {session.user.name?.[0] || 'U'}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{session.user.name}</h2>
                            <p className="text-gray-500">{session.user.email}</p>
                        </div>
                    </div>
                </div>

                <h3 className="text-xl font-bold mb-6">Mis Pedidos</h3>
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white p-6 rounded-xl border flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400 font-mono">#{order.id.slice(-8).toUpperCase()}</p>
                                <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-lg">${order.total.toLocaleString()}</p>
                                <span className={`text-xs px-2 py-1 rounded-full font-bold ${order.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {order.status === 'PAID' ? 'PAGADO' : 'PENDIENTE'}
                                </span>
                            </div>
                        </div>
                    ))}
                    {orders.length === 0 && (
                        <div className="text-center py-10 text-gray-400">
                            No tienes pedidos aún.
                        </div>
                    )}
                </div>
            </div>

            <Footer
                contact={{
                    phone: settings.contactPhone,
                    email: settings.contactEmail,
                    address: settings.contactAddress
                }}
                primaryColor={settings.primaryColor}
            />
        </MainLayoutWrapper>
    );
}
