"use client";

import { Code, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="text-[#50576b] pb-12 px-4 sm:px-8 bg-[#f5f5f5] pt-20">
            <div className="flex flex-col items-center justify-center max-w-6xl mx-auto w-full">
                {/* Background Logo Effect (Simulated with CSS/SVG since we don't have the image) */}
                <div
                    className="translate-y-[45%] -mt-[22%] w-full h-full opacity-5 pointer-events-none absolute bottom-0 left-0 overflow-hidden"
                    style={{
                        mask: "linear-gradient(0deg, rgba(0, 0, 0, 0) 18%, #f5f5f5 129%)",
                    }}
                >
                    <Code className="w-[800px] h-[800px] text-black absolute -bottom-40 left-1/2 -translate-x-1/2" />
                </div>

                <div className="w-full grid grid-cols-1 lg:grid-cols-3 md:grid-cols-1 gap-y-10 bg-[#f5f5f5] relative z-10">
                    <div className="flex flex-col items-start -mt-3">
                        <Link
                            href="/"
                            className="flex items-center gap-2 font-bold text-xl tracking-tight text-zinc-900 mb-4"
                        >
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Code className="w-5 h-5 text-white" />
                            </div>
                            <span>
                                CodeChef<span className="text-blue-600">Sol</span>
                            </span>
                        </Link>
                        <p className="font-normal text-[#50576b] leading-snug text-[15px] mt-1 md:max-w-64">
                            Premium solutions, optimized algorithms, and a community of
                            passionate coders.
                        </p>
                    </div>

                    <div className="grid grid-cols-[1fr_2fr] gap-x-2 items-start">
                        <div>
                            <h4 className="text-black mb-4 font-medium">Company</h4>
                            <div className="flex flex-col gap-y-2">
                                {[
                                    "Solutions",
                                    "Pricing",
                                    "Community",
                                    "FAQs",
                                    "About",
                                    "Contact",
                                ].map((item) => (
                                    <Link
                                        key={item}
                                        href="#"
                                        className="transition-colors text-[#50576b] hover:text-black hover:underline underline-offset-4"
                                    >
                                        {item}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="justify-self-center">
                            <h4 className="text-black font-medium mb-4">Socials</h4>
                            <div className="flex flex-col gap-y-3">
                                {["Email", "Instagram", "LinkedIn", "GitHub"].map((item) => (
                                    <Link
                                        key={item}
                                        href="#"
                                        className="flex items-center gap-1 transition-colors font-normal text-[#50576b] hover:text-black hover:underline underline-offset-4"
                                    >
                                        {item}
                                        <span className="ml-1 text-xs">
                                            <ArrowRight className="w-3 h-3 -rotate-45" />
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <h4 className="text-black mb-4 font-medium">Newsletter</h4>
                        <p className="font-normal text-[15px] text-[#50576b] leading-snug mb-4 max-w-xs">
                            Stay ahead with the latest algorithms and coding tips.
                        </p>
                        <form className="flex items-center gap-2 bg-white rounded-full border border-gray-200 pl-3 pr-1.5 py-1.5 w-full max-w-md shadow-sm focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                            <span className="text-[#b0b0b0]">@</span>
                            <input
                                type="email"
                                placeholder="Enter your email..."
                                className="flex-1 outline-none bg-transparent text-base font-normal text-[#50576b] placeholder:text-gray-400"
                            />
                            <button
                                type="submit"
                                aria-label="Submit form"
                                className="bg-[#0067F4] hover:bg-[#0047A8] cursor-pointer transition-colors text-white rounded-full w-16 h-10 flex items-center justify-center"
                            >
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>

                <div className="md:mt-10 max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center lg:items-start justify-between gap-4 border-t border-gray-200 pt-6 text-base text-[#50576b] relative z-10">
                    <p className="flex-1 text-[#50576b] text-center md:text-left">
                        © {new Date().getFullYear()} CodeChef Solutions. All rights
                        reserved.
                    </p>
                    <div className="flex-1 flex justify-center md:justify-end gap-8">
                        <Link
                            href="#"
                            className="hover:underline hover:text-black underline-offset-4 transition-colors font-normal text-[#50576b]"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="#"
                            className="hover:underline hover:text-black underline-offset-4 transition-colors font-normal text-[#50576b]"
                        >
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
