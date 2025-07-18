"use client";
import Breadcrumb from '@/components/Breadcrumb';
import Footer from '@/components/Footer';
import Image from 'next/image';
import React, { useEffect } from 'react';

const AboutPage: React.FC = () => {
  useEffect(() => {
    document.title = 'リユース転職サービス';
  }, []);

  return (
    <>
      <main>
        <div className="h-20 sm:h-30 md:h-75 bg-[#414141]"></div>
        {/* Text Content (Left Side - Dark Grey Background) */}
        <div className="w-full max-w-[1200px] m-auto text-white px-4 lg:px-0 md:mb-25">
          <div className="md:text-left md:mr-8 xl:mr-20">
            <div className="h-[30px] md:h-15 w-[3px] bg-green-500 mr-2 md:mt-[-30px] mb-5 md:mb-10"></div>
            <h1 className="text-[26px] md:text-[35px] lg:text-[44px] font-bold text-black mb-2">リユース転職とは</h1>
            <p className="text-[14px] md:text-[18px] text-gray-300 font-bold">What is a career change?</p>
          </div>
        </div>

        <div className="w-full my-10 sm:my-[50px] md:my-0 md:w-1/2 relative bg-white h-[160px] sm:h-[250px] md:h-[350px] flex justify-end rounded-tl-[50px] sm:rounded-tl-[80px] md:rounded-tl-[100px] overflow-hidden md:absolute md:right-0 md:top-[180px]">
          <Image
            src="/images/about/banner.jpg"
            alt="資格バナー"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Breadcrumb */}
        <Breadcrumb />
        <div className="pb-[30px] md:pb-[60px] text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-9 text-center relative inline-block mx-auto job-openings">
            サービスの特徴
          </h2>
          <p className='text-center text-[14px] text-gray-600 font-sans'>SERVICE FEATURES</p>
        </div>

        <div className="flex justify-start gap-[5%]">
          <div className="my-5 md:my-8 w-[48%] relative aspect-[7/6]">
            <Image
              src='/images/about/about1.jpg'
              alt="シンプルイラスト"
              fill
              className="object-contain rounded-tr-[100px]"
            />
          </div>
          <div className="lg:max-w-[600px]">
            <h2 className='text-[24px] md:text-[30px] lg:text-[38px] font-bold'>
              リユース転職とは
              <div className="absolute top-[50%] -translate-y-1/2 right-0 max-w-[298px] h-auto relative aspect-[3/2] m-auto mb-4">
                <Image
                  src='/images/about/about_text.png'
                  alt="シンプルイラスト"
                  fill
                  className="object-contain rounded-[30px]"
                />
              </div>
            </h2>

            <p className='text-[#65B729]'>リユース転職は、国内唯一のリユース、リサイクル、買取業界専門のトータルキャリア支援サービスです。</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AboutPage; 