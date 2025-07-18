'use client'

import { useState, useEffect, Suspense } from "react";
import Sidebar from '@/components/Sidebar';
import useWindowSize from "@/hooks/useWindowSize";
import { AuthProvider } from "@/app/layout";
import { useAuthContext } from '@/app/layout';
import LoginModal from '@/components/modal/Login';
import { useRouter, usePathname } from 'next/navigation';


export default function MyPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isOpen, setIsOpen] = useState(false);
  const [width] = useWindowSize();
  const { isAuthenticated } = useAuthContext();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOpen(width >= 768);
    }
  }, [width]);

  useEffect(() => {
    if (typeof window !== 'undefined' && !isAuthenticated) {
      // If not authenticated and not already on the top page, redirect and show login modal
      if (pathname.startsWith('/mypage')) {
        window.location.href = '/';
        setShowLoginModal(true);
      }
    }
  }, [isAuthenticated, pathname, router]);

  // Show login modal if redirected
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('login') === '1') {
        setShowLoginModal(true);
      }
    }
  }, []);

  return (
    <AuthProvider>
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
        {showLoginModal && (
          <LoginModal onClose={() => setShowLoginModal(false)} onSuccess={() => setShowLoginModal(false)} />
        )}
      </div>
    </AuthProvider>
  );
}
