'use client'

import { Suspense } from "react";
import FaviconEnforcer from "@/components/FaviconEnforcer";

export default function JobsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <FaviconEnforcer />
            <Suspense>
                {children}
            </Suspense>
        </>
    );
}
