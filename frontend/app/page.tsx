"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { API_ROUTES } from "@/lib/api";
import Navbar from "./components/Navbar";
import HeroMixed from "./components/HeroMixed";
import StepsMixed from "./components/StepsMixed";
import FAQ from "./components/FAQ";
import FooterMixed from "./components/FooterMixed";

const AuthModal = dynamic(() => import("./components/AuthModal"), {
    ssr: false,
});

export default function Home() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    useEffect(() => {
        // Check for referral params
        const params = new URLSearchParams(window.location.search);
        const ref = params.get("ref");
        const action = params.get("action");

        if (ref) {
            localStorage.setItem("referralCode", ref);
        }

        if (action === "signup") {
            setIsAuthModalOpen(true);
        }
    }, []);
    return (
        <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden font-sans">
            <Navbar onOpenAuth={() => setIsAuthModalOpen(true)} />

            <main>
                <HeroMixed onOpenAuth={() => setIsAuthModalOpen(true)} />
                <StepsMixed />
                <FAQ />
            </main>

            <FooterMixed />

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                googleAuthUrl={API_ROUTES.AUTH.GOOGLE}
            />
        </div>
    );
}
