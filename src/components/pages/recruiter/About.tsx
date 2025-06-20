import React from 'react';
import Image from 'next/image';
import { AboutProps } from '@/utils/types';

export default function About({ items, className = '' }: AboutProps) {
    return (
        <div className={`flex flex-wrap justify-center lg:grid lg:grid-cols-1 lg:grid-cols-3 gap-8 ${className}`}>
            {items.map((item, index) => (
                <div key={index} className="flex flex-col items-center text-center sm:w-[70%] md:w-[45%] lg:w-full" >
                    <div className="rounded-lg shadow-lg p-6 w-full relative md:min-h-86 xl:min-h-80 mb-10">
                        <Image
                            src="/images/recruiter/10.png"
                            alt="half_circle"
                            width={250}
                            height={130}
                            className="object-contain absolute top-0 left-1/2 -translate-x-1/2"
                        />
                        <div className="relative w-full aspect-square mb-14 mt-[-80px] h-42">
                            <Image
                                src={item.image}
                                alt={item.altText || (typeof item.title === 'string' ? item.title : 'About item')}
                                fill
                                className="object-contain"
                            />
                        </div>
                        <h3 className="text-[20px] md:text-[22px] font-bold mb-4 text-green whitespace-pre-line">
                            {item.title}
                        </h3>
                        <p className="text-[14px] md:text-[16px] tracking-[-0.07em] text-left">{item.text}</p>
                    </div>
                </div>
            ))}
        </div>
    );
} 