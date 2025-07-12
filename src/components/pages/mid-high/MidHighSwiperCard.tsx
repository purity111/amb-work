import React from "react";

interface MidHighSwiperCardProps {
  category: string;
  title: string;
  salaryMin: number;
  salaryMax: number;
  salaryUnit: string;
  descriptionTitle: string;
  description: string;
}

const MidHighSwiperCard: React.FC<MidHighSwiperCardProps> = ({
  category,
  title,
  salaryMin,
  salaryMax,
  descriptionTitle,
  description,
}) => {
  return (
    <div className="rounded-tl-[32px] shadow-md overflow-hidden flex flex-col w-[320px] md:w-[320px] min-h-[350px] bg-[#f8f8f8]">
      {/* Header */}
      <div className="bg-[#22305A] text-white py-6 px-2 flex flex-col items-center">
        <div className="text-sm font-light tracking-widest mb-1 hyphen">{category}</div>
        <div className="text-lg font-bold text-center leading-tight">{title}</div>
      </div>
      {/* Salary */}
      <div className="flex flex-col items-center py-4 pt-0 px-6">
        <div className="text-[#22305A] text-base my-6">年収 <span className="text-[#B80000] text-2xl font-bold">{salaryMin}</span>万円〜<span className="text-[#B80000] text-2xl font-bold">{salaryMax}</span>万円</div>
        {/* Description Title */}
        <div className="w-full bg-[#9E7F41] text-white text-center font-bold py-2 rounded mb-2">{descriptionTitle}</div>
        {/* Description */}
        <div className="text-[#222] text-sm whitespace-pre-line w-full text-left leading-[1.5] pt-2">{description}</div>
      </div>
    </div>
  );
};

export default MidHighSwiperCard; 