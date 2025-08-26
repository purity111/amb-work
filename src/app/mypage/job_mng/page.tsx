"use client";

import { useAuthContext } from "@/app/layout";
import CButton from "@/components/common/Button";
import CInput from "@/components/common/Input";
import CSelect from "@/components/common/Select";
import { JobStatusOptions, JobTypeOptions } from "@/utils/constants";
import Image from "next/image";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { CSVLink } from "react-csv";
import Pagination from "@/components/common/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetAllEmployerInfos } from "@/hooks/useGetAllEmployerInfos";
import { useGetJobs } from "@/hooks/useGetJobs";
import { JobDetail, PickOption } from "@/utils/types";
import { formatTimeAgo, generateJobCSVData, getFirstFullImage } from "@/utils/helper";
import { useMutation } from "@tanstack/react-query";
import { deleteJobById } from "@/lib/api";
import { toast } from "react-toastify";
import { format } from 'date-fns';
import Dialog from "@/components/Dialog";
import Spinner from "@/components/common/Spinner";

export default function JobMngPage() {
  const [jobType, setJobType] = useState<string>('0');
  const [companyOptions, setCompanyOptions] = useState<PickOption[]>([]);
  const [company, setCompany] = useState('0')
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [tempSearch, setTempSearch] = useState('');
  const [deleteJobId, setDeleteJobId] = useState(0);
  const [selectedJobs, setSelectedJobs] = useState<Record<number, JobDetail | null>>({});


  const router = useRouter()
  const { profile, isAdmin } = useAuthContext();
  const { data, isLoading } = useGetAllEmployerInfos(profile?.role);
  const { data: jobs, isLoading: jobLoading, refetch } = useGetJobs({
    page: currentPage,
    limit,
    searchTerm,
    companyID: Number(company),
    jobType: jobType === '3' ? 0 : Number(jobType),
    isAdmin: profile?.role === 'JobSeeker' ? '0' : '1',
    employer_id: profile?.role === 'Employer' ? profile.id : 0,
    public_status: jobType === '3' ? 2 : undefined
  })

  const { data: allFilteredJobs } = useGetJobs({
    page: 1,
    limit: 999999,
    searchTerm,
    companyID: Number(company),
    jobType: Number(jobType),
    isAdmin: profile?.role === 'JobSeeker' ? '0' : '1',
    employer_id: profile?.role === 'Employer' ? profile.id : 0,
    sortBy: 'employer_id'
  })

  const hasLoaded = useRef(false);

  const searchParams = useSearchParams();

  // Employer/Admin access control
  useEffect(() => {
    if (profile && !(profile.role === 'Employer' || profile.role === 'admin')) {
      router.replace("/mypage");
    }
  }, [profile, router]);

  useEffect(() => {
    refetch();
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const companyId = params.get('companyID');
    const searchText = params.get('searchTerm');
    setCompany(companyId || '');
    setSearchTerm(searchText || '')
    setTempSearch(searchText || '')
    hasLoaded.current = true;
  }, [searchParams])

  useEffect(() => {
    if (!hasLoaded.current) return;
    const params = new URLSearchParams();
    params.set('page', currentPage.toString());
    params.set('limit', limit.toString());
    params.set('searchTerm', searchTerm)
    params.set('jobType', jobType)
    params.set('companyID', company)
    router.push(`?${params.toString()}`);
  }, [currentPage, limit, searchTerm, company, jobType])

  useEffect(() => {
    setSelectedJobs({})
  }, [company, jobType])

  const deleteJob = useMutation({
    mutationFn: deleteJobById,
    onSuccess: (data) => {
      // Optionally invalidate or refetch queries here
      console.log('Create new job: ', data)
      toast.success('求人を削除しました。')
      refetch();
    },
    onError: (error) => {
      console.error('Error with creating new job:', error);
      toast.error('求人の削除に失敗しました。')
    },
  });

  useEffect(() => {
    if (isLoading) return;
    if (data?.success) {
      const options = data.data.employers.map((i: any) => ({
        value: i.id,
        option: i.clinic_name
      }));
      setCompanyOptions([
        {
          value: '0',
          option: 'すべて'
        },
        ...options
      ])
    }
  }, [data, isLoading])

  useEffect(() => {
    if (jobLoading) return;
    if (jobs?.success) {
      const pageCount = jobs.data.pagination.totalPages;
      setTotalPage(pageCount)
    }
  }, [jobs, jobLoading])

  const getSelectedJobs = useMemo(() => {
    const filtered = Object.values(selectedJobs).filter((job: JobDetail | null) => !!job);
    return filtered;
  }, [selectedJobs])

  const onSelectJobType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setJobType(e.target.value as string);
  };

  const onSelectCompany = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCompany(e.target.value as string);
  };

  const onPageChange = (page: number) => {
    setCurrentPage(page)
  }

  const onClickAddNewJob = (event?: React.MouseEvent) => {
    // If Ctrl+click (or Cmd+click on Mac), open in new tab
    if (event && (event.ctrlKey || event.metaKey)) {
      window.open('/mypage/job_mng/post-new', '_blank');
    } else {
      // Normal click - navigate in same tab
      router.push('/mypage/job_mng/post-new');
    }
  }

  const onChangeSearchTerm = (e: ChangeEvent<HTMLInputElement>) => {
    setTempSearch(e.target.value);
  }

  const onConfirmSearchTerm = () => {
    setSearchTerm(tempSearch);
  }

  const onClickEdit = (id: number, event?: React.MouseEvent) => {
    // If Ctrl+click (or Cmd+click on Mac), open in new tab
    if (event && (event.ctrlKey || event.metaKey)) {
      window.open(`/mypage/job_mng/edit/${id}`, '_blank');
    } else {
      // Normal click - navigate in same tab
      router.push(`/mypage/job_mng/edit/${id}`);
    }
  }

  const onClickClone = (id: number, event?: React.MouseEvent) => {
    // If Ctrl+click (or Cmd+click on Mac), open in new tab
    if (event && (event.ctrlKey || event.metaKey)) {
      window.open(`/mypage/job_mng/post-new?source=${id}`, '_blank');
    } else {
      // Normal click - navigate in same tab
      router.push(`/mypage/job_mng/post-new?source=${id}`);
    }
  }

  const onClickDelete = (id: number) => {
    setDeleteJobId(id);
  }

  const onConfirmDeleteJob = () => {
    deleteJob.mutate(deleteJobId);
    setDeleteJobId(0)
  }

  const onCopyJobLink = async (id: number) => {
    const jobLink = `${window.location.origin}/job-openings/recruit/${id}`;
    try {
      await navigator.clipboard.writeText(jobLink);
      toast.info('求人リンクをコピーしました。')
    } catch (err) {
      console.error('Failed to copy the job link: ', err);
    }
  }

  const toggleCheckbox = (job: JobDetail) => {
    setSelectedJobs((prev) => ({
      ...prev,
      [job.id]: prev[job.id] ? null : job,
    }));
  };

  const onClearSelectedJobs = () => {
    setSelectedJobs({});
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="w-95/100 max-w-320 mx-auto">
        <div className="border-b-1 border-gray-700 pt-10 pb-5 flex flex-col">
          <h2 className='text-center mb-6 text-[24px] md:text-[32px] font-bold'>求人管理ページ</h2>
          <div className="flex-1 flex flex-row items-center space-x-2 space-y-2">
            <div className="flex-1 m-0">
              <CButton
                text="新規作成"
                className='bg-blue text-white text-sm h-[40px]'
                size="small"
                leftIcon={<span className="mr-1 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg></span>}
                onClick={(e) => onClickAddNewJob(e)}
              />
            </div>
            <div className="flex flex-row items-center space-x-2">
              {allFilteredJobs?.data?.jobs?.length > 0 && (
                <CSVLink
                  data={generateJobCSVData(allFilteredJobs?.data?.jobs, window.location.origin)}
                  filename={`求職者一覧-${format(new Date(), 'yyyy年MM月dd日-HHmm')}`}
                >
                  <CButton
                    text="全体CSV出⼒"
                    className='bg-green text-white text-sm h-[40px]'
                    size="small"
                  // leftIcon={<span className="mr-1 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg></span>}
                  />
                </CSVLink>
              )}
              {getSelectedJobs.length > 0 && (
                <CSVLink
                  data={generateJobCSVData(Object.values(getSelectedJobs) as JobDetail[], window.location.origin)}
                  filename={`求職者一覧-${format(new Date(), 'yyyy年MM月dd日-HHmm')}`}
                >
                  <CButton
                    text="選択のみCSV出⼒"
                    className='bg-orange text-white text-sm h-[40px]'
                    size="small"
                  // leftIcon={<span className="mr-1 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg></span>}
                  />
                </CSVLink>
              )}
            </div>
          </div>
          <div className="flex flex-row items-center mt-2">
            <p>選択済み: {getSelectedJobs.length} 求人</p>
            <span className="ml-2 text-blue cursor-pointer" onClick={onClearSelectedJobs}>クリア</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:space-x-3">
            <div className="flex-1 flex flex-row justify-between md:justify-start items-center space-x-3 pt-2">
              <CSelect
                options={JobTypeOptions}
                value={jobType}
                onChange={onSelectJobType}
                width="w-40"
                height="h-10"
                className="truncate"
              />
              {isAdmin && (
                <CSelect
                  options={companyOptions}
                  value={company}
                  onChange={onSelectCompany}
                  width="w-40"
                  height="h-10"
                  className="truncate"
                />
              )}
            </div>
            <div className="flex flex-row justify-between md:justify-end pt-2 space-x-2">
              <CInput
                placeholder="検索"
                height="h-10"
                wrapperClassName="flex-1"
                value={tempSearch}
                onChange={onChangeSearchTerm}
              />
              <CButton
                text="検索"
                className='bg-blue text-white h-[40px]'
                size="small"
                onClick={onConfirmSearchTerm}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-row justify-center mt-4">
          {jobs?.data?.jobs?.length === 0 && <p>結果なし</p>}
          {totalPage > 0 && jobs?.data?.jobs?.length > 0 && (
            <Pagination
              page={currentPage}
              totalPages={totalPage}
              onPageChange={onPageChange}
            />
          )}
        </div>

        <div className="flex flex-col space-y-5 mt-10 pb-10">
          {jobLoading && (
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          )}
          {(jobs?.data?.jobs?.length > 0) && jobs?.data?.jobs?.map((job: JobDetail) => (
            <div className="border-1 border-gray-700 overflow-hidden bg-white rounded-sm shadow-md" key={`${currentPage}-${job.id}`}>
              <div className={`flex flex-row justify-between px-2 py-3 ${job.job_detail_page_template_id === 1 ? 'bg-blue' : 'bg-orange-400'}`}>
                <p className="text-sm text-white pr-10 truncate flex-1">{job.job_title}</p>
                <p className="text-sm text-white">{formatTimeAgo(new Date(job.created))}</p>
                <input
                  type="checkbox"
                  checked={!!selectedJobs[job.id]}
                  onChange={() => toggleCheckbox(job)}
                  className="form-checkbox h-5 w-5 ml-2 text-green-600"
                />
              </div>
              <div className="flex flex-col sm:flex-row">

                <div className="w-1/1 sm:w-1/4 md:w-1/5 p-0 md:p-2 relative">
                  <div className="w-full aspect-300/220 relative">
                    {getFirstFullImage(job.jobThumbnails) ? (
                      <Image
                        src={getFirstFullImage(job.jobThumbnails) as string}
                        alt={`${job.job_title}のサムネイル`}
                        fill
                        className="object-cover"
                        sizes="(min-width: 768px) 20vw, 100vw"
                        priority={true}
                      />
                    ) : (
                      <Image
                        src={`/images/no-preview.jpg`}
                        alt={`No preview available for job: ${job.job_title}`}
                        fill
                        className="object-cover"
                        sizes="(min-width: 768px) 20vw, 100vw"
                      />
                    )}
                  </div>
                </div>

                <div className="flex-1 flex flex-row items-center flex-wrap content-start border-l-0 md:border-l-1 border-gray-700 border-t-1 md:border-t-0">

                  <div className="w-1/1 lg:w-1/2 flex flex-row h-fit border-b-1 border-gray-700">
                    <div className="flex-1">
                      <p className="p-2 bg-gray-800 text-sm border-r-1 border-gray-700">掲載期間</p>
                    </div>
                    <div className="flex-2">
                      <p className="p-2 text-sm">{job.clinic_public_date_start} - {job.clinic_public_date_end}</p>
                    </div>
                  </div>

                  <div className="w-1/1 lg:w-1/2 flex flex-row h-fit border-b-1 border-gray-700">
                    <div className="flex-1">
                      <p className="p-2 bg-gray-800 text-sm border-r-1 border-gray-700 lg:border-l-1 lg:border-gray-700">公開状況</p>
                    </div>
                    <div className="flex-2">
                      <p className="p-2 text-sm">{JobStatusOptions[job.public_status - 1].option}</p>
                    </div>
                  </div>

                  <div className="w-1/1 flex flex-row h-fit border-b-1 border-gray-700">
                    <div className="flex-1">
                      <p className="p-2 bg-gray-800 text-sm border-r-1 border-gray-700">掲載URL</p>
                    </div>
                    {job.public_status === 1 ? (
                      <div className="flex-2 lg:flex-5 flex flex-row items-center justify-between overflow-hidden whitespace-nowrap">
                        <div className="mx-2 flex-1 overflow-hidden whitespace-nowrap">
                          <p className="bg-gray-800 my-auto border-1 py-0.5 px-1 border-gray-700 text-sm truncate">
                            {`${window.location.origin}/job-openings/recruit/${job.id}`}
                          </p>
                        </div>
                        <CButton
                          text="コピー"
                          className="bg-gray-400 h-[25px] rounded-none text-white text-sm mr-2"
                          onClick={() => onCopyJobLink(job.id)}
                        />
                      </div>
                    ) : (
                      <div className="flex-2 lg:flex-5 flex flex-row items-center justify-between overflow-hidden whitespace-nowrap">
                        <p className="my-auto pl-2 text-sm">
                          URL は利用できません。
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="w-1/1 lg:w-1/2 flex flex-row h-fit border-b-1 border-gray-700">
                    <div className="flex-1">
                      <p className="p-2 bg-gray-800 text-sm border-r-1 border-gray-700">検索表示数</p>
                    </div>
                    <div className="flex-2">
                      <p className="p-2 text-sm">{Number(job.search_count)}</p>
                    </div>
                  </div>

                  <div className="w-1/1 lg:w-1/2 flex flex-row h-fit border-b-1 border-gray-700">
                    <div className="flex-1">
                      <p className="p-2 bg-gray-800 text-sm border-r-1 border-gray-700 lg:border-l-1 lg:border-gray-700">求人閲覧数</p>
                    </div>
                    <div className="flex-2">
                      <p className="p-2 text-sm">{Number(job.recruits_count)}</p>
                    </div>
                  </div>

                  <div className="w-1/1 flex flex-row h-fit border-b-1 border-gray-700">
                    <div className="flex-1">
                      <p className="p-2 bg-gray-800 text-sm border-r-1 border-gray-700">お気に入り数</p>
                    </div>
                    <div className="flex-2 lg:flex-5 overflow-hidden whitespace-nowrap">
                      <p className="p-2 truncate text-sm">{Number(job.favourite_count || 0)}</p>
                    </div>
                  </div>

                  <div className="w-1/1 flex flex-row h-fit border-b-1 border-gray-700">
                    <div className="flex-1">
                      <p className="p-2 bg-gray-800 text-sm border-r-1 border-gray-700">応募者総数</p>
                    </div>
                    <div className="flex-2 lg:flex-5 overflow-hidden whitespace-nowrap">
                      <p className="p-2 truncate text-sm">{Number(job.application_count || 0)}</p>
                    </div>
                  </div>

                  <div className="w-1/2 lg:w-1/4 flex flex-row h-fit border-b-1 border-gray-700">
                    <div className="w-2/3">
                      <p className="p-2 bg-gray-800 text-sm border-r-1 border-gray-700">面接日決定数</p>
                    </div>
                    <div className="w-1/3 lg:flex-5 overflow-hidden whitespace-nowrap">
                      <p className="p-2 truncate text-sm">0</p>
                    </div>
                  </div>

                  <div className="w-1/2 lg:w-1/4 flex flex-row h-fit border-b-1 border-gray-700">
                    <div className="w-2/3">
                      <p className="p-2 bg-gray-800 text-sm border-r-1 border-gray-700 border-l-1 border-gray-700">面接済数</p>
                    </div>
                    <div className="w-1/3 lg:flex-5 overflow-hidden whitespace-nowrap">
                      <p className="p-2 truncate text-sm">0</p>
                    </div>
                  </div>

                  <div className="w-1/2 lg:w-1/4 flex flex-row h-fit border-b-1 border-gray-700">
                    <div className="w-2/3">
                      <p className="p-2 bg-gray-800 text-sm border-r-1 border-gray-700 lg:border-l-1 lg:border-gray-700">最終面接済</p>
                    </div>
                    <div className="w-1/3 lg:flex-5 overflow-hidden whitespace-nowrap">
                      <p className="p-2 truncate text-sm">0</p>
                    </div>
                  </div>

                  <div className="w-1/2 lg:w-1/4 flex flex-row h-fit border-b-1 border-gray-700">
                    <div className="w-2/3">
                      <p className="p-2 bg-gray-800 text-sm border-r-1 border-gray-700 border-l-1 border-gray-700">面接決定済</p>
                    </div>
                    <div className="w-1/3 lg:flex-5 overflow-hidden whitespace-nowrap">
                      <p className="p-2 truncate text-sm">0</p>
                    </div>
                  </div>

                  <div className="w-1/1 border-b-1 border-gray-700">
                    <p className="truncate p-2">{job.job_lead_statement}</p>
                  </div>

                  <div className="flex flex-wrap p-1 w-full">
                    <div className="w-1/2 lg:w-1/4 p-1">
                      {job.public_status === 2 ? (
                        <CButton
                          text="プレビュー"
                          className="bg-green h-[40px] rounded-none text-white text-sm w-full !cursor-not-allowed"
                        />
                      ) : (
                        <a href={`/job-openings/recruit/${job.id}`} className="flex-1" target="_blank">
                          <CButton
                            text="プレビュー"
                            className="bg-green h-[40px] rounded-none text-white text-sm w-full"
                          />
                        </a>
                      )}

                    </div>

                    <div className="w-1/2 lg:w-1/4 p-1">
                      <CButton
                        text="ページ修正"
                        className="bg-orange h-[40px] rounded-none text-white text-sm w-full"
                        onClick={(e) => onClickEdit(job.id, e)}
                      />
                    </div>

                    <div className="w-1/2 lg:w-1/4 p-1">
                      <CButton
                        text="複製"
                        className="bg-blue h-[40px] rounded-none text-white text-sm w-full"
                        onClick={(e) => onClickClone(job.id, e)}
                      />
                    </div>

                    <div className="w-1/2 lg:w-1/4 p-1">
                      <CButton
                        text={(deleteJobId === job.id && deleteJob.isPending) ? <Spinner /> : "削除"}
                        className="bg-red-400 h-[40px] rounded-none rounded-none text-white text-sm w-full"
                        onClick={() => onClickDelete(job.id)}
                      />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ))}

          {totalPage > 0 && jobs?.data?.jobs?.length && (
            <div className="flex flex-row justify-center mt-4">
              <Pagination
                page={currentPage}
                totalPages={totalPage}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </div>
        {deleteJobId > 0 && (
          <Dialog
            title="警告"
            description='本当に削除しますか。'
            onPressCancel={() => setDeleteJobId(0)}
            onPressOK={onConfirmDeleteJob}
            okButtonTitle='削除'
          />
        )}

      </div>
    </div >
  );
}

