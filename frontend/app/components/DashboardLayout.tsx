"use client";

import { useState } from 'react';
import SidebarClient from './SidebarClient';
import LogoutButton from './LogoutButton';

interface DashboardLayoutProps {
    children: React.ReactNode;
    userData: {
        credits: number;
        name: string;
        role: string;
    };
}

export default function DashboardLayout({ children, userData }: DashboardLayoutProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-zinc-50">
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
