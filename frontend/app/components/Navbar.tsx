"use client";

import { Code, Menu, ArrowRight } from "lucide-react";
import Link from "next/link";

interface NavbarProps {
    onOpenAuth: () => void;
}

export default function Navbar({ onOpenAuth }: NavbarProps) {
    return (
        <div className="w-full fixed top-4 left-0 right-0 z-40 flex justify-center items-center px-2 pointer-events-none">
            <div className="pointer-events-auto w-full max-w-[1400px] relative flex justify-center items-center">
                {/* Logo - Left */}
                <Link
                    className="max-md:hidden absolute left-5 lg:left-15 h-12 md:h-14 pl-3 md:pl-4 flex items-center gap-2 font-bold text-xl tracking-tight text-zinc-900"
                    href="/"
                >
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                        <Code className="w-6 h-6 text-white" />
                    </div>
                    <span>
                        CodeChef<span className="text-blue-600">Sol</span>
                    </span>
                </Link>

                {/* Centered Menu */}
                <div className="relative flex flex-col bg-white text-black w-full md:w-fit rounded-[24px] md:rounded-full shadow-md border border-zinc-100 pointer-events-auto">
                    <div className="flex items-center justify-between md:justify-center font-medium md:py-1 px-1 md:px-2">
                        {/* Mobile Logo */}
                        <Link
                            className="md:hidden h-12 pl-3 flex items-center gap-2 font-bold text-lg tracking-tight text-zinc-900"
                            href="/"
                        >
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Code className="w-5 h-5 text-white" />
                            </div>
                            <span>CodeChefSol</span>
                        </Link>

                        {/* Desktop Links */}
                        <div className="hidden md:flex items-center gap-2 font-normal text-black tracking-tight">
                            {[
                                { label: "Solutions", href: "#solutions" },
                                { label: "Pricing", href: "#pricing" },
                                { label: "Community", href: "#community" },
                                { label: "FAQs", href: "#faq" },
                            ].map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="opacity-90 hover:opacity-100 duration-300 transition-all hover:will-change-transform hover:bg-black/5 rounded-full py-3 px-5"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 focus:outline-none shrink-0 mr-1"
                            aria-label="Open menu"
                        >
                            <Menu className="w-5 h-5 text-gray-900" />
                        </button>

                        {/* Desktop CTA (Inside Pill) */}
                        <div className="hidden pl-3">
                            <button
                                onClick={onOpenAuth}
                                className="inline-flex items-center gap-2 space-x-2 pr-2 py-2 pl-6 font-medium bg-[#151619] text-white rounded-full shadow tracking-tight hover:bg-[#2a2c32] text-sm transition button-shadow whitespace-nowrap"
                            >
                                Get Started
                                <div className="border border-[#545557] bg-[#333437] w-8 h-8 rounded-full flex items-center justify-center">
                                    <ArrowRight className="w-4 h-4 -rotate-45 text-white" />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right CTA (Outside Pill - Desktop Only) */}
                <div className="max-md:hidden absolute right-5 lg:right-15 pl-3 pointer-events-auto">
                    <button
                        onClick={onOpenAuth}
                        className="inline-flex items-center gap-2 space-x-2 pr-2 py-2 pl-6 font-medium bg-[#151619] text-white rounded-full shadow tracking-tight hover:bg-[#2a2c32] text-sm transition button-shadow whitespace-nowrap"
                    >
                        Login
                        <div className="border border-[#545557] bg-[#333437] w-8 h-8 rounded-full flex items-center justify-center">
                            <ArrowRight className="w-4 h-4 -rotate-45 text-white" />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
