import Image from "next/image";
import React from "react";

interface CircleTextItemProps {
    text: string;
    imageUrl: string;
    altText: string;
}

export default function CircleTextItem({ text, imageUrl, altText }: CircleTextItemProps) {
    return (
        <div className="flex flex-col items-center text-center w-[45%] lg:w-[22%]"> {/* Flex column for text and image, width adjustment for responsiveness */}
            {/* Circular text background */}
            <div className="bg-[#F8F8F8] rounded-full w-40 h-40 md:w-45 md:h-45 flex items-center justify-center mb-4 shadow-md"> {/* Added size, flex properties, padding, margin, shadow */}
                <p className="whitespace-pre-line text-base">{text}</p> {/* Adjusted text size, kept gray-700 */}
            </div>
            {/* Image below the text circle */}
            <div className="relative w-32 h-51 -mt-10"> {/* This is the parent container */}
                <Image
                    src={imageUrl}
                    alt={altText}
                    fill // Image will fill its parent container
                    className="object-contain" // Image content will be scaled to fit without stretching
                />
            </div>
        </div>
    );
} 