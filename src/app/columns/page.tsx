"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ColumnsRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect from /columns to /column
        router.replace('/column');
    }, [router]);

    return (
        <div className="flex flex-row justify-center pt-10">
            <div>Redirecting to columns...</div>
        </div>
    );
}
