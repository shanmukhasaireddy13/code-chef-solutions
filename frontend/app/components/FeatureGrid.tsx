"use client";

import { motion } from "framer-motion";
import { Zap, CheckCircle, Globe, Shield, Star, Layout } from "lucide-react";

export default function FeatureGrid() {
    const features = [
        {
            title: "Optimized Code",
            description:
                "Solutions written with time and space complexity in mind. Never get TLE again.",
            icon: Zap,
            className: "md:col-span-2",
        },
        {
            title: "Verified Correct",
            description:
                "Every solution is tested against the official test cases to ensure 100% accuracy.",
            icon: CheckCircle,
            className: "md:col-span-1",
        },
        {
            title: "Multi-Language",
            description:
                "Implementations available in C++, Java, Python, and JavaScript for every problem.",
            icon: Globe,
            className: "md:col-span-1",
        },
        {
            title: "Premium Support",
            description: "Get priority help with your doubts and code debugging.",
            icon: Shield,
            className: "md:col-span-2",
        },
    ];

    return (
        <section className="py-32 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 mb-6 tracking-tight">
                        Why Choose Us?
                    </h2>
                    <p className="text-xl text-zinc-500 max-w-2xl mx-auto">
                        We provide more than just code. We provide understanding.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className={`p-8 rounded-3xl bg-white border border-zinc-100 shadow-lg shadow-zinc-200/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all group ${feature.className}`}
                        >
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all bg-blue-50 text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
                                <feature.icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-zinc-900">
                                {feature.title}
                            </h3>
                            <p className="text-zinc-500 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
