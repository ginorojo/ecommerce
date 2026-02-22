interface FooterProps {
    contact: {
        phone?: string | null;
        email?: string | null;
        address?: string | null;
    };
    primaryColor: string;
}

export default function Footer({ contact, primaryColor }: FooterProps) {
    return (
        <footer className="bg-gray-900 text-white py-20 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                <div>
                    <h3 className="text-2xl font-bold mb-6" style={{ color: primaryColor }}>E-STORE</h3>
                    <p className="text-gray-400">
                        Tu tienda de confianza con la mejor selección de productos y atención personalizada.
                    </p>
                </div>

                <div>
                    <h4 className="text-lg font-semibold mb-6">Contacto</h4>
                    <ul className="space-y-4 text-gray-400">
                        {contact.phone && <li>Tel: {contact.phone}</li>}
                        {contact.email && <li>Email: {contact.email}</li>}
                        {contact.address && <li>Dir: {contact.address}</li>}
                    </ul>
                </div>

                <div>
                    <h4 className="text-lg font-semibold mb-6">Suscripción</h4>
                    <div className="flex gap-2">
                        <input
                            type="email"
                            placeholder="Tu email"
                            className="bg-gray-800 border-none rounded-lg px-4 py-2 flex-1 focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            className="px-6 py-2 rounded-lg font-bold"
                            style={{ backgroundColor: primaryColor }}
                        >
                            Unirse
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-20 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
                © 2024 E-Store CMS Template. Todos los derechos reservados.
            </div>
        </footer>
    );
}
