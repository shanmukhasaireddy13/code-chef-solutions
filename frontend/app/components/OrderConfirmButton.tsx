"use client";

import React, { useState, useRef } from 'react';
import './OrderConfirmButton.css';

interface OrderConfirmButtonProps {
    onOrderComplete?: () => void;
    buttonText?: string;
    successText?: string;
    className?: string;
    disabled?: boolean;
}

export default function OrderConfirmButton({
    onOrderComplete,
    buttonText = "Complete Order",
    successText = "Order Placed",
    className = "",
    disabled = false
}: OrderConfirmButtonProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClick = () => {
        if (!isAnimating && !disabled && buttonRef.current) {
            setIsAnimating(true);
            buttonRef.current.classList.add('animate');

            // Call the callback after animation completes (7 seconds is when success message shows)
            setTimeout(() => {
                if (onOrderComplete) {
                    onOrderComplete();
                }
            }, 7000);

            // Reset animation after 10 seconds (full animation duration)
            setTimeout(() => {
                if (buttonRef.current) {
                    buttonRef.current.classList.remove('animate');
                }
                setIsAnimating(false);
            }, 10000);
        }
    };

    return (
        <button
            ref={buttonRef}
            className={`order ${className}`}
            onClick={handleClick}
            disabled={isAnimating || disabled}
            style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
        >
            <span className="default">{buttonText}</span>
            <span className="success">
                {successText}
                <svg viewBox="0 0 12 10">
                    <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                </svg>
            </span>
            <div className="box"></div>
            <div className="truck">
                <div className="back"></div>
                <div className="front">
                    <div className="window"></div>
                </div>
                <div className="light top"></div>
                <div className="light bottom"></div>
            </div>
            <div className="lines"></div>
        </button>
    );
}
