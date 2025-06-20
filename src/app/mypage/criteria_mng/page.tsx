"use client";

import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import { RecruitingCriteria } from '@/utils/types';
import { format } from 'date-fns';
import CButton from "@/components/common/Button";
import Pagination from '@/components/common/Pagination';
import { useGetAdminCriterias } from '@/hooks/useGetAdminCriterias';
import CInput from '@/components/common/Input';
import AddCriteriaModal from '@/components/modal/AddCriteriaModal';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createRecruitingCriteria, getRecruitingCriterias, updateRecruitingCriteria, deleteRecruitingCriteria } from '@/lib/api';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = Yup.object().shape({
  calling_name: Yup.string().required('呼出用名称は必須です'),
  name: Yup.string().required('名前は必須です'),
  clinic_flg: Yup.number().required('クリニックフラグは必須です')
});

type FormValues = Yup.InferType<typeof schema>;

export default function CriteriaMngPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [tempSearch, setTempSearch] = useState('');
  const router = useRouter();
  const { data: response, isLoading: cLoading, refetch } = useGetAdminCriterias({
    page: currentPage,
    limit,
    searchTerm
  });
  const [criterias, setCriterias] = useState<RecruitingCriteria[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCriteria, setEditingCriteria] = useState<RecruitingCriteria | null>(null);

  useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      calling_name: '',
      name: '',
      clinic_flg: 0
    }
  });

  const addCriteria = useMutation({
    mutationFn: createRecruitingCriteria,
    onSuccess: () => {
      toast.success('募集条件を追加しました');
      setIsAddModalOpen(false);
      refetch();
    },
    onError: (error) => {
      console.error('Error adding criteria:', error);
      toast.error('募集条件の追加に失敗しました');
    }
  });

  const updateCriteria = useMutation({
    mutationFn: updateRecruitingCriteria,
    onSuccess: () => {
      toast.success('募集条件を更新しました');
      setIsAddModalOpen(false);
      setEditingCriteria(null);
      refetch();
    },
    onError: (error) => {
      console.error('Error updating criteria:', error);
      toast.error('募集条件の更新に失敗しました');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRecruitingCriteria,
    onSuccess: () => {
      toast.success("条件を削除しました");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "条件の削除に失敗しました");
    },
  });

  const { data: allCriterias } = useQuery({
    queryKey: ['allCriterias'],
    queryFn: getRecruitingCriterias
  });

  useEffect(() => {
    if (response?.data) {
      setCriterias(response.data.RecruitingCriteriaItems);
      setTotalPage(response.data.pagination.totalPages);
    }
  }, [response, limit]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('page', currentPage.toString());
    params.set('limit', limit.toString());
    params.set('searchTerm', searchTerm);
    router.push(`?${params.toString()}`);
  }, [currentPage, limit, searchTerm, router]);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const onChangeSearchTerm = (e: ChangeEvent<HTMLInputElement>) => {
    setTempSearch(e.target.value);
  }

  const onConfirmSearchTerm = () => {
    setSearchTerm(tempSearch);
  }

  const onClickAddNewCriteria = () => {
    setEditingCriteria(null);
    setIsAddModalOpen(true);
  }

  const handleEdit = (criteria: RecruitingCriteria) => {
    setEditingCriteria(criteria);
    setIsAddModalOpen(true);
  };

  const onSubmit = (data: { calling_name?: string; name: string; display_order: number }) => {
    if (editingCriteria) {
      updateCriteria.mutate({ id: editingCriteria.id, data });
    } else {
      addCriteria.mutate(data);
    }
  };

  const handleDelete = (criteria: RecruitingCriteria) => {
    if (window.confirm(`${criteria.name}を削除してもよろしいですか？`)) {
      deleteMutation.mutate(criteria.id);
    }
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'yyyy年MM月dd日HH:mm:ss');
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {cLoading ? (
        <p>読み込む中...</p>
      ) : (
        <div className="overflow-x-auto">
          <h2 className='text-center mb-6 text-[32px] font-bold'>募集条件管理</h2>
          <div className="flex justify-end flex-row items-center mx-auto my-2 space-x-2 w-full sm:w-[80%] md:w-full">
            <CButton
              text="追加"
              className='bg-blue-500 text-white text-sm h-[40px]'
              size="small"
              leftIcon={<span className="text-[18px] md:text-3xl">+</span>}
              onClick={onClickAddNewCriteria}
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
          <table className="rwd-table">
            <thead>
              <tr>
                <th scope='col'>No.</th>
                <th scope='col'>呼出用名称</th>
                <th scope='col'>名前</th>
                <th scope='col'>並び順</th>
                <th scope='col'>作成日</th>
                <th scope='col'>更新日</th>
                <th scope='col'>操作</th>
              </tr>
            </thead>
            <tbody>
              {criterias.map((criteria, index) => (
                <tr key={criteria.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td data-label="No." className="py-2 px-4 border-b border-gray-200"><span className='md:hidden'>No.　：</span>　{criteria.id}</td>
                  <td data-label="呼出用名称" className="py-2 px-4 border-b border-gray-200"><span className='md:hidden'>呼出用名称　：</span>　{criteria.calling_name}</td>
                  <td data-label="名前" className="py-2 px-4 border-b border-gray-200"><span className='md:hidden'>名前　：</span>　{criteria.name}</td>
                  <td data-label="並び順" className="py-2 px-4 border-b border-gray-200 hidden sm:table-cell"><span className='md:hidden'>並び順　：</span>　{criteria.display_order}</td>
                  <td data-label="作成日" className="py-2 px-4 border-b border-gray-200 hidden md:table-cell"><span className='md:hidden'>作成日　：</span>　{formatDateTime(criteria.created)}</td>
                  <td data-label="更新日" className="py-2 px-4 border-b border-gray-200 hidden md:table-cell"><span className='md:hidden'>更新日　：</span>　{formatDateTime(criteria.modified)}</td>
                  <td data-label="操作" className="!p-2 border-b border-gray-200">
                    <div className="flex gap-1 sm:gap-2 sm:space-x-2 justify-center items-center">
                      <CButton
                        onClick={() => handleEdit(criteria)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 text-xs flex items-center"
                        text="編集"
                        leftIcon={(
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        )}
                      />
                      <CButton
                        onClick={() => handleDelete(criteria)}
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
        </div>
      )}

      <AddCriteriaModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingCriteria(null);
        }}
        onSubmit={onSubmit}
        currentCriteriaCount={allCriterias?.length ?? 0}
        editData={editingCriteria ? {
          id: editingCriteria.id,
          calling_name: editingCriteria.calling_name,
          name: editingCriteria.name,
          display_order: editingCriteria.display_order
        } : undefined}
      />
    </div>
  );
}

