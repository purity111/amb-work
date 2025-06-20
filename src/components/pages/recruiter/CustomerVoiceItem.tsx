import React from 'react';
import Image from 'next/image';
import { CustomerVoiceItemData } from '@/utils/types';

interface CustomerVoiceItemProps {
    item: CustomerVoiceItemData;
}

export default function CustomerVoiceItem({ item }: CustomerVoiceItemProps) {
    return (
        <div className="flex flex-col sm:flex-row items-center gap-6 bg-white border-b-1 border-[#DFDFDF] p-6">
            <div className="relative w-[90%] sm:w-full md:w-1/3 lg:w-1/4 aspect-video rounded-tr-[40px] overflow-hidden">
                <Image
                    src={item.image}
                    alt={item.altText || item.title}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="w-full md:w-2/3 lg:w-3/4 text-center md:text-left">
                <p className="mb-2">{item.title}</p>
                <h3 className="text-lg md:text-xl font-bold mb-4">{item.position}</h3>
                <p className="">{item.text}</p>
            </div>
        </div>
    );
} 