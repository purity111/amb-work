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
                <div className="w-9/10 max-w-200 mx-auto min-h-screen">
                    {children}
                </div>
            </div>
            <Footer />
        </>
    );
}
