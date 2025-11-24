"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Check } from 'lucide-react';
import { createPortal } from 'react-dom';

interface Step {
    targetId: string;
    title: string;
    description: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
    waitForClick?: boolean;
    navigatesOnClick?: boolean;
}

interface TourProps {
    steps: Step[];
    currentStepIndex: number;
    onStepChange: (index: number) => void;
    onComplete: () => void;
    onSkip?: () => void;
}

export default function Tour({ steps, currentStepIndex, onStepChange, onComplete, onSkip }: TourProps) {
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        return () => { };
    }, []);

    useEffect(() => {
        let retryCount = 0;
        const maxRetries = 50; // 5 seconds total (100ms interval)

        const findTarget = () => {
            const target = document.getElementById(steps[currentStepIndex].targetId);
            if (target) {
                const rect = target.getBoundingClientRect();
                // Check if visible
                if (rect.width === 0 && rect.height === 0) {
                    if (retryCount < maxRetries) {
                        retryCount++;
                        setTimeout(findTarget, 100);
                        return;
                    }
                }

                setTargetRect(rect);

                // Smart positioning logic
                const tooltipHeight = 250;
                const tooltipWidth = 320;

                let top = rect.bottom + 24;
                let left = rect.left;

                // Check for explicit position preference
                const preferredPosition = steps[currentStepIndex].position;

                if (preferredPosition === 'top') {
                    top = rect.top - tooltipHeight - 24;
                } else if (preferredPosition === 'bottom') {
                    top = rect.bottom + 24;
                } else if (preferredPosition === 'left') {
                    top = rect.top;
                    left = rect.left - tooltipWidth - 24;
                } else if (preferredPosition === 'right') {
                    top = rect.top;
                    left = rect.right + 24;
                } else {
                    // Auto-positioning fallback
                    const spaceBelow = window.innerHeight - rect.bottom;
                    const spaceAbove = rect.top;
                    if (spaceBelow < tooltipHeight && spaceAbove > tooltipHeight) {
                        top = rect.top - tooltipHeight - 24;
                    }
                }

                // Ensure horizontal fit
                if (preferredPosition !== 'left' && preferredPosition !== 'right') {
                    if (left + tooltipWidth > window.innerWidth) {
                        left = window.innerWidth - tooltipWidth - 16;
                    }
                    if (left < 16) left = 16;
                } else {
                    if (left < 16) left = 16;
                    if (left + tooltipWidth > window.innerWidth) left = window.innerWidth - tooltipWidth - 16;
                }

                setTooltipPosition({ top, left });
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                // Retry if target not found
                if (retryCount < maxRetries) {
                    retryCount++;
                    setTimeout(findTarget, 100);
                }
            }
        };

        // Initial delay to allow rendering
        const timer = setTimeout(findTarget, 500);

        // Event delegation for click handling
        const handleDocumentClick = (e: MouseEvent) => {
            const step = steps[currentStepIndex];
            if (step.waitForClick && !step.navigatesOnClick) {
                const target = document.getElementById(step.targetId);
                if (target && (e.target === target || target.contains(e.target as Node))) {
                    // Small delay to allow the click action to complete (e.g., state update) before moving
                    setTimeout(() => {
                        onStepChange(currentStepIndex + 1);
                    }, 100);
                }
            }
        };

        document.addEventListener('click', handleDocumentClick, true); // Capture phase to ensure we catch it
        window.addEventListener('resize', findTarget);
        window.addEventListener('scroll', findTarget);

        return () => {
            clearTimeout(timer);
            document.removeEventListener('click', handleDocumentClick, true);
            window.removeEventListener('resize', findTarget);
            window.removeEventListener('scroll', findTarget);
        };
    }, [currentStepIndex, steps, onStepChange]);

    const handleNext = () => {
        if (currentStepIndex < steps.length - 1) {
            onStepChange(currentStepIndex + 1);
        } else {
            onComplete();
        }
    };

    if (!isMounted || !targetRect) return null;

    const currentStep = steps[currentStepIndex];

    return createPortal(
        <div className="fixed inset-0 z-[9999] pointer-events-none">
            {/* Dark Overlay with Cutout */}
            <motion.div
                className="absolute border-blue-500/0 rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] transition-all duration-300 ease-out"
                initial={false}
                animate={{
                    top: targetRect.top - 8,
                    left: targetRect.left - 8,
                    width: targetRect.width + 16,
                    height: targetRect.height + 16,
                }}
            />

            {/* Spotlight Border */}
            <motion.div
                className="absolute border-2 border-blue-500 rounded-xl pointer-events-none"
                initial={false}
                animate={{
                    top: targetRect.top - 8,
                    left: targetRect.left - 8,
                    width: targetRect.width + 16,
                    height: targetRect.height + 16,
                }}
                transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 30
                }}
            />

            {/* Tooltip Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStepIndex}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="absolute pointer-events-auto"
                    style={{
                        top: tooltipPosition.top,
                        left: tooltipPosition.left,
                    }}
                >
                    <div className="bg-white w-80 rounded-2xl shadow-2xl p-6 border border-zinc-100 relative overflow-hidden">
                        {/* Decorative background blob */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-60" />

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">
                                        {currentStepIndex + 1}
                                    </span>
                                    <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                                        of {steps.length}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {onSkip && (
                                        <button
                                            onClick={onSkip}
                                            className="text-xs font-medium text-zinc-400 hover:text-zinc-600 transition-colors"
                                        >
                                            Skip
                                        </button>
                                    )}
                                    <button
                                        onClick={onComplete}
                                        className="text-zinc-400 hover:text-zinc-600 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-zinc-900 mb-2">
                                {currentStep.title}
                            </h3>
                            <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                                {currentStep.description}
                            </p>

                            <div className="flex items-center justify-between">
                                <div className="flex gap-1">
                                    {steps.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentStepIndex ? 'bg-blue-500' : 'bg-zinc-200'
                                                }`}
                                        />
                                    ))}
                                </div>

                                {!currentStep.waitForClick && (
                                    <button
                                        onClick={handleNext}
                                        className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-all hover:scale-105 active:scale-95"
                                    >
                                        {currentStepIndex === steps.length - 1 ? (
                                            <>Finish <Check className="w-4 h-4" /></>
                                        ) : (
                                            <>Next <ChevronRight className="w-4 h-4" /></>
                                        )}
                                    </button>
                                )}
                                {currentStep.waitForClick && (
                                    <span className="text-xs font-bold text-blue-600 animate-pulse flex items-center gap-1">
                                        Click element <ChevronRight className="w-3 h-3" />
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>,
        document.body
    );
}
