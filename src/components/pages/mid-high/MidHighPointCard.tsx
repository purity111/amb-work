import React from "react";
import Image from "next/image";

interface MidHighPointCardProps {
  number: number;
  label: string;
  imageUrl: string;
  title: string;
  description: string;
}

const MidHighPointCard: React.FC<MidHighPointCardProps> = ({ number, label, imageUrl, title, description }) => {
  return (
    <div className="flex flex-col items-center w-full max-w-xs mx-auto">
      <div className="text-xs text-[#22305A] tracking-widest mb-1 mt-2">{label}</div>
      <div className="text-6xl font-bold text-[#22305A] leading-none mb-2">{number.toString().padStart(2, '0')}</div>
      <div className="w-6 h-[2px] bg-[#22305A] mb-4" />
      <div className="w-full rounded-2xl overflow-hidden mb-4 aspect-[1.2/1] bg-gray-100">
        <Image src={imageUrl} alt={description} width={360} height={225} className="object-cover w-full h-full" />
      </div>
      <h4 className="text-lg font-bold text-center">{title}</h4>
      <p className="text-sm md:text-base text-center pt-3">{description}</p>
    </div>
  );
};

export default MidHighPointCard; 