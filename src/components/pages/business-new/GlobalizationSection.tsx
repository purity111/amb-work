'use client'

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface GlobalizationSectionProps {
    order: string;
    title: string;
    image: string;
    imageAlt: string;
    sections?: {
        title: string;
        content: string[];
    }[];
    links?: {
        title: string;
        href: string;
    }[];
}

const GlobalizationSection: React.FC<GlobalizationSectionProps> = ({
    title,
    order,
    image,
    sections = [],
    links = []
}) => {
    return (
        <div className="max-w-[472px] mx-auto px-[20px] py-[40px] md:p-[40px] border border-[#dfdfdf] rounded-tr-[30px] mb-10 md:mb-0">
            {/* Title Section */}
            <div className="flex items-center justify-center">
                <span className="mx-4 text-[#65B729] font-bold text-[30px] hyphen">{order}</span>
            </div>

            <h2 className="text-[18px] md:text-[22px] font-bold text-center mb-8">{title}</h2>

            {/* Main Image */}
            <div className="w-full flex justify-center mb-12">
                <Image
                    src={image}
                    alt="About Business"
                    width={390}
                    height={197}
                    className="rounded-lg object-cover w-full h-auto"
                    priority
                />
            </div>

            {/* Text Sections */}
            {sections && sections.length > 0 && (
                <div className="space-y-8">
                    {sections.map((section, index) => (
                        <div key={index} className="">
                            <h3 className="text-[14px] font-bold flex items-center">
                                {section.title}
                            </h3>
                            <div className="pl-5">
                                {section.content.map((paragraph, pIndex) => (
                                    <p key={pIndex} className="text-sm">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* More Details Section */}
            {links && links.length > 0 && (
                <div className="pt-8">
                    <p className="text-sm">もっと詳しく↓</p>
                    <div className="space-y-3">
                        {links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                className="block text-sm text-[#65B729] underline transition-colors"
                            >
                                {link.title}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GlobalizationSection; 