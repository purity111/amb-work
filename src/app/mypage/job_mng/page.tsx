"use client";

import { useAuthContext } from "@/app/layout";
import CButton from "@/components/common/Button";
import CInput from "@/components/common/Input";
import CSelect from "@/components/common/Select";
import { JobStatusOptions, JobTypeOptions } from "@/utils/constants";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Pagination from "@/components/common/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetAllEmployerInfos } from "@/hooks/useGetAllEmployerInfos";
import { useGetJobs } from "@/hooks/useGetJobs";
import { JobDetail, PickOption } from "@/utils/types";
import { getFirstFullImage } from "@/utils/helper";
import { useMutation } from "@tanstack/react-query";
import { deleteJobById } from "@/lib/api";
import { toast } from "react-toastify";
import Dialog from "@/components/Dialog";
import Spinner from "@/components/common/Spinner";
import { formatDistanceToNow } from "date-fns";


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


  const router = useRouter()
  const { profile, isAdmin } = useAuthContext();
  const { data, isLoading } = useGetAllEmployerInfos(profile?.role);
  const { data: jobs, isLoading: jobLoading, refetch } = useGetJobs({
    page: currentPage,
    limit,
    searchTerm,
    companyID: Number(company),
    jobType: Number(jobType),
    isAdmin: profile?.role === 'JobSeeker' ? '0' : '1'
  })

  const hasLoaded = useRef(false);

  const searchParams = useSearchParams();

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
          option: 'All'
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

  const onSelectJobType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setJobType(e.target.value as string);
  };

  const onSelectCompany = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCompany(e.target.value as string);
  };

  const onPageChange = (page: number) => {
    setCurrentPage(page)
  }

  const onClickAddNewJob = () => {
    router.push('/mypage/job_mng/post-new')
  }

  const onChangeSearchTerm = (e: ChangeEvent<HTMLInputElement>) => {
    setTempSearch(e.target.value);
  }

  const onConfirmSearchTerm = () => {
    setSearchTerm(tempSearch);
  }

  const onClickEdit = (id: number) => {
    router.push(`/mypage/job_mng/edit/${id}`)
  }

  const onClickClone = (id: number) => {
    router.push(`/mypage/job_mng/post-new?source=${id}`)
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

  return (
    <div className="flex min-h-screen flex-col">
      <div className="w-95/100 max-w-320 mx-auto pt-10">
        <div className="border-b-1 border-gray-700 py-2 flex flex-col">
          <div className="flex-1 flex flex-row space-x-2 space-y-2">
            <div className="flex-1">
              <CButton
                text="求人掲載ページ新規作成"
                className='bg-blue text-white text-sm h-[40px]'
                size="small"
                leftIcon={<span className="text-[18px] md:text-3xl">+</span>}
                onClick={onClickAddNewJob}
              />
            </div>
            <CButton
              text="全体CSV出⼒"
              className='bg-green text-white text-sm h-[40px]'
              size="small"
              leftIcon={<span className="text-[18px] md:text-3xl">+</span>}
            />
            <CButton
              text="選択のみCSV出⼒"
              className='bg-orange text-white text-sm h-[40px]'
              size="small"
              leftIcon={<span className="text-[18px] md:text-3xl">+</span>}
            />
          </div>
          <div className="flex flex-col lg:flex-row lg:space-x-3">
            <div className="flex-1 flex flex-row space-x-3 pt-2">
              <CSelect
                options={JobTypeOptions}
                value={jobType}
                onChange={onSelectJobType}
                width="w-40"
                height="h-10"
              />
              {isAdmin && (
                <CSelect
                  options={companyOptions}
                  value={company}
                  onChange={onSelectCompany}
                  height="h-10"
                  width="w-60"
                />
              )}
            </div>
            <div className="flex flex-row pt-2 space-x-2">
              <CInput
                placeholder="検索"
                height="h-10"
                className="flex-1"
                value={tempSearch}
                onChange={onChangeSearchTerm}
              />
              <CButton
                text="Search"
                className='bg-blue text-white h-[40px]'
                size="small"
                onClick={onConfirmSearchTerm}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-row justify-center mt-4">
          {jobs?.data?.jobs?.length === 0 && <p>結果なし</p>}
          {totalPage > 0 && (
            <Pagination
              page={currentPage}
              totalPages={totalPage}
              onPageChange={onPageChange}
            />
          )}
        </div>
        <div className="flex flex-col space-y-5 mt-10 pb-20">
          {jobLoading && (
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          )}
          {(jobs?.data?.jobs?.length > 0) && jobs?.data?.jobs?.map((job: JobDetail) => (
            <div className="border-1 border-gray-700 overflow-hidden" key={`${currentPage}-${job.id}`}>
              <div className={`flex flex-row justify-between px-2 py-3 ${job.job_detail_page_template_id === 1 ? 'bg-blue' : 'bg-orange-400'}`}>
                <p className="text-sm text-white pr-10 truncate flex-1">{job.job_title}</p>
                <p className="text-sm text-white">{formatDistanceToNow(new Date(job.created), { addSuffix: true })}</p>
              </div>
              <div className="flex flex-col sm:flex-row">

                <div className="w-1/1 sm:w-1/4 md:w-1/5 p-2">
                  <div className="w-full aspect-1/1 relative">
                    {getFirstFullImage(job.jobThumbnails) ? (
                      <Image
                        src={getFirstFullImage(job.jobThumbnails) as string}
                        alt={`Job thumbnail for ${job.job_title}`}
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

                <div className="flex-1 flex flex-row flex-wrap content-start border-l-1 border-gray-700">

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
                    <div className="flex-2 lg:flex-5 flex flex-row items-center justify-between overflow-hidden whitespace-nowrap pr-1">
                      <div className="p-1 flex-1 overflow-hidden whitespace-nowrap">
                        <p className="bg-gray-800 my-auto border-1 px-1 border-gray-700 text-sm truncate">
                          {`${window.location.origin}/job-openings/recruit/${job.id}`}
                        </p>
                      </div>
                      <CButton
                        text="コピー"
                        className="bg-gray-400 h-[25px] rounded-none text-white text-sm"
                        onClick={() => onCopyJobLink(job.id)}
                      />
                    </div>
                  </div>

                  <div className="w-1/1 lg:w-1/2 flex flex-row h-fit border-b-1 border-gray-700">
                    <div className="flex-1">
                      <p className="p-2 bg-gray-800 text-sm border-r-1 border-gray-700">検索表示数</p>
                    </div>
                    <div className="flex-2">
                      <p className="p-2 text-sm">0</p>
                    </div>
                  </div>

                  <div className="w-1/1 lg:w-1/2 flex flex-row h-fit border-b-1 border-gray-700">
                    <div className="flex-1">
                      <p className="p-2 bg-gray-800 text-sm border-r-1 border-gray-700 lg:border-l-1 lg:border-gray-700">求人ページ閲覧数</p>
                    </div>
                    <div className="flex-2">
                      <p className="p-2 text-sm">0</p>
                    </div>
                  </div>

                  <div className="w-1/1 flex flex-row h-fit border-b-1 border-gray-700">
                    <div className="flex-1">
                      <p className="p-2 bg-gray-800 text-sm border-r-1 border-gray-700">お気に入り登録会員数</p>
                    </div>
                    <div className="flex-2 lg:flex-5 overflow-hidden whitespace-nowrap">
                      <p className="p-2 truncate text-sm">0</p>
                    </div>
                  </div>

                  <div className="w-1/1 flex flex-row h-fit border-b-1 border-gray-700">
                    <div className="flex-1">
                      <p className="p-2 bg-gray-800 text-sm border-r-1 border-gray-700">応募者総数</p>
                    </div>
                    <div className="flex-2 lg:flex-5 overflow-hidden whitespace-nowrap">
                      <p className="p-2 truncate text-sm">0</p>
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
                      <a href={`/jobs/recruit/${job.id}`} className="flex-1" target="_blank">
                        <CButton
                          text="プレビュー"
                          className="bg-green h-[40px] rounded-none text-white text-sm w-full"
                        />
                      </a>
                    </div>

                    <div className="w-1/2 lg:w-1/4 p-1">
                      <CButton
                        text="ページ修正"
                        className="bg-orange h-[40px] rounded-none text-white text-sm w-full"
                        onClick={() => onClickEdit(job.id)}
                      />
                    </div>

                    <div className="w-1/2 lg:w-1/4 p-1">
                      <CButton
                        text="複製"
                        className="bg-blue h-[40px] rounded-none text-white text-sm w-full"
                        onClick={() => onClickClone(job.id)}
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

          {totalPage > 0 && (
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
            description='Are you sure you want to delete this job?'
            onPressCancel={() => setDeleteJobId(0)}
            onPressOK={onConfirmDeleteJob}
            okButtonTitle='削除'
          />
        )}

      </div>
    </div >
  );
}

