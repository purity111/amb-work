import Link from 'next/link';
import React from 'react';

interface PrivacyPolicyCheckboxProps {
    text: string;
    link: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    error?: string;
}

export default function PrivacyPolicyCheckbox({
    text,
    link,
    checked,
    onChange,
    error
}: PrivacyPolicyCheckboxProps) {
    return (
        <div>
            <div className="flex mb-4">
                <label className="flex m-auto items-center space-x-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => onChange(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm">
                        <Link
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                        >
                            {text}
                        </Link>
                        に同意する
                    </span>
                </label>
            </div>
            {error && (
                <p className="mt-1 text-xs text-center text-red-600">{error}</p>
            )}
        </div>
    );
} 