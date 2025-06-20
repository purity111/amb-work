import React, { InputHTMLAttributes } from "react";

interface CInputProps {
    multiline?: boolean;
    height?: string;
    width?: string;
    className?: string;
    disabled?: boolean;
    isError?: boolean;
    errorText?: string;
}

export default function CInput({ multiline = false, height = 'h-[50px]', width = 'w-full', className, disabled = false, isError = false, errorText, ...props }: CInputProps & InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>) {
    const renderInput = () => {
        if (multiline) {
            return (
                <textarea
                    className={`
                        border rounded-lg px-4 py-2 focus:border-blue focus:outline-none focus:shadow-sm
                        ${className} 
                        ${isError ? 'border-red-400' : 'border-[#CCC]'}
                        ${height}
                        ${width}
                        ${disabled ? 'bg-gray-800' : 'bg-white'}
                    `}
                    disabled={disabled}
                    {...props}
                />
            );
        }
        return (
            <input
                className={`
                    border rounded-lg px-4 focus:border-blue focus:outline-none focus:shadow-sm
                    ${className}
                    ${isError ? 'border-red-400' : 'border-[#CCC]'}
                    ${height}
                    ${width}
                    ${disabled ? 'bg-gray-800' : 'bg-white'}
                `}
                disabled={disabled}
                {...props}
            />
        );
    }

    return (
        <div>
            {renderInput()}
            {isError && errorText && (
                <p className="text-red-400 text-[10px]">{errorText}</p>
            )}
        </div>
    )

}