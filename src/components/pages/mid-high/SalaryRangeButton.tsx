import React from "react";
import Image from "next/image";

interface SalaryRangeButtonProps {
    imageUrl: string;
    className?: string;
}

const SalaryRangeButton: React.FC<SalaryRangeButtonProps> = ({
    imageUrl,
    className = "",
}) => {
    return (
        <div
            className={`relative flex items-center justify-start bg-[#22305A] md:w-[500px] py-3 min-h-[60px] px-10 md:px-16 py-3 min-w-[180px] font-serif ${className}`}
        >
            {/* Left dot and line */}
            <span className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center">
                <span className="w-8 h-px bg-white"></span>
                <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
            </span>
            <div className="relative">
                <span className="flex items-center justify-center w-[280px] h-[25px] md:w-[350px] h-[40px]">
                    <Image
                        src={imageUrl}
                        alt="Salary Range"
                        fill
                        // style={{ objectFit: 'contain', height: '2.5rem', width: 'auto' }}
                        priority
                    />
                </span>
            </div>
        </div>
    );
};

export default SalaryRangeButton; 