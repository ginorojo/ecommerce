"use client";

import { motion } from "framer-motion";

interface HeroProps {
    title: string;
    subtitle: string;
    image: string;
    primaryColor: string;
}

export default function Hero({ title, subtitle, image, primaryColor }: HeroProps) {
    return (
        <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
                style={{ backgroundImage: `url(${image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8'})` }}
            >
                <div className="absolute inset-0 bg-black/40" />
            </div>

            <div className="relative z-10 text-center text-white px-4">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-7xl font-bold mb-6"
                >
                    {title}
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl md:text-2xl mb-8 opacity-90"
                >
                    {subtitle}
                </motion.p>
                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="px-8 py-4 rounded-full text-lg font-semibold transition-transform hover:scale-105"
                    style={{ backgroundColor: primaryColor }}
                >
                    Ver Productos
                </motion.button>
            </div>
        </section>
    );
}
