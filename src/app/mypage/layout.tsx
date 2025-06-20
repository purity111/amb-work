'use client'

import { useState, useEffect } from "react";
import Sidebar from '@/components/Sidebar';
import useWindowSize from "@/hooks/useWindowSize";


export default function MyPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isOpen, setIsOpen] = useState(false);
  const [width] = useWindowSize();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOpen(width >= 768);
    }
  }, [width]);

  return (
    <div className="flex flex-row min-h-screen max-w-full">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <main
        className={`
          flex-1 flex-grow transition-all duration-300 ease-in-out pt-20 md:pt-25
          ${isOpen ? 'md:ml-64 md:w-[calc(100%-256px)] xl:ml-80 xl:w-[calc(100%-320px)]' : 'md:ml-0 w-full'}
        `}
      >
        {children}
      </main>
    </div>
  );
}
