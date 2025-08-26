'use client'

import React, { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { confirmEmail } from '@/lib/api';
import { useRouter, useSearchParams } from 'next/navigation';
import Spinner from '@/components/common/Spinner';
import { useAuthContext } from '@/hooks/useAuthContext';

export default function ConfirmEmailPage() {
    const [errorText, setErrorText] = useState('')
    const [isSuccess, setIsSuccess] = useState(false);
    const { saveCredentails } = useAuthContext();
    const router = useRouter();

    const searchParams = useSearchParams();
    const confirmMutation = useMutation({
        mutationFn: confirmEmail,
        onSuccess: (data) => {
            setIsSuccess(true);
            const { token, user, role } = data.data;
            saveCredentails(token, { role, ...user });
            router.push('/');
        },
        onError: (error: any) => {
            setErrorText(error?.response?.data?.message || '予期しないエラー');
        },
    });

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        const token = params.get('token');
        const role = params.get('role');
        if (token && role) {
            confirmMutation.mutate({
                token,
                role,
            })
        }
    }, [])

    return (
        <main>
            {/* Hero Section - Identical Split Layout */}
            <div className="h-20 sm:h-30 md:h-75 bg-[#414141]"></div>
            {/* Text Content (Left Side - Dark Grey Background) */}
            {confirmMutation.isPending && (
                <div className="flex items-center justify-center mt-10">
                    <Spinner />
                    <h1 className="ml-4 text-2xl text-center text-black">メールアドレスの確認</h1>
                </div>
            )}
            {errorText && (
                <div className="flex items-center justify-center mt-10">
                    <h2 className="ml-4 text-2xl text-center text-black">{errorText}</h2>
                </div>
            )}
            {isSuccess && (
                <div className="flex items-center justify-center mt-10">
                    <h2 className="ml-4 text-2xl text-center font-bold text-blue">メールが正常に確認されました。</h2>
                </div>
            )}
        </main>
    )
}