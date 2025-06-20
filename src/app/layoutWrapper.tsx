'use client'

import { Noto_Sans_JP } from 'next/font/google'
import "./globals.css";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ZKGN = Noto_Sans_JP({ subsets: ['latin'] })

export default function LayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={ZKGN.className}>
        {children}
      </body>
    </html>
  );
}
