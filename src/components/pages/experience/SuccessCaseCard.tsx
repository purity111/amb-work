import React from 'react';
import Image from 'next/image';

interface SuccessCaseCardProps {
  caseNo: string;
  caseTitle: string;
  caseSubtitle: string;
  tag: string;
  image: string;
  description: string;
}

const SuccessCaseCard: React.FC<SuccessCaseCardProps> = ({
  caseNo,
  caseTitle,
  caseSubtitle,
  tag,
  image,
  description,
}) => {
  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center text-center">
      <div className="text-[#65B729] font-bold text-lg mb-2">{caseNo}</div>
      <div className="font-bold text-[18px] md:text-[20px] mb-1">{caseTitle}</div>
      <div className="text-[16px] md:text-[18px] font-semibold">{caseSubtitle}</div>
      <div className="my-4 md:my-8">
        <span className="inline-block border border-gray-400 rounded px-3 py-1 text-xs bg-white">{tag}</span>
      </div>
      <div className="mb-4">
        <div className="w-[200px] h-[200px] mx-auto rounded-full overflow-hidden">
          <Image src={image} alt={caseTitle} width={200} height={200} className="object-cover w-full h-full" />
        </div>
      </div>
      <div className="text-[14px] md:text-base leading-relaxed">{description}</div>
    </div>
  );
};

export default SuccessCaseCard; 