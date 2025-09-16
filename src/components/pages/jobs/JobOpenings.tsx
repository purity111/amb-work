import CButton from "@/components/common/Button";
import Pagination from "@/components/common/Pagination";
import Spinner from "@/components/common/Spinner";
import JobFilterModal from "@/components/modal/JobFilterModal";
import { useGetBookmarkedJobs } from "@/hooks/useGetBookmarkedJobs";
import { useGetJobs } from "@/hooks/useGetJobs";

import { bookmarkJob, createApplication, getApplicationsByRole, sendScheduleAdjustmentEmail } from "@/lib/api";
import { getFeatureParam, getFilterJobUrl, getFirstFullImage } from "@/utils/helper";
import { BookmarkJob, FeatureItem, FeatureParams, JobDetail, PickOption } from "@/utils/types";
import { useMutation } from "@tanstack/react-query";
import { differenceInDays } from "date-fns";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { JobFilterFormValue } from "./JobFilterForm";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useGetFeatures } from "@/hooks/useGetFeatures";
import { MapData } from "@/utils/constants";
import Dialog from '@/components/Dialog';
import Link from "next/link";
import AuthModal from "@/components/modal/Auth";

const now = new Date();

export default function JobList({
    prefectures: propPrefectures,
    jobTypes: propJobTypes,
    items: propItems,
    conditions: propConditions,
    employmentTypes: propEmploymentTypes,
    onJobCountChange
}: {
    prefectures?: string,
    jobTypes?: string,
    items?: string,
    conditions?: string,
    employmentTypes?: string,
    onJobCountChange?: (count: number) => void
} = {}) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const [limit] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalJobCount, setTotalJobCount] = useState(0);
    const [totalPageCount, setTotalPageCount] = useState(0);
    const [jobData, setJobData] = useState<JobDetail[]>([]);
    const [recommendJobData, setRecommendJobData] = useState<JobDetail[]>([]);
    const [filterModalShown, setFilterModalShown] = useState(false);
    const [prefectures, setPrefectures] = useState<string[]>([]);
    const [features, setFeatures] = useState<FeatureParams | null>(null);
    const [searchTags, setSearchTags] = useState<PickOption[]>([]);
    const [applyModalShown, setApplyModalShown] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
    const [jobseekerApplications, setJobseekerApplications] = useState<number[]>([]);
    const [optimisticBookmarkedSet, setOptimisticBookmarkedSet] = useState<Set<number>>(new Set());
    const [authModalState, setAuthModalState] = useState(0); // 1: Login, 2: Register
    const [selectedJobIdForAuth, setSelectedJobIdForAuth] = useState<number | null>(null);

    const router = useRouter()
    const urlIndexingParam = useParams();
    // Use props if provided, otherwise use params
    const pString = propPrefectures ?? (urlIndexingParam.prefectures as string);
    const jString = propJobTypes ?? (urlIndexingParam.jobTypes as string);
    const iString = propItems ?? (urlIndexingParam.items as string);
    const cString = propConditions ?? (urlIndexingParam.conditions as string);
    const eString = propEmploymentTypes ?? (urlIndexingParam.employmentTypes as string);

    const { data: featuresData } = useGetFeatures();
    const { data, isLoading, isError } = useGetJobs({
        page: currentPage,
        limit,
        searchTerm,
        isAdmin: '0',
        prefectures,
        features: getFeatureParam(features).map(String),
        recommend: 1
    })

    const { profile } = useAuthContext();
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

    useEffect(() => {
        if (isLoading) return;
        if (data?.success && data.data) {
            const { jobs, pagination } = data.data;
            setJobData(jobs || []);
            const newJobCount = pagination?.total || 0;
            setTotalJobCount(newJobCount)
            setTotalPageCount(pagination?.totalPages || 0)
            // Call the callback to update parent component
            if (onJobCountChange) {
                onJobCountChange(newJobCount);
            }
        }
    }, [data, isLoading, onJobCountChange])

    // Set recommended jobs from the single API call with recommend=1
    useEffect(() => {
        if (isClient && data?.success && data.data) {
            setRecommendJobData(data.data.recommendedJobs || []);
        }
    }, [data, isClient])

    const hasLoaded = useRef(false);

    const searchParams = useSearchParams();
    useEffect(() => {
        if (!featuresData?.data) return;
        const params = new URLSearchParams(searchParams.toString());
        const searchText = params.get('searchTerm');
        const page = params.get('page');
        setSearchTerm(searchText || '')
        setCurrentPage(Number(page) || 1)
        parseFeaturesAndPrefecturesParam()
        hasLoaded.current = true;
    }, [searchParams, featuresData])

    useEffect(() => {
        if (!hasLoaded.current) return;
        const params = new URLSearchParams();
        params.set('page', currentPage.toString());
        params.set('limit', limit.toString());
        params.set('searchTerm', searchTerm)

        // Build current filter snapshot to keep clean path
        const currentFilterValue = {
            prefectures: (prefectures || []).map(p => parseInt(p)),
            jobTypes: features?.jobTypes || [],
            items: features?.items || [],
            conditions: features?.conditions || [],
            employmentTypes: features?.employmentTypes || []
        };
        if (featuresData?.data) {
            const url = getFilterJobUrl(currentFilterValue, featuresData.data);
            router.push(`${url}?${params.toString()}`);
        } else {
            router.push(`?${params.toString()}`);
        }
    }, [currentPage, limit, searchTerm, prefectures, features, featuresData])

    useEffect(() => {
        let bookmarks: BookmarkJob[] = [];
        if (bookmarkedList?.data?.jobs) {
            bookmarks = bookmarkedList.data.jobs;
        } else if (bookmarkedList?.data?.favouritejobs) {
            bookmarks = bookmarkedList.data.favouritejobs;
        } else if (Array.isArray(bookmarkedList?.data)) {
            bookmarks = bookmarkedList.data;
        }
        setOptimisticBookmarkedSet(new Set(bookmarks.map((i: BookmarkJob) => i.job_info_id)));
    }, [bookmarkedList]);

    const bookmarkShouldBeDisabled = useMemo(() => {
        return bookmark.isPending || profile?.role !== 'JobSeeker'
    }, [bookmark, profile])

    const cityAll = useMemo(() => {
        let res: Array<{ id: number, text: string }> = [];
        MapData.forEach(item => {
            res = res.concat(item.city)
        })
        return res;
    }, [MapData])

    const parseFeaturesAndPrefecturesParam = () => {
        // Handle placeholder values ('-') by treating them as empty strings
        const jArray = jString && jString !== '-' ? jString.split('-') : [];
        const iArray = iString && iString !== '-' ? iString.split('-') : [];
        const cArray = cString && cString !== '-' ? cString.split('-') : [];
        const eArray = eString && eString !== '-' ? eString.split('-') : [];
        const parsedFeatures = {
            jobTypes: featuresData.data.filter((i: FeatureItem) => !!jArray.includes(encodeURIComponent(i.name))).map((k: FeatureItem) => k.id),
            items: featuresData.data.filter((i: FeatureItem) => !!iArray.includes(encodeURIComponent(i.name))).map((k: FeatureItem) => k.id),
            conditions: featuresData.data.filter((i: FeatureItem) => !!cArray.includes(encodeURIComponent(i.name))).map((k: FeatureItem) => k.id),
            employmentTypes: featuresData.data.filter((i: FeatureItem) => !!eArray.includes(encodeURIComponent(i.name))).map((k: FeatureItem) => k.id),
        };
        setFeatures(parsedFeatures);
        // set prefecture data from url
        const pTemp: string[] = [];
        const pArray = pString && pString !== '-' ? pString.split('-') : [];
        const normalizePref = (s: string) => decodeURIComponent(s).replace(/[都道府県]$/u, '');
        pArray.forEach(p => {
            const find = cityAll.find((i) => normalizePref(i.text) === normalizePref(p));
            if (find) pTemp.push(find.id.toString())
        })
        setPrefectures(pTemp);
        // set searchTags here
        const tagList = [
            ...pTemp.map((item: string, index: number) => ({
                value: item,
                option: decodeURIComponent(pArray[index])
            })),
            ...parsedFeatures.jobTypes.map((item: number, index: number) => ({
                value: item,
                option: decodeURIComponent(jArray[index])
            })),
            ...parsedFeatures.items.map((item: number, index: number) => ({
                value: item,
                option: decodeURIComponent(iArray[index])
            })),
            ...parsedFeatures.conditions.map((item: number, index: number) => ({
                value: item,
                option: decodeURIComponent(cArray[index])
            })),
            ...parsedFeatures.employmentTypes.map((item: number, index: number) => ({
                value: item,
                option: decodeURIComponent(eArray[index])
            })),
        ]
        setSearchTags(tagList);
        // set document title here

    }

    useEffect(() => {
        // Fetch applications for the current jobseeker
        if (profile?.role === 'JobSeeker' && profile?.id) {
            getApplicationsByRole({ job_seeker_id: profile.id, page: 1, limit: 1000 }).then(res => {
                if (res?.data?.applications) {
                    setJobseekerApplications(res.data.applications.map((a: any) => a.job_info_id));
                }
            });
        }
    }, [profile]);

    if (isLoading) {
        return (
            <Spinner />
        )
    }

    if (isError) {
        return (
            <p>
                Failed in getting jobs
            </p>
        )
    }

    const onPageChange = (page: number) => {
        setCurrentPage(page)
    }

    const onSubmitFilterForm = (value: JobFilterFormValue, searchText: string) => {
        setFilterModalShown(false);
        const url = getFilterJobUrl(value, featuresData.data);
        const params = new URLSearchParams();
        params.set('page', currentPage.toString());
        params.set('limit', limit.toString());
        params.set('searchTerm', searchText)
        router.push(`${url}?${params.toString()}`);
    }

    const getPrefecture = (features: FeatureItem[]) => {
        const find = features.find(i => {
            if (i?.parent_id && i?.parent_id > 34 && i?.parent_id < 43) return true;
            return false;
        })
        if (!find) return 'None';
        return find.name;
    }

    const onToggleBookmark = (id: number) => {
        setOptimisticBookmarkedSet(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
        bookmark.mutate({ job_info_id: id });
    }

    const isBookmarked = (id: number) => optimisticBookmarkedSet.has(id);

    const isLoggedIn = !!profile?.role;

    const renderEmploymentTypeTags = (features: FeatureItem[]) => {
        const filtered = features.filter(i => i.parent_id === 4);
        return filtered.map(i => (
            <span key={i.id} className="border-1 border-red py-[2px] px-2 text-red text-[11px] rounded-xs">{i.name}</span>
        ))
    }

    const renderPagination = () => {
        if (!jobData?.length && totalPageCount <= 1) {
            return null;
        }
        return (
            <div className="flex justify-center my-4">
                <Pagination
                    page={currentPage}
                    totalPages={totalPageCount}
                    onPageChange={onPageChange}
                />
            </div>
        )
    }

    const handleApply = (jobId: number) => {
        setSelectedJobId(jobId);
        setApplyModalShown(true);
    };

    const handleConfirmApply = async () => {
        if (!selectedJobId) return;
        try {
            const profileStr = localStorage.getItem('profile');
            let jobSeekerId = null;
            let jobSeekerEmail = null;
            let jobSeekerName = null;
            if (profileStr) {
                try {
                    const parsed = JSON.parse(profileStr);
                    jobSeekerId = parsed?.id;
                    jobSeekerEmail = parsed?.email;
                    jobSeekerName = parsed?.name;
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
                setJobseekerApplications(prev => [...prev, selectedJobId]);
                
                // Send schedule adjustment email for career counseling service jobs
                const selectedJob = jobData.find(job => job.id === selectedJobId);
                if (selectedJob && selectedJob.job_detail_page_template_id === 2 && jobSeekerEmail && jobSeekerName) {
                    try {
                        await sendScheduleAdjustmentEmail({
                            jobSeekerId: Number(jobSeekerId),
                            jobId: selectedJobId,
                            jobSeekerEmail: jobSeekerEmail,
                            jobSeekerName: jobSeekerName
                        });
                        console.log('Schedule adjustment email sent successfully');
                    } catch (emailError) {
                        console.error('Failed to send schedule adjustment email:', emailError);
                        // Don't show error to user as the application was successful
                    }
                }
            } else {
                toast.error(res.message || '応募に失敗しました。');
            }
        } catch (e) {
            console.log(e);
            toast.error('応募に失敗しました。');
        }
        setApplyModalShown(false);
    };

    if (!isClient) {
        return (
            <div className="pb-10 md:pb-30">
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue mx-auto"></div>
                    <p className="mt-2 text-gray-600">読み込み中...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-10 md:pb-30">
            <div className="py-2 top-20 md:top-25 bg-white z-10 border-b-2 border-gray-700">
                <div className="flex flex-col md:flex-row items-center">
                    <p className="text-lg flex-1 pb-2">
                        {`検索結果：${totalJobCount}件`}
                    </p>
                    <div className="flex flex-row items-center">
                        <Link href='/job-openings'>
                            <CButton
                                text="フィルターをクリア"
                                className="bg-red text-white rounded-sm mr-2 text-xs md:text-base"
                            />
                        </Link>
                        <CButton
                            text="さらに条件を追加する"
                            leftIcon={<span className="text-base pr-2">+</span>}
                            className="bg-green text-white rounded-sm text-xs md:text-base tracking-[0.18em]"
                            onClick={() => setFilterModalShown(true)}
                        />
                    </div>
                </div>
                <div className="flex flex-row flex-wrap space-x-2 pt-2">
                    {searchTags.map((tag: PickOption) => {
                        return (
                            <CButton
                                key={tag.value}
                                className="bg-orange mb-2 text-xs"
                                size="small"
                                text={tag.option}
                            />
                        )
                    })}
                    {searchTerm && (
                        <CButton
                            key={'search'}
                            className="bg-blue mb-2"
                            size="small"
                            text={`キーワード検索(タイトル): ${searchTerm}`}
                        />
                    )}
                </div>
            </div>
            {!jobData?.length && <p className="text-gray-600 mt-4">結果なし</p>}
            {renderPagination()}

            {/* Recommended Jobs Section */}
            {isLoading && (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue mx-auto"></div>
                    <p className="mt-2 text-gray-600">おすすめの求人を読み込み中...</p>
                </div>
            )}

            {recommendJobData.length > 0 && (
                <div>
                    <h3 className="text-[22px] md:text-[26px] text-bold text-[#007eff]">おすすめの求人</h3>
                    <div className="mt-2 mt-8 flex flex-col md:flex-row gap-4 px-3 md:px-0">
                        {recommendJobData.map((job: JobDetail) => (
                            <Link key={job.id} href={`/job-openings/recruit/${job.id}`} className="block w-full mb-5 md:w-1/3">
                                <div className="relative aspect-[4/3] w-full rounded overflow-hidden shadow hover:shadow-lg transition-shadow bg-white">
                                    <Image
                                        src={getFirstFullImage(job.jobThumbnails) || '/images/default-company.png'}
                                        alt={job.job_title}
                                        fill
                                        className="object-cover"
                                        sizes="20vw"
                                    />
                                    <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white text-center py-2 px-2 text-base md:text-lg font-semibold truncate">
                                        {job.job_title}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <hr className="w-full h-[1px] border-gray-700 my-10" />
                </div>
            )}

            {jobData.map((job: JobDetail) => {
                const alreadyApplied = jobseekerApplications.includes(job.id);
                const isTemplate2 = job.job_detail_page_template_id === 2;
                const applyButtonText = alreadyApplied
                    ? "応募済み"
                    : isTemplate2
                        ? "転職支援サービスに応募する"
                        : "企業に直接応募する";
                const applyButtonTextSP = alreadyApplied
                    ? "応募済み"
                    : isTemplate2
                        ? "転職支援応募"
                        : "企業応募";
                const bookmarkButtonTextSP = "お気に入り";
                const applyButtonClass = alreadyApplied
                    ? 'w-full text-white rounded-sm bg-gray-400 cursor-not-allowed'
                    : `w-full text-white rounded-sm ${isTemplate2 ? 'bg-orange' : 'bg-blue'}`;
                return (
                    <div className="mb-4 md:mb-10" key={job.id}>
                        <a href={`/job-openings/recruit/${job.id}`}>
                            <div className="hover:bg-gray-800 rounded-br-none rounded-bl-none rounded-md cursor-pointer">
                                <div className="flex flex-row space-x-4 pt-3 px-4">
                                    {differenceInDays(now, new Date(job.created)) < 7 && (
                                        <span className="py-[2px] px-2 text-sm text-white bg-red">NEW</span>
                                    )}
                                    {renderEmploymentTypeTags(job.features)}
                                </div>
                                <p className="px-4 pt-3 text-base md:text-xl font-bold text-gray-300">{job.job_title}</p>
                                <h5 className="px-4 pt-3 text-xs md:text-sm text-gray-300">{job?.employer?.clinic_name}</h5>
                                <div className="flex flex-col md:flex-row py-2 md:py-8 px-4">
                                    <div className="w-full md:max-w-75 aspect-3/2 relative">
                                        <Image
                                            className="object-cover rounded-tr-[30px]"
                                            src={getFirstFullImage(job.jobThumbnails) || '/images/default-company.png'}
                                            alt="thumbnail"
                                            fill
                                            sizes="50vw"
                                        />
                                    </div>
                                    <div className="flex-1 mt-6 md:mt-0 md:pl-6">
                                        <p className="pb-4 border-b-1 text-xs md:text-base border-gray-700">{job.job_lead_statement || 'No description'}</p>
                                        <div className="flex flex-row py-3 md:py-4 border-b-1 border-gray-700 text-xs md:text-base">
                                            <div className="flex-1">
                                                <p>勤務地</p>
                                            </div>
                                            <div className="flex-3">
                                                <p>{getPrefecture(job.features)}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-row py-3 md:py-4 border-b-1 border-gray-700 text-xs md:text-base">
                                            <div className="flex-1">
                                                <p>最寄り駅</p>
                                            </div>
                                            <div className="flex-3">
                                                <p>{job.closest_station || ''}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-row py-3 md:py-4 border-b-1 border-gray-700 text-xs md:text-base">
                                            <div className="flex-1">
                                                <p>給与</p>
                                            </div>
                                            <div className="flex-3">
                                                <p>{job.pay}</p>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </a>
                        <div className="flex flex-col md:flex-row p-2 sm:p-4 md:p-8 bg-gray-800 rounded-tr-none rounded-tl-none rounded-md">
                            {/* SP mode: flex layout for bookmark and apply buttons */}
                            <div className="flex md:hidden flex-row space-x-4">
                                <CButton
                                    text={bookmarkButtonTextSP}
                                    className={`flex-1 border-2 border-yellow text-yellow rounded-sm ${!isLoggedIn ? 'cursor-pointer' : bookmarkShouldBeDisabled ? '!cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                                    onClick={() => {
                                        if (!isLoggedIn) {
                                            setSelectedJobIdForAuth(job.id);
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
                                        bookmark.isPending ?
                                            <Spinner size={4} color="orange" />
                                            : <Image src={`/images/icons/${isBookmarked(job.id) ? 'favorite' : 'off_favorite'}.png`} alt="favorite-icon" width={20} height={20} />
                                    }
                                />
                                <CButton
                                    text={applyButtonTextSP}
                                    hasNavIcon
                                    onClick={() => {
                                        if (!isLoggedIn) {
                                            setSelectedJobIdForAuth(job.id);
                                            setAuthModalState(1);
                                        } else if (profile?.role === 'JobSeeker' && !alreadyApplied) handleApply(job.id);
                                        else if (alreadyApplied) router.push('/mypage/application_mng');
                                    }}
                                    className={`flex-1 ${applyButtonClass}`}
                                    disabled={bookmark.isPending}
                                />
                            </div>
                            
                            {/* Desktop mode: original layout */}
                            <div className="hidden md:flex flex-1 md:flex-4 flex-row space-x-4 md:space-x-8">
                                <CButton
                                    text={isBookmarked(job.id) ? "お気に入り解除" : "お気に入り登録"}
                                    className={`flex-1 border-2 border-yellow text-yellow rounded-sm ${!isLoggedIn ? 'cursor-pointer' : bookmarkShouldBeDisabled ? '!cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                                    onClick={() => {
                                        if (!isLoggedIn) {
                                            setSelectedJobIdForAuth(job.id);
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
                                        bookmark.isPending ?
                                            <Spinner size={4} color="orange" />
                                            : <Image src={`/images/icons/${isBookmarked(job.id) ? 'favorite' : 'off_favorite'}.png`} alt="favorite-icon" width={20} height={20} />
                                    }
                                />
                                <a href={`/job-openings/recruit/${job.id}`} className="flex-1" target="_blank">
                                    <CButton
                                        text="詳細を見る"
                                        hasNavIcon
                                        className="w-full h-full bg-green text-white rounded-sm"
                                    />
                                </a>
                            </div>
                            <div className="hidden md:flex flex-1 md:flex-3 flex-row pt-4 md:pt-0 md:pl-8">
                                <CButton
                                    text={applyButtonText}
                                    hasNavIcon
                                    onClick={() => {
                                        if (!isLoggedIn) {
                                            setSelectedJobIdForAuth(job.id);
                                            setAuthModalState(1);
                                        } else if (profile?.role === 'JobSeeker' && !alreadyApplied) handleApply(job.id);
                                        else if (alreadyApplied) router.push('/mypage/application_mng');
                                    }}
                                    className={applyButtonClass}
                                    disabled={bookmark.isPending}
                                />
                            </div>
                        </div>
                    </div>
                )
            })}
            {renderPagination()}
            {filterModalShown && (
                <JobFilterModal
                    onClose={() => setFilterModalShown(false)}
                    onSubmit={(value, searchText) => onSubmitFilterForm(value, searchText)}
                    features={getFeatureParam(features).map(String)}
                    prefectures={prefectures}
                    searchText={searchTerm}
                />
            )}
            {authModalState > 0 && (
                <AuthModal 
                    initialStep={authModalState === 1 ? 'Login' : 'Register'} 
                    onClose={() => {
                        setAuthModalState(0);
                        setSelectedJobIdForAuth(null);
                    }}
                    jobId={selectedJobIdForAuth}
                />
            )}
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
        </div>
    )
}