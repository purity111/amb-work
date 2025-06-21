'use client'

import Footer from "@/components/Footer";

export default function JobsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <div className="pt-25 relative">
                {children}
            </div>
            <Footer />
        </>
    );
}
