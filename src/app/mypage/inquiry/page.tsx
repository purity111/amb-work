"use client";

import Link from "next/link";

export default function MyPageInquiry() {
  return (
    <div className="flex flex-col p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">問い合わせ対応</h1>
      <div className="flex flex-col gap-4">
        <Link
          href="/mypage/inquiry/career"
          className="border border-blue-400 text-black hover:bg-blue-100 px-6 py-3 rounded-lg text-base transition-all duration-200"
        >
          キャリア相談
        </Link>
        <Link
          href="/mypage/inquiry/recruiter"
          className="border border-blue-400 text-black hover:bg-blue-100 px-6 py-3 rounded-lg text-base transition-all duration-200"
        >
          企業からの問い合わせ
        </Link>
        <Link
          href="/mypage/inquiry/contact"
          className="border border-blue-400 text-black hover:bg-blue-100 px-6 py-3 rounded-lg text-base transition-all duration-200"
        >
          お問い合わせ
        </Link>
      </div>
    </div>
  );
} 