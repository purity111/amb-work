"use client";

import { TestimonialSectionProps } from '@/utils/types';

export default function TestimonialSection({ image, description1, description2, sections }: TestimonialSectionProps) {
    // Generate mobile version of image path
    const mobileImage = image.replace('/pc/', '/sp/');

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="max-w-4xl mx-auto">
                {/* Main Image Section */}
                <div className="relative mb-7 md:mb-9">

                    <div className="mx-8">
                        {/* Desktop Image */}
                        <img
                            src={image}
                            alt="Testimonial"
                            className="w-full md:w-[48%] h-auto m-auto object-cover rounded-lg shadow-lg hidden md:block"
                        />
                        {/* Mobile Image */}
                        <img
                            src={mobileImage}
                            alt="Testimonial"
                            className="w-full h-auto m-auto object-cover rounded-lg shadow-lg md:hidden"
                        />
                        <p className="text-center pt-[22px] text-[14px] md:text-[25px] font-bold">{description1}</p>
                        <p className="text-center text-[11px] md:text-[25px] font-bold">{description2}</p>
                    </div>
                </div>

                {/* Information Card */}
                <div className="bg-white border-[1px] border-[#1F86C3] rounded-2xl shadow-lg px-5 py-10 md:px-10 md:py-15">
                    {sections.map((section, index) => (
                        <div key={index}>
                            <h3 className="text-[15px] md:text-left text-center md:text-[25px] font-bold text-[#1F86C3] mb-2">
                                {section.title}
                            </h3>
                            <p className="leading-relaxed text-sm md:text-[20px]">
                                {section.description}
                            </p>
                            {index < sections.length - 1 && (
                                <hr className="md:border-[#D9D7D7] mt-5 mb-3 md:mt-9 md:mb-5 border-dashed md:border-solid" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
