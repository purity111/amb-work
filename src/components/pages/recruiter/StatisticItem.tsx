import Image from "next/image";
import React from "react";
import { StatisticItemData } from "@/utils/types";

interface StatisticItemProps extends StatisticItemData {
    step: number;
    isStep?: boolean;
}

export default function StatisticItem({ step, image, altText, text, isStep }: StatisticItemProps) {
    return (
        <div className="p-6 text-center max-w-[360px] m-auto md:m-0">
            {isStep && <p className="text-[16px] text-green font-bold">STEP</p>}
            <p className="text-[30px] text-green font-bold hyphen">0{step}</p>
            <div className="bg-white rounded-lg shadow-lg relative w-full aspect-square mb-4">
                <Image
                    src={image}
                    alt={altText}
                    fill
                    className="object-contain"
                />
            </div>
            <p className="whitespace-pre-line">{text}</p>
        </div>
    );
} 