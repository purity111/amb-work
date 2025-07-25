"use client";

import { useEffect, useState } from 'react';
import LinkButton from './LinkButton';
import { getFullUrl } from '@/utils/config';

const FixedBottomBar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Show when scrollY > 0 and distance from bottom > 300px
      setIsVisible(scrollY > 0 && (documentHeight - (scrollY + windowHeight)) > 100);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 z-30
        transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
      `}
    >
      <div className="bg-[#000000ab] w-full px-4 py-3 relative">
        <div className="max-w-[1200px] sm:mx-auto flex justify-center lg:justify-around items-center gap-3 sm:gap-6">
          <div className="opacity-0"></div>
          <div className="flex flex-row items-center lg:justify-around gap-3 sm:w-auto">
            <LinkButton
              text={isMobile ? "求人情報" : "求人情報はこちら"}
              className="bg-green text-white w-max-content sm:w-50 md:w-70 lg:w-90"
              hasNavIcon
              to={getFullUrl('/job-openings')}
            />
            <LinkButton
              text={isMobile ? "転職支援サービス" : "転職支援サービス(無料)はこちら"}
              className="bg-orange text-white w-max-content sm:w-50 md:w-70 lg:w-90"
              hasNavIcon
              to={getFullUrl('/career-counseling')}
            />
          </div>
          <button
            onClick={scrollToTop}
            className="w-12 h-12 bg-green cursor-pointer flex items-center justify-center hover:opacity-80 transition-colors"
            aria-label="Scroll to top"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="m18 15-6-6-6 6" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
};

export default FixedBottomBar; 