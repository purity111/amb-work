'use client'

import { useState, useEffect, Suspense } from "react";
import Sidebar from '@/components/Sidebar';
import useWindowSize from "@/hooks/useWindowSize";
import { AuthProvider, useAuthContext } from "@/hooks/useAuthContext";
import FaviconEnforcer from "@/components/FaviconEnforcer";
import { useRouter } from "next/navigation";


export default function MyPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isOpen, setIsOpen] = useState(false);
  const [width] = useWindowSize();
  const router = useRouter();
  const { isAuthenticated } = useAuthContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOpen(width >= 768);
    }
  }, [width]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) {
      const currentUrl = typeof window !== 'undefined' ? (window.location.pathname + window.location.search) : '/mypage';
      router.replace(`/?auth=login&redirectTo=${encodeURIComponent(currentUrl)}`);
    }
  }, [mounted, isAuthenticated, router]);

  return (
    <AuthProvider>
      <FaviconEnforcer />
      {mounted && isAuthenticated && (
        <div className="flex flex-row min-h-screen max-w-full">
          <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
          <main
            className={`
              flex-1 flex-grow transition-all duration-300 ease-in-out pt-20 md:pt-25 overflow-x-hidden
              ${isOpen ? 'md:ml-64 bg-blue-100 md:w-[calc(100%-256px)] xl:ml-80 xl:w-[calc(100%-320px)]' : 'md:ml-0 w-full'}
            `}
          >
            <Suspense>
              {children}
            </Suspense>
          </main>
        </div>
      )}
    </AuthProvider>
  );
}
