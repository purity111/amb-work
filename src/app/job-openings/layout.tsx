'use client'

import Footer from "@/components/Footer";
import { AuthProvider } from "@/app/layout";

export default function JobOpeningsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AuthProvider>
            <div className="pt-25 relative">
                {children}
            </div>
            <Footer />
        </AuthProvider>
    );
}
