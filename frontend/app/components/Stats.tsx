"use client";

import { motion } from "framer-motion";
import { Code, Users, CheckCircle } from "lucide-react";

export default function Stats() {
    const stats = [
        { label: "Solutions", value: "500+", icon: Code },
        { label: "Active Users", value: "10k+", icon: Users },
        { label: "Accuracy", value: "100%", icon: CheckCircle },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-5xl mx-auto px-6"
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 rounded-3xl bg-white/50 backdrop-blur-sm border border-zinc-100 shadow-xl shadow-zinc-200/50">
                {stats.map((stat, index) => (
                    <div key={index} className="text-center p-4 group">
                        <div className="w-14 h-14 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-blue-600 transition-transform group-hover:scale-110 group-hover:rotate-3">
                            <stat.icon className="w-7 h-7" />
                        </div>
                        <p className="text-4xl font-bold text-zinc-900 mb-1 tracking-tight">
                            {stat.value}
                        </p>
                        <p className="text-zinc-500 font-medium">{stat.label}</p>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
