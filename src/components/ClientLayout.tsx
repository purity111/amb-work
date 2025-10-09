'use client';

import { ToastContainer } from "react-toastify";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from "@/components/Header";
import FixedBottomBar from "@/components/FixedBottomBar";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/hooks/useAuthContext";
import { NotificationProvider } from "@/hooks/useNotificationContext";
import { useGlobalNotifications } from "@/hooks/useGlobalNotifications";

// Component to handle global notifications
function GlobalNotificationHandler() {
  console.log('GlobalNotificationHandler: Component rendered');
  useGlobalNotifications();
  return null;
}

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();
  
  // Hide FixedBottomBar on /job-openings/recruit/[id] page, /mypage, and campaign/landing pages
  const hideFixedBottomBar =
    ["/job-openings/recruit/", "/mypage"].some(prefix => pathname?.startsWith(prefix)) ||
    pathname?.startsWith("/recycle-tsushin-25summer_campaign") || 
    pathname === "/recycle-tsushin-26new_plan" || pathname === "/recycle-tsushin-26new_plan/";
  
  // Hide FixedBottomBar in mobile mode on /job-openings page (but not on recruit pages)
  const hideFixedBottomBarInMobile = (pathname === "/job-openings" || pathname?.startsWith("/job-openings/")) && !pathname?.startsWith("/job-openings/recruit/");
  
  // Hide Header on campaign page and landing page
  const hideHeader = pathname?.startsWith("/recycle-tsushin-25summer_campaign") || pathname === "/recycle-tsushin-26new_plan" || pathname === "/recycle-tsushin-26new_plan/";
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <GlobalNotificationHandler />
          {!hideHeader && <Header />}
          {children}
          {!hideFixedBottomBar && <FixedBottomBar hideInMobile={hideFixedBottomBarInMobile} />}
          <ToastContainer 
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            style={{
              zIndex: 9999,
              fontSize: '14px'
            }}
          />
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
