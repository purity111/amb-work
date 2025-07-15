'use client'

import Image from "next/image";
import RedRegisterButton from "@/components/pages/mid-high/RedRegisterButton";
import SalaryRangeButton from "@/components/pages/mid-high/SalaryRangeButton";
import Footer from "@/components/Footer";
import MidHighPointCard from "@/components/pages/mid-high/MidHighPointCard";
import { MID_HIGH_POINTS, MID_HIGH_SWIPER_CARDS } from "@/utils/constants";
import MidHighAboutSection from "@/components/pages/mid-high/MidHighAboutSection";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import MidHighSwiperCard from "@/components/pages/mid-high/MidHighSwiperCard";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import MidHighCaseSwiperCard from '@/components/pages/mid-high/MidHighCaseSwiperCard';
import CareerCounselingForm from "@/components/common/CareerCounselingForm";

export default function MidhighPage() {
    return (
        <>
            <div className="relative w-full">
                {/* Mobile (SP) Layout */}
                <div className="md:hidden w-full flex flex-col bg-[#F6F8F6]">
                    {/* Logo and Headline */}
                    <div className="px-5 pt-25 pb-2">
                        <div className="w-[140px] mb-4 aspect-[7/2]">
                            <Image
                                src="/images/mid-high/logo.png"
                                alt="リユース転職"
                                width={140}
                                height={40}
                                className="object-contain"
                                priority
                            />
                        </div>
                        <div className="text-[#222] text-[1.1rem] font-bold leading-tight mb-1">
                            リユース・リサイクル・買取業界の<br />
                            <span className="text-[#A08B53] font-bold">ミドル・ハイクラス転職</span>もリユース転職！
                        </div>
                    </div>
                    {/* Main Image */}
                    <div className="relative w-full h-[350px] mb-2">
                        <Image
                            src="/images/mid-high/main_sp.jpg"
                            alt="main background"
                            fill
                            style={{ objectFit: "cover", objectPosition: "center top" }}
                            className="select-none pointer-events-none"
                            priority
                        />
                    </div>
                    {/* Salary Range Button */}
                    <div className="px-4 mt-2">
                        <SalaryRangeButton imageUrl="/images/mid-high/main_income.png" />
                    </div>
                    {/* Register Button Section with Navy BG */}
                    <div className="w-full bg-[#22305A] px-4 pt-4 pb-8 mt-4 flex flex-col items-center">
                        <RedRegisterButton label="無料登録はこちら">
                            無料登録して求人情報を見る
                        </RedRegisterButton>
                    </div>
                </div>
                {/* Desktop Layout (unchanged) */}
                <div className="hidden md:block">
                    <div className="h-20 md:h-75 bg-white w-full"></div>
                    <div className="h-20 md:h-100 bg-[#22305A] w-full"></div>
                    <div className="min-h-screen w-full flex justify-center absolute top-25">
                        <div className="flex w-full mx-5 max-w-[1400px] rounded-bl-[40px] bg-transparent relative">
                            {/* Left: Content Card */}
                            <div className="absolute z-20 flex-1 rounded-bl-[80px] rounded-tl-[80px] rounded-br-[120px] rounded-tr-[0px] flex flex-col justify-center pl-10 pr-4 py-16 md:py-24" style={{ minWidth: 0 }}>
                                {/* Logo */}
                                <div className="w-[164px] md:w-[220px] mb-8">
                                    <Image
                                        src="/images/mid-high/logo.png"
                                        alt="リユース転職"
                                        width={220}
                                        height={60}
                                        className="object-contain"
                                        priority
                                    />
                                </div>
                                {/* Headline */}
                                <div className="text-[#222] text-[1.7rem] md:text-[2.1rem] font-bold leading-tight mb-2 text-[20px] md:text-[30px]">
                                    リユース・リサイクル・買取業界の<br />
                                    <span className="text-[#A08B53] font-bold">ミドル・ハイクラス転職</span>もリユース転職！
                                </div>
                                {/* Salary Range Button */}
                                <div className="hidden md:block">
                                    <div className="mt-8 mb-6">
                                        <SalaryRangeButton imageUrl="/images/mid-high/main_income.png" />
                                    </div>
                                    {/* Register Button */}
                                    <div className="mt-2">
                                        <RedRegisterButton label="無料登録はこちら">
                                            無料登録して求人情報を見る
                                        </RedRegisterButton>
                                    </div>
                                </div>
                            </div>
                            {/* Right: Main Image */}
                            <div className="hidden md:block flex-1 relative max-h-[540px]">
                                <Image
                                    src="/images/mid-high/main.jpg"
                                    alt="main background"
                                    fill
                                    style={{ objectFit: "cover", objectPosition: "center right" }}
                                    className="select-none pointer-events-none rounded-bl-[100px]"
                                    priority
                                />
                            </div>
                            <div className="md:hidden flex-1 relative">
                                <Image
                                    src="/images/mid-high/main_sp.jpg"
                                    alt="main background"
                                    fill
                                    style={{ objectFit: "cover", objectPosition: "center right" }}
                                    className="select-none pointer-events-none"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Experience Consultant Section */}
            <div className="w-full flex justify-center my-12 px-2">
                <div className="flex items-center w-full max-w-3xl">
                    {/* Left border */}
                    <div className="border-l-1 border-black h-full mr-4" />
                    <div className="flex-1 text-center">
                        <div className="text-[1.1rem] text-[16px] md:text-[25px] md:text-[1.3rem] font-bold text-black leading-snug">
                            経験豊富なトップコンサルタントが、<br />
                            あなたと同じ目線で親身にアドバイス
                        </div>
                        <div className="text-[#A23D3B]  text-[16px] md:text-[25px] font-bold mt-2">
                            初めてのミドル・ハイクラス転職でも安心
                        </div>
                    </div>
                    {/* Right border */}
                    <div className="border-r-1 border-black h-full ml-4" />
                </div>
            </div>

            <div className="w-full flex justify-center my-20">
                <div className="flex flex-col md:flex-row gap-10 md:gap-20 w-full max-w-[1200px] justify-center">
                    {MID_HIGH_POINTS.map((point) => (
                        <MidHighPointCard key={point.number} {...point} />
                    ))}
                </div>
            </div>
            <MidHighAboutSection />
            <div className="relative z-10 w-full max-w-5xl m-auto flex flex-col items-center">
                <h2 className="text-2xl md:text-3xl font-bold text-[#222] mb-2">求人情報の一部</h2>
                <div className="flex items-center">
                    <span className="block w-6 h-1 bg-[#22305A] rounded rounded-tr-0 rounded-br-0" />
                    <span className="block w-6 h-1 bg-[#A08B53] rounded rounded-tr-0 rounded-br-0" />
                </div>
            </div>
            <div className="w-full flex justify-center my-10">
                <div className="relative w-full max-w-6xl px-2 md:px-0">
                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={16}
                        slidesPerView={1}
                        slidesPerGroup={1}
                        breakpoints={{
                            768: {
                                slidesPerView: 2,
                                slidesPerGroup: 1,
                            },
                            1200: {
                                slidesPerView: 3,
                                slidesPerGroup: 1,
                            },
                        }}
                        navigation={{
                            nextEl: '.job-swiper-button-next',
                            prevEl: '.job-swiper-button-prev',
                        }}
                        pagination={{
                            clickable: true,
                            dynamicBullets: false,
                            el: '.job-swiper-pagination',
                            bulletClass: 'job-swiper-bullet swiper-pagination-bullet',
                            bulletActiveClass: 'job-swiper-bullet-active swiper-pagination-bullet-active',
                        }}
                        className="job-swiper pb-16 !ml-[16px]"
                    >
                        {MID_HIGH_SWIPER_CARDS.map((card, idx) => (
                            <SwiperSlide key={idx} className="flex justify-center mb-8">
                                <MidHighSwiperCard {...card} />
                            </SwiperSlide>
                        ))}
                        <div className="job-swiper-pagination flex justify-center items-center gap-2" />
                        <div className="!hidden md:!block job-swiper-button-prev" />
                        <div className="!hidden md:!block job-swiper-button-next" />
                    </Swiper>
                </div>
            </div>
            <div className="w-full flex justify-center my-8">
                <a
                    href="/jobs"
                    className="w-full max-w-[500px] flex items-center justify-center gap-3 py-5 px-4 mx-4 rounded-xl shadow-lg bg-gradient-to-b from-[#b80000] to-[#a10000] hover:opacity-90 transition font-bold text-white text-xl outline-none focus:ring-2 focus:ring-red-400"
                    role="button"
                    tabIndex={0}
                >
                    {/* List icon (inline SVG) */}
                    <span className="inline-flex items-center justify-center">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="4" y="6" width="16" height="2" rx="1" fill="white" />
                            <rect x="4" y="11" width="16" height="2" rx="1" fill="white" />
                            <rect x="4" y="16" width="16" height="2" rx="1" fill="white" />
                        </svg>
                    </span>
                    求人一覧はこちら
                </a>
            </div>
            {/* --- MID HIGH CASE SWIPER --- */}
            <section className="relative mt-30 py-16 md:py-24 bg-cover bg-center" style={{ backgroundImage: 'url(/images/mid-high/bg.jpg)' }}>
                <div className="relative z-10 w-full max-w-5xl m-auto flex flex-col items-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">ミドル・ハイクラス転職　実績</h2>
                    <div className="flex items-center">
                        <span className="block w-6 h-1 bg-[#A41414] rounded rounded-tr-0 rounded-br-0" />
                        <span className="block w-6 h-1 bg-[#A08B53] rounded rounded-tr-0 rounded-br-0" />
                    </div>
                </div>
                <div className="w-full flex justify-center my-10">
                    <div className="relative w-full max-w-[1200px] px-4 md:px-0">
                        <MidHighCaseSwiperCard />
                    </div>
                </div>
            </section>
            <section>
                <div className="relative z-10 w-full max-w-5xl m-auto pt-20 flex flex-col items-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#222] mb-2 tracking-[-0.06em]">無料登録フォーム【リユース転職】</h2>
                    <div className="flex items-center">
                        <span className="block w-6 h-1 bg-[#22305A] rounded rounded-tr-0 rounded-br-0" />
                        <span className="block w-6 h-1 bg-[#A08B53] rounded rounded-tr-0 rounded-br-0" />
                    </div>
                </div>
                <p className="text-base text-center py-10">
                    ※ご登録者様にはお申込み特典として<br />
                    「業界の最新動向」資料（PDFファイル）を<br />
                    送付させていただきます。
                </p>
                <CareerCounselingForm />
            </section>
            <Footer />
            <style jsx global>{`
                .job-swiper-pagination {
                    position: relative;
                    bottom: 0;
                    z-index: 10;
                }
                .job-swiper-bullet {
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
                .job-swiper-bullet-active {
                    background: #22305A;
                    border-color: #22305A;
                }
            `}</style>
        </>
    );
}
