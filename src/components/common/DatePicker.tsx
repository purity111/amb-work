import Image from "next/image";
import React from "react";
import DatePicker, { DatePickerProps, registerLocale } from "react-datepicker";
import { toJapaneseCalendar } from "wareki-tool-kit";
import { ja } from "date-fns/locale/ja";

registerLocale('ja', ja);

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
    // Get the selected date from props
    const selectedDate = props.selected instanceof Date ? props.selected : undefined;
    let warekiLabel = '';
    if (selectedDate) {
        // Format as yyyy-MM-dd for wareki-tool-kit
        const y = selectedDate.getFullYear();
        const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const d = String(selectedDate.getDate()).padStart(2, '0');
        warekiLabel = toJapaneseCalendar(`${y}-${m}-${d}`);
    }
    return (
        <div>
            <div className={`flex flex-row items-center border rounded-lg px-4 w-full ${isError ? 'border-red-400' : 'border-[#CCC]'} ${height} ${className}`}>
                <div className="flex-1">
                    <DatePicker
                        className="w-full outline-none bg-white"
                        locale="ja"
                        {...props}
                    />
                </div>
                <Image src="/svgs/calendar.svg" className="opacity-70" alt="calendar icon" width={20} height={20} />
            </div>
            {selectedDate && (
                <div className="text-xs text-gray-600 mt-1">{warekiLabel}</div>
            )}
            {isError && errorText && (
                <p className="text-red-400 text-[10px]">{errorText}</p>
            )}
        </div>
    );
}