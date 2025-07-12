import React from "react";

interface RedRegisterButtonProps {
  label?: string;
  children: React.ReactNode;
  href?: string;
  className?: string;
}

export default function RedRegisterButton({
  label = "無料登録はこちら",
  children,
  href = "/register",
  className = "",
}: RedRegisterButtonProps) {
  return (
    <div className="relative max-w-[500px] w-full flex justify-center items-center">
      {/* Floating label */}
      <div className="absolute -top-4 z-10 px-6 py-1 bg-white rounded-full shadow text-[#b80000] text-sm font-bold border border-[#e5e5e5]">
        {label}
      </div>
      <a
        href={href}
        className={`w-full flex items-center justify-center gap-2 py-5 px-4 rounded-xl shadow-lg bg-gradient-to-b from-[#b80000] to-[#a10000] hover:opacity-90 transition font-bold text-white text-xl outline-none focus:ring-2 focus:ring-red-400 ${className}`}
        role="button"
        tabIndex={0}
      >
        {/* User-plus icon (inline SVG) */}
        <span className="inline-flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm8-1v-2h-2v-2h-2v2h-2v2h2v2h2v-2h2z" fill="#fff"/>
          </svg>
        </span>
        <span>{children}</span>
      </a>
    </div>
  );
} 