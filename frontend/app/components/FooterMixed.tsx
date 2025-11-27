"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Github, Twitter, Instagram, Mail, CheckCircle, ShieldCheck, Lock } from "lucide-react";
import Link from "next/link";

const MarqueeItem = ({ text }: { text: string }) => (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-dashed border-zinc-700 bg-zinc-800/50 whitespace-nowrap">
        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
        <span className="text-sm font-medium text-zinc-300">{text}</span>
    </div>
);

const topics = [
    "Dynamic Programming", "Graph Theory", "Greedy Algorithms", "Segment Trees",
    "Number Theory", "Bit Manipulation", "String Algorithms", "Game Theory",
    "Sorting & Searching", "Recursion", "Backtracking", "System Design"
];

export default function FooterMixed() {
    return (
        <div className="flex flex-col w-full">

            {/* 1. CTA Section (CodeDale Style - Dark Card with Cluely Gradient Text) */}
            <section className="relative w-full px-4 sm:px-6 py-12 lg:p-12 bg-zinc-50 overflow-hidden">
                {/* Background Pattern */}
                <div
                    className="absolute inset-0 w-full h-full opacity-30 [mask-image:radial-gradient(circle,black_30%,transparent_100%)] [mask-repeat:no-repeat] [mask-position:center] [mask-size:cover] pointer-events-none"
                    style={{
                        backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
                        backgroundSize: "32px 32px",
                    }}
                ></div>
                <div className="w-full max-w-7xl mx-auto bg-[#161616] text-white rounded-[36px] p-8 sm:p-12 lg:p-16 flex flex-col items-center text-center overflow-hidden relative">

                    {/* Background Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-3xl bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>

                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 relative z-10">
                        Master Coding Like a Pro.
                    </h3>

                    <p className="text-xl md:text-2xl font-medium mb-8 relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-indigo-200 to-blue-200">
                        Start your journey with CodeChef Solutions today.
                    </p>

                    <Link href="/auth?action=signup" className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
                        <div className="relative flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-semibold text-lg transition-transform transform group-hover:scale-105">
                            <Sparkles className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                            <span>Get Started Free</span>
                        </div>
                    </Link>

                    {/* Marquee Integrated into CTA Bottom */}
                    <div className="mt-16 w-full overflow-hidden border-t border-zinc-800 pt-8 opacity-80">
                        <div className="flex relative w-full">
                            <motion.div
                                className="flex gap-4 px-4"
                                animate={{ x: ["0%", "-50%"] }}
                                transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
                            >
                                {[...topics, ...topics, ...topics].map((topic, i) => (
                                    <MarqueeItem key={i} text={topic} />
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Main Footer (Cluely Style - Clean & Structured) */}
            <footer className="bg-white pt-16 pb-8 px-6 border-t border-zinc-100">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">

                    {/* Brand Column */}
                    <div className="lg:col-span-1 flex flex-col gap-4">
                        <div className="flex items-center gap-2 font-bold text-xl text-zinc-900">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                                <span className="font-mono">&lt;/&gt;</span>
                            </div>
                            CodeChef Solutions
                        </div>
                        <p className="text-zinc-500 leading-relaxed">
                            Strategic coding practice tailored to drive results and conversions in your career.
                        </p>
                        <div className="flex gap-3 mt-2">
                            <a href="#" className="p-2 bg-zinc-100 rounded-full text-zinc-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="p-2 bg-zinc-100 rounded-full text-zinc-600 hover:bg-zinc-200 hover:text-black transition-colors">
                                <Github className="w-4 h-4" />
                            </a>
                            <a href="#" className="p-2 bg-zinc-100 rounded-full text-zinc-600 hover:bg-pink-50 hover:text-pink-600 transition-colors">
                                <Instagram className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-8">
                        <div>
                            <h4 className="font-semibold text-zinc-900 mb-4">Company</h4>
                            <ul className="flex flex-col gap-2 text-sm text-zinc-500">
                                <li><Link href="#" className="hover:text-blue-600 transition-colors">About Us</Link></li>
                                <li><Link href="#" className="hover:text-blue-600 transition-colors">Careers</Link></li>
                                <li><Link href="#" className="hover:text-blue-600 transition-colors">Blog</Link></li>
                                <li><Link href="#" className="hover:text-blue-600 transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-zinc-900 mb-4">Resources</h4>
                            <ul className="flex flex-col gap-2 text-sm text-zinc-500">
                                <li><Link href="#" className="hover:text-blue-600 transition-colors">Problems</Link></li>
                                <li><Link href="#" className="hover:text-blue-600 transition-colors">Editorials</Link></li>
                                <li><Link href="#" className="hover:text-blue-600 transition-colors">Cheat Sheets</Link></li>
                                <li><Link href="#" className="hover:text-blue-600 transition-colors">Roadmap</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-zinc-900 mb-4">Legal</h4>
                            <ul className="flex flex-col gap-2 text-sm text-zinc-500">
                                <li><Link href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
                                <li><Link href="#" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li>
                                <li><Link href="#" className="hover:text-blue-600 transition-colors">Cookie Policy</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Newsletter Column */}
                    <div className="lg:col-span-1 flex flex-col gap-4">
                        <h4 className="font-semibold text-zinc-900">Newsletter</h4>
                        <p className="text-sm text-zinc-500">Stay ahead with coding tips and strategies that drive results.</p>
                        <form className="flex items-center gap-2 bg-white border border-zinc-200 rounded-full p-1 pl-4 focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-sm">
                            <span className="text-zinc-400">@</span>
                            <input
                                type="email"
                                placeholder="Enter your email..."
                                className="bg-transparent border-none outline-none text-sm w-full text-zinc-700 placeholder:text-zinc-400"
                            />
                            <button className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>

                        {/* Trust Badges */}
                        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-zinc-100">
                            <div className="flex items-center gap-1 opacity-60 grayscale hover:grayscale-0 transition-all">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/SOC_2_Logo.jpg/640px-SOC_2_Logo.jpg" alt="SOC2" className="h-8 object-contain mix-blend-multiply" />
                            </div>
                            <div className="flex items-center gap-1 opacity-60 grayscale hover:grayscale-0 transition-all">
                                <ShieldCheck className="w-6 h-6 text-zinc-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="max-w-7xl mx-auto pt-8 border-t border-zinc-100 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-zinc-400">© 2025 CodeChef Solutions. All rights reserved.</p>
                    <div className="flex items-center gap-8 text-sm text-zinc-500">
                        <Link href="#" className="hover:text-zinc-900 transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-zinc-900 transition-colors">Terms of Service</Link>
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-100 text-xs font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            All systems operational
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
