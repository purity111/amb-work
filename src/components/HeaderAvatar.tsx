import { useAuthContext } from "@/app/layout";
import Image from "next/image";
import { useState, useEffect } from "react";

interface Props {
    data: any
}

export default function HeaderAvatar({ data }: Props) {
    const [menuShown, setMenuShown] = useState(false);
    const { logout } = useAuthContext();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Render null on the server or until mounted on the client
    if (!isMounted || !data) {
        return null;
    }

    return (
        <div
            className="relative h-full aspect-square p-5 cursor-pointer hover:bg-gray-600"
            onMouseEnter={() => setMenuShown(true)}
            onMouseLeave={() => setMenuShown(false)}
        >
            <div className="relative w-full h-full">
                <Image
                    src={data?.role === 'Employer' ? '/images/default-company.png' : '/images/default-avatar.jpg'}
                    alt="avatar"
                    className="rounded-full"
                    fill
                    sizes="100px"
                />
            </div>
            <div
                className={`
                    absolute top-1/1 right-0 w-50 bg-white shadow-md border-1 border-gray-700 cursor-default
                    ${menuShown ? 'block' : 'hidden'}
                `}
            >
                <p className="p-2 text-gray-600 text-sm border-b-1 border-gray-800">
                    {(data?.role === 'admin' || data?.role === 'subadmin') && 'Admin'}
                    {data?.role === 'Employer' && data?.clinic_name}
                    {data?.role === 'JobSeeker' && data?.name}
                    {data?.role === 'Employer' && `(${data?.clinic_name_kana})`}
                    {data?.role === 'Employer' && `(${data?.name_kana})`}
                </p>
                <a href="/mypage" className="text-base w-1/1">
                    <p className="p-2 hover:bg-gray-800">My Page</p>
                </a>
                <p className="p-2 font-md cursor-pointer hover:bg-gray-800" onClick={logout}>LogOut</p>
            </div>
        </div>
    );
}

