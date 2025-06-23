import Image from "next/image";
import React from "react";

interface PointItemProps {
    order: string;
    text: string;
}

export default function PointItem({ order, text }: PointItemProps) {
    return (
        <div className="w-full sm:w-[80%] md:w-[32%] rounded-tr-[30px] bg-[#F3F3F3] px-[20px] py-[40px] sm:p-[40px] mb-2">
            <h5 className="text-[13px] text-[#65B729] text-center font-bold">POINT</h5>
            <div className="text-center">
                <h5 className="text-[30px] text-[#65B729] font-bold hyphen mb-[20px]">{order}</h5>
            </div>
            <p className="text-[14px] tracking-[0.02em]">{text}</p>
        </div>
    );
} 