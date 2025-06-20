import { PickOption } from "@/utils/types";
import React, { InputHTMLAttributes } from "react";

interface CheckBoxGroup {
    name: string;
    options: PickOption[],
    direction?: 'row' | 'column',
    selectedValues: string[];
    onChangeOptions: (values: string[]) => void;
}

export default function CCheckBoxGroup({
    name,
    options,
    direction = 'row',
    selectedValues,
    onChangeOptions,
    ...props
}: CheckBoxGroup & InputHTMLAttributes<HTMLInputElement>) {

    const handleChangeOption = (value: string) => {
        const index = selectedValues.indexOf(value);
        if (index < 0) {
            onChangeOptions([...selectedValues, value])
        } else {
            selectedValues.splice(index, 1)
            onChangeOptions(selectedValues);
        }
    }

    return (
        <div className={`flex ${direction === 'row' ? 'flex-row flex-wrap' : 'flex-col'} gap-2`}>
            {options.map((option) => (
                <label
                    key={option.value}
                    className={`flex items-center gap-2 mr-2 rounded-xl cursor-pointer`}
                >
                    <input
                        type="checkbox"
                        name={name}
                        value={option.value}
                        checked={selectedValues.includes(option.value)}
                        onChange={() => handleChangeOption(option.value)}
                        className="accent-blue-500"
                        {...props}
                    />
                    <span className="text-base text-gray-400 hover:text-blue duration-300">{option.option}</span>
                </label>
            ))}
        </div>
    );
}