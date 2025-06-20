import React, { ButtonHTMLAttributes } from "react";

interface CButtonProps {
    text: string | React.ReactNode;
    className?: string
    size?: 'small' | 'normal' | 'large'
    leftIcon?: React.ReactElement
    rightIcon?: React.ReactElement
    hasNavIcon?: boolean
    navIconColor?: string;
}

export default function CButton({
    text,
    size = 'normal',
    className,
    leftIcon,
    rightIcon,
    hasNavIcon = false,
    navIconColor = 'white',
    ...props
}: CButtonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={`
                relative flex flex-row items-center justify-center rounded-lg cursor-pointer duration-1200 hover:opacity-80
                ${hasNavIcon ? `button-with-nav after:border-r-2 after:border-b-2 after:border-r-${navIconColor}` : ''}
                ${size === 'large' ? 'py-[15px] px-[20px]' : size === 'normal' ? 'py-[10px] px-[15px]' : 'py-[5px] px-[10px]'}
                ${className}
            `}
            {...props}
        >
            {leftIcon && <div className="mr-2">{leftIcon}</div>}
            {text}
            {rightIcon && <div className="ml-2">{rightIcon}</div>}
        </button>
    );
}