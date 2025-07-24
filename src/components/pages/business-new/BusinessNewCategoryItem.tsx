import React from "react";

interface CategoryItemProps {
    order: string;
    title: string;
    text: string;
}

export default function CategoryItem({ order, title, text }: CategoryItemProps) {
    return (
        <div className="w-full sm:w-[80%] md:w-[32%] md:min-h-[280px] rounded-tr-[30px] bg-[#F3F3F3] px-[20px] py-[40px] sm:p-[40px] mb-2">
            <div className="text-center mb-5">
                <h5 className="text-[30px] text-[#65B729] font-bold hyphen">{order}</h5>
                <h5 className="text-[18px] md:text-[22px] font-semibold text-center">{title}</h5>
            </div>
            <p className="text-[14px] tracking-[0.02em]">{text}</p>
        </div>
    );
} 