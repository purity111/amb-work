import CButton from "@/components/common/Button";
import Pagination from "@/components/common/Pagination";
import Spinner from "@/components/common/Spinner";
import JobFilterModal from "@/components/modal/JobFilterModal";
import { useGetBookmarkedJobs } from "@/hooks/useGetBookmarkedJobs";
import { useGetJobs } from "@/hooks/useGetJobs";
import { bookmarkJob, createApplication, getApplicationsByRole } from "@/lib/api";
import { getFirstFullImage } from "@/utils/helper";
import { BookmarkJob, FeatureItem, JobDetail, PickOption } from "@/utils/types";
import { useMutation } from "@tanstack/react-query";
import { differenceInDays } from "date-fns";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { JobFilterFormValue } from "./JobFilterForm";
import { useAuthContext } from "@/app/layout";
import { useGetFeatures } from "@/hooks/useGetFeatures";
import { MapData } from "@/utils/constants";
import LoginModal from "@/components/modal/Login";
import Dialog from '@/components/Dialog';

const now = new Date();

export default function JobList() {
    const [limit] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalJobCount, setTotalJobCount] = useState(0);
    const [totalPageCount, setTotalPageCount] = useState(0);
    const [jobData, setJobData] = useState<JobDetail[]>([]);
    const [filterModalShown, setFilterModalShown] = useState(false);
    const [prefectures, setPrefectures] = useState<string[]>([]);
    const [features, setFeatures] = useState<string[]>([]);
    const [searchTags, setSearchTags] = useState<PickOption[]>([]);
    const [loginModalShown, setLoginModalShown] = useState(false);
    const [applyModalShown, setApplyModalShown] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
    const [jobseekerApplications, setJobseekerApplications] = useState<number[]>([]);
    const [optimisticBookmarkedSet, setOptimisticBookmarkedSet] = useState<Set<number>>(new Set());

    const router = useRouter()

    const { data: featuresData } = useGetFeatures();
    const { data, isLoading, isError } = useGetJobs({
        page: currentPage,
        limit,
        searchTerm,
        isAdmin: '0',
        prefectures,
        features
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
            console.log('jobs', jobs);
            
            setJobData(jobs || []);
            setTotalJobCount(pagination?.total || 0)
            setTotalPageCount(pagination?.totalPages || 0)
        }
    }, [data, isLoading])

    const hasLoaded = useRef(false);

    const searchParams = useSearchParams();
    useEffect(() => {
        if (!featuresData?.data) return;
        const params = new URLSearchParams(searchParams.toString());
        const searchText = params.get('searchTerm');
        const page = params.get('page');
        const featuresParam = params.get('features');
        const prefecturesParam = params.get('prefectures');
        setSearchTerm(searchText || '')
        setCurrentPage(Number(page) || 1)
        parseFeaturesAndPrefecturesParam(featuresParam || '', prefecturesParam || '')
        hasLoaded.current = true;
    }, [searchParams, featuresData])

    console.log({profile})

    useEffect(() => {
        if (!hasLoaded.current) return;
        const params = new URLSearchParams();
        params.set('page', currentPage.toString());
        params.set('limit', limit.toString());
        params.set('searchTerm', searchTerm)
        params.set('prefectures', getPrefecturesParam)
        params.set('features', getFeaturesParam)
        router.push(`?${params.toString()}`);
    }, [currentPage, limit, searchTerm, prefectures, features])

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

    const getFeaturesParam = useMemo(() => {
        if (!featuresData?.data) return ''
        const res: string[] = [];
        features.forEach(f => {
            const find = featuresData.data.find((i: FeatureItem) => i.id.toString() === f);
            if (find) res.push(find.name)
        })
        return res.join(',');
    }, [features, featuresData])

    const getPrefecturesParam = useMemo(() => {
        const res: string[] = [];
        prefectures.forEach(p => {
            const find = cityAll.find((i) => i.id.toString() === p);
            if (find) res.push(find.text)
        })
        return res.join(',');
    }, [prefectures, cityAll])

    useEffect(() => {
        const res: PickOption[] = [];
        const fArray = getFeaturesParam.split(',')
        const pArray = getPrefecturesParam.split(',')
        features.forEach((f, index) => {
            res.push({
                value: f.toString(),
                option: fArray[index]
            })
        })
        prefectures.forEach((f, index) => {
            res.push({
                value: f.toString(),
                option: pArray[index]
            })
        })
        setSearchTags(res);
    }, [features, getFeaturesParam, prefectures, getPrefecturesParam])

    const parseFeaturesAndPrefecturesParam = (features: string, prefectures: string) => {
        const fArray = features.split(',');
        const pArray = prefectures.split(',');
        const fTemp: string[] = [], pTemp: string[] = []
        fArray.forEach(f => {
            const find = featuresData.data.find((i: FeatureItem) => i.name === f);
            if (find) fTemp.push(find.id.toString())
        })
        pArray.forEach(p => {
            const find = cityAll.find((i) => i.text === p);
            if (find) pTemp.push(find.id.toString())
        })
        setFeatures(fTemp);
        setPrefectures(pTemp);
    }

    useEffect(() => {
        // Build title from current filters
        const prefectureNames = getPrefecturesParam.split(',').filter(Boolean);
        const featureNames = getFeaturesParam.split(',').filter(Boolean);
        let title = 'リユース転職の';
        if (prefectureNames.length > 0) {
            title += prefectureNames.join('、') + '地域で';
        }
        if (featureNames.length > 0) {
            title += '「' + featureNames.join('」、「') + '」の求人';
        } else {
            title += '求人';
        }
        document.title = title;
    }, [getPrefecturesParam, getFeaturesParam]);

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
        setPrefectures(value.prefectures?.map(String) || []);
        const { conditions = [], employmentTypes = [], items = [], jobTypes = [] } = value;
        setFeatures([...conditions, ...employmentTypes, ...items, ...jobTypes].map(String))
        setSearchTerm(searchText);
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
            <span key={i.id} className="border-1 border-red py-[2px] px-2 text-red text-sm rounded-xs">{i.name}</span>
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
            if (profileStr) {
                try {
                    const parsed = JSON.parse(profileStr);
                    jobSeekerId = parsed?.id;
                } catch (e) {console.log(e);
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
            } else {
                toast.error(res.message || '応募に失敗しました。');
            }
        } catch (e) {
            console.log(e);
            toast.error('応募に失敗しました。');
        }
        setApplyModalShown(false);
    };

    return (
        <div className="pb-30">
            <div className="py-2 sticky top-20 md:top-25 bg-white z-10 border-b-2 border-gray-700">
                <div className="flex flex-row justify-between items-center">
                    <p className="text-lg">
                        {`検索結果：${totalJobCount}件`}
                    </p>
                    <CButton
                        text="さらに条件を追加する"
                        leftIcon={<span>+</span>}
                        className="bg-green text-white rounded-sm"
                        onClick={() => setFilterModalShown(true)}
                    />
                </div>
                <div className="my-2 flex flex-row flex-wrap space-x-2">
                    {searchTags.map((tag: PickOption) => {
                        return (
                            <CButton
                                key={tag.value}
                                className="bg-orange"
                                size="small"
                                text={tag.option}
                            />
                        )
                    })}
                </div>
            </div>
            {!jobData?.length && <p className="text-gray-600 mt-4">No results</p>}
            {renderPagination()}
            {jobData.map((job: JobDetail) => {
                const alreadyApplied = jobseekerApplications.includes(job.id);
                const isTemplate2 = job.job_detail_page_template_id === 2;
                const applyButtonText = alreadyApplied
                    ? "応募済み"
                    : isTemplate2
                        ? "転職支援サービスに応募する"
                        : "企業に直接応募する";
                const applyButtonClass = alreadyApplied
                    ? 'w-full text-white rounded-sm bg-gray-400 cursor-not-allowed'
                    : `w-full text-white rounded-sm ${isTemplate2 ? 'bg-orange' : 'bg-blue'}`;
                return (
                    <div key={job.id} className="py-10">
                        <div className="flex flex-row space-x-4">
                            {differenceInDays(now, new Date(job.created)) < 7 && (
                                <span className="py-[2px] px-2 text-sm text-white bg-red">NEW</span>
                            )}
                            {renderEmploymentTypeTags(job.features)}
                        </div>
                        <p className="pt-3 text-xl font-bold text-gray-300">{job.job_title}</p>
                        <div className="flex flex-col md:flex-row py-8">
                            <div className="w-full md:max-w-75 aspect-3/2  relative">
                                <Image
                                    className="object-cover rounded-tr-[30px]"
                                    src={getFirstFullImage(job.jobThumbnails) || '/images/default-company.png'}
                                    alt="thumbnail"
                                    fill
                                />
                            </div>
                            <div className="flex-1 mt-6 md:mt-0 md:pl-6">
                                <p className="pb-4 border-b-1 border-gray-700">{job.job_lead_statement || 'No description'}</p>
                                <div className="flex flex-row py-4 border-b-1 border-gray-700">
                                    <div className="flex-1">
                                        <p>勤務地</p>
                                    </div>
                                    <div className="flex-3">
                                        <p>{getPrefecture(job.features)}</p>
                                    </div>
                                </div>
                                <div className="flex flex-row py-4 border-b-1 border-gray-700">
                                    <div className="flex-1">
                                        <p>最寄り駅</p>
                                    </div>
                                    <div className="flex-3">
                                        <p>{job.employer.closest_station || ''}</p>
                                    </div>
                                </div>
                                <div className="flex flex-row py-4 border-b-1 border-gray-700">
                                    <div className="flex-1">
                                        <p>給与</p>
                                    </div>
                                    <div className="flex-3">
                                        <p>{job.pay}</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="flex flex-col md:flex-row p-2 sm:p-4 md:p-8 bg-gray-800 rounded-md">
                            <div className="flex-1 md:flex-4 flex flex-row space-x-4 md:space-x-8">
                                <CButton
                                    text={isBookmarked(job.id) ? "お気に入り解除" : "お気に入り登録"}
                                    className={`flex-1 border-2 border-yellow text-yellow rounded-sm ${!isLoggedIn ? 'cursor-pointer' : bookmarkShouldBeDisabled ? '!cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                                    onClick={() => {
                                        if (!isLoggedIn) setLoginModalShown(true);
                                        else if (profile?.role === 'JobSeeker') onToggleBookmark(job.id);
                                    }}
                                    disabled={bookmarkShouldBeDisabled}
                                    aria-label={bookmarkShouldBeDisabled ? '求職者のみお気に入り登録できます' : undefined}
                                    rightIcon={
                                        bookmark.isPending ?
                                            <Spinner size={4} color="orange" />
                                            : <Image src={`/images/icons/${isBookmarked(job.id) ? 'favorite' : 'off_favorite'}.png`} alt="favorite-icon" width={20} height={20} />
                                    }
                                />
                                <a href={`/jobs/recruit/${job.id}`} className="flex-1" target="_blank">
                                    <CButton
                                        text="詳細を見る"
                                        hasNavIcon
                                        className="w-full h-full bg-green text-white rounded-sm"
                                    />
                                </a>
                            </div>
                            <div className="flex-1 md:flex-3 flex flex-row pt-4 md:pt-0 md:pl-8">
                                <CButton
                                    text={applyButtonText}
                                    hasNavIcon
                                    onClick={() => {
                                        if (!isLoggedIn) setLoginModalShown(true);
                                        else if (profile?.role === 'JobSeeker' && !alreadyApplied) handleApply(job.id);
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
                    features={features}
                    prefectures={prefectures}
                    searchText={searchTerm}
                />
            )}
            {loginModalShown && (
                <LoginModal onClose={() => setLoginModalShown(false)} onSuccess={() => setLoginModalShown(false)} />
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