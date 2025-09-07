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
    const page = params.get('page');
    const pSortBy = params.get('sortBy');
    const pSortOrder = params.get('sortOrder');
    const prefecture = params.get('prefectures');
    const searchTerm = params.get('searchTerm');
    setCurrentPage(Number(page || 1));
    setSearchTerm(searchTerm || '')
    setTempSearch(searchTerm || '')
    setPrefectures(Number(prefecture))
    setSortBy(pSortBy || '')
    setSortOrder(pSortOrder === 'ASC' ? 'ASC' : pSortOrder === 'DESC' ? 'DESC' : 'ASC')
    hasLoaded.current = true;
  }, [searchParams])

  useEffect(() => {
    if (!hasLoaded.current) return;
    const params = new URLSearchParams();
    params.set('page', currentPage.toString());
    params.set('limit', limit.toString());
    params.set('searchTerm', searchTerm);
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
  }, [response, limit]);

  const onChangeSearchTerm = (e: ChangeEvent<HTMLInputElement>) => {
    setTempSearch(e.target.value);
  }

  const onChangePrefectures = (e: ChangeEvent<HTMLSelectElement>) => {
    setPrefectures(Number(e.target.value))
  }

  const onConfirmSearchTerm = () => {
    setSearchTerm(tempSearch);
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
    <div className="flex flex-col p-8">
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
            value={prefectures}
            options={PrefectureOptions}
            placeholder="都道府県を選択"
            onChange={onChangePrefectures}
            className="h-[40px]"
            width="w-50"
          />
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
      <div className="block md:hidden">
        {response?.data?.jobseekers?.map((applicant: JobSeekerDetail, index: number) => (
          <div key={applicant.id} className="bg-white rounded-lg shadow-md mb-4 p-4 border border-gray-600">
            <div className="mb-2"><span className="font-semibold">No.：</span>{index + 1}</div>
            <div className="mb-2"><span className="font-semibold">名前：</span>{applicant.name}</div>
            <div className="mb-2"><span className="font-semibold">メール：</span>{applicant.email}</div>
            <div className="mb-2"><span className="font-semibold">電話：</span>{applicant.tel}</div>
            {/* Add more fields as needed */}
            <div className="flex gap-2 mt-2 justify-end">
              <CButton
                onClick={() => handleEdit(applicant)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 text-xs flex items-center"
                text="編集"
              />
              <CButton
                onClick={() => handleDelete(applicant)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 text-xs flex items-center"
                text="削除"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="hidden md:block">
        <table className="rwd-table">
          <thead>
            <tr>
              <th scope='col'>No.</th>
              <th scope='col'>{renderSortableheader('name', '氏名')}</th>
              <th scope='col'>{renderSortableheader('name_kana', '氏名（カナ）')}</th>
              <th scope='col'>{renderSortableheader('birthdate', '生年月日')}</th>
              <th scope='col'>{renderSortableheader('sex', '性別')}</th>
              <th scope='col'>{renderSortableheader('zip', '郵便番号')}</th>
              <th scope='col'>都道府県</th>
              <th scope='col'>{renderSortableheader('tel', '電話番号')}</th>
              <th scope='col'>メールアドレス</th>
              <th scope='col'>{renderSortableheader('service_content', '転職サポート希望')}</th>
              <th scope='col'>{renderSortableheader('created', '登録日')}</th>
              <th scope='col'>操作</th>
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
                <td data-label="DOB" className="py-2 px-4 border-b border-gray-200 hidden sm:table-cell">
                  {format(new Date(jobseeker.birthdate), 'yyyy年MM月dd日')}
                </td>
                <td data-label="Sex" className="py-2 px-4 border-b border-gray-200 hidden md:table-cell">
                  {jobseeker.sex === 1 ? 'M' : 'F'}
                </td>
                <td data-label="ZipCode" className="py-2 px-4 border-b border-gray-200 hidden md:table-cell">
                  {jobseeker.zip}
                </td>
                <td data-label="Prefectures" className="py-2 px-4 border-b border-gray-200 hidden md:table-cell">
                  {PrefectureOptions[jobseeker.prefectures].option || '?'}
                </td>
                <td data-label="PhoneNumber" className="py-2 px-4 border-b border-gray-200 hidden md:table-cell">
                  {jobseeker.tel}
                </td>
                <td data-label="Email" className="py-2 px-4 border-b border-gray-200 hidden md:table-cell">
                  {jobseeker.email}
                </td>
                <td data-label="ServiceContent" className="py-2 px-4 border-b border-gray-200 hidden md:table-cell">
                  {jobseeker.service_content ? '有' : '無'}
                </td>
                <td data-label="CreatedAt" className="py-2 px-4 border-b border-gray-200 hidden md:table-cell">
                  {format(new Date(jobseeker.created), 'yyyy年MM月dd日HH:mm:ss')}
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
      <div className="flex flex-row justify-center mt-4">
        <Pagination
          page={currentPage}
          totalPages={totalPage}
          onPageChange={onPageChange}
        />
      </div>
      {modalShown && (
        <AddJobSeekerModal
          preLoad={selectedJobSeeker}
          onClose={onCloseModal}
          onSubmit={onSubmitForm}
        />
      )}
    </div >
  );
}

