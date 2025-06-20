"use client";

import React, { AnchorHTMLAttributes } from "react";

interface LinkButtonProps {
    text: string;
    className?: string;
    hasNavIcon?: boolean;
    to?: string;
    icon?: string;
}

export default function LinkButton({
    text,
    className,
    hasNavIcon = false,
    to,
    icon,
    ...props
}: LinkButtonProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
    return (
        <a
            href={to}
            className={`
                relative inline-flex flex-row items-center justify-center rounded-lg cursor-pointer
                transition-all duration-300 ease-in-out
                hover:opacity-90
                text-base
                px-[12px] py-[15px] sm:px-[15px] sm:py-[20px]
                ${hasNavIcon ? `
                    pr-8 sm:pr-12
                    after:content-[""] 
                    after:inline-block 
                    after:w-[8px]
                    after:h-[8px]
                    after:border-r-[2px] 
                    after:border-b-[2px] 
                    after:border-r-white 
                    after:border-b-white 
                    after:rotate-[-45deg] 
                    after:absolute 
                    after:top-[calc(50%-3px)] 
                    after:right-4 sm:after:right-6
                    after:transition-transform 
                    after:duration-300
                    hover:after:translate-x-1
                ` : ''}
                whitespace-nowrap
                ${className}
            `}
            {...props}
        >
            {icon && (
                <img
                    src={`/images/icons/${icon}`}
                    alt={text}
                    className="w-6 h-6 mr-3"
                />
            )}
            {text}
        </a>
    );
} 