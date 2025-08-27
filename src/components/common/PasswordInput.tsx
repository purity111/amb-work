import React, { useState, InputHTMLAttributes } from "react";
import CInput from "./Input";

interface PasswordInputProps {
    height?: string;
    width?: string;
    className?: string;
    wrapperClassName?: string;
    disabled?: boolean;
    isError?: boolean;
    errorText?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PasswordInput({ 
    height = 'h-[50px]', 
    width = 'w-full', 
    className, 
    wrapperClassName, 
    disabled = false, 
    isError = false, 
    errorText,
    placeholder,
    value,
    onChange,
    ...props 
}: PasswordInputProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>) {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={`relative ${wrapperClassName}`}>
            <CInput
                type={showPassword ? "text" : "password"}
                height={height}
                width={width}
                className={className}
                disabled={disabled}
                isError={isError}
                errorText={errorText}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                {...props}
            />
            <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer focus:outline-none"
                disabled={disabled}
            >
                {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                )}
            </button>
        </div>
    );
} 