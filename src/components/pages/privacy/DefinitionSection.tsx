import React from 'react';

interface DefinitionSectionProps {
    number: number;
    title: string;
    text: string;
    isTerms?: boolean;
}

export default function DefinitionSection({ number, title, text, isTerms }: DefinitionSectionProps) {
  return (
    <div className="mb-8">
      <h2 className="text-[22px] md:text-[28px] font-bold mb-1 pb-1">
        {isTerms ? `第${number}条` : `${number}`}　({title})
      </h2>
      {/* Two-color horizontal line */}
      <div className="w-full h-[2px] bg-gradient-to-r from-green from-10% md:from-6% to-gray-400 to-10%"></div>
      <p className="leading-[1.8] mt-4 mb-4 text-[14px] md:text-base whitespace-pre-line">
        {text}
      </p>
    </div>
  );
} 