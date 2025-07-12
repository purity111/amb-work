import Image from "next/image";
import React from "react";
import DatePicker, { DatePickerProps } from "react-datepicker";

interface CDatePickerProps {
    isError?: boolean;
    errorText?: string;
    height?: string;
    className?: string;
}

export default function CDatePicker({
    isError,
    errorText,
    height = 'h-[50px]',
    className = '',
    ...props
}: CDatePickerProps & DatePickerProps) {
    return (
        <div>
            <div className={`flex flex-row items-center border rounded-lg px-4 w-full ${isError ? 'border-red-400' : 'border-[#CCC]'} ${height} ${className}`}>
                <div className="flex-1">
                    <DatePicker
                        className="w-full outline-none bg-white"
                        {...props}
                    />
                </div>
                <Image src="/svgs/calendar.svg" className="opacity-70" alt="calendar icon" width={20} height={20} />
            </div>
            {isError && errorText && (
                <p className="text-red-400 text-[10px]">{errorText}</p>
            )}
        </div>
    );
}