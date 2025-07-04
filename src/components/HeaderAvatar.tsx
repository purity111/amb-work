import { useAuthContext } from "@/app/layout";
import Image from "next/image";
import { useState, useEffect } from "react";
import useGetCurrentUser from "@/hooks/useGetCurrentUser";

interface Props {
    data: any
}

export default function HeaderAvatar({ data }: Props) {
    const [menuShown, setMenuShown] = useState(false);
    const { logout } = useAuthContext();
    const [isMounted, setIsMounted] = useState(false);
    const { data: currentUserData } = useGetCurrentUser({
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    });

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const onClickLogout = () => {
        if (confirm("本当にログアウトしますか？")) {
            logout()
        }
    }

    // Use currentUserData if available, otherwise fall back to props data
    const userData = currentUserData?.success ? currentUserData.data : data;

    // Render null on the server or until mounted on the client
    if (!isMounted || !userData) {
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
                    src={userData?.avatar ? `${process.env.NEXT_PUBLIC_UPLOADS_BASE_URL}/${userData?.avatar}` : (userData?.role === 'Employer' ? '/images/default-company.png' : '/images/default-avatar.jpg')}
                    alt="avatar"
                    className="rounded-full object-cover"
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
                    {(userData?.role === 'admin' || userData?.role === 'subadmin') && 'Admin'}
                    {userData?.role === 'employer' && userData?.clinic_name}
                    {userData?.role === 'jobseeker' && userData?.name}
                </p>
                <a href="/mypage" className="text-base w-1/1">
                    <p className="p-2 hover:bg-gray-800">My Page</p>
                </a>
                <p className="p-2 font-md cursor-pointer hover:bg-gray-800" onClick={onClickLogout}>LogOut</p>
            </div>
        </div>
    );
}

