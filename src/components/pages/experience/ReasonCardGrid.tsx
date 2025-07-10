import React from 'react';

interface ReasonCardGridProps {
  items: string[];
}

const ReasonCardGrid: React.FC<ReasonCardGridProps> = ({ items }) => {
  return (
    <div className="w-full flex flex-col items-center">
      {/* First row: 3 cards */}
      <div className="flex flex-col md:flex-row justify-center gap-6 w-full mb-6">
        {items.slice(0, 3).map((item, idx) => (
          <div
            key={idx}
            className={`flex-1 p-8 rounded-2xl text-center min-h-[170px] flex flex-col items-center justify-center ${idx === 0 ? 'rounded-tl-[40px]' : ''} ${idx % 2 === 0 ? 'bg-[#ffffde]' : 'bg-[#ffffed]'}`}
            style={{ maxWidth: 400 }}
          >
            <div className="text-[#65B729] hyphen font-bold text-[30px]">{`0${idx + 1}`}</div>
            <div className="text-[18px] font-semibold leading-relaxed whitespace-pre-line">{item}</div>
          </div>
        ))}
      </div>
      {/* Second row: 2 cards, centered */}
      <div className="flex flex-col md:flex-row justify-center gap-6 w-full">
        {items.slice(3, 5).map((item, idx) => (
          <div
            key={idx + 3}
            className={`flex-1 p-8 rounded-2xl text-center min-h-[170px] flex flex-col items-center justify-center ${(idx + 3) % 2 === 0 ? 'bg-[#ffffde]' : 'bg-[#ffffed]'}`}
            style={{ maxWidth: 400 }}
          >
            <div className="text-[#65B729] hyphen font-bold text-[30px]">{`0${idx + 4}`}</div>
            <div className="text-[18px] font-semibold leading-relaxed whitespace-pre-line">{item}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReasonCardGrid; 