import Image from "next/image";
import React from "react";
import DatePicker, { DatePickerProps } from "react-datepicker";

interface CDatePickerProps {
    isError?: boolean;
    errorText?: string;
}

export default function CDatePicker({
    isError,
    errorText,
    ...props
}: CDatePickerProps & DatePickerProps) {
    return (
        <div>
            <div className="flex flex-row items-center border-1 border-gray-700 w-fit rounded-sm p-1">
                <div className="flex-1">
                    <DatePicker
                        className="px-2 py-1 outline-none w-40"
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