"use client";

import { motion } from "framer-motion";
import { Code, Search, Rocket } from "lucide-react";

export default function Steps() {
    const steps = [
        {
            id: 1,
            title: "Search Your Problem",
            description:
                "Find the CodeChef problem you are stuck on using our powerful search.",
            icon: Search,
        },
        {
            id: 2,
            title: "View the Solution",
            description:
                "Access detailed explanations and optimized code in C++, Java, and Python.",
            icon: Code,
        },
        {
            id: 3,
            title: "Master the Concept",
            description:
                "Understand the logic, time complexity, and edge cases to ace your next contest.",
            icon: Rocket,
        },
    ];

    return (
        <div id="steps" className="">
            <section className="w-full h-full px-5">
                <div className="max-w-[1100px] mx-auto w-full h-full flex flex-col items-center justify-center px-4">
                    <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center text-center py-16 gap-2.5">
                        <h2 className="text-[32px] sm:text-4xl tracking-tight font-semibold leading-[1.2]">
                            How to Get Started with CodeChefSol
                        </h2>
                        <p className="text-base whitespace-pre-wrap leading-[1.2] text-zinc-500">
                            Stop struggling with TLEs. Follow these simple steps to improve your
                            rating.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 w-full justify-center items-center gap-10 sm:px-6 py-10 overflow-hidden">
                        {/* Image/Visual Side (Placeholder for now, using abstract shapes/icons) */}
                        <div className="relative hidden md:flex w-full h-[400px] bg-zinc-50 rounded-3xl items-center justify-center overflow-hidden border border-zinc-100">
                            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
                            <div className="relative z-10 p-8 bg-white rounded-2xl shadow-xl border border-zinc-100 max-w-xs rotate-3">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-2 w-3/4 bg-zinc-100 rounded"></div>
                                    <div className="h-2 w-1/2 bg-zinc-100 rounded"></div>
                                    <div className="h-2 w-full bg-zinc-100 rounded"></div>
                                    <div className="h-2 w-5/6 bg-zinc-100 rounded"></div>
                                </div>
                                <div className="mt-6 flex justify-end">
                                    <div className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full">
                                        Accepted
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Steps List */}
                        <div className="flex flex-col w-full items-center justify-center gap-5">
                            {steps.map((step, index) => (
                                <div
                                    key={step.id}
                                    className="flex flex-col items-start gap-5 w-full p-6 bg-white hover:bg-zinc-50 border border-zinc-100 transition-all duration-300 ease-in-out hover:scale-[1.02] rounded-3xl cursor-pointer shadow-sm hover:shadow-md"
                                >
                                    <div className="flex items-center gap-4 w-full">
                                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                            <step.icon className="w-6 h-6" />
                                        </div>
                                        <div className="text-2xl font-medium">Step {step.id}</div>
                                    </div>
                                    <div className="flex flex-col items-start gap-1 pl-16">
                                        <h6 className="text-xl font-medium">{step.title}</h6>
                                        <p className="text-zinc-500 leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
