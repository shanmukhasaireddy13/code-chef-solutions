"use client";

import Link from 'next/link';
import { ArrowLeft, Calendar, Copy, Check, Terminal } from 'lucide-react';
import { useState } from 'react';

interface Solution {
    _id: string;
    name: string;
    difficulty: string;
    contestId: string;
    problemId: string;
    price: number;
    content: string;
    createdAt: string;
}

interface SolutionViewClientProps {
    solution: Solution;
}

export default function SolutionViewClient({ solution }: SolutionViewClientProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        // Extract code from markdown block
        const codeMatch = solution.content.match(/```(?:\w+)?\n([\s\S]*?)```/);
        const codeToCopy = codeMatch ? codeMatch[1] : solution.content;

        navigator.clipboard.writeText(codeToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto pt-12 pb-20">
            <Link href="/dashboard/solutions" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to My Solutions
            </Link>

            <div className="space-y-6">
                {/* Minimal Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-900 mb-2">{solution.name}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-zinc-500 text-sm">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Purchased {new Date(solution.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </span>
                            <span>•</span>
                            <span>Contest #{solution.contestId}</span>
                            <span>•</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${solution.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                solution.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                                }`}>
                                {solution.difficulty}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Apple Window Style Code Card */}
                <div id="solution-code-card" className="bg-[#1e1e1e] rounded-xl shadow-2xl overflow-hidden border border-zinc-800/50">
                    {/* Window Title Bar */}
                    <div className="bg-[#2d2d2d] px-4 py-3 flex items-center justify-between border-b border-zinc-700/50">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]"></div>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono">
                            <Terminal className="w-3 h-3" />
                            solution.cpp
                        </div>
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-white/10 text-zinc-300 hover:bg-white/20 transition-colors"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-3 h-3 text-green-400" />
                                    Copied
                                </>
                            ) : (
                                <>
                                    <Copy className="w-3 h-3" />
                                    Copy
                                </>
                            )}
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-0">
                        <div className="prose prose-invert max-w-none">
                            <div
                                className="solution-content-dark"
                                dangerouslySetInnerHTML={{ __html: formatMarkdown(solution.content) }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Simple markdown formatter tailored for the dark window
function formatMarkdown(markdown: string): string {
    if (!markdown) return '';
    let html = markdown;

    // Remove headers from the code view as they are redundant with the main header
    // or style them very subtly if they are part of the explanation
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-zinc-200 mt-6 mb-3 px-6">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-zinc-100 mt-8 mb-4 px-6">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-white mt-8 mb-4 px-6">$1</h1>');

    // Code blocks - Remove the wrapper since the whole card is the wrapper
    // Just style the pre/code
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-[#1e1e1e] text-zinc-300 p-6 overflow-x-auto font-mono text-sm leading-relaxed"><code>$2</code></pre>');

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="bg-white/10 text-zinc-200 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');

    // Bold
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-white">$1</strong>');

    // Paragraphs
    html = html.replace(/^(?!<h|<pre|<ul|<ol)(.+)$/gm, '<p class="px-6 mb-4 text-zinc-400 leading-relaxed">$1</p>');

    // Line breaks
    html = html.replace(/\n\n/g, ''); // Let p tags handle spacing

    return html;
}
