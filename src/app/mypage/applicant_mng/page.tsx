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
      toast.success("Deleted successfully");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete");
    },
  });

  const updateJobSeeker = useMutation({
    mutationFn: updateJobSeekerById,
    onSuccess: () => {
      toast.success("Updated successfully");
      setModalShown(false);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete");
    },
  });

  const createNewJobSeeker = useMutation({
    mutationFn: registerAsJobSeeker,
    onSuccess: () => {
      toast.success("Created successfully");
      setModalShown(false);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete");
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
    setSelectedJobSeeker(jobSeeker);
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
      email: formData.email
    }
    if (!selectedJobSeeker) {
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
    <div className="flex flex-col p-5">
      <h1 className="text-2xl font-bold mb-6">応募者管理ページ(Applicant Management Page)</h1>
      <div className="flex justify-between flex-row items-center mx-auto my-2 space-x-2 w-full sm:w-[80%] md:w-full">
        <CButton
          text="追加"
          className='bg-blue text-white text-sm h-[40px] w-40'
          size="small"
          leftIcon={<span className="text-[18px] md:text-3xl">+</span>}
          onClick={onClickAddNew}
        />
        <div className="flex justify-end flex-row items-center mx-auto my-2 space-x-2 w-full sm:w-[80%] md:w-full">
          <CSelect
            value={prefectures}
            options={PrefectureOptions}
            placeholder="都道府県を選択"
            onChange={onChangePrefectures}
            className="h-[40px]"
            width="w-50"
          />
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
            <th scope='col'>{renderSortableheader('created', '登録日')}</th>
            <th scope='col'>操作</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <p>Loading...</p>
          )}
          {!response?.data?.jobseekers?.length && !isLoading && (
            <p>No results</p>
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

