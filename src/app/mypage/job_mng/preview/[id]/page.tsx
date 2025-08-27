"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetJobById } from "@/hooks/useGetJobById";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useEffect, useState, useRef } from "react";
import Spinner from "@/components/common/Spinner";
import { getFirstFullImage, getPrefectureName, parsePublicDate } from "@/utils/helper";
import { JobDetailExtra, RecruitingCriteria, StaffInfoExtra, CompanyInfo } from "@/utils/types";
import Image from "next/image";
import ImageWithLoader from "@/components/common/ImageWithLoader";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import CButton from '@/components/common/Button';
import useWindowSize from "@/hooks/useWindowSize";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function JobPreviewPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id;
    const { profile } = useAuthContext();
    const [mounted, setMounted] = useState(false);
    const [width] = useWindowSize();

    const { data, isLoading } = useGetJobById(Number(id));

    // Refs for smooth scrolling
    const staffSectionRef = useRef<HTMLDivElement>(null);
    const gallerySectionRef = useRef<HTMLDivElement>(null);
    const aboutSectionRef = useRef<HTMLDivElement>(null);
    const informationSectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => setMounted(true), []);

    // Check if user has access to preview this job
    useEffect(() => {
        if (profile && !(profile.role === 'Employer' || profile.role === 'admin')) {
            router.replace("/mypage");
            return;
        }

        // If user is Employer, check if they own this job
        if (profile?.role === 'Employer' && data?.data?.employer_id !== profile.id) {
            router.replace("/mypage");
            return;
        }
    }, [profile, data, router]);

    if (!mounted) return null;

    if (isLoading) {
        return (
            <div className="flex flex-row justify-center pt-10">
                <Spinner />
            </div>
        )
    }

    if (!data?.data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-lg text-gray-600">求人の詳細を取得できませんでした。</p>
                <CButton
                    text="戻る"
                    className="mt-4 bg-blue text-white"
                    onClick={() => router.back()}
                />
            </div>
        )
    }

    const job: JobDetailExtra = data.data;
    const themeColor = job.job_detail_page_template_id === 1 ? 'blue' : 'orange';

    const renderFeatureInfo = (job: JobDetailExtra) => {
        const res: Record<string, any> = {}
        const jobTypes = job.features.filter(i => i.parent_id === 1)?.map(i => i.name)?.join(' / ') || 'None';
        res['職種'] = jobTypes;
        res['給料'] = job.pay;
        const employmentTypes = job.features.filter(i => i.parent_id === 4)?.map(i => i.name)?.join(' / ') || 'None';
        res['雇用形態'] = employmentTypes;
        return Object.entries(res).map(([key, data]) => {
            return (
                <div key={key} className="flex flex-row border-t-1 border-gray-700">
                    <div className="flex-1 border-r-1 border-gray-700 p-3 bg-gray-800">
                        <p className="font-bold text-gray-300">{key}</p>
                    </div>
                    <div className="flex-3 p-3">
                        <p className="font-normal">{data}</p>
                    </div>
                </div>
            )
        })
    }

    const renderCriteriaInfo = (job: JobDetailExtra) => {
        const sorted: RecruitingCriteria[] = job.recruitingCriterias.sort((a: RecruitingCriteria, b: RecruitingCriteria) => a.display_order - b.display_order);
        const cloned = [...sorted];

        return (
            <>
                {cloned.map((criteria: RecruitingCriteria) => {
                    return (
                        <div key={criteria.name} className="flex flex-row border-t-1 border-gray-700">
                            <div className="flex-1 border-r-1 border-gray-700 p-3 bg-gray-800">
                                <p className="font-bold text-gray-300">{criteria.name}</p>
                            </div>
                            <div className="flex-3 p-3">
                                <p className="font-normal" dangerouslySetInnerHTML={{ __html: criteria.JobInfosRecruitingCriteria.body?.replace(/\r?\n/g, '<br />') || '' }} />
                            </div>
                        </div>
                    )
                })}
            </>
        )
    }

    return (
        <div className="flex flex-col pt-5">
            {/* Preview Banner */}
            <div className="bg-yellow-500 text-black text-center py-3 px-4 sticky top-0 z-20">
                <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span className="font-bold">プレビューモード - この求人はまだ公開されていません</span>
                </div>
            </div>

            <p className="text-[24px] md:text-4xl text-center text-gray-300 mb-3 break-words">{job.employer?.clinic_name}</p>
            <p className={`text-2xl text-center text-${themeColor} mb-6 break-words`}>{job.job_title}</p>
            
            <div className="mt-10 flex flex-wrap flex-row justify-center items-stretch sm:items-center w-full gap-2 sm:gap-0">
                {job?.staffInfos?.length > 0 && (
                    <div
                        className="px-1 sm:px-6 flex flex-col items-center border-l-0 sm:border-l-1 border-gray-700 cursor-pointer"
                        onClick={() => staffSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        <p className="text-[18px] sm:text-base font-bold text-gray-300">スタッフ紹介</p>
                        <p className={`text-[14px] text-${themeColor} mt-2`}>STAFF</p>
                    </div>
                )}
                {job?.workplaceIntroductions?.length > 0 && (
                    <div
                        className="px-1 sm:px-6 flex flex-col items-center border-l-0 sm:border-l-1 border-gray-700 cursor-pointer"
                        onClick={() => gallerySectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        <p className="text-[18px] sm:text-base font-bold text-gray-300">社内風景</p>
                        <p className={`text-[14px] text-${themeColor} mt-2`}>PHOTO GALLERY</p>
                    </div>
                )}
                <div
                    className="px-1 sm:px-6 flex flex-col items-center border-l-0 sm:border-l-1 border-r-0 sm:border-r-1 border-gray-700 cursor-pointer"
                    onClick={() => aboutSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                >
                    <p className="text-[18px] sm:text-base font-bold text-gray-300">会社情報</p>
                    <p className={`text-[14px] text-${themeColor} mt-2`}>ABOUT</p>
                </div>
                <div
                    className="px-1 sm:px-6 flex flex-col items-center border-r-0 sm:border-r-1 border-gray-700 cursor-pointer"
                    onClick={() => informationSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                >
                    <p className="text-[18px] sm:text-base font-bold text-gray-300">求人情報</p>
                    <p className={`text-[14px] text-${themeColor} mt-2`}>INFORMATION</p>
                </div>
            </div>

            <div className="my-8">
                <div className="h-25 md:h-35 w-auto relative aspect-250/138 mx-auto max-w-[400px]">
                    <Image src={`/images/recruiter/${themeColor === 'orange' ? 'message' : 'message_blue'}.png`} alt="msg" fill />
                </div>
                <p className="text-2xl text-center text-gray-300 font-bold break-words">{job.job_lead_statement}</p>
            </div>

            {/* Preview Action Bar */}
            {/* <div className={`fixed bottom-0 left-0 right-0 z-30 bg-${themeColor} py-3`}>
                <div className="flex flex-row justify-center gap-4">
                    <CButton
                        text="編集する"
                        className={`bg-white text-${themeColor} rounded-lg cursor-pointer`}
                        onClick={() => router.push(`/mypage/job_mng/edit/${job.id}`)}
                    />
                    <CButton
                        text="戻る"
                        className={`border-2 ${themeColor === 'blue' ? 'border-blue text-blue' : 'border-orange text-orange'} rounded-sm min-w-[140px] bg-white`}
                        onClick={() => router.back()}
                    />
                </div>
            </div> */}

            {job?.staffInfos?.length > 0 && (
                <div ref={staffSectionRef} id="preview-staff" className="flex flex-col items-center w-full px-2 sm:px-0">
                    <p className="text-4xl text-gray-300 font-bold mt-10 sm:mt-30">スタッフ紹介</p>
                    <p className={`text-${themeColor}`}>STAFF</p>
                    <Swiper navigation={true} modules={[Navigation]} className="w-full max-w-full">
                        {job?.staffInfos?.map((staff: StaffInfoExtra) => {
                            return (
                                <SwiperSlide key={staff.id}>
                                    <div className="flex items-center justify-center pb-10">
                                        <div className="w-full sm:w-9/10 max-w-85 shadow-md rounded-tr-[40px] mt-10 overflow-hidden">
                                            <div className="w-full aspect-1/1 relative">
                                                <ImageWithLoader className="object-cover" src={getFirstFullImage(staff.images) || '/images/default-avatar.jpg'} alt={staff.first_name} fill />
                                            </div>
                                            <div className="p-4 sm:p-8">
                                                {(staff.last_name || staff.first_name) && <p>{staff.last_name} {staff.first_name}</p>}
                                                {staff.post && <p>{staff.post}</p>}
                                                {staff.career && <p>{staff.career}</p>}
                                                {staff.introduction_text && <p className="font-normal">{staff.introduction_text}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            )
                        })}
                    </Swiper>
                </div>
            )}

            {job?.workplaceIntroductions?.length > 0 && (
                <div ref={gallerySectionRef} id="preview-gallery" className="relative pt-10 flex flex-col items-center w-full px-2 sm:px-0">
                    <div className="absolute inset-y-0 left-1/2 right-1/2 -translate-x-1/2 w-screen bg-gray-800 rounded-tl-[200px] -z-1" />
                    <p className="text-4xl text-gray-300 font-bold z-10">社内風景</p>
                    <p className={`text-${themeColor} z-10`}>PHOTO GALLERY</p>
                    <div className="w-[85%] md:w-full sm:w-screen sm:-ml-[calc(50vw-50%)] pt-6 sm:pt-15 px-0 sm:px-4 z-10">
                        <Swiper
                            slidesPerView={width < 640 ? 1 : width < 1024 ? 2 : 3}
                            spaceBetween={16}
                            centeredSlides={true}
                            pagination={{ clickable: true }}
                            modules={[Pagination]}
                        >
                            {job.workplaceIntroductions?.map((place: CompanyInfo) => {
                                return (
                                    <SwiperSlide key={place.id}>
                                        <div className="pb-6 sm:pb-10">
                                            <div className="w-full aspect-5/4 relative">
                                                <ImageWithLoader className="object-cover" src={getFirstFullImage(place.images) || '/images/default-company.png'} alt={place.description} fill />
                                            </div>
                                            <p className="bg-white p-4 sm:p-6 shadow-lg font-normal">
                                                {place.description}
                                            </p>
                                        </div>
                                    </SwiperSlide>
                                )
                            })}
                        </Swiper>
                    </div>
                </div>
            )}

            <div ref={aboutSectionRef} id="preview-gallery" className="relative pt-10 flex flex-col items-center w-full px-2 sm:px-0">
                <p className="text-4xl text-gray-300 font-bold">会社情報</p>
                <p className={`text-${themeColor} pb-5`}>ABOUT</p>
                <div className="narrow-container w-full border-1 border-gray-700 mt-6 sm:mt-10 text-sm sm:text-base">
                    {[
                        { label: '会社名', value: `${job.employer?.clinic_name} (${job.employer?.clinic_name_kana || ''})` },
                        { label: '事業形態', value: '法人' },
                        { label: '住所', value: (<><span>〒{job.employer?.zip || ''}</span><br /><span>{getPrefectureName(job.employer?.prefectures)} {job.employer?.city}</span></>) },
                        { label: '従業員数', value: job.employer?.employee_number || '' },
                        { label: '設立年月日', value: job.employer?.establishment_year || '' },
                        { label: '資本金', value: job.employer?.capital_stock || '' },
                        { label: '事業内容', value: job.employer?.business || '' },
                        { label: 'ウェブサイト', value: job.employer?.home_page_url || '' },
                        { label: '掲載期間', value: `${parsePublicDate(job.clinic_public_date_start)} ~ ${parsePublicDate(job.clinic_public_date_end)}` },
                    ].map((row) => (
                        <div key={row.label} className={`flex flex-col sm:flex-row border-b-1 last:border-b-0 border-gray-700`}>
                            <div className="sm:flex-1 border-b-0 sm:border-b-0 sm:border-r-1 border-gray-700 p-3 bg-gray-800">
                                <p className="font-bold text-gray-300">{row.label}</p>
                            </div>
                            <div className="sm:flex-3 p-3">
                                <p className="font-normal break-words">{row.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div ref={informationSectionRef} id="preview-gallery" className="mt-10 sm:mt-30 relative py-10 sm:py-30 flex flex-col items-center w-full px-2 sm:px-0">
                <div className="absolute inset-y-0 left-1/2 right-1/2 -translate-x-1/2 w-screen bg-gray-800 rounded-tr-[100px] md:rounded-tr-[200px] -z-1" />
                <p className="text-4xl text-gray-300 font-bold z-10">求人情報</p>
                <p className={`text-${themeColor} z-10 pb-5`}>INFORMATION</p>
                <div className="narrow-container mt-6 sm:mt-10 bg-white p-2 sm:p-15 w-full text-sm sm:text-base z-10">
                    <div className="border-1 border-t-0 border-gray-700">
                        {renderFeatureInfo(job)}
                        {renderCriteriaInfo(job)}
                    </div>
                </div>
            </div>
        </div>
    );
}

