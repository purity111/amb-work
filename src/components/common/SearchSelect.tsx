import { PickOption } from "@/utils/types";
import React, { ChangeEvent, useEffect, useState } from "react";
import CInput from "./Input";
import { useClickOutside } from "@/hooks/useClickOutside";

interface CSearchSelectProps {
    value: string;
    options: PickOption[];
    width?: string;
    className?: string;
    searchable?: boolean;
    isError?: boolean;
    disabled?: boolean;
    errorText?: string;
    onChange: (value: string) => void;
}

export default function CSearchSelect({ value, options, width = 'w-full', className, searchable = false, isError = false, disabled = false, errorText, onChange }: CSearchSelectProps) {
    const [searchText, setSearchText] = useState('');
    const [selected, setSelected] = useState<PickOption | null>(null);
    const [dropdownHidden, setDropdownHidden] = useState(true);

    const dropdownRef = useClickOutside<HTMLDivElement>(() => setDropdownHidden(true));

    useEffect(() => {
        const find = options.find(i => i.value === value);
        if (find) setSelected(find);
    }, [])

    const onChangeSearchTerm = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const onSelectOption = (option: PickOption) => {
        setSelected(option);
        onChange(option.value);
        setDropdownHidden(true);
    }

    const handleInputClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevents click from reaching parent
        console.log('Input clicked');
    };

    return (
        <div>
            <div
                ref={dropdownRef}
                className={`relative h-10 border rounded-lg px-4 pr-8 py-2 focus:border-blue focus:outline-none focus:shadow-sm
                    ${isError ? 'border-red-400' : 'border-[#CCC]'}
                    ${disabled ? 'bg-gray-800' : 'bg-white'}
                    ${width} ${className}
                    ${dropdownHidden ? 'overflow-hidden' : 'overflow-visible'}
                `}
                onClick={() => setDropdownHidden(!dropdownHidden)}
            >
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                    <div className={`h-2 w-2 border-r-2 border-b-2 border-gray-600 duration-400 rotate-45`} />
                </div>
                <div >
                    <p className="truncate whitespace-nowrap overflow-hidden">{selected?.option}</p>
                </div>
                <div className={`absolute top-10 left-0 border border-[#CCC] bg-white min-w-full max-h-50 z-1000 flex flex-col`}>
                    {searchable && (
                        <div className="p-2 flex items-center" onClick={handleInputClick}>
                            <CInput
                                placeholder="検索"
                                height="h-10"
                                className="flex-1 max-w-[180px] sm:max-w-full"
                                wrapperClassName="flex-1"
                                value={searchText}
                                onChange={onChangeSearchTerm}

                            />
                            <button
                                className="w-10 h-10 font-bold text-2xl text-gray-500 hover:text-gray-300 rounded-full cursor-pointer"
                                onClick={() => setSearchText('')}
                            >
                                &times;
                            </button>
                        </div>
                    )}
                    <div className="flex-1 overflow-y-auto">
                        {options.map(option => {
                            if (!option.option.toLowerCase().includes(searchText.toLowerCase())) return null;
                            return (
                                <p key={option.value} className="cursor-pointer hover:bg-blue/30 py-1 px-2" onClick={() => onSelectOption(option)}>
                                    {option.option}
                                </p>
                            )
                        })}
                    </div>
                </div>
            </div>
            {isError && errorText && (
                <p className="text-red-400 text-[10px]">{errorText}</p>
            )}
        </div>
    );
}