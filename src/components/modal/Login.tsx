'use client'

import React, { useState } from "react";
import CInput from "../common/Input";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/lib/api";
import { toast } from "react-toastify";
import { useAuthContext } from "@/app/layout";
import Spinner from "../common/Spinner";

interface LoginModalProps {
    onSuccess: () => void;
    onClose: () => void;
}

export default function LoginModal({ onSuccess, onClose }: LoginModalProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { saveCredentails } = useAuthContext();

    const mutation = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            // data: {success: true, data: object}
            // logged in successfully
            toast.success('加入成功!', {
                autoClose: 1000,
                onClose: () => {
                    const { token, user, role } = data.data;
                    saveCredentails(token, { role, ...user })
                    onSuccess();
                }
            });
        },
        onError: (error) => {
            console.log('login error: ', error)
            toast.error('無効なログイン情報');
        },
    });

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const onLoginSubmit = () => {
        mutation.mutate({ email, password })
    }

    return (
        <div
            className="fixed inset-0 z-50 flex  justify-center bg-gray-300/80"
        >
            <div className="relative flex flex-col bg-white rounded-lg border-none shadow-xl my-auto w-full h-fit max-h-3/4 max-w-md pt-6 pb-8 relative border-1 border-gray-700 overflow-hidden">
                <p className="text-center text-blue text-2xl pb-6 border-b-1 border-gray-800">ログイン</p>

                <div className="p-6">
                    <div className="flex flex-col items-left md:flex-row  py-2">
                        <div className="flex-2 flex flex-row items-center">
                            <p className="text-sm text-gray-400 py-2">メールアドレス</p>
                        </div>
                        <div className="flex-3">
                            <CInput
                                height="h-[40px]"
                                className="rounded-sm placeholder-gray-700"
                                onChange={handleEmailChange}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col items-left md:flex-row  py-2">
                        <div className="flex-2 flex flex-row items-center">
                            <p className="text-sm text-gray-400 py-2">パスワード</p>
                        </div>
                        <div className="flex-3">
                            <CInput
                                type="password"
                                height="h-[40px]"
                                className="rounded-sm placeholder-gray-700"
                                onChange={handlePasswordChange}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-row items-center px-4 space-x-4">
                    <button
                        className={`
                            flex-1 bg-green text-white py-2 rounded-sm cursor-pointer h-10
                            ${(email && password) ? 'opacity-90 hover:opacity-100' : 'opacity-80'}
                            `}
                        disabled={!email || !password}
                        onClick={onLoginSubmit}
                    >
                        {mutation.isPending ?
                            <div className="w-full h-full items-center flex justify-center"><Spinner size={4} /></div>
                            : '確認'}
                    </button>
                    <button
                        className={`
                            flex-1 bg-gray-400 text-white py-2 rounded-sm cursor-pointer
                            ${(email && password) ? 'opacity-90 hover:opacity-100' : 'opacity-80'}
                            `}
                        onClick={onClose}
                    >
                        キャンセル
                    </button>
                </div>
            </div>
        </div>
    );
}