'use client'

import Footer from "@/components/Footer";
import { AuthProvider } from "@/app/layout";
import FaviconEnforcer from "@/components/FaviconEnforcer";

export default function JobOpeningsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AuthProvider>
            <FaviconEnforcer />
            <div className="pt-25 relative">
                {children}
            </div>
            <Footer />
        </AuthProvider>
    );
}
