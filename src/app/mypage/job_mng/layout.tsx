'use client'

import { Suspense } from "react";

export default function JobsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Suspense>
            {children}
        </Suspense>
    );
}
