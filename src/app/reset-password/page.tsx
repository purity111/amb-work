'use client'

import React, { useState } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import RequiredLabel from '@/components/common/RequiredLabel';
import CInput from '@/components/common/Input';
import { useMutation } from '@tanstack/react-query';
import { resetPassword } from '@/lib/api';
import { toast } from 'react-toastify';
import { useSearchParams } from 'next/navigation';
import Spinner from '@/components/common/Spinner';

type FormValues = {
    password: string;
    confirmPassword: string;
};

const schema = Yup.object().shape({
    password: Yup.string()
        .required('必須項目です。')
        .min(8, '8文字以上である必要があります')
        .matches(/[0-9]/, '数字を含めてください。')
        .matches(/[@$!%*?&#]/, '特殊記号を含めてください。'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'パスワードは一致する必要があります')
        .required('必須項目です。'),
});

export default function ResetPasswordPage() {
    const [isSuccess, setIsSuccess] = useState(false);
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
    });

    const searchParams = useSearchParams();


    const resetMutation = useMutation({
        mutationFn: resetPassword,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onSuccess: (data) => {
            setIsSuccess(true);
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || '予期しないエラー');
        },
    });

    const onSubmit = (data: FormValues) => {
        const params = new URLSearchParams(searchParams.toString());
        const token = params.get('token');
        const role = params.get('role');
        if (token && role) {
            resetMutation.mutate({
                token,
                role,
                newPassword: data.password
            })
        }
    };

    if (isSuccess) {
        return (
            <main>
                {/* Hero Section - Identical Split Layout */}
                <div className="h-20 sm:h-30 md:h-75 bg-[#414141]"></div>
                {/* Text Content (Left Side - Dark Grey Background) */}
                <div className="w-full max-w-[1200px] m-auto text-white mt-30 px-4 lg:px-0 md:mb-10">
                    <h1 className="text-[26px] text-center md:text-[35px] lg:text-[44px] font-bold text-green mb-2">パスワードが正常にリセットされました。</h1>
                </div>
            </main>
        )
    }

    return (
        <>
            <main>
                {/* Hero Section - Identical Split Layout */}
                <div className="h-20 sm:h-30 md:h-75 bg-[#414141]"></div>
                {/* Text Content (Left Side - Dark Grey Background) */}
                <div className="w-full max-w-[1200px] m-auto text-white mt-10 px-4 lg:px-0 md:mb-10">
                    <h2 className="text-[26px] text-center md:text-[35px] lg:text-[44px] font-bold text-black mb-2">パスワードをリセットする</h2>
                </div>
                <div className='w-9/10 max-w-100 mx-auto'>
                    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                        <div className="flex flex-col items-start py-2">
                            <div className="flex-2 flex flex-row items-center">
                                <p className="text-sm text-gray-400 py-2">パスワード</p>
                                <RequiredLabel />
                            </div>
                            <div className="flex-3">
                                <Controller
                                    name="password"
                                    control={control}
                                    render={({ field }) => (
                                        <CInput
                                            {...field}
                                            isError={!!errors.password}
                                            errorText={errors.password?.message}
                                            type="password"
                                            height="h-[40px]"
                                            className="rounded-sm placeholder-gray-700"
                                            onChange={(e) => field.onChange(e)}
                                        />
                                    )}
                                />
                                <p className="text-[11px] text-gray-600 h-0">8文字以上かつ、半角英数字および特殊記号（!, %, # など）を含めてください。</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-start  py-2">
                            <div className="flex-2 flex flex-row items-center">
                                <p className="text-sm text-gray-400 py-2">確認用パスワード</p>
                                <RequiredLabel />
                            </div>
                            <div className="flex-3">
                                <Controller
                                    name="confirmPassword"
                                    control={control}
                                    render={({ field }) => (
                                        <CInput
                                            {...field}
                                            isError={!!errors.confirmPassword}
                                            errorText={errors.confirmPassword?.message}
                                            height="h-[40px]"
                                            type="password"
                                            className="rounded-sm placeholder-gray-700"
                                            onChange={(e) => field.onChange(e)}
                                        />
                                    )}
                                />
                                <p className="text-[11px] text-gray-600 h-0">パスワード欄と同じものを入力してください。</p>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className={`flex-1 bg-green text-white py-2 rounded-sm cursor-pointer h-10 w-full mt-4`}
                        >
                            {resetMutation.isPending ?
                                <div className="w-full h-full items-center flex justify-center"><Spinner size={4} /></div>
                                : 'リセット'
                            }
                        </button>
                    </form>
                </div>
            </main>
        </>
    );
}