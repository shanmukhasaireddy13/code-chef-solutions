"use client";

import { useState, useEffect } from 'react';
import SidebarClient from './SidebarClient';
import LogoutButton from './LogoutButton';
import Tour from './Tour';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { API_ROUTES } from '@/lib/api';
import { toast } from 'sonner';

interface DashboardLayoutProps {
    children: React.ReactNode;
    userData: {
        credits: number;
        name: string;
        role: string;
        hasSeenTour?: boolean;
        tour?: {
            isCompleted: boolean;
            currentStep: number;
        };
    };
}

export default function DashboardLayout({ children, userData }: DashboardLayoutProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showTour, setShowTour] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Get current step from URL or default to 0
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    useEffect(() => {
        const initializeTour = async () => {
            // Never show tour for admin users
            if (userData.role === 'admin') {
                return;
            }

            // If tour is explicitly requested via URL, show it
            const tourParam = searchParams.get('tour');
            const stepParam = searchParams.get('tourStep');

            if (tourParam === 'true') {
                if (stepParam) setCurrentStepIndex(parseInt(stepParam, 10));
                setShowTour(true);
                return;
            }

            // Check if user has seen the tour
            if (!userData.hasSeenTour) {
                setCurrentStepIndex(0);
                // Small delay to allow initial render
                setTimeout(() => setShowTour(true), 1000);
            }
        };

        initializeTour();
    }, [searchParams, userData]);

    const updateTourStatus = async (isCompleted?: boolean, step?: number) => {
        try {
            await fetch(API_ROUTES.USER.TOUR_STATUS, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ isCompleted, currentStep: step })
            });
        } catch (error) {
            console.error('Failed to update tour status', error);
        }
    };

    const handleTourComplete = async () => {
        setShowTour(false);
        await updateTourStatus(true, tourSteps.length);
        // Navigate to dashboard and reload
        window.location.href = '/dashboard';
    };

    const handleTourSkip = async () => {
        setShowTour(false);
        // Mark as completed when skipped
        await updateTourStatus(true, currentStepIndex);
        toast.info("You can revisit the tour from the settings if you don't know how things work.");
        // Navigate to dashboard and reload after a short delay so user can see the toast
        setTimeout(() => {
            window.location.href = '/dashboard';
        }, 2000);
    };

    const handleStepChange = (index: number) => {
        setCurrentStepIndex(index);
        updateTourStatus(false, index); // Save progress

        const nextStep = tourSteps[index];
        if (nextStep) {
            // If path changes, navigate
            if (nextStep.path && nextStep.path !== pathname) {
                router.push(`${nextStep.path}?tour=true&tourStep=${index}`);
            } else {
                // Just update URL param
                const params = new URLSearchParams(searchParams.toString());
                params.set('tour', 'true'); // Ensure tour param is present
                params.set('tourStep', index.toString());
                router.replace(`${pathname}?${params.toString()}`);
            }
        }
    };

    const tourSteps = [
        {
            targetId: 'nav-dashboard',
            title: 'Welcome to Dashboard',
            description: 'This is your command center. Access all features from this sidebar. It will stay open during the tour.',
            path: '/dashboard',
            position: 'right' as const,
        },
        {
            targetId: 'btn-add-credits',
            title: 'Add Credits',
            description: 'Need more credits? Click here to top up your wallet instantly.',
            path: '/dashboard',
            position: 'right' as const,
        },
        {
            targetId: 'tour-global-offers',
            title: 'Exclusive Offers',
            description: 'Check out the latest deals and discounts available for you right here!',
            path: '/dashboard',
            position: 'bottom' as const,
        },
        {
            targetId: 'tour-contests-section',
            title: 'Live & Upcoming Contests',
            description: 'Here you can see all ongoing and future contests. Join live ones to earn rewards!',
            path: '/dashboard',
            position: 'left' as const,
        },
        {
            targetId: 'tour-referral',
            title: 'Earn Rewards',
            description: 'Invite your friends to the platform and earn free credits for every signup!',
            path: '/dashboard',
            position: 'top' as const,
        },
        {
            targetId: 'tour-contest-card',
            title: 'Enter a Contest',
            description: 'Click on this live contest card to enter the contest arena and see the problems.',
            path: '/dashboard',
            position: 'right' as const,
            waitForClick: true,
            navigatesOnClick: true,
        },
        {
            targetId: 'tour-add-to-cart-btn',
            title: 'Select Problem',
            description: 'Click the cart icon to add this problem to your cart.',
            // path: '/dashboard/contest', // Removed to prevent 404 on dynamic route
            position: 'left' as const,
            waitForClick: true,
        },
        {
            targetId: 'tour-unlock-btn',
            title: 'Unlock Solutions',
            description: 'Click here to purchase the solutions in your cart. First one is free!',
            // path: '/dashboard/contest',
            position: 'left' as const,
            waitForClick: true,
        },
        {
            targetId: 'tour-view-solution-btn',
            title: 'View Solution',
            description: 'Success! Now click "View Solution" to see the code.',
            // path: '/dashboard/contest',
            position: 'left' as const,
            waitForClick: true,
            navigatesOnClick: true,
        },
        {
            targetId: 'solutions-table',
            title: 'Solutions Library',
            description: 'This is where your solutions live. Select a contest or search for a specific problem.',
            path: '/dashboard/solutions',
            position: 'right' as const,
        },
        {
            targetId: 'tour-first-solution',
            title: 'Select a Solution',
            description: 'Click on a solution to see its details and code.',
            path: '/dashboard/solutions',
            position: 'left' as const,
            waitForClick: true,
        },
        {
            targetId: 'solution-view-btn',
            title: 'View Code',
            description: 'Click the "Open Solution" button to see the full code, copy it, or download it.',
            path: '/dashboard/solutions',
            position: 'left' as const,
            waitForClick: true,
            navigatesOnClick: true,
        },
        {
            targetId: 'solution-code-card',
            title: 'Solution Code',
            description: 'Here is the complete solution code! You can copy it using the button in the top right.',
            // path: '/dashboard/solutions/[id]', // Dynamic path, handled by previous step navigation
            position: 'top' as const,
        },
        {
            targetId: 'nav-help',
            title: 'Need Help?',
            description: 'Got a problem? Don\'t worry! Click Next to visit our Support Center.',
            path: '/dashboard/solutions',
            position: 'right' as const,
        },
        {
            targetId: 'help-section',
            title: 'Support Center',
            description: 'Submit a ticket here if you face any issues. We are here to help!',
            path: '/dashboard/help',
            position: 'left' as const,
        },
        {
            targetId: 'nav-settings',
            title: 'Settings',
            description: 'Finally, let\'s check your settings. Click Next to proceed.',
            path: '/dashboard/help',
            position: 'right' as const,
        },
        {
            targetId: 'settings-container',
            title: 'Your Preferences',
            description: 'Manage your profile, change your password, and view your billing history here.',
            path: '/dashboard/settings',
            position: 'left' as const,
        },
    ];

    return (
        <div className="min-h-screen bg-zinc-50">
            {showTour && (
                <Tour
                    steps={tourSteps}
                    currentStepIndex={currentStepIndex}
                    onStepChange={handleStepChange}
                    onComplete={handleTourComplete}
                    onSkip={handleTourSkip}
                />
            )}

            <SidebarClient
                initialCredits={userData.credits}
                userName={userData.name}
                role={userData.role}
                isCollapsed={isCollapsed}
                toggleSidebar={() => setIsCollapsed(!isCollapsed)}
            />
            <main
                className={`transition-all duration-300 ease-in-out relative ${isCollapsed ? 'ml-20' : 'ml-72'
                    } p-8`}
            >
                <div className="absolute top-6 right-8 z-10">
                    <LogoutButton logoutUrl="/api/auth/logout" />
                </div>
                {children}
            </main>
        </div>
    );
}
