import React, { useState } from "react";

interface CollapsibleItemProps {
    title: string;
    children: React.ReactNode
}

export default function CollapsibleItem({ title, children }: CollapsibleItemProps) {
    const [open, setOpen] = useState(false);

    return (
        <div className="overflow-hidden">
            <div className="flex flex-row justify-between items-center">
                <span className="text-gray-400 font-bold text-sm">{title}</span>
                <button
                    onClick={() => setOpen(!open)}
                    className="w-8 h-8 relative flex items-center justify-center text-2xl font-bold focus:outline-none"
                >
                    <span className={`collapse-btn ${open ? 'active' : ''}`} />
                    {/* <span className={`absolute transition-opacity duration-300 ease-in-out ${open ? 'opacity-100' : 'opacity-0 -rotate-90 scale-75'}`}>−</span> */}
                </button>
            </div>
            <div
                className={`transition-[max-height] duration-500 ease-in-out overflow-hidden ${open ? 'max-h-96' : 'max-h-0'
                    }`}
            >
                <div className="pl-4 text-sm text-gray-300">
                    {children}
                </div>
            </div>
        </div>
    );
}