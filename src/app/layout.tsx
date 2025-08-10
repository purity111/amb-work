'use client';

import { ToastContainer } from "react-toastify";
import { createContext, useContext, useState } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from "@/components/Header";
import FixedBottomBar from "@/components/FixedBottomBar";
import { useAuth } from "@/hooks/useAuth";
import LayoutWrapper from "./layoutWrapper";
import "./globals.css";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "react-datepicker/dist/react-datepicker.css";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import Head from "next/head";

const AuthContext = createContext<ReturnType<typeof useAuth> | null>(null);

// 👇 Load Google Font
const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used within AuthProvider');
  return context;
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();
  // Hide FixedBottomBar on /jobs/recruit/[id] page
  const hideFixedBottomBar =
    ["/jobs/recruit/", "/mypage"].some(prefix => pathname?.startsWith(prefix));

  return (
    <html lang="ja">
      <Head>
        {/* Comprehensive favicon configuration to prevent flashing */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="180x180" href="/favicon-180x180.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon-180x180.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon-180x180.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileImage" content="/favicon-180x180.png" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AMB" />
        {/* Preload favicon files for faster loading */}
        <link rel="preload" href="/favicon.ico" as="image" type="image/x-icon" />
        <link rel="preload" href="/favicon-32x32.png" as="image" type="image/png" />
        {/* Inline favicon as immediate fallback */}
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚀</text></svg>" />
        
        {/* Page Title and SEO */}
        <title>AMB - 転職支援サービス | あなたの次のキャリアチャンスを見つけましょう</title>
        <meta name="description" content="AMB転職支援サービス - あなたの次のキャリアチャンスを見つけましょう。豊富な求人情報とキャリアコンサルティングで、理想の転職をサポートします。" />
        <meta name="keywords" content="転職, 求人, キャリア, 就職, 仕事, 転職支援, キャリアコンサルティング, 求人情報" />
        <meta name="author" content="AMB" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://amb.com/" />
        <meta property="og:title" content="AMB - 転職支援サービス | あなたの次のキャリアチャンスを見つけましょう" />
        <meta property="og:description" content="AMB転職支援サービス - あなたの次のキャリアチャンスを見つけましょう。豊富な求人情報とキャリアコンサルティングで、理想の転職をサポートします。" />
        <meta property="og:image" content="/images/logo.png" />
        <meta property="og:site_name" content="AMB" />
        <meta property="og:locale" content="ja_JP" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://amb.com/" />
        <meta name="twitter:title" content="AMB - 転職支援サービス | あなたの次のキャリアチャンスを見つけましょう" />
        <meta name="twitter:description" content="AMB転職支援サービス - あなたの次のキャリアチャンスを見つけましょう。豊富な求人情報とキャリアコンサルティングで、理想の転職をサポートします。" />
        <meta name="twitter:image" content="/images/logo.png" />
        
        {/* Additional SEO */}
        <meta name="application-name" content="AMB" />
        <meta name="apple-mobile-web-app-title" content="AMB" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="canonical" href="https://amb.com/" />
      </Head>
      {/* 👇 Apply the custom font class to <body> */}
      <body className={inter.className}>
        <LayoutWrapper>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <Header />
              {children}
              {!hideFixedBottomBar && <FixedBottomBar />}
              <ToastContainer hideProgressBar={true} />
            </AuthProvider>
          </QueryClientProvider>
        </LayoutWrapper>
      </body>
    </html>
  );
}
