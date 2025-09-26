"use client";

import CButton from "@/components/common/Button";
import CInput from "@/components/common/Input";
import Pagination from "@/components/common/Pagination";
import CSelect from "@/components/common/Select";
import { format } from 'date-fns';
import { useGetJobSeekers } from "@/hooks/useGetJobSeekers";
import { deleteJobSeekerById, registerAsJobSeeker, updateJobSeekerById } from "@/lib/api";
import { PrefectureOptions } from "@/utils/constants";
import { JobSeekerDetail } from "@/utils/types";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import AddJobSeekerModal, { JobSeekerFormValues } from "@/components/modal/AddJobSeekerModal";
import Modal from "@/components/common/Modal";
import Link from "next/link";
import { getJobSeekers } from "@/lib/api";
import { CSVLink } from "react-csv";
import { generateJobSeekerCSVData } from "@/utils/helper";

export default function ApplicantMngPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [tempSearch, setTempSearch] = useState('');
  const [prefectures, setPrefectures] = useState(0);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [selectedJobSeeker, setSelectedJobSeeker] = useState<JobSeekerDetail | null>(null)
  const [modalShown, setModalShown] = useState(false)
  const [favoritesModalShown, setFavoritesModalShown] = useState(false)
  const [appliedModalShown, setAppliedModalShown] = useState(false)
  const [favoritesData, setFavoritesData] = useState<any[]>([])
  const [appliedData, setAppliedData] = useState<any[]>([])
  const [selectedApplicantName, setSelectedApplicantName] = useState('')

  const router = useRouter();
  const hasLoaded = useRef(false);
  const searchParams = useSearchParams();
  const { data: response, isLoading, refetch } = useGetJobSeekers({
    page: currentPage,
    limit,
    searchTerm,
    prefectures,
    sortBy,
    sortOrder
  });

  // Fetch all job seekers for CSV export
  const { data: allJobSeekersResponse } = useGetJobSeekers({
    page: 1,
    limit: 999999,
    searchTerm: '',
    prefectures: 0,
    sortBy: '',
    sortOrder: 'ASC'
  });

  const deleteJobSeeker = useMutation({
    mutationFn: deleteJobSeekerById,
    onSuccess: () => {
      toast.success("削除しました。");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "削除失敗");
    },
  });

  const updateJobSeeker = useMutation({
    mutationFn: updateJobSeekerById,
    onSuccess: () => {
      toast.success("変更しました。");
      setModalShown(false);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "削除失敗");
    },
  });

  const createNewJobSeeker = useMutation({
    mutationFn: registerAsJobSeeker,
    onSuccess: () => {
      toast.success("作成しました。");
      setModalShown(false);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "削除失敗");
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const page = Number(params.get('page') || 1);
    const pSortBy = params.get('sortBy') || '';
    const pSortOrder = params.get('sortOrder');
    const prefecture = Number(params.get('prefectures') || 0);
    const searchTermParam = params.get('searchTerm') || '';
    
    // Only update state if values have actually changed
    if (currentPage !== page) setCurrentPage(page);
    if (searchTerm !== searchTermParam) {
      setSearchTerm(searchTermParam);
      setTempSearch(searchTermParam);
    }
    if (prefectures !== prefecture) setPrefectures(prefecture);
    if (sortBy !== pSortBy) setSortBy(pSortBy);
    
    const newSortOrder = pSortOrder === 'ASC' ? 'ASC' : pSortOrder === 'DESC' ? 'DESC' : 'ASC';
    if (sortOrder !== newSortOrder) setSortOrder(newSortOrder);
    
    hasLoaded.current = true;
  }, [searchParams])

  useEffect(() => {
    if (!hasLoaded.current) return;
    const params = new URLSearchParams();
    params.set('page', currentPage.toString());
    params.set('limit', limit.toString());
    if (searchTerm.trim()) params.set('searchTerm', searchTerm.trim());
    if (prefectures) params.set('prefectures', prefectures.toString());
    if (sortBy) {
      params.set('sortBy', sortBy);
      params.set('sortOrder', sortOrder);
    }
    router.push(`?${params.toString()}`);
  }, [currentPage, limit, searchTerm, prefectures, sortBy, sortOrder, router]);

  useEffect(() => {
    if (response?.data) {
      setTotalPage(response.data.pagination.totalPages);
    }
  }, [response]);

  const onChangeSearchTerm = (e: ChangeEvent<HTMLInputElement>) => {
    setTempSearch(e.target.value);
  }

  const onChangePrefectures = (e: ChangeEvent<HTMLSelectElement>) => {
    setPrefectures(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when filtering by prefecture
  }

  const onConfirmSearchTerm = () => {
    setSearchTerm(tempSearch);
    setCurrentPage(1); // Reset to first page when searching
  }

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEdit = (jobSeeker: JobSeekerDetail) => {
    // Find the fresh data from the current response
    const freshJobSeeker = response?.data?.jobseekers?.find((js: JobSeekerDetail) => js.id === jobSeeker.id) || jobSeeker;
    setSelectedJobSeeker(freshJobSeeker);
    setModalShown(true);
  };

  const onClickAddNew = () => {
    setSelectedJobSeeker(null);
    setModalShown(true);
  };

  const onCloseModal = () => {
    setModalShown(false);
    setSelectedJobSeeker(null);
  }

  const handleDelete = (jobSeeker: JobSeekerDetail) => {
    if (window.confirm(`Are you sure you want to delete ${jobSeeker.name}`)) {
      deleteJobSeeker.mutate(jobSeeker.id);
    }
  };

  const showFavorites = async (jobSeeker: JobSeekerDetail) => {
    try {
      setSelectedApplicantName(jobSeeker.name);
      const response = await getJobSeekers({ 
        page: 1, 
        limit: 1, 
        searchTerm: jobSeeker.email,
        sortBy: '',
        sortOrder: 'ASC'
      });
      
      // Get the specific job seeker data with allFavoriteJobs
      const jobSeekerData = response?.data?.jobseekers?.find((js: any) => js.id === jobSeeker.id);
      const favorites = jobSeekerData?.allFavoriteJobs || [];
      
      setFavoritesData(favorites);
      setFavoritesModalShown(true);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('お気に入りの取得に失敗しました');
    }
  };

  const showAppliedJobs = async (jobSeeker: JobSeekerDetail) => {
    try {
      setSelectedApplicantName(jobSeeker.name);
      const response = await getJobSeekers({ 
        page: 1, 
        limit: 1, 
        searchTerm: jobSeeker.email,
        sortBy: '',
        sortOrder: 'ASC'
      });
      
      // Get the specific job seeker data with allJobApplications
      const jobSeekerData = response?.data?.jobseekers?.find((js: any) => js.id === jobSeeker.id);
      const applications = jobSeekerData?.allJobApplications || [];
      
      setAppliedData(applications);
      setAppliedModalShown(true);
    } catch (error) {
      console.error('Error fetching applied jobs:', error);
      toast.error('応募履歴の取得に失敗しました');
    }
  };

  const onClickHeader = (key: string) => {
    if (sortBy === key) {
      if (sortOrder === 'ASC') setSortOrder('DESC');
      else setSortOrder('ASC');
    } else {
      setSortBy(key);
      setSortOrder('ASC');
    }
  }

  const onSubmitForm = (formData: JobSeekerFormValues) => {
    const param: any = {
      name: formData.name,
      name_kana: formData.name_kana,
      birthdate: `${formData.dob_year}-${String(formData.dob_month).padStart(2, '0')}-${String(formData.dob_date).padStart(2, '0')}`,
      sex: formData.sex,
      zip: formData.postCode,
      prefectures: formData.prefecture,
      tel: formData.phonenumber,
      email: formData.email,
      service_content: formData.service_content
    }
    if (!selectedJobSeeker && formData.password) {
      param.password = formData.password
    }
    if (selectedJobSeeker) {
      updateJobSeeker.mutate({
        id: selectedJobSeeker?.id,
        param
      })
    } else {
      createNewJobSeeker.mutate(param)
    }
  }

  const renderSortableheader = (sortKey: string, label: string) => {
    return (
      <div className="flex flex-row justify-center items-center cursor-pointer" onClick={() => onClickHeader(sortKey)}>
        <span>{label} {sortBy === sortKey ? sortOrder === 'DESC' ? '▼' : '▲' : ''}</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col p-3 md:p-8">
      <h1 className="text-[24px] md:text-[32px] font-bold text-center mb-6">会員全体管理ページ</h1>
      <div className="flex flex-col md:flex-row">
        <div className="flex justify-between md:justify-start flex-row items-center mx-auto my-2 space-x-2 w-full sm:w-[80%] md:w-full">
          <CButton
            text="追加"
            className='bg-blue-500 text-white text-sm h-[40px]'
            size="small"
            leftIcon={
              <span className="mr-1 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </span>
            }
            onClick={onClickAddNew}
          />
          <CSelect
            value={prefectures.toString()}
            options={PrefectureOptions}
            placeholder="都道府県を選択"
            onChange={onChangePrefectures}
            className="h-[40px]"
            width="w-50"
          />
          {allJobSeekersResponse?.data?.jobseekers?.length > 0 && (
            <CSVLink
              data={generateJobSeekerCSVData(allJobSeekersResponse.data.jobseekers)}
              filename={`求職者一覧-${format(new Date(), 'yyyy年MM月dd日-HHmm')}.csv`}
            >
              <CButton
                text="CSV出力"
                className='bg-green text-white text-sm h-[40px]'
                size="small"
                leftIcon={
                  <span className="mr-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </span>
                }
              />
            </CSVLink>
          )}
        </div>
        <div className="flex justify-end flex-row justify-between md:justify-end items-center mx-auto my-2 space-x-2 w-full sm:w-[80%] md:w-full">
          <CInput
            placeholder="検索"
            height="h-10"
            className="flex-1 max-w-[180px] sm:max-w-full"
            onChange={onChangeSearchTerm}
            value={tempSearch}
          />
          <CButton
            text="検索"
            className='bg-blue text-white h-[40px]'
            size="small"
            onClick={onConfirmSearchTerm}
          />
        </div>
      </div>
      {/* Card layout for SP */}
      <div className="block md:hidden overflow-x-auto">
        <table className="min-w-full whitespace-nowrap border-collapse border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope='col' className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">No.</th>
              <th scope='col' className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">{renderSortableheader('name', '氏名')}</th>
              <th scope='col' className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">{renderSortableheader('name_kana', '氏名（カナ）')}</th>
              <th scope='col' className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">{renderSortableheader('birthdate', '生年月日')}</th>
              <th scope='col' className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">{renderSortableheader('sex', '性別')}</th>
              <th scope='col' className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">{renderSortableheader('zip', '郵便番号')}</th>
              <th scope='col' className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">都道府県</th>
              <th scope='col' className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">{renderSortableheader('tel', '電話番号')}</th>
              <th scope='col' className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">メールアドレス</th>
              <th scope='col' className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">{renderSortableheader('service_content', '転職サポート希望')}</th>
              <th scope='col' className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">{renderSortableheader('created', '登録日')}</th>
              <th scope='col' className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">求人関連データ</th>
              <th scope='col' className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">操作</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td className="py-8 px-4 text-center text-gray-500" colSpan={12}>
                  読み込み中...
                </td>
              </tr>
            )}
            {!response?.data?.jobseekers?.length && !isLoading && (
              <tr>
                <td className="py-8 px-4 text-center text-gray-500" colSpan={12}>
                  結果なし
                </td>
              </tr>
            )}
            {response?.data?.jobseekers.map((jobseeker: JobSeekerDetail, index: number) => (
              <tr key={jobseeker.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td data-label="No." className="py-2 px-4 border-b border-gray-200">
                  {(currentPage - 1) * limit + index + 1}
                </td>
                <td data-label="Name" className="py-2 px-4 border-b border-gray-200">
                  {jobseeker.name}
                </td>
                <td data-label="Name(kana)" className="py-2 px-4 border-b border-gray-200">
                  {jobseeker.name_kana}
                </td>
                <td data-label="DOB" className="py-2 px-4 border-b border-gray-200">
                  {format(new Date(jobseeker.birthdate), 'yyyy年MM月dd日')}
                </td>
                <td data-label="Sex" className="py-2 px-4 border-b border-gray-200">
                  {jobseeker.sex === 1 ? '男' : '女'}
                </td>
                <td data-label="ZipCode" className="py-2 px-4 border-b border-gray-200">
                  {jobseeker.zip}
                </td>
                <td data-label="Prefectures" className="py-2 px-4 border-b border-gray-200">
                  {PrefectureOptions.find(p => p.value === jobseeker.prefectures.toString())?.option || '?'}
                </td>
                <td data-label="PhoneNumber" className="py-2 px-4 border-b border-gray-200">
                  {jobseeker.tel}
                </td>
                <td data-label="Email" className="py-2 px-4 border-b border-gray-200">
                  {jobseeker.email}
                </td>
                <td data-label="ServiceContent" className="py-2 px-4 border-b border-gray-200">
                  {jobseeker.service_content ? '有' : '無'}
                </td>
                <td data-label="CreatedAt" className="py-2 px-4 border-b border-gray-200">
                  {format(new Date(jobseeker.created), 'yyyy年MM月dd日HH:mm:ss')}
                </td>
                <td data-label="JobRelatedData" className="py-2 px-4 border-b border-gray-200">
                  <div className="flex flex-col gap-1 text-xs">
                    <button 
                      className="text-blue-600 cursor-pointer underline hover:text-blue-800" 
                      onClick={() => showFavorites(jobseeker)}
                    >
                      お気に入り
                    </button>
                    <button 
                      className="text-green-600 cursor-pointer underline hover:text-green-800" 
                      onClick={() => showAppliedJobs(jobseeker)}
                    >
                      応募履歴
                    </button>
                  </div>
                </td>
                <td data-label="Actions" className="!p-2 border-b border-gray-200">
                  <div className="flex gap-1 sm:gap-2 sm:space-x-2 justify-center items-center">
                    <CButton
                      onClick={() => handleEdit(jobseeker)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 text-xs flex items-center"
                      text="編集"
                      leftIcon={(
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      )}
                    />
                    <CButton
                      onClick={() => handleDelete(jobseeker)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 text-xs flex items-center"
                      text="削除"
                      leftIcon={(
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full whitespace-nowrap border-collapse border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope='col' className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">No.</th>
              <th scope='col' className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">{renderSortableheader('name', '氏名')}</th>
              <th scope='col' className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">{renderSortableheader('name_kana', '氏名（カナ）')}</th>
              <th scope='col' className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">{renderSortableheader('birthdate', '生年月日')}</th>
              <th scope='col' className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">{renderSortableheader('sex', '性別')}</th>
              <th scope='col' className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">{renderSortableheader('zip', '郵便番号')}</th>
              <th scope='col' className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">都道府県</th>
              <th scope='col' className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">{renderSortableheader('tel', '電話番号')}</th>
              <th scope='col' className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">メールアドレス</th>
              <th scope='col' className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">{renderSortableheader('service_content', '転職サポート希望')}</th>
              <th scope='col' className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">{renderSortableheader('created', '登録日')}</th>
              <th scope='col' className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">求人関連データ</th>
              <th scope='col' className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">操作</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <p>読み込み中...</p>
            )}
            {!response?.data?.jobseekers?.length && !isLoading && (
              <p>結果なし</p>
            )}
            {response?.data?.jobseekers.map((jobseeker: JobSeekerDetail, index: number) => (
              <tr key={jobseeker.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td data-label="No." className="py-2 px-4 border-b border-gray-200">
                  {(currentPage - 1) * limit + index + 1}
                </td>
                <td data-label="Name" className="py-2 px-4 border-b border-gray-200">
                  {jobseeker.name}
                </td>
                <td data-label="Name(kana)" className="py-2 px-4 border-b border-gray-200">
                  {jobseeker.name_kana}
                </td>
                <td data-label="DOB" className="py-2 px-4 border-b border-gray-200">
                  {format(new Date(jobseeker.birthdate), 'yyyy年MM月dd日')}
                </td>
                <td data-label="Sex" className="py-2 px-4 border-b border-gray-200">
                  {jobseeker.sex === 1 ? '男' : '女'}
                </td>
                <td data-label="ZipCode" className="py-2 px-4 border-b border-gray-200">
                  {jobseeker.zip}
                </td>
                <td data-label="Prefectures" className="py-2 px-4 border-b border-gray-200">
                  {PrefectureOptions.find(p => p.value === jobseeker.prefectures.toString())?.option || '?'}
                </td>
                <td data-label="PhoneNumber" className="py-2 px-4 border-b border-gray-200">
                  {jobseeker.tel}
                </td>
                <td data-label="Email" className="py-2 px-4 border-b border-gray-200">
                  {jobseeker.email}
                </td>
                <td data-label="ServiceContent" className="py-2 px-4 border-b border-gray-200">
                  {jobseeker.service_content ? '有' : '無'}
                </td>
                <td data-label="CreatedAt" className="py-2 px-4 border-b border-gray-200">
                  {format(new Date(jobseeker.created), 'yyyy年MM月dd日HH:mm:ss')}
                </td>
                <td data-label="JobRelatedData" className="py-2 px-4 border-b border-gray-200">
                  <div className="flex flex-col gap-1 text-xs">
                    <button 
                      className="text-blue-600 cursor-pointer underline hover:text-blue-800" 
                      onClick={() => showFavorites(jobseeker)}
                    >
                      お気に入り
                    </button>
                    <button 
                      className="text-green-600 cursor-pointer underline hover:text-green-800" 
                      onClick={() => showAppliedJobs(jobseeker)}
                    >
                      応募履歴
                    </button>
                  </div>
                </td>
                <td data-label="Actions" className="!p-2 border-b border-gray-200">
                  <div className="flex gap-1 sm:gap-2 sm:space-x-2 justify-center items-center">
                    <CButton
                      onClick={() => handleEdit(jobseeker)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 text-xs flex items-center"
                      text="編集"
                      leftIcon={(
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      )}
                    />
                    <CButton
                      onClick={() => handleDelete(jobseeker)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 text-xs flex items-center"
                      text="削除"
                      leftIcon={(
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {
        totalPage > 1 && (
          <div className="flex flex-row justify-center mt-4">
            <Pagination
              page={currentPage}
              totalPages={totalPage}
              onPageChange={onPageChange}
            />
          </div>
        )
      }
      {modalShown && (
        <AddJobSeekerModal
          preLoad={selectedJobSeeker}
          onClose={onCloseModal}
          onSubmit={onSubmitForm}
        />
      )}

      {/* Favorites Modal */}
      {favoritesModalShown && (
        <Modal isOpen={favoritesModalShown} onClose={() => setFavoritesModalShown(false)}>
          <div className="max-w-5xl max-h-[85vh] overflow-hidden flex flex-col p-3">
            <h3 className="text-xl font-bold mb-6 text-center">
              <span className="text-red-600">{selectedApplicantName}</span>様のお気に入り一覧
            </h3>
            <div className="flex-1 overflow-auto">
              <table className="min-w-full border-collapse border border-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-200">求人URL</th>
                    <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-200">お気に入り日時</th>
                    <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-200">求人タイトル</th>
                    <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-200">求人タイプ</th>
                  </tr>
                </thead>
                <tbody>
                  {favoritesData.map((item: any, index: number) => (
                    <tr key={`${item.id}-${index}`} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="py-3 px-6 border-b border-gray-200 whitespace-nowrap">
                        <Link 
                          href={`https://reuse-tenshoku.com/job-openings/recruit/${item.id}`} 
                          target="_blank"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          https://reuse-tenshoku.com/job-openings/recruit/{item.id}
                        </Link>
                      </td>
                      <td className="py-3 px-6 border-b border-gray-200 whitespace-nowrap">
                        {item.favoriteDate ? format(new Date(item.favoriteDate), 'yyyy年MM月dd日 HH:mm:ss') : '-'}
                      </td>
                      <td className="py-3 px-6 border-b border-gray-200 whitespace-nowrap">
                        {item.name || '-'}
                      </td>
                      <td className="py-3 px-6 border-b border-gray-200 whitespace-nowrap">
                        {item.jobType === 'direct' ? '直接応募' : item.jobType === 'agency' ? '転職サポート' : item.jobType || '-'}
                      </td>
                    </tr>
                  ))}
                  {favoritesData.length === 0 && (
                    <tr>
                      <td className="py-8 px-6 text-center text-gray-500" colSpan={4}>
                        お気に入りがありません
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Modal>
      )}

      {/* Applied Jobs Modal */}
      {appliedModalShown && (
        <Modal isOpen={appliedModalShown} onClose={() => setAppliedModalShown(false)}>
          <div className="max-w-5xl max-h-[85vh] overflow-hidden flex flex-col p-3">
            <h3 className="text-xl font-bold mb-6 text-center">
              <span className="text-red-600">{selectedApplicantName}</span>様の応募履歴一覧
            </h3>
            <div className="flex-1 overflow-auto">
              <table className="min-w-full border-collapse border border-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-200">求人URL</th>
                    <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-200">応募日時</th>
                    <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-200">求人タイトル</th>
                    <th className="py-4 px-6 text-left text-sm font-medium border-b border-gray-200">求人タイプ</th>
                  </tr>
                </thead>
                <tbody>
                  {appliedData.map((item: any, index: number) => (
                    <tr key={`${item.id}-${index}`} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="py-3 px-6 border-b border-gray-200 whitespace-nowrap">
                        <Link 
                          href={`https://reuse-tenshoku.com/job-openings/recruit/${item.id}`} 
                          target="_blank"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          https://reuse-tenshoku.com/job-openings/recruit/{item.id}
                        </Link>
                      </td>
                      <td className="py-3 px-6 border-b border-gray-200 whitespace-nowrap">
                        {item.applicationDate ? format(new Date(item.applicationDate), 'yyyy年MM月dd日 HH:mm:ss') : '-'}
                      </td>
                      <td className="py-3 px-6 border-b border-gray-200 whitespace-nowrap">
                        {item.name || '-'}
                      </td>
                      <td className="py-3 px-6 border-b border-gray-200 whitespace-nowrap">
                        {item.jobType === 'direct' ? '直接応募' : item.jobType === 'agency' ? '転職サポート' : item.jobType || '-'}
                      </td>
                    </tr>
                  ))}
                  {appliedData.length === 0 && (
                    <tr>
                      <td className="py-8 px-6 text-center text-gray-500" colSpan={4}>
                        応募履歴がありません
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Modal>
      )}
    </div >
  );
}

