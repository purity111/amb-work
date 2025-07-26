import { PickOption } from "@/utils/types";
import React, { InputHTMLAttributes, useState, useEffect } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";

interface BirthDateSelectProps {
    options: PickOption[];
    width?: string;
    className?: string;
    isError?: boolean;
    errorText?: string;
    placeholder?: string;
}

export default function BirthDateSelect({ options, width = 'w-full', className, isError = false, errorText, placeholder, ...props }: BirthDateSelectProps & InputHTMLAttributes<HTMLSelectElement>) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<PickOption | null>(null);
    const dropdownRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

    useEffect(() => {
        const find = options.find(i => i.value === props.value);
        if (find) setSelectedOption(find);
    }, [props.value, options]);

    const handleSelect = (option: PickOption) => {
        setSelectedOption(option);
        setIsOpen(false);
        if (props.onChange) {
            const event = {
                target: { value: option.value }
            } as React.ChangeEvent<HTMLSelectElement>;
            props.onChange(event);
        }
    };

    return (
        <div>
            <div className="relative w-full">
                <div
                    ref={dropdownRef}
                    className={`relative appearance-none border rounded-lg px-4 py-2 focus:border-blue focus:outline-none focus:shadow-sm cursor-pointer
                    ${isError ? 'border-red-400' : 'border-[#CCC]'}
                    ${props.disabled ? 'bg-gray-800' : 'bg-white'}
                    ${width} ${className}
                `}
                    onClick={() => !props.disabled && setIsOpen(!isOpen)}
                >
                    <div className="flex justify-between items-center">
                        <span className={selectedOption ? 'text-black' : 'text-gray-500'}>
                            {selectedOption ? selectedOption.option : placeholder || ''}
                        </span>
                        <div className="pointer-events-none">
                            <div className={`h-2 w-2 border-r-2 border-b-2 border-gray-600 duration-400 rotate-45 ${isOpen ? 'rotate-[225deg]' : ''}`} />
                        </div>
                    </div>
                    
                    {isOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-28 overflow-y-auto">
                            {options.map(option => (
                                <div
                                    key={option.value}
                                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                                    onClick={() => handleSelect(option)}
                                >
                                    {option.option}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {isError && errorText && (
                <p className="text-red-400 text-[10px]">{errorText}</p>
            )}
        </div>
    );
} 