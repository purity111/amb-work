'use client'

import { Suspense } from "react";

export default function ConfirmEmailLayout({
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
