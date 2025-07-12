import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { MID_HIGH_CASES } from '@/utils/constants';

interface MidHighCaseSwiperCardProps {
  cases?: typeof MID_HIGH_CASES;
}

const MidHighCaseSwiperCard: React.FC<MidHighCaseSwiperCardProps> = ({ cases = MID_HIGH_CASES }) => {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={32}
      slidesPerView={1}
      slidesPerGroup={1}
      pagination={{
        clickable: true,
        dynamicBullets: false,
        el: '.case-swiper-pagination',
        bulletClass: 'case-swiper-bullet swiper-pagination-bullet',
        bulletActiveClass: 'case-swiper-bullet-active swiper-pagination-bullet-active',
      }}
      navigation={{
        nextEl: '.case-swiper-button-next',
        prevEl: '.case-swiper-button-prev',
      }}
      breakpoints={{
        768: {
          slidesPerView: 2,
          slidesPerGroup: 1,
        },
      }}
      className="case-swiper pb-10"
      style={{ maxWidth: '1024px', margin: '0 auto' }}
    >
      {cases.map((item) => (
        <SwiperSlide key={item.id} className="flex justify-center items-stretch">
          <div className="w-full max-w-[600px] bg-white rounded-[32px] md:min-h-[450px] shadow-lg overflow-hidden flex flex-col items-center md:items-stretch">
            {/* Header: Avatar + Case Info (Gold) */}
            <div className="w-full flex items-center bg-[#9E7F41] py-5 px-4 md:px-8 relative">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md flex-shrink-0">
                <Image src={item.avatar} alt={item.caseNo} width={88} height={88} className="object-cover w-full h-full" />
              </div>
              <div className="ml-4 flex flex-col justify-center">
                <div className="text-white font-bold text-[32px] leading-tight">{item.caseNo}</div>
                <div className="text-white text-lg font-bold">{item.ageGender}</div>
              </div>
            </div>
            {/* Reason Section */}
            <div className="w-full flex flex-row items-center px-4 py-4 bg-white md:px-8 md:py-6">
              <div className="flex flex-col items-center mr-4">
                <div className="w-16 h-16 rounded-full border border-gray-400 flex items-center justify-center text-sm md:text-base font-bold bg-white leading-tight text-center">
                  転職<br />理由
                </div>
              </div>
              <div className="flex-1 text-sm md:text-base whitespace-pre-line">{item.reason}</div>
            </div>
            {/* Before/After Section */}
            <div className="w-full flex flex-col md:flex-row items-stretch py-4 px-4 md:py-8 bg-white">
              {/* Before */}
              <div className="flex-1 flex flex-col items-center md:items-stretch bg-white">
                <div className="w-full bg-[#22305A] text-white rounded-t-lg md:rounded-t-lg md:rounded-bl-lg py-2 text-center font-bold mb-2 md:mb-0 md:rounded-none md:rounded-tl-lg md:rounded-bl-lg md:text-lg">{item.beforeTitle}</div>
                <div className="w-full bg-white text-[#222] text-center text-base md:text-lg font-bold py-2 whitespace-pre-line">{item.beforeDesc}</div>
                <div className="w-full text-center text-sm md:text-base mb-2 md:mb-0">年収 <span className="text-[#22305A] text-xl md:text-2xl font-bold">{item.beforeSalary}</span> 万円</div>
              </div>
              {/* Arrow */}
              <div className="hidden md:flex flex-col justify-center items-center px-2">
                <svg width="40" className='md:-rotate-90' height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5v14m0 0l-6-6m6 6l6-6" stroke="#22305A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              {/* After */}
              <div className="flex-1 flex flex-col items-center md:items-stretch bg-white">
                <div className="w-full bg-[#B80000] text-white rounded-t-lg md:rounded-t-lg md:rounded-br-lg py-2 text-center font-bold mb-2 md:mb-0 md:rounded-none md:rounded-tr-lg md:rounded-br-lg md:text-lg">{item.afterTitle}</div>
                <div className="w-full bg-white text-[#B80000] text-center text-base md:text-lg font-bold py-2 whitespace-pre-line">{item.afterDesc}</div>
                <div className="w-full text-center text-gray-500 text-sm md:text-base">年収 <span className="text-[#B80000] text-xl md:text-2xl font-bold">{item.afterSalary}</span> 万円</div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
      {/* Pagination and Navigation */}
      <div className="case-swiper-pagination flex justify-center items-center gap-2 mt-4" />
      <style jsx global>{`
        .case-swiper-pagination {
          position: relative;
          bottom: 0;
          margin-top: 24px;
          z-index: 10;
        }
        .case-swiper-bullet {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #fff;
          border: 2px solid #22305A;
          margin: 0 6px;
          opacity: 1;
          transition: background 0.2s, border 0.2s;
          box-sizing: border-box;
          display: inline-block;
        }
        .case-swiper-bullet-active {
          background: #22305A;
          border-color: #22305A;
        }
      `}</style>
      <div className="!hidden md:!block case-swiper-button-prev" />
      <div className="!hidden md:!block case-swiper-button-next" />
    </Swiper>
  );
};

export default MidHighCaseSwiperCard;
