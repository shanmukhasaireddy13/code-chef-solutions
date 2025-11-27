"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            question: "Who’s behind CodeChef Solutions?",
            answer:
                "CodeChef Solutions is powered by a passionate team of competitive programmers and developers who care about your learning journey.",
        },
        {
            question: "Are the solutions free?",
            answer:
                "Yes! We believe in accessible education. Most of our standard solutions are completely free to access.",
        },
        {
            question: "Do you support languages other than C++?",
            answer:
                "Absolutely. We provide solutions in C++, Java, Python, and often JavaScript to cater to all developers.",
        },
        {
            question: "How often are new problems added?",
            answer:
                "We update our database daily, especially after every major CodeChef contest.",
        },
        {
            question: "Can I contribute a solution?",
            answer:
                "Yes! We have a community contribution program where you can submit your optimized solutions for review.",
        },
    ];

    return (
        <div id="faq" className="">
            <section className="relative w-full h-full bg-zinc-50 scroll-mt-10 px-5 py-20 overflow-hidden">
                {/* Background Pattern */}
                <div
                    className="absolute inset-0 w-full h-full opacity-30 [mask-image:radial-gradient(circle,black_30%,transparent_100%)] [mask-repeat:no-repeat] [mask-position:center] [mask-size:cover] pointer-events-none"
                    style={{
                        backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
                        backgroundSize: "32px 32px",
                    }}
                ></div>

                <div className="relative z-10 max-w-[1100px] mx-auto w-full h-full flex flex-col items-center justify-center">
                    <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center text-center py-16 gap-2.5">
                        <h2 className="text-[32px] sm:text-4xl tracking-tight font-bold leading-[1.2] text-zinc-900">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-base whitespace-pre-wrap leading-[1.2] text-zinc-500">
                            We Get It—Curiosity Leads to Success! Got questions? That’s a
                            great sign. Here are some answers.
                        </p>
                    </div>

                    <div className="w-full max-w-[800px] mx-auto flex flex-col gap-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="w-full flex flex-col gap-2">
                                <div
                                    className="self-end flex items-center gap-2 cursor-pointer w-full justify-end"
                                    onClick={() =>
                                        setOpenIndex(openIndex === index ? null : index)
                                    }
                                >
                                    <button
                                        className={`w-10 h-10 flex items-center justify-center shrink-0 rounded-full cursor-pointer hover:scale-105 hover:-rotate-12 transition-transform duration-300 origin-center ${openIndex === index
                                            ? "bg-[#151619] text-white shadow-lg"
                                            : "border border-zinc-200 text-zinc-700 bg-white hover:bg-zinc-50"
                                            }`}
                                        type="button"
                                        aria-label="expand-or-collapse-faq-button"
                                    >
                                        {openIndex === index ? (
                                            <Minus className="w-5 h-5" />
                                        ) : (
                                            <Plus className="w-5 h-5" />
                                        )}
                                    </button>
                                    <p
                                        className={`w-fit p-4 rounded-l-3xl rounded-tr-3xl transition-all duration-300 font-medium border ${openIndex === index
                                            ? "bg-[#151619] text-white border-[#151619] shadow-lg"
                                            : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300"
                                            }`}
                                    >
                                        {faq.question}
                                    </p>
                                </div>

                                <AnimatePresence>
                                    {openIndex === index && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0, y: -10 }}
                                            animate={{ opacity: 1, height: "auto", y: 0 }}
                                            exit={{ opacity: 0, height: 0, y: -10 }}
                                            className="max-w-[600px] mr-auto w-full flex items-end gap-2 origin-top-left z-10 overflow-hidden"
                                        >
                                            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0 border-2 border-white shadow-sm">
                                                <span className="text-xs font-bold text-blue-600">
                                                    CS
                                                </span>
                                            </div>
                                            <p className="w-fit p-5 rounded-e-3xl rounded-tl-2xl text-zinc-600 bg-white text-[15px] shadow-lg border border-zinc-100 leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
