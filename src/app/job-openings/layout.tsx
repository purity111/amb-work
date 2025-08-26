'use client'

import Footer from "@/components/Footer";
import FaviconEnforcer from "@/components/FaviconEnforcer";

export default function JobOpeningsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <FaviconEnforcer />
            <div className="pt-25 relative">
                {children}
            </div>
            <Footer />
        </>
    );
}
