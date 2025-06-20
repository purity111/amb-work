import React from 'react';

interface FormFieldProps {
    label: string;
    type?: 'text' | 'email' | 'tel';
    required?: boolean;
    className?: string;
    component?: 'input' | 'textarea';
    rows?: number;
}

export default function FormField({
    label,
    type = 'text',
    required = false,
    className = '',
    component = 'input',
    rows = 4,
    ...props
}: FormFieldProps & React.InputHTMLAttributes<HTMLInputElement> & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-10">
            <label className="block mb-2">
                {label}
                {required && <span className="ml-1 bg-red-500 text-white px-1 py-[2px]">必須</span>}
            </label>
            {component === 'textarea' ? (
                <textarea
                    className={`w-full flex border-[#cccccc] md:max-w-[450px] lg:max-w-[600px] border rounded-lg p-2 ${className}`}
                    required={required}
                    rows={rows}
                    {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
                />
            ) : (
                <input 
                    type={type}
                    className={`w-full flex border-[#cccccc] md:max-w-[450px] lg:max-w-[600px] border rounded-lg p-2 ${className}`} 
                    required={required} 
                    {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
                />
            )}
        </div>
    );
} 