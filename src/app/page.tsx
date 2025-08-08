"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import Image from "next/image";
import { AboutPosts, HomeSliderData, Posts, QuickJobs } from '@/utils/constants';
import CButton from '@/components/common/Button';
import Footer from '@/components/Footer';
import JobFilterForm, { JobFilterFormValue } from '@/components/pages/jobs/JobFilterForm';
import { useRouter } from 'next/navigation';
import { useGetFeatures } from '@/hooks/useGetFeatures';
import { useEffect, useState } from 'react';
import ColumnCard from '@/components/pages/columns/ColumnCard';
import { getRecommendedColumns } from '@/lib/api';
import { useGetInterviews } from '@/hooks/useGetInterviews';
import InterviewCard from '@/components/pages/interview/InterviewCard';
import Link from 'next/link';
import { getFilterJobUrl } from '@/utils/helper';
import Spinner from '@/components/common/Spinner';
import AuthModal from '@/components/modal/Auth';
import PageTitle from '@/components/PageTitle';
import { getPageTitle } from '@/utils/titles';


export default function HomePage() {
  const router = useRouter();
  const { data: featuresData, isLoading: featuresLoading } = useGetFeatures();
  const [recommendedColumns, setRecommendedColumns] = useState<any[]>([]);
  const [authModalState, setAuthModalState] = useState(0); // 1: Login, 2: Register

  const pageInfo = getPageTitle('home');


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('auth') === 'login') {
        setAuthModalState(1);
      }
      if (params.get('auth') === 'register') {
        setAuthModalState(2);
      }
    }
  }, []);

  useEffect(() => {
    getRecommendedColumns()
      .then((cols) => {
        setRecommendedColumns(cols?.slice(0, 3) || []);
      })
      .catch((err) => {
        console.error('getRecommendedColumns error:', err);
        console.log(err);

      });
  }, []);

  const onSubmitJobSearch = (value: JobFilterFormValue, searchText: string) => {
    const url = getFilterJobUrl(value, featuresData.data);
    const params = new URLSearchParams();
    params.set('page', '1');
    params.set('limit', '10');
    params.set('searchTerm', searchText || '');
    router.push(`${url}?${params.toString()}`);
  };

  const { data: interviewData } = useGetInterviews({ page: 1, limit: 3 });

  return (
    <div className="flex min-h-screen flex-col">
      <PageTitle 
        title={pageInfo.title}
        description={pageInfo.description}
        keywords={pageInfo.keywords}
      />
      <div className='bg-[#414141] h-[140px] md:h-[160px] w-full'></div>
      <h1 className="sr-only">AMB - 転職支援サービス | あなたの次のキャリアチャンスを見つけましょう</h1>
      <Swiper
        spaceBetween={30}
        speed={2000}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        pagination={{
          clickable: true,
        }}
        modules={[Autoplay, Pagination, Navigation]}
        className="w-screen"
      >
        {HomeSliderData.map(slide => (
          <SwiperSlide key={slide.id} className='w-screen h-120 bg-gray-200 text-white'>
            <img src={slide.image} alt="slide image" />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className='w-19/20 max-w-240 mx-auto px-3 py-8 sm:py-24'>
        <h2 className='mb-8 text-[24px] sm:text-[32px] font-medium job-openings text-center relative !font-black'>求人情報</h2>
        <p className='text-center text-[14px] sm:text-base text-gray-600 font-sans'>JOB OPENINGS</p>
        <p className='mt-10 text-center text-[18px] sm:text-[24px] font-semibold'>リユース・リサイクル・買取業界の転職、就活、バイト探しは</p>
        <p className='text-center text-[20px] sm:text-[34px] font-semibold'>
          <span className='text-green'>「求人数 NO.1」</span>
          のリユース転職で求人検索！
        </p>
        {featuresLoading ? (
          <Spinner />
        ) : (
          <div className='mt-15'>
            <JobFilterForm onSubmit={onSubmitJobSearch} />
          </div>
        )}
      </div>
      <div className='flex flex-wrap max-w-300 mx-auto w-95/100 gap-8 py-25 px-3 sm:px-0'>
        {/* <div className='flex flex-wrap max-w-300 mx-auto gap-8 py-10 sm:py-25 pl-5 sm:mx-0'> */}
        {QuickJobs.map(job => (
          <a key={job.to} href={'/'} className='w-full sm:w-[calc(50%-16px)] aspect-580/205 relative'>
            <Image src={job.image} alt='job' fill />
          </a>
        ))}
      </div>
      <div className='pt-15 sm:pt-25'>
        <h2 className='mb-8 text-[24px] sm:text-[32px] job-openings text-center relative font-semibold text-gray-300'>転職支援サービス</h2>
        <p className='text-center text-[14px] sm:text-base text-gray-600 font-sans'>SUPPORT</p>
        <p className='text-center text-[18px] sm:text-[34px] text-gray-300 font-bold mt-15 '>
          <span className='text-green'>専属のキャリアアドバイザー</span>
          無料で徹底サポート！
        </p>
        <p className='text-center text-[18px] sm:text-[34px] text-gray-300 font-bold'>
          <span className='text-green'>非公開求人</span>
          も多数！
        </p>
      </div>
      <div className='flex flex-wrap max-w-300 mx-auto w-95/100 gap-8 pt-[50px] px-3 sm:px-0'>
        {Posts.map(job => (
          <a key={job.to} href={job.to} className='w-full sm:w-[calc(50%-16px)] aspect-580/205 relative'>
            <Image src={job.image} alt='job' fill />
          </a>
        ))}
      </div>
      <div className='py-15 sm:py-25'>
        <div className='flex flex-col md:flex-row'>
          <div className='flex-1 pr-10 pb-10 lg:pr-25'>
            <div className='relative w-full aspect-698/484'>
              <Image src="/images/home/about-bg.webp" alt="about" className='object-cover rounded-tr-[100px]' fill />
            </div>
          </div>
          <div className='flex-1 px-4 md:px-0 md:pr-25'>
            <Image src="/images/home/about-title.png" alt="about-title" width={304} height={121} />
            <div className='text-gray-300 text-wrap text-[14px] sm:text-base/7 font-normal space-y-2'>
              <p>
                国内初、リユース・リサイクル・買取業界に特化した求人サイト。バイヤー・鑑定士など専門性の高い求人から、未経験歓迎求人まで。大手企業からベンチャー企業、地域密着企業まで幅広く求人があります。条件に合わせて検索いただけます。
              </p>
              <p>
                また、転職支援サービスでは、専任キャリアアドバイザーが履歴書・職務経歴書の添削や、面接対策まで徹底サポートしています。
              </p>
              <p>
                チャンスの多い業界であなたらしい輝くキャリアへの一歩を支援します。
              </p>
            </div>
            <a href="about">
              <CButton
                text="リユース転職とは"
                className='border border-green mt-11 font-semibold text-green px-[60px]'
                hasNavIcon
                navIconColor='green'
              />
            </a>
          </div>
        </div>
      </div>

      <div className='flex flex-col xl:flex-row px-4 gap-8 justify-center items-center'>
        {AboutPosts.map(post => (
          <a href={post.to} key={post.id} className='flex flex-row border rounded-tr-[20px] border-gray-700 max-w-140'>
            <div className='relative w-[130px] sm:w-[160px] h-[80px] sm:h-[104px] md:w-[230px] md:h-[150px]'>
              <Image src={post.image} alt='job' fill />
            </div>
            <div className='flex-1 flex flex-col items-center justify-center px-4 sm:px-10'>
              <div>
                <p className='text-[16px] sm:text-xl text-gray-300 font-bold'>{post.title}</p>
                <p className='text-[12px] sm:text-sm text-gray-600 font-normal'>{post.subTitle}</p>
              </div>
            </div>
          </a>
        ))}
      </div>

      <section className="mt-25 relative">
        <div className="pt-[50px] md:pt-[100px] pb-[30px] md:pb-[60px] text-center top-interview">
          <h2 className="text-2xl md:text-3xl font-bold mb-9 text-center relative inline-block mx-auto job-openings">
            インタビュー
          </h2>
          <p className='text-center text-[14px] text-gray-600 font-sans'>INTERVIEW</p>
        </div>
        {interviewData?.InterviewItems && interviewData.InterviewItems.length > 0 && (
          <div className="max-w-[1200px] mx-auto px-4 lg:px-0 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {interviewData.InterviewItems.map((interview: any) => (
                <InterviewCard key={interview.id} interview={interview} />
              ))}
            </div>
            <div className="flex justify-center md:justify-end mt-8">
              <Link href="/interview/business" className="inline-block px-6 py-2 border border-green text-green rounded hover:bg-green hover:text-white transition-colors font-semibold">
                インタビュー一覧へ &gt;
              </Link>
            </div>
          </div>
        )}
      </section>

      <section>
        <div className="pt-[50px] md:pt-[100px] pb-[30px] md:pb-[60px] text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-9 text-center relative inline-block mx-auto job-openings">
            コラム
          </h2>
          <p className='text-center text-[14px] text-gray-600 font-sans'>COLUMN</p>
        </div>
        {recommendedColumns.length > 0 && (
          <div className="max-w-[1200px] mx-auto px-4 lg:px-0 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recommendedColumns.map((column) => (
                <ColumnCard key={column.id} column={column} />
              ))}
            </div>
          </div>
        )}
      </section>

      <Footer />
      {authModalState > 0 && (
        <AuthModal initialStep={authModalState === 1 ? 'Login' : 'Register'} onClose={() => setAuthModalState(0)} />
      )}
    </div >
  );
}

