import { PickOption } from "@/utils/types";
import React, { InputHTMLAttributes } from "react";

interface RadioGroup {
    name: string;
    options: PickOption[],
    direction?: 'row' | 'column',
    value: string;
    className?: string;
    onChange: (value: string) => void;
}

export default function CRadioGroup({
    name,
    options,
    direction = 'row',
    value,
    className,
    onChange,
    ...props
}: RadioGroup & InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div className={`flex ${direction === 'row' ? 'flex-row flex-wrap' : 'flex-col'} gap-2`}>
            {options.map((option) => (
                <label
                    key={option.value}
                    className={`${className} flex items-center gap-2 ${direction === 'row' ? 'py-3' : 'py-1'} mr-2 rounded-xl cursor-pointer `}
                >
                    <input
                        type="radio"
                        name={name}
                        value={option.value}
                        checked={value === option.value}
                        onChange={() => onChange(option.value)}
                        className="accent-blue-500"
                        {...props}
                    />
                    <span className="text-sm">{option.option}</span>
                </label>
            ))}
        </div>
    );
}