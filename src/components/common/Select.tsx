import { PickOption } from "@/utils/types";
import React, { InputHTMLAttributes } from "react";

interface CSelectProps {
    options: PickOption[];
    width?: string;
    height?: string;
    className?: string;
    isError?: boolean;
    errorText?: string;
}

export default function CSelect({ options, width = 'w-full', height, className, isError = false, errorText, ...props }: CSelectProps & InputHTMLAttributes<HTMLSelectElement>) {
    return (
        <div>
            <div className="relative w-fit">
                <select
                    className={`relative appearance-none border rounded-lg px-4 py-2 focus:border-blue focus:outline-none focus:shadow-sm
                    ${isError ? 'border-red-400' : 'border-[#CCC]'}
                    ${props.disabled ? 'bg-gray-800' : 'bg-white'}
                    ${width} ${height || ''} ${className || ''}
                `}
                    {...props}
                >
                    {options.map(option => (
                        <option key={option.value} value={option.value}>{option.option}</option>
                    ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                    <div className={`h-2 w-2  border-r-2 border-b-2 border-gray-600 duration-400 rotate-45`} />
                </div>
            </div>
            {isError && errorText && (
                <p className="text-red-400 text-[10px]">{errorText}</p>
            )}
        </div>
    );
}