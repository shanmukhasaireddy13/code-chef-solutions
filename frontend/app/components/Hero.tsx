"use client";

import { Code, Terminal, Cpu, Star, CheckCircle, ArrowRight } from "lucide-react";

interface HeroProps {
    onOpenAuth: () => void;
}

export default function Hero({ onOpenAuth }: HeroProps) {
    return (
        <div id="home" className="relative w-full flex flex-col items-center justify-center pb-10 overflow-hidden px-5 pt-32">
            {/* Background Pattern */}
            <div
                className="absolute inset-0 w-full h-full opacity-20 [mask-image:radial-gradient(circle,black_30%,transparent_100%)] [mask-repeat:no-repeat] [mask-position:center] [mask-size:cover] pointer-events-none"
                style={{
                    backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                }}
            ></div>

            {/* Notification Pill */}
            <div className="flex items-center justify-center z-10 mb-8">
                <button
                    onClick={onOpenAuth}
                    className="flex items-center justify-center gap-3 bg-[#ffffff] rounded-full pr-1 pl-3 py-1 text-xs md:text-sm tracking-tighter text-gray-700 font-medium border border-zinc-100 shadow-sm hover:shadow-md transition-all"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    New Solutions Added Daily!
                    <div className="bg-[#f6f7f9] w-7.5 h-7.5 rounded-full flex items-center justify-center p-1">
                        <ArrowRight className="w-4 h-4 text-gray-600" />
                    </div>
                </button>
            </div>

            <div className="relative w-full flex gap-[5.1%] justify-center items-center px-4 max-w-[1400px] mx-auto">
                {/* Left Card */}
                <div className="xl:block hidden">
                    <div className="flex items-center justify-end">
                        <div className="relative w-[230px]">
                            <div className="absolute inset-0 bg-white rounded-2xl -rotate-[6deg] border border-black/5 -z-10 shadow-sm"></div>
                            <div className="relative bg-white rounded-2xl text-xs card-shadow p-5 w-full rotate-[-14deg] shadow-xl border border-zinc-100">
                                <div className="flex items-start justify-between gap-3">
                                    <p className="text-gray-500 text-[13px] font-medium tracking-tight mb-3 leading-[1.2]">
                                        "CodeChef Solutions turned the impossible into possible and redefined our expectations of learning."
                                    </p>
                                    <div className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                        <Star className="w-3 h-3 fill-current" />
                                    </div>
                                </div>
                                <span className="block font-semibold text-gray-900">
                                    - Alex R., Competitive Coder
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center Content */}
                <div className="flex flex-col items-center justify-center h-full mt-8 space-y-6 z-10">
                    <h1 className="hidden md:block text-[50px] font-bold text-center max-w-4xl text-gray-900 tracking-tight xl:tracking-tighter xl:leading-[70px]">
                        <div className="flex items-center justify-center gap-1 whitespace-nowrap">
                            World-class Coding
                            <span className="ml-2 logo-shadow bg-white rounded-lg w-10 h-10 rotate-12 translate-x-1.5 translate-y-1 flex items-center justify-center border border-zinc-100 shadow-sm">
                                <Code className="w-5 h-5 text-blue-600" />
                            </span>
                            <span className="logo-shadow bg-white rounded-lg w-10 h-10 -rotate-12 z-10 -translate-x-1.5 translate-y-1 flex items-center justify-center border border-zinc-100 shadow-sm">
                                <Terminal className="w-5 h-5 text-green-600" />
                            </span>
                        </div>
                        <div className="flex items-center gap-2 whitespace-nowrap justify-center">
                            Partner For Your
                            <span className="ml-2 logo-shadow bg-white rounded-lg w-10 h-10 translate-y-1 flex items-center rotate-12 justify-center border border-zinc-100 shadow-sm">
                                <Cpu className="w-5 h-5 text-purple-600" />
                            </span>
                            Success
                        </div>
                    </h1>

                    <h1 className="block md:hidden text-[34px] leading-[1.1] text-center font-semibold tracking-tighter px-2 text-gray-900">
                        World-class Coding <br /> Partner For Your Success
                    </h1>

                    <p className="text-[#323745] text-sm md:text-lg mx-10 text-center max-w-xl tracking-tighter leading-relaxed">
                        Trusted by students and professionals to master algorithms, debug code, and ace their coding interviews.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-2 mb-8 w-fit md:w-full">
                        <button
                            onClick={onOpenAuth}
                            className="w-full md:w-fit flex items-center justify-center gap-2 space-x-2 py-3 px-5 group transition-all duration-500 ease-in-out font-medium bg-[#151619] text-white rounded-full shadow tracking-tight whitespace-nowrap text-sm sm:text-sm button-shadow will-change-auto hover:bg-[#2a2c32]"
                        >
                            <div className="relative w-[4.7rem] md:w-7 h-7 origin-center md:group-hover:w-[4.7rem] transition-all duration-500 ease-in-out flex items-center justify-center will-change-auto">
                                <div className="absolute left-0 shrink-0 z-10 w-7 h-7 rounded-full bg-white flex items-center justify-center">
                                    <Code className="w-4 h-4 text-black" />
                                </div>
                                <span className="text-white ml-2 opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 absolute left-8 text-xs">
                                    Start
                                </span>
                                <div className="absolute right-0 shrink-0 w-7 h-7 rounded-full bg-[#0368f4] text-white flex items-center justify-center">
                                    <span className="text-[10px]">Now</span>
                                </div>
                            </div>
                            Start Learning Free
                        </button>
                    </div>

                    <div className="flex items-center justify-center gap-5 xl:mt-4">
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="w-10 h-10 rounded-full border-2 border-white bg-zinc-100 flex items-center justify-center overflow-hidden"
                                >
                                    <img
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 5}`}
                                        alt="User"
                                        className="w-full h-full"
                                    />
                                </div>
                            ))}
                            <span className="bg-white w-10 h-10 text-gray-900 border border-gray-200 rounded-full flex items-center justify-center text-xs font-semibold ml-1">
                                +10k
                            </span>
                        </div>
                        <div className="flex flex-col justify-start items-start gap-1">
                            <div className="flex space-x-0.5">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star
                                        key={i}
                                        className="w-4 h-4 fill-current text-yellow-400 text-gray-900"
                                    />
                                ))}
                            </div>
                            <span className="text-gray-600 text-[13.5px] tracking-tight font-medium">
                                From 500+ reviews
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Card */}
                <div className="xl:block hidden">
                    <div className="flex items-center justify-start">
                        <div className="relative w-[230px]">
                            <div className="absolute inset-0 bg-white rounded-2xl rotate-[20deg] border border-black/5 -z-10 shadow-sm"></div>
                            <div className="relative bg-white rounded-2xl p-5 w-full rotate-[14deg] card-shadow shadow-xl border border-zinc-100">
                                <div className="flex items-start justify-between gap-4">
                                    <p className="text-gray-500 text-[13px] font-medium mb-3 tracking-tight leading-[1.2]">
                                        "I finally understood Dynamic Programming thanks to these solutions. Highly recommended!"
                                    </p>
                                    <div className="w-6 h-6 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                                        <CheckCircle className="w-3 h-3" />
                                    </div>
                                </div>
                                <span className="block text-xs font-semibold text-gray-900">
                                    - Priya S., Student
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
