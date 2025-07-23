import React from 'react';
import Image from 'next/image';
import { BACKGROUNDS_SECTIONS } from '@/utils/constants';

interface BackgroundsSectionProps {
  sectionIndex?: number; // default 0
}

const BackgroundsSection: React.FC<BackgroundsSectionProps> = ({ sectionIndex = 0 }) => {
  const section = BACKGROUNDS_SECTIONS[sectionIndex];
  if (!section) return null;
  const isImageLeft = section.order === 'image-left';

  return (
    <div className=' my-8 md:my-16'>
      <section className="flex flex-col md:flex-row items-end">
        {(isImageLeft && window.innerWidth > 768) && (
          <div className="w-full md:w-1/2 flex justify-center mb-6 md:mb-0">
            <Image
              src={section.image}
              alt={section.mainHeading}
              width={400}
              height={300}
              className="rounded-lg object-cover"
              priority
            />
          </div>
        )}
        <div className="w-full md:w-1/2 px-4">
          <p className="text-[#65B729] font-bold text-sm mb-2">{section.backgroundsTitle}　ー</p>
          <h3 className="text-[22px] font-bold mb-4">{section.mainHeading}</h3>
          {section.description1 && (
            <p className="text-sm md:text-base leading-relaxed whitespace-pre-line">{section.description1}</p>
          )}

        </div>
        {(!isImageLeft || window.innerWidth < 768) && (
          <div className="w-full md:w-1/2 flex justify-center mt-6 md:mt-0">
            <Image
              src={section.image}
              alt={section.mainHeading}
              width={400}
              height={300}
              className="rounded-lg object-cover"
              priority
            />
          </div>
        )}
      </section>
      {section.description2 && (
        <p className="text-sm md:text-base pt-10 leading-relaxed whitespace-pre-line">{section.description2}</p>
      )}
      
    </div>
  );
};

export default BackgroundsSection; 