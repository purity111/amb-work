"use client";

import CButton from "@/components/common/Button";
import CInput from "@/components/common/Input";
import Pagination from "@/components/common/Pagination";
import CSelect from "@/components/common/Select";
import { useGetEmployers } from "@/hooks/useGetEmployers";
import { PrefectureOptions } from "@/utils/constants";
import { Employer } from "@/utils/types";
import { useMutation } from "@tanstack/react-query";
import { deleteEmployerById, updateEmployerById, createEmployer } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from 'react-toastify';
import AddEmployerModal, { EmployerFormValues } from "@/components/modal/AddEmployerModal";
import { format } from 'date-fns';

export default function CompanyMngPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [tempSearch, setTempSearch] = useState('');
  const [prefectures, setPrefectures] = useState(0);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [selectedEmployer, setSelectedEmployer] = useState<Employer | null>(null)
  const [modalShown, setModalShown] = useState(false)

  const router = useRouter();
  const hasLoaded = useRef(false);
  const searchParams = useSearchParams();
  
  const { data: response, isLoading, refetch } = useGetEmployers({
    page: currentPage,
    limit,
    searchTerm,
    prefectures,
    sortBy,
    sortOrder
  });

  const deleteEmployer = useMutation({
    mutationFn: deleteEmployerById,
    onSuccess: () => {
      toast.success("削除しました。");
      refetch();
    },
    onError: (error: any) => {
      console.error('Delete error:', error);
      console.error('Error status:', error?.response?.status);
      console.error('Error message:', error?.response?.data?.message);
      
      const errorMessage = error?.response?.data?.message || "削除失敗";
      const errorStatus = error?.response?.status;
      
      // Check for various error conditions that might indicate related data exists
      if (errorStatus === 400 || errorStatus === 409 || 
          errorMessage.includes('foreign key') || 
          errorMessage.includes('constraint') ||
          errorMessage.includes('関連') ||
          errorMessage.includes('削除できません') ||
          errorMessage.includes('Cannot delete')) {
      
      } else {
        toast.error(errorMessage);
      }
    },
  });

  const updateEmployer = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Employer> }) => 
      updateEmployerById(id, data),
    onSuccess: () => {
      toast.success("変更しました。");
      setModalShown(false);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "更新失敗");
    },
  });

  const createNewEmployer = useMutation({
    mutationFn: createEmployer,
    onSuccess: () => {
      toast.success("作成しました。");
      setModalShown(false);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "作成失敗");
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
  }, [searchParams]);

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

  const handleEdit = (employer: Employer) => {
    setSelectedEmployer(employer);
    setModalShown(true);
  }

  const handleDelete = (employer: Employer) => {
    const confirmMessage = `企業「${employer.clinic_name}」を削除しますか？\n\n注意: この企業に関連する求人やチャット履歴がある場合は、通常の削除は失敗する可能性があります。`;
    
    if (confirm(confirmMessage)) {
      deleteEmployer.mutate(employer.id);
    }
  }


  const handleModalSubmit = (data: EmployerFormValues) => {
    if (selectedEmployer) {
      // Edit existing employer
      updateEmployer.mutate({
        id: selectedEmployer.id,
        data: {
          ...data,
          business_form: Number(data.business_form),
          prefectures: Number(data.prefectures),
          employee_number: data.employee_number ? Number(data.employee_number) : undefined,
        }
      });
    } else {
      // Create new employer
      createNewEmployer.mutate({
        ...data,
        business_form: Number(data.business_form),
        prefectures: Number(data.prefectures),
        employee_number: data.employee_number ? Number(data.employee_number) : undefined,
      });
    }
  };

  const handleModalClose = () => {
    setModalShown(false);
    setSelectedEmployer(null);
  };

  const employers = response?.data?.employers || [];

  return (
    <div className="flex flex-col p-3 md:p-8">
      <h1 className="text-[24px] md:text-[32px] font-bold text-center mb-6">企業管理ページ</h1>
      <div className="flex flex-col md:flex-row">
        <div className="flex items-center mx-auto my-2 space-x-2 w-full">
          <h4 className="hidden md:block">都道府県：</h4>
          <CSelect
            value={prefectures.toString()}
            options={PrefectureOptions}
            placeholder="都道府県を選択"
            onChange={onChangePrefectures}
            className="h-[40px] w-[80px] md:w-[120px]"
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
        {employers?.map((employer: Employer, index: number) => (
          <div key={employer.id} className="bg-white rounded-lg shadow-md mb-4 p-4 border border-gray-600">
            <div className="mb-2"><span className="font-semibold">No.：</span>{index + 1}</div>
            <div className="mb-2"><span className="font-semibold">企業名：</span>{employer.clinic_name}</div>
            <div className="mb-2"><span className="font-semibold">企業名（カナ）：</span>{employer.clinic_name_kana}</div>
            <div className="mb-2"><span className="font-semibold">登録日：</span>{employer.created ? format(new Date(employer.created), 'yyyy年MM月dd日') : '-'}</div>
            <div className="mb-2"><span className="font-semibold">郵便番号：</span>{employer.zip}</div>
            <div className="mb-2"><span className="font-semibold">都道府県：</span>{PrefectureOptions.find(p => p.value === employer.prefectures.toString())?.option || '不明'}</div>
            <div className="mb-2"><span className="font-semibold">市区町村：</span>{employer.city}</div>
            <div className="mb-2"><span className="font-semibold">最寄り駅：</span>{employer.closest_station || '-'}</div>
            <div className="mb-2"><span className="font-semibold">電話番号：</span>{employer.tel}</div>
            <div className="mb-2"><span className="font-semibold">メールアドレス：</span>{employer.email}</div>
            <div className="mb-2"><span className="font-semibold">ホームページ：</span>
              {employer.home_page_url ? (
                <a href={employer.home_page_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {employer.home_page_url}
                </a>
              ) : '-'}
            </div>
            <div className="mb-2"><span className="font-semibold">従業員数：</span>{employer.employee_number || '-'}</div>
            <div className="mb-2"><span className="font-semibold">事業内容：</span>{employer.business || '-'}</div>
            <div className="mb-2"><span className="font-semibold">資本金：</span>{employer.capital_stock || '-'}</div>
            <div className="mb-2"><span className="font-semibold">設立年：</span>{employer.establishment_year}</div>
            <div className="flex gap-2 mt-2 justify-end">
              <CButton
                onClick={() => handleEdit(employer)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 text-xs flex items-center"
                text="編集"
              />
              <CButton
                onClick={() => handleDelete(employer)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 text-xs flex items-center"
                text="削除"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full whitespace-nowrap border-collapse border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope='col' className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">No.</th>
              <th scope='col' className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">企業名</th>
              <th scope='col' className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">企業名（カナ）</th>
              <th scope='col' className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">登録日</th>
              <th scope='col' className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">郵便番号</th>
              <th scope='col' className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">都道府県</th>
              <th scope='col' className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">市区町村</th>
              <th scope='col' className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">最寄り駅</th>
              <th scope='col' className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">電話番号</th>
              <th scope='col' className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">メールアドレス</th>
              <th scope='col' className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">ホームページ</th>
              <th scope='col' className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">従業員数</th>
              <th scope='col' className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">事業内容</th>
              <th scope='col' className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">資本金</th>
              <th scope='col' className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">設立年</th>
              <th scope='col' className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">操作</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <p>読み込み中...</p>
            )}
            {!employers?.length && !isLoading && (
              <p>結果なし</p>
            )}
            {employers.map((employer: Employer, index: number) => (
              <tr key={employer.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td data-label="No." className="py-2 px-4 border-b border-gray-200">
                  {(currentPage - 1) * limit + index + 1}
                </td>
                <td data-label="企業名" className="py-2 px-4 border-b border-gray-200">
                  {employer.clinic_name}
                </td>
                <td data-label="企業名（カナ）" className="py-2 px-4 border-b border-gray-200">
                  {employer.clinic_name_kana}
                </td>
                <td data-label="登録日" className="py-2 px-4 border-b border-gray-200">
                  {employer.created ? format(new Date(employer.created), 'yyyy年MM月dd日') : '-'}
                </td>
                <td data-label="郵便番号" className="py-2 px-4 border-b border-gray-200">
                  {employer.zip}
                </td>
                <td data-label="都道府県" className="py-2 px-4 border-b border-gray-200">
                  {PrefectureOptions.find(p => p.value === employer.prefectures.toString())?.option || '不明'}
                </td>
                <td data-label="市区町村" className="py-2 px-4 border-b border-gray-200">
                  {employer.city}
                </td>
                <td data-label="最寄り駅" className="py-2 px-4 border-b border-gray-200">
                  {employer.closest_station || '-'}
                </td>
                <td data-label="電話番号" className="py-2 px-4 border-b border-gray-200">
                  {employer.tel}
                </td>
                <td data-label="メールアドレス" className="py-2 px-4 border-b border-gray-200">
                  {employer.email}
                </td>
                <td data-label="ホームページ" className="py-2 px-4 border-b border-gray-200">
                  {employer.home_page_url ? (
                    <a href={employer.home_page_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">
                      {employer.home_page_url.length > 30 ? 'リンク' : employer.home_page_url}
                    </a>
                  ) : '-'}
                </td>
                <td data-label="従業員数" className="py-2 px-4 border-b border-gray-200">
                  {employer.employee_number || '-'}
                </td>
                <td data-label="事業内容" className="py-2 px-4 border-b border-gray-200">
                  <div className="max-w-[200px] truncate" title={employer.business}>
                    {employer.business || '-'}
                  </div>
                </td>
                <td data-label="資本金" className="py-2 px-4 border-b border-gray-200">
                  {employer.capital_stock || '-'}
                </td>
                <td data-label="設立年" className="py-2 px-4 border-b border-gray-200">
                  {employer.establishment_year}
                </td>
                <td data-label="操作" className="!p-2 border-b border-gray-200">
                  <div className="flex gap-1 sm:gap-2 sm:space-x-2 justify-center items-center">
                    <CButton
                      onClick={() => handleEdit(employer)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 text-xs flex items-center"
                      text="編集"
                      leftIcon={(
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      )}
                    />
                    <CButton
                      onClick={() => handleDelete(employer)}
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

      {/* Modal */}
      {modalShown && (
        <AddEmployerModal
          preLoad={selectedEmployer}
          onSubmit={handleModalSubmit}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}

