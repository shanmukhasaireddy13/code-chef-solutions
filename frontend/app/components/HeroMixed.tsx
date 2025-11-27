"use client";

import { Code, Terminal, Cpu, Search, ArrowRight, CheckCircle, Star, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface HeroProps {
  onOpenAuth: () => void;
}

export default function HeroMixed({ onOpenAuth }: HeroProps) {
  return (
    <div id="home" className="relative w-full flex flex-col items-center justify-start pt-32 pb-20 overflow-hidden px-5 min-h-screen">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 w-full h-full opacity-30 [mask-image:radial-gradient(circle,black_30%,transparent_100%)] [mask-repeat:no-repeat] [mask-position:center] [mask-size:cover] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      ></div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center gap-8 lg:gap-12 w-full max-w-7xl mx-auto">
        
        {/* Text Section */}
        <div className="flex flex-col items-center gap-6 text-center max-w-4xl">
           {/* Notification Pill */}
          <button
            onClick={onOpenAuth}
            className="flex items-center justify-center gap-3 bg-white/80 backdrop-blur-sm rounded-full pr-1 pl-3 py-1 text-xs md:text-sm tracking-tighter text-gray-700 font-medium border border-zinc-200 shadow-sm hover:shadow-md transition-all mb-4"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            New Solutions Added Daily!
            <div className="bg-zinc-100 w-7.5 h-7.5 rounded-full flex items-center justify-center p-1">
              <ArrowRight className="w-4 h-4 text-gray-600" />
            </div>
          </button>

          <h1 className="text-[40px] md:text-[64px] leading-[1.1] font-bold text-zinc-900 tracking-tight">
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
              <span>World-class</span>
              <span className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-white rounded-2xl shadow-lg border border-zinc-100 rotate-3">
                <Code className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
              </span>
              <span>Coding Partner</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mt-2">
              <span>For Your</span>
              <span className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-white rounded-2xl shadow-lg border border-zinc-100 -rotate-3">
                <Terminal className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Success
              </span>
            </div>
          </h1>

          <p className="text-zinc-500 text-lg md:text-xl max-w-2xl leading-relaxed">
            Trusted by students and professionals to master algorithms, debug code, and ace their coding interviews.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mt-4">
            <button
              onClick={onOpenAuth}
              className="w-full sm:w-auto px-8 py-4 bg-[#151619] text-white rounded-full font-semibold transition-all hover:bg-[#2a2c32] hover:scale-105 shadow-lg shadow-zinc-500/20 flex items-center justify-center gap-2"
            >
              Start Learning Free
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white text-zinc-900 border border-zinc-200 rounded-full font-semibold transition-all hover:bg-zinc-50 hover:border-zinc-300 shadow-sm">
              View Sample Solution
            </button>
          </div>
        </div>

        {/* Central Visual (The "Mix") */}
        <div className="relative w-full max-w-5xl mt-8 perspective-midrange">
          {/* Main Card (Glassmorphic IDE) */}
          <motion.div 
            initial={{ opacity: 0, y: 40, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full aspect-[16/10] md:aspect-[2/1] bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden"
          >
            {/* Window Controls */}
            <div className="absolute top-0 left-0 right-0 h-10 bg-zinc-50 border-b border-zinc-100 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <div className="ml-4 px-3 py-1 bg-white rounded-md border border-zinc-200 text-xs text-zinc-400 font-mono">
                solution.cpp
              </div>
            </div>

            {/* Code Content */}
            <div className="p-8 pt-16 font-mono text-sm md:text-base text-zinc-700 leading-relaxed overflow-hidden">
              <div className="flex gap-4">
                <div className="flex flex-col text-zinc-300 select-none text-right">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <span key={i}>{i + 1}</span>
                  ))}
                </div>
                <div className="flex flex-col">
                  <span className="text-purple-600">class</span> <span className="text-yellow-600">Solution</span> {"{"}
                  <span className="pl-4"><span className="text-purple-600">public</span>:</span>
                  <span className="pl-8"><span className="text-blue-600">int</span> <span className="text-yellow-600">maxProfit</span>(vector&lt;<span className="text-blue-600">int</span>&gt;& prices) {"{"}</span>
                  <span className="pl-12"><span className="text-blue-600">int</span> minPrice = INT_MAX;</span>
                  <span className="pl-12"><span className="text-blue-600">int</span> maxPro = 0;</span>
                  <span className="pl-12"><span className="text-purple-600">for</span>(<span className="text-blue-600">int</span> i = 0; i &lt; prices.size(); i++) {"{"}</span>
                  <span className="pl-16">minPrice = min(minPrice, prices[i]);</span>
                  <span className="pl-16">maxPro = max(maxPro, prices[i] - minPrice);</span>
                  <span className="pl-12">{"}"}</span>
                  <span className="pl-12"><span className="text-purple-600">return</span> maxPro;</span>
                  <span className="pl-8">{"}"}</span>
                  <span>{"}"};</span>
                </div>
              </div>
            </div>

            {/* Overlay 1: Search (Left) */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 max-w-xs hidden md:block"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                  <Search className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-zinc-700">Searching...</span>
              </div>
              <div className="text-sm text-zinc-500 bg-zinc-50 p-2 rounded-lg border border-zinc-100">
                "Best Time to Buy and Sell Stock"
              </div>
            </motion.div>

            {/* Overlay 2: Success (Right) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute top-20 right-8 bg-green-50/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-green-100 flex items-center gap-2 hidden md:flex"
            >
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-700">Accepted (0ms)</span>
            </motion.div>
          </motion.div>

          {/* Floating Testimonials (Absolute positioning relative to the visual container) */}
          <div className="absolute -left-12 top-1/2 -translate-y-1/2 hidden xl:block">
            <div className="bg-white p-4 rounded-2xl shadow-xl border border-zinc-100 max-w-[200px] -rotate-6 hover:rotate-0 transition-transform duration-300">
              <p className="text-xs text-zinc-500 mb-2">"The explanations are crystal clear!"</p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-[10px] font-bold">JD</div>
                <span className="text-xs font-bold text-zinc-900">John Doe</span>
              </div>
            </div>
          </div>

          <div className="absolute -right-12 top-1/3 hidden xl:block">
             <div className="bg-white p-4 rounded-2xl shadow-xl border border-zinc-100 max-w-[200px] rotate-6 hover:rotate-0 transition-transform duration-300">
              <p className="text-xs text-zinc-500 mb-2">"Helped me crack my Google interview."</p>
              <div className="flex items-center gap-2">
                 <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-[10px] font-bold">AS</div>
                <span className="text-xs font-bold text-zinc-900">Alice Smith</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
