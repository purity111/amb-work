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

  return (
    <html lang="ja">
      {/* 👇 Apply the custom font class to <body> */}
      <body className={inter.className}>
        <LayoutWrapper>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <Header />
              {children}
              <FixedBottomBar />
              <ToastContainer hideProgressBar={true} />
            </AuthProvider>
          </QueryClientProvider>
        </LayoutWrapper>
      </body>
    </html>
  );
}
