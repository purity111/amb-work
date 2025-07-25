"use client";

import ImageWithLoader from "@/components/common/ImageWithLoader";
import Spinner from "@/components/common/Spinner";
import { useGetJobById } from "@/hooks/useGetJobById";
import { useGetBookmarkedJobs } from "@/hooks/useGetBookmarkedJobs";
import useWindowSize from "@/hooks/useWindowSize";
import { getFirstFullImage, getPrefectureName, parsePublicDate } from "@/utils/helper";
import { CompanyInfo, JobDetailExtra, RecruitingCriteria, StaffInfoExtra } from "@/utils/types";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useRef, useState, useEffect } from "react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import CButton from '@/components/common/Button';
import { useAuthContext } from "@/app/layout";
import { useMutation } from '@tanstack/react-query';
import { bookmarkJob, createApplication, getApplicationsByRole } from '@/lib/api';
import { toast } from 'react-toastify';
import Dialog from "@/components/Dialog";
import AuthModal from "@/components/modal/Auth";

export default function JobPreviewDetails() {
    const params = useParams();
    const id = params.id;
    const router = useRouter();

    const staffSectionRef = useRef<HTMLDivElement | null>(null);
    const gallerySectionRef = useRef<HTMLDivElement | null>(null);
    const aboutSectionRef = useRef<HTMLDivElement | null>(null);
    const informationSectionRef = useRef<HTMLDivElement | null>(null);

    const [authModalState, setAuthModalState] = useState(0); // 1: Login, 2: Register
    const { data, isLoading } = useGetJobById(Number(id));
    const [width] = useWindowSize();
    const { profile } = useAuthContext();
    const isLoggedIn = !!profile?.role;
    const [applyModalShown, setApplyModalShown] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
    const [jobseekerApplications, setJobseekerApplications] = useState<number[]>([]);

    // Get bookmarked jobs to check if current job is bookmarked
    const { data: bookmarkedList, refetch } = useGetBookmarkedJobs({ page: 1, limit: 10, searchTerm: '' });
    const bookmark = useMutation({
        mutationFn: bookmarkJob,
        onSuccess: (data) => {
            // Optionally invalidate or refetch queries here
            if (!data.success) return;
            if (data.data) toast.success('お気に入りの登録に成功しました。');
            else toast.success('お気に入りを排除しました。')
            refetch()
        },
        onError: (error) => {
            console.error('Error with registering favorite:', error);
            toast.error('お気に入りをご登録できません。')
        },
    });

    const onToggleBookmark = (id: number) => {
        bookmark.mutate({ job_info_id: id })
    }

    const bookmarkShouldBeDisabled = useMemo(() => {
        return bookmark.isPending || profile?.role !== 'JobSeeker'
    }, [bookmark, profile])

    const job: JobDetailExtra = useMemo(() => {
        if (!data?.data || isLoading) return null;
        return data.data;
    }, [data, isLoading])

    const themeColor = useMemo(() => {
        if (!job) return null;
        return job.job_detail_page_template_id === 1 ? 'blue' : 'orange';
    }, [job])

    // Check if current job is bookmarked
    const isBookmarked = useMemo(() => {
        let bookmarks: any[] = [];
        if (bookmarkedList?.data?.jobs) {
            bookmarks = bookmarkedList.data.jobs;
        } else if (bookmarkedList?.data?.favouritejobs) {
            bookmarks = bookmarkedList.data.favouritejobs;
        } else if (Array.isArray(bookmarkedList?.data)) {
            bookmarks = bookmarkedList.data;
        }
        return bookmarks.some((bookmark: any) => bookmark.job_info_id === Number(id));
    }, [bookmarkedList, id]);

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (profile?.role === 'JobSeeker' && profile?.id) {
            getApplicationsByRole({ job_seeker_id: profile.id, page: 1, limit: 1000 }).then(res => {
                if (res?.data?.applications) {
                    setJobseekerApplications(res.data.applications.map((a: any) => a.job_info_id));
                }
            });
        }
    }, [profile]);

    // Add state and effect for visibility like FixedBottomBar
    const [isBarVisible, setIsBarVisible] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            setIsBarVisible(scrollY > 0 && (documentHeight - (scrollY + windowHeight)) > 100);
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!mounted) return null;

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
                        <p className="font-normal">{data}</p>
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
                        {zipData && <p className="font-normal">〒{zipData.JobInfosRecruitingCriteria.body}</p>}<br />
                        {cityData && <p className="font-normal">{cityData.JobInfosRecruitingCriteria.body}</p>}
                    </div>
                </div>
                {cloned.map((criteria: RecruitingCriteria) => {
                    return (
                        <div key={criteria.name} className="flex flex-row border-t-1 border-gray-700">
                            <div className="flex-1 border-r-1 border-gray-700 p-3 bg-gray-800">
                                <p className="font-bold text-gray-300">{criteria.name}</p>
                            </div>
                            <div className="flex-3 p-3">
                                <p className="font-normal" dangerouslySetInnerHTML={{ __html: criteria.JobInfosRecruitingCriteria.body.replace(/\r?\n/g, '<br />') }} />
                            </div>
                        </div>
                    )
                })}
            </>
        )

    }

    const handleConfirmApply = async () => {
        if (!selectedJobId) return;
        try {
            const profileStr = localStorage.getItem('profile');
            let jobSeekerId = null;
            if (profileStr) {
                try {
                    const parsed = JSON.parse(profileStr);
                    jobSeekerId = parsed?.id;
                } catch (e) {
                    console.log(e);
                }
            }
            if (!jobSeekerId) {
                toast.error('求職者IDが見つかりません。ログインし直してください。');
                setApplyModalShown(false);
                return;
            }
            const res = await createApplication({ job_info_id: selectedJobId, job_seeker_id: Number(jobSeekerId) });
            if (res.success) {
                toast.success('応募が完了しました。');
                console.log(jobseekerApplications);
                setJobseekerApplications(prev => [...prev, selectedJobId]);
            } else {
                toast.error(res.message || '応募に失敗しました。');
            }
        } catch (e) {
            console.log(e);
            toast.error('応募に失敗しました。');
        }
        setApplyModalShown(false);
    };

    const alreadyApplied = jobseekerApplications.includes(job.id);

    return (
        <div className="flex flex-col pt-5">

            <p className="text-[24px] md:text-4xl text-center text-gray-300 mb-3 break-words">{job.employer.clinic_name}</p>
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

            {/* Fixed bottom bar for actions, shown/hide on scroll like <FixedBottomBar> */}
            <div
                className={`fixed bottom-0 left-0 right-0 z-30 bg-${themeColor} py-3 transition-all duration-300 ease-in-out ${isBarVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
            >
                <div className="flex flex-row justify-center gap-4">
                    <CButton
                        text={isBookmarked ? "お気に入り解除" : "お気に入り登録"}
                        className={`bg-white text-${themeColor} rounded-lg ${!isLoggedIn ? 'cursor-pointer' : bookmarkShouldBeDisabled ? '!cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                        onClick={() => {
                            if (!isLoggedIn) {
                                setAuthModalState(1);
                                return;
                            }
                            if (profile?.role === 'JobSeeker') {
                                onToggleBookmark(job.id);
                            }
                            // Do nothing for other roles
                        }}
                        disabled={bookmark.isPending || (isLoggedIn && profile?.role !== 'JobSeeker')}
                        aria-label={bookmarkShouldBeDisabled ? '求職者のみお気に入り登録できます' : undefined}
                        rightIcon={
                            <Image
                                src={`/images/icons/${isBookmarked ? 'favorite' : 'off_favorite'}.png`}
                                alt="favorite-icon"
                                width={18}
                                height={18}
                            />
                        }
                    />
                    <CButton
                        text={alreadyApplied
                            ? "応募済み"
                            : width < 768
                                ? "応募する"
                                : job.job_detail_page_template_id === 1
                                    ? "企業に直接応募する"
                                    : "転職支援サービスに応募する"
                        }
                        className={`border-2 ${themeColor === 'blue' ? 'border-blue text-blue' : 'border-orange text-orange'} rounded-sm min-w-[140px] transition py-[10px] px-[24px] text-base ${alreadyApplied ? 'bg-gray-500 text-white cursor-pointer' : 'bg-white'}`}
                        onClick={() => {
                            if (!isLoggedIn) {
                                setAuthModalState(1);
                                return;
                            }
                            if (profile?.role === 'JobSeeker' && !alreadyApplied) {
                                setSelectedJobId(job.id);
                                setApplyModalShown(true);
                            } else if (alreadyApplied) {
                                router.push('/mypage/application_mng');
                            }
                            // Do nothing for other roles
                        }}
                        disabled={bookmarkShouldBeDisabled || (isLoggedIn && profile?.role !== 'JobSeeker' && !alreadyApplied)}
                    />
                </div>
            </div>
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
                                                {(staff.first_name || staff.last_name) && <p>{staff.first_name} {staff.last_name}</p>}
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
                        { label: '会社名', value: `${job.employer.clinic_name} (${job.employer.clinic_name_kana})` },
                        { label: '事業形態', value: '法人' },
                        { label: '住所', value: (<><span>〒{job.employer.zip}</span><br /><span>{getPrefectureName(job.employer.prefectures)} {job.employer.city}</span></>) },
                        { label: '従業員数', value: job.employer.employee_number },
                        { label: '設立年月日', value: job.employer.establishment_year },
                        { label: '資本金', value: job.employer.capital_stock },
                        { label: '事業内容', value: job.employer.business },
                        { label: 'ウェブサイト', value: job.employer.home_page_url },
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
            {applyModalShown && (
                <Dialog
                    title="応募確認"
                    description="この求人に本当に応募しますか。"
                    okButtonTitle="確認"
                    okButtonColor="bg-green"
                    onPressOK={handleConfirmApply}
                    onPressCancel={() => setApplyModalShown(false)}
                />
            )}
            {authModalState > 0 && (
                <AuthModal initialStep={authModalState === 1 ? 'Login' : 'Register'} onClose={() => setAuthModalState(0)} />
            )}
        </div >
    );
}

