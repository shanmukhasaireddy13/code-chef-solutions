"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileCode, BookOpen, Check, Code2, Terminal, Cpu } from "lucide-react";

// Mock UI Components for the visuals
const VisualStep1 = () => (
    <div className="w-full h-full bg-white rounded-2xl border border-zinc-200 shadow-lg overflow-hidden flex flex-col">
        <div className="h-8 bg-zinc-50 border-b border-zinc-100 flex items-center px-3 gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
            <div className="ml-2 text-[10px] text-zinc-400 font-mono">problems.tsx</div>
        </div>
        <div className="p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3 bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                <Search className="w-5 h-5 text-zinc-400" />
                <div className="h-2 bg-zinc-200 rounded w-24"></div>
            </div>
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 hover:border-blue-200 hover:bg-blue-50 transition-colors group">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-zinc-100 group-hover:bg-blue-100 flex items-center justify-center">
                                <Code2 className="w-4 h-4 text-zinc-400 group-hover:text-blue-500" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="h-2 bg-zinc-200 rounded w-32 group-hover:bg-blue-200"></div>
                                <div className="h-1.5 bg-zinc-100 rounded w-20"></div>
                            </div>
                        </div>
                        <div className="px-2 py-1 rounded text-[10px] bg-zinc-100 text-zinc-500 group-hover:bg-blue-100 group-hover:text-blue-600">
                            Easy
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const VisualStep2 = () => (
    <div className="w-full h-full bg-white rounded-2xl border border-zinc-200 shadow-lg overflow-hidden flex flex-col relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
        <div className="p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-zinc-800">Select Approach</h3>
                <span className="text-xs text-zinc-400">2 found</span>
            </div>
            <div className="space-y-4">
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 relative overflow-hidden">
                    <div className="flex items-start gap-3">
                        <div className="mt-1">
                            <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center">
                                <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-medium text-blue-900 text-sm">Optimal Solution</h4>
                            <p className="text-xs text-blue-700 mt-1">Time: O(n) | Space: O(1)</p>
                        </div>
                    </div>
                </div>
                <div className="p-4 rounded-xl border border-zinc-200 bg-white opacity-60">
                    <div className="flex items-start gap-3">
                        <div className="mt-1">
                            <div className="w-5 h-5 rounded-full border-2 border-zinc-300"></div>
                        </div>
                        <div>
                            <h4 className="font-medium text-zinc-700 text-sm">Brute Force</h4>
                            <p className="text-xs text-zinc-500 mt-1">Time: O(n^2) | Space: O(1)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const VisualStep3 = () => (
    <div className="w-full h-full bg-[#1e1e1e] rounded-2xl border border-zinc-800 shadow-lg overflow-hidden flex flex-col">
        <div className="h-8 bg-[#252526] flex items-center px-3 justify-between">
            <span className="text-[10px] text-zinc-400 font-mono">explanation.md</span>
            <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-zinc-600"></div>
                <div className="w-2 h-2 rounded-full bg-zinc-600"></div>
            </div>
        </div>
        <div className="p-6 font-mono text-xs text-zinc-300 leading-relaxed">
            <div className="flex gap-2 mb-4">
                <span className="text-blue-400">#</span>
                <span>Intuition</span>
            </div>
            <p className="text-zinc-500 mb-4">
                We can use a two-pointer approach to solve this efficiently...
            </p>
            <div className="pl-3 border-l-2 border-zinc-700 my-4">
                <span className="text-purple-400">const</span> <span className="text-yellow-400">solve</span> = <span className="text-blue-400">()</span> <span className="text-blue-400">=&gt;</span> {"{"}
                <br />
                &nbsp;&nbsp;<span className="text-green-400">// Core logic here</span>
                <br />
                {"}"}
            </div>
            <div className="mt-4 flex items-center gap-2 text-green-400 bg-green-400/10 w-fit px-2 py-1 rounded">
                <Check className="w-3 h-3" />
                <span>Concept Mastered</span>
            </div>
        </div>
    </div>
);

const steps = [
    {
        id: 1,
        title: "Search for a Problem",
        description: "Browse our extensive database of CodeChef problems. Filter by difficulty, topic, or tags to find exactly what you need to practice.",
        visual: VisualStep1,
    },
    {
        id: 2,
        title: "Select a Solution",
        description: "Choose from multiple solution approaches. Compare Brute Force vs. Optimal solutions to understand the trade-offs in Time and Space complexity.",
        visual: VisualStep2,
    },
    {
        id: 3,
        title: "Master the Concept",
        description: "Deep dive into the logic with line-by-line explanations. Don't just copy code—understand the underlying algorithms and patterns.",
        visual: VisualStep3,
    },
];

export default function StepsMixed() {
    const [activeStep, setActiveStep] = useState(1);

    return (
        <section className="relative py-24 bg-zinc-50 overflow-hidden">
            {/* Background Pattern */}
            <div
                className="absolute inset-0 w-full h-full opacity-30 [mask-image:radial-gradient(circle,black_30%,transparent_100%)] [mask-repeat:no-repeat] [mask-position:center] [mask-size:cover] pointer-events-none"
                style={{
                    backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                }}
            ></div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
                <div className="flex flex-col items-center justify-center text-center mb-16 gap-4">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900">
                        How to Get Started
                    </h2>
                    <p className="text-lg text-zinc-500 max-w-2xl">
                        Stop struggling with obscure editorials. Master competitive programming with a structured approach.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                    {/* Left Side: Visuals (Desktop) */}
                    <div className="relative hidden lg:block w-full aspect-[4/3] perspective-midrange">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeStep}
                                initial={{ opacity: 0, y: 20, rotateX: -5, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, rotateX: 5, scale: 0.95 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="absolute inset-0 w-full h-full"
                            >
                                {(() => {
                                    const Visual = steps.find((s) => s.id === activeStep)?.visual;
                                    return Visual ? <Visual /> : null;
                                })()}
                            </motion.div>
                        </AnimatePresence>

                        {/* Decorative Elements behind */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-3xl -z-10 blur-2xl opacity-50"></div>
                    </div>

                    {/* Right Side: Steps List */}
                    <div className="flex flex-col gap-6">
                        {steps.map((step) => (
                            <div
                                key={step.id}
                                onMouseEnter={() => setActiveStep(step.id)}
                                className={`
                  relative p-6 rounded-3xl transition-all duration-300 cursor-pointer border
                  ${activeStep === step.id
                                        ? "bg-white border-zinc-200 shadow-xl scale-100"
                                        : "bg-transparent border-transparent hover:bg-white/50 scale-95 opacity-70 hover:opacity-100"
                                    }
                `}
                            >
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-4">
                                        <span
                                            className={`
                        flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold transition-colors
                        ${activeStep === step.id
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-zinc-200 text-zinc-500"
                                                }
                      `}
                                        >
                                            {step.id}
                                        </span>
                                        <h3 className={`text-xl font-bold ${activeStep === step.id ? "text-zinc-900" : "text-zinc-700"}`}>
                                            {step.title}
                                        </h3>
                                    </div>

                                    <p className="text-zinc-600 leading-relaxed pl-14">
                                        {step.description}
                                    </p>

                                    {/* Mobile Visual (Inline) */}
                                    <div className="lg:hidden mt-4 w-full aspect-video">
                                        <step.visual />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
