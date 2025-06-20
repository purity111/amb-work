'use client';

import { FooterButtonList, SocialButtonList } from "@/utils/constants";
import Image from "next/image";
import Link from "next/link";
import { useAuthContext } from "@/app/layout";
import { useState, useEffect } from "react";

export default function Footer() {
    const { isAuthenticated } = useAuthContext();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <footer className="p-10 sm:p-24 bg-gray-400 pb-2" style={{ paddingBottom: '8px' }}>
            <div className="max-w-300 mx-auto">
                <div className="flex flex-col md:flex-row flex-wrap gap-x-[30px] gap-y-[10px] sm:gap-y-[20px]">
                    {FooterButtonList.map(btn => {
                        const isConsultationMenu = btn.title === 'まずはご相談';
                        return (
                            <div key={btn.to + btn.title} className="max-w-60 sm:max-w-50">
                                <div className="py-2">
                                    <Link
                                        href={btn.to}
                                        className={`
                                            text-white text-[13px] font-base hover:opacity-60 duration-500
                                            ${isConsultationMenu ? 'consultation-menu relative inline-block' : ''}
                                        `}
                                    >
                                        {btn.title}
                                    </Link>
                                </div>
                                {btn.items?.map(item => (
                                    <div key={item.title} className="py-1 flex flex-row items-center">
                                        <span className="text-white mr-1">ー</span>
                                        <Link href={item.to} className="text-white text-[13px] font-base hover:opacity-60 duration-500">{item.title}</Link>
                                    </div>
                                ))}
                            </div>
                        )
                    })}
                </div>
                <div className="flex flex-col md:flex-row justify-between">
                    <div className="flex flex-row items-center py-3">
                        {SocialButtonList.map(btn => (
                            <Link href={btn.to} key={btn.id} className="mr-6">
                                <Image src={btn.icon} width={30} height={30} alt={btn.id} />
                            </Link>
                        ))}
                    </div>
                    <div className="flex flex-row items-center py-3">
                        {isAuthenticated ? (
                            <Link 
                                href="/mypage" 
                                className="cursor-pointer text-white flex-1 flex flex-row justify-center items-center py-2 px-6 bg-blue hover:opacity-50 duration-400"
                            >
                                <Image src="/svgs/login_icon.svg" alt="mypage-icon" width={16} height={16} />
                                <span className="ml-2">マイページ</span>
                            </Link>
                        ) : (
                            <>
                                <div className="cursor-pointer text-white flex-1 flex flex-row items-center py-2 px-6 bg-green hover:opacity-50 duration-400">
                                    <Image src="/svgs/register_icon.svg" alt="register-icon" width={16} height={16} />
                                    <span className="ml-2">会員登録</span>
                                </div>
                                <div className="cursor-pointer text-white flex-1 flex flex-row items-center py-2 px-6 bg-blue hover:opacity-50 duration-400">
                                    <Image src="/svgs/login_icon.svg" alt="register-icon" width={16} height={16} />
                                    <span className="ml-2">ログイン</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between text-white text-xs">
                    <span className="py-3 text-[10px]">2025©リユース・リサイクル・買取業界専門の転職・求人サイト「リユース転職」</span>
                    <div className="flex flex-row items-center py-3 gap-4">
                        <Link href={'/privacy'} className="text-white text-[13px] font-base hover:opacity-60 duration-500">プライバシーポリシー</Link>
                        <Link href={'terms'} className="text-white text-[13px] font-base hover:opacity-60 duration-500">利用規約</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

