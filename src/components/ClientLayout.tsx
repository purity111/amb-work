'use client';

import { ToastContainer } from "react-toastify";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from "@/components/Header";
import FixedBottomBar from "@/components/FixedBottomBar";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/hooks/useAuthContext";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();
  
  // Hide FixedBottomBar on /job-openings/recruit/[id] page
  const hideFixedBottomBar =
    ["/job-openings/recruit/", "/mypage"].some(prefix => pathname?.startsWith(prefix));
  
  // Hide Header on campaign page
  const hideHeader = pathname?.startsWith("/recycle-tsushin-25summer_campaign");

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {!hideHeader && <Header />}
        {children}
        {!hideFixedBottomBar && <FixedBottomBar />}
        <ToastContainer hideProgressBar={true} />
      </AuthProvider>
    </QueryClientProvider>
  );
}
