'use client'

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useUnsavedChangesPrompt(isDirty: boolean) {
    const router = useRouter();

    const navigate = (url: string) => {
        if (isDirty) {
            const confirmLeave = window.confirm('保存されていない変更があります。終了してもよろしいですか？');
            if (!confirmLeave) {
                return; // Cancel navigation
            }
        }
        router.push(url);
    };

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (!isDirty) return;
            e.preventDefault();
            e.returnValue = '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    return { navigate };
}