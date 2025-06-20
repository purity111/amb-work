"use client";

import ImageWithLoader from "@/components/common/ImageWithLoader";
import Spinner from "@/components/common/Spinner";
import { useGetJobById } from "@/hooks/useGetJobById";
import useWindowSize from "@/hooks/useWindowSize";
import { getFirstFullImage, getPrefectureName, parsePublicDate } from "@/utils/helper";
import { CompanyInfo, JobDetailExtra, RecruitingCriteria, StaffInfoExtra } from "@/utils/types";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useMemo, useRef } from "react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function JobPreviewDetails() {
    const params = useParams();
    const id = params.id;

    const staffSectionRef = useRef<HTMLDivElement | null>(null);
    const gallerySectionRef = useRef<HTMLDivElement | null>(null);
    const aboutSectionRef = useRef<HTMLDivElement | null>(null);
    const informationSectionRef = useRef<HTMLDivElement | null>(null);

    const { data, isLoading } = useGetJobById(Number(id));
    const [width] = useWindowSize();

    const job: JobDetailExtra = useMemo(() => {
        if (!data?.data || isLoading) return null;
        return data.data;
    }, [data, isLoading])

    const themeColor = useMemo(() => {
        if (!job) return null;
        return job.job_detail_page_template_id === 1 ? 'blue' : 'orange';
    }, [job])

    if (isLoading) {
        return (
            <div className="flex flex-row justify-center pt-10">
                <Spinner />
            </div>
        )
    }

    if (!job) {
        return (
            <p>Failed to get job details</p>
        )
    }

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
                        <p className="font-light">{data}</p>
                    </div>
                </div>
            )
        })
    }

    const renderCriteriaInfo = (job: JobDetailExtra) => {
        const sorted: RecruitingCriteria[] = job.recruitingCriterias.sort((a: RecruitingCriteria, b: RecruitingCriteria) => a.display_order - b.display_order);
        const cloned = [...sorted];
        const zipIndex = cloned.findIndex(i => i.calling_name === 'zip');
        let zipData: RecruitingCriteria | null = null;
        if (zipIndex > -1) {
            zipData = cloned.splice(zipIndex, 1)[0];
        }
        let cityData: RecruitingCriteria | null = null;
        const cityIndex = cloned.findIndex(i => i.calling_name === 'city');
        if (cityIndex > -1) {
            cityData = cloned.splice(cityIndex, 1)[0];
        }

        return (
            <>
                <div className="flex flex-row border-t-1 border-gray-700">
                    <div className="flex-1 border-r-1 border-gray-700 p-3 bg-gray-800">
                        <p className="font-bold text-gray-300">勤務地</p>
                    </div>
                    <div className="flex-3 p-3">
                        {zipData && <p className="font-light">〒{zipData.JobInfosRecruitingCriteria.body}</p>}<br />
                        {cityData && <p className="font-light">{cityData.JobInfosRecruitingCriteria.body}</p>}
                    </div>
                </div>
                {cloned.map((criteria: RecruitingCriteria) => {
                    return (
                        <div key={criteria.name} className="flex flex-row border-t-1 border-gray-700">
                            <div className="flex-1 border-r-1 border-gray-700 p-3 bg-gray-800">
                                <p className="font-bold text-gray-300">{criteria.name}</p>
                            </div>
                            <div className="flex-3 p-3">
                                <p className="font-light" dangerouslySetInnerHTML={{ __html: criteria.JobInfosRecruitingCriteria.body.replace(/\r?\n/g, '<br />') }} />
                            </div>
                        </div>
                    )
                })}
            </>
        )

    }

    return (
        <div className="flex flex-col pt-5">
            <p className="text-4xl text-center text-gray-300 mb-3">{job.employer.clinic_name}</p>
            <p className={`text-2xl text-center text-${themeColor} mb-6`}>{job.job_title}</p>
            <div className="mt-10 flex flex-row justify-center">
                {job?.staffInfos?.length > 0 && (
                    <div
                        className="px-1 md:px-6 flex flex-col items-center border-l-1 border-gray-700 cursor-pointer"
                        onClick={() => staffSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        <p className="text-[12px] md:text-base font-bold text-gray-300">スタッフ紹介</p>
                        <p className={`text-[10px] text-${themeColor} mt-2`}>STAFF</p>
                    </div>
                )}
                {job?.workplaceIntroductions?.length > 0 && (
                    <div
                        className="px-1 md:px-6 flex flex-col items-center border-l-1 border-gray-700 cursor-pointer"
                        onClick={() => gallerySectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        <p className="text-[12px] md:text-base font-bold text-gray-300">社内風景</p>
                        <p className={`text-[10px] text-${themeColor} mt-2`}>PHOTO GALLERY</p>
                    </div>
                )}
                <div
                    className="px-1 md:px-6 flex flex-col items-center border-l-1 border-r-1 border-gray-700 cursor-pointer"
                    onClick={() => aboutSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                >
                    <p className="text-[12px] md:text-base font-bold text-gray-300">会社情報</p>
                    <p className={`text-[10px] text-${themeColor} mt-2`}>ABOUT</p>
                </div>
                <div
                    className="px-1 md:px-6 flex flex-col items-center border-r-1 border-gray-700 cursor-pointer"
                    onClick={() => informationSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                >
                    <p className="text-[12px] md:text-base font-bold text-gray-300">求人情報</p>
                    <p className={`text-[10px] text-${themeColor} mt-2`}>INFORMATION</p>
                </div>
            </div>
            <div>
                <div className="h-35 relative aspect-250/138 mx-auto">
                    <Image src={`/images/recruiter/${themeColor === 'orange' ? 'message' : 'message_blue'}.png`} alt="msg" fill />
                </div>
            </div>
            <p className="text-2xl text-center text-gray-300 font-bold mt-6">{job.job_lead_statement}</p>

            {job?.staffInfos?.length > 0 && (
                <div ref={staffSectionRef} id="preview-staff" className="flex flex-col items-center ">
                    <p className="text-4xl text-gray-300 font-bold mt-30">スタッフ紹介</p>
                    <p className={`text-${themeColor}`}>STAFF</p>
                    <Swiper navigation={true} modules={[Navigation]} className="w-full">
                        {job?.staffInfos?.map((staff: StaffInfoExtra) => {
                            return (
                                <SwiperSlide key={staff.id}>
                                    <div className="flex items-center justify-center pb-10">
                                        <div className="w-9/10 max-w-85 shadow-md rounded-tr-[40px] mt-10 overflow-hidden">
                                            <div className="w-full aspect-1/1 relative">
                                                <ImageWithLoader className="object-cover" src={getFirstFullImage(staff.images) || '/images/default-avatar.jpg'} alt={staff.first_name} fill />
                                            </div>
                                            <div className="p-8">
                                                {(staff.first_name || staff.last_name) && <p>{staff.first_name} {staff.last_name}</p>}
                                                {staff.post && <p>{staff.post}</p>}
                                                {staff.career && <p>{staff.career}</p>}
                                                {staff.introduction_text && <p className="font-light">{staff.introduction_text}</p>}
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
                <div ref={gallerySectionRef} id="preview-gallery" className="mt-30 relative py-30 flex flex-col items-center">
                    <div className="absolute -right-500 top-0 left-0 bottom-0 bg-gray-800 rounded-tl-[200px] -z-1" />
                    <p className="text-4xl text-gray-300 font-bold">社内風景</p>
                    <p className={`text-${themeColor}`}>PHOTO GALLERY</p>
                    <div className="w-screen -ml-[calc(50vw - 50%)] pt-15 px-4">
                        <Swiper
                            slidesPerView={width < 768 ? 1 : 3}
                            spaceBetween={30}
                            centeredSlides={true}
                            pagination={{
                                clickable: true,
                            }}
                            modules={[Pagination]}
                        >
                            {job.workplaceIntroductions?.map((place: CompanyInfo) => {
                                return (
                                    <SwiperSlide key={place.id}>
                                        <div className="pb-10">
                                            <div className="w-full aspect-5/4 relative">
                                                <ImageWithLoader className="object-cover" src={getFirstFullImage(place.images) || '/images/default-company.png'} alt={place.description} fill />
                                            </div>
                                            <p className="bg-white p-6 shadow-lg font-light">
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

            <div ref={aboutSectionRef} id="preview-gallery" className="mt-30 relative py-30 flex flex-col items-center">
                <p className="text-4xl text-gray-300 font-bold">会社情報</p>
                <p className={`text-${themeColor}`}>ABOUT</p>
                <div className="w-full border-1 border-gray-700 mt-10">
                    <div className="flex flex-row border-b-1 border-gray-700">
                        <div className="flex-1 border-r-1 border-gray-700 p-3 bg-gray-800">
                            <p className="font-bold text-gray-300">会社名</p>
                        </div>
                        <div className="flex-3 p-3">
                            <p className="font-light">{job.employer.clinic_name} ({job.employer.clinic_name_kana})</p>
                        </div>
                    </div>
                    <div className="flex flex-row border-b-1 border-gray-700">
                        <div className="flex-1 border-r-1 border-gray-700 p-3 bg-gray-800">
                            <p className="font-bold text-gray-300">事業形態</p>
                        </div>
                        <div className="flex-3 p-3">
                            <p className="font-light">法人</p>
                        </div>
                    </div>
                    <div className="flex flex-row border-b-1 border-gray-700">
                        <div className="flex-1 border-r-1 border-gray-700 p-3 bg-gray-800">
                            <p className="font-bold text-gray-300">住所</p>
                        </div>
                        <div className="flex-3 p-3">
                            <p className="font-light">〒{job.employer.zip}</p>
                            <p className="font-light">{getPrefectureName(job.employer.prefectures)} {job.employer.city}</p>
                        </div>
                    </div>
                    <div className="flex flex-row border-b-1 border-gray-700">
                        <div className="flex-1 border-r-1 border-gray-700 p-3 bg-gray-800">
                            <p className="font-bold text-gray-300">従業員数</p>
                        </div>
                        <div className="flex-3 p-3">
                            <p className="font-light">{job.employer.employee_number}</p>
                        </div>
                    </div>
                    <div className="flex flex-row border-b-1 border-gray-700">
                        <div className="flex-1 border-r-1 border-gray-700 p-3 bg-gray-800">
                            <p className="font-bold text-gray-300">設立年月日</p>
                        </div>
                        <div className="flex-3 p-3">
                            <p className="font-light">{job.employer.establishment_year}</p>
                        </div>
                    </div>
                    <div className="flex flex-row border-b-1 border-gray-700">
                        <div className="flex-1 border-r-1 border-gray-700 p-3 bg-gray-800">
                            <p className="font-bold text-gray-300">資本金</p>
                        </div>
                        <div className="flex-3 p-3">
                            <p className="font-light">{job.employer.capital_stock}</p>
                        </div>
                    </div>
                    <div className="flex flex-row border-b-1 border-gray-700">
                        <div className="flex-1 border-r-1 border-gray-700 p-3 bg-gray-800">
                            <p className="font-bold text-gray-300">事業内容</p>
                        </div>
                        <div className="flex-3 p-3">
                            <p className="font-light">{job.employer.business}</p>
                        </div>
                    </div>
                    <div className="flex flex-row border-b-1 border-gray-700">
                        <div className="flex-1 border-r-1 border-gray-700 p-3 bg-gray-800">
                            <p className="font-bold text-gray-300">ウェブサイト</p>
                        </div>
                        <div className="flex-3 p-3">
                            <p className="font-light">{job.employer.home_page_url}</p>
                        </div>
                    </div>
                    <div className="flex flex-row">
                        <div className="flex-1 border-r-1 border-gray-700 p-3 bg-gray-800">
                            <p className="font-bold text-gray-300">掲載期間</p>
                        </div>
                        <div className="flex-3 p-3">
                            <p className="font-light">{parsePublicDate(job.clinic_public_date_start)} ~ {parsePublicDate(job.clinic_public_date_end)}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div ref={informationSectionRef} id="preview-gallery" className="mt-30 relative py-30 flex flex-col items-center">
                <div className="absolute top-0 w-screen bottom-0 bg-gray-800 rounded-tr-[200px] -z-1" />
                <p className="text-4xl text-gray-300 font-bold">求人情報</p>
                <p className={`text-${themeColor}`}>INFORMATION</p>
                <div className="mt-10 bg-white p-2 md:p-15 w-full">
                    <div className="border-1 border-t-0 border-gray-700">
                        {renderFeatureInfo(job)}
                        {renderCriteriaInfo(job)}
                    </div>
                </div>
            </div>
        </div >
    );
}

