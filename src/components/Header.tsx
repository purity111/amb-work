'use client'

import { HeaderButtonList } from "@/utils/constants";
import { HeaderButton } from "@/utils/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import CollapsibleItem from "./CollapsableItem";
import RegisterModal from "./modal/Register";
import LoginModal from "./modal/Login";
import HeaderAvatar from "./HeaderAvatar";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/app/layout";
import api from "@/lib/axios";

export default function Header() {
    const [open, setOpen] = useState(false);
    const [registerModalShown, setRegisterModalShown] = useState(false);
    const [loginModalShown, setLoginModalShown] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const { profile, isAuthenticated, token, logout } = useAuthContext();

    const router = useRouter();
    useEffect(() => {
        setIsMounted(true);
        api.interceptors.response.use(
            (response) => response,
            async (error) => {
                console.log({ error })
                if (error.response?.status === 401) {
                    logout();
                    router.push('/');
                }
                return Promise.reject(error);
            }
        );

        // Add token to request
        api.interceptors.request.use((config) => {
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        });
    }, [router])

    const onLoginSuccess = () => {
        setLoginModalShown(false);
        // client-side reload only
        if (typeof window !== 'undefined') {
            window.location.reload();
        }
    }

    const onCloseRegisterModal = (success?: boolean) => {
        setRegisterModalShown(false)
        if (success) setLoginModalShown(true);
    }

    const handleToggleClick = () => {
        setOpen(!open)
    };

    if (!isMounted) return null;

    const renderHeaderButton = (item: HeaderButton) => {
        if (item.type === 'link') {
            return (
                <Link key={item.title} href={item.to} className="relative mx-3 my-1 text-white font-bold text-sm">{item.title}</Link>
            )
        } else {
            const isConsultationMenu = item.title === 'まずはご相談';
            return (
                <span
                    key={item.title}
                    className={`
                        relative mx-8 my-1 text-white font-bold text-sm header-menu
                        ${isConsultationMenu ? 'consultation-menu' : ''}
                    `}
                >
                    {item.title}
                    <div className="sub-menu">
                        {item.items.map(i => (
                            <div key={i.title} className="py-3">
                                <Link href={i.to} className="font-base hover:opacity-60">{i.title}</Link>
                            </div>
                        ))}
                    </div>
                </span>
            )
        }
    }

    const renderMobileMenuList = () => {
        return HeaderButtonList.map((item) => {
            if (item.type === 'link') {
                return (
                    <Link
                        key={item.title}
                        href={item.to}
                        className="relative my-6 text-gray-400 font-bold text-base"
                        onClick={() => setOpen(false)}
                    >
                        {item.title}
                    </Link>
                )
            } else {
                return (
                    <div key={item.title} className="my-6">
                        <CollapsibleItem title={item.title}>
                            {item.items.map(i => (
                                <div key={i.title} className="pt-6">
                                    <Link
                                        href={i.to}
                                        className="font-base hover:opacity-60"
                                        onClick={() => setOpen(false)}
                                    >
                                        {i.title}
                                    </Link>
                                </div>
                            ))}
                        </CollapsibleItem>
                    </div>
                )
            }
        })
    }

    return (
        <header className="flex flex-row bg-gray-400 w-full h-20 md:h-25 items-center fixed z-30">
            <Link href={'/'} className="h-18 md:h-20 w-18 md:w-82 relative ml-4 sm:ml-8 lg:ml-12 xl:ml-16">
                <Image
                    src={'/images/logo.png'}
                    alt="logo"
                    className="object-cover hidden md:block"
                    fill
                    priority
                    sizes="328px"
                />
                <Image
                    src={'/images/logo-sp.png'}
                    alt="logo-sp"
                    className="md:hidden object-contain"
                    fill
                    priority
                    sizes="72px"
                />
            </Link>
            <ul className="hidden lg:flex flex-1 flex-row flex-wrap justify-end items-center header">
                {HeaderButtonList.map((item) => {
                    return renderHeaderButton(item)
                })}
            </ul>
            <div className="relative flex flex-1 flex-row justify-end items-center lg:hidden">
                {
                    !isAuthenticated &&
                    <div className={`flex flex-col items-center mr-3 cursor-pointer hover:opacity-60`} onClick={() => setRegisterModalShown(true)}>
                        <div className="relative w-4 sm:w-6 aspect-[1]">
                            <Image
                                src="/svgs/register_icon.svg"
                                alt="register-icon"
                                fill
                            />
                        </div>
                        <span className="text-white text-sm sm:text-base">会員登録</span>
                    </div>
                }
                {
                    !isAuthenticated &&
                    <div className={`flex flex-col items-center mr-3 cursor-pointer hover:opacity-60`} onClick={() => setLoginModalShown(true)}>
                        <div className="relative w-4 sm:w-6 aspect-[1]">
                            <Image src="/svgs/login_icon.svg" alt="register-icon" width={25} height={25} />
                        </div>
                        <span className="text-white text-sm sm:text-base">ログイン</span>
                    </div>
                }
                <button
                    onClick={handleToggleClick}
                    className="group relative w-8 h-8  cursor-pointer focus:outline-none mx-4"
                >
                    <span className={`absolute h-0.5 left-0 w-full ${open ? 'bg-green' : 'bg-white'} transition-transform transition-colors duration-300 ease-in-out ${open ? 'translate-y-0 rotate-45 top-1/2' : 'top-1'}`} />
                    <span className={`absolute h-0.5 left-0 w-full ${open ? 'bg-green' : 'bg-white'} transition-opacity transition-colors duration-300 ease-in-out ${open ? 'opacity-0' : 'top-[calc(50%-1px)]'}`} />
                    <span className={`absolute h-0.5 left-0 w-full ${open ? 'bg-green' : 'bg-white'} transition-transform transition-colors duration-300 ease-in-out ${open ? 'translate-y-0 -rotate-45 top-1/2' : 'bottom-1'}`} />
                </button>

            </div>
            <div className={`${open ? 'h-[calc(100vh-80px)] md:h-[calc(100vh-100px)] p-6 overflow-auto' : 'h-0 overflow-hidden'} lg:hidden absolute top-20 md:top-25 flex flex-col w-full  bg-white duration-200`}>
                {renderMobileMenuList()}
            </div>
            {isMounted && isAuthenticated ? ( // Conditionally render based on isMounted and isAuthenticated
                <HeaderAvatar data={profile} />
            ) : (
                // Only render the login/register buttons on the client if not authenticated and mounted
                isMounted && !isAuthenticated && (
                    <div className="h-full flex-col hidden lg:flex">
                        <div
                            className="cursor-pointer text-white flex-1 flex flex-row items-center px-6 bg-green hover:opacity-50 duration-400"
                            onClick={() => setRegisterModalShown(true)}
                        >
                            <Image src="/svgs/register_icon.svg" alt="register-icon" width={16} height={16} />
                            <span className="ml-2">会員登録</span>
                        </div>
                        <div
                            className="cursor-pointer text-white flex-1 flex flex-row items-center px-6 bg-blue hover:opacity-50 duration-400"
                            onClick={() => setLoginModalShown(true)}
                        >
                            <Image src="/svgs/login_icon.svg" alt="register-icon" width={16} height={16} />
                            <span className="ml-2">ログイン</span>
                        </div>
                    </div>
                )
            )}
            {registerModalShown && (
                <RegisterModal onClose={onCloseRegisterModal} />
            )}
            {loginModalShown && (
                <LoginModal onClose={() => setLoginModalShown(false)} onSuccess={onLoginSuccess} />
            )}
        </header>
    );
}

