"use client";

import { ChangeEvent, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { FeatureItem, PickOption } from '@/utils/types';
import { createFeatures, updateFeatures, deleteFeatures } from '@/lib/api';
import CButton from "@/components/common/Button";
import CInput from '@/components/common/Input';
import Pagination from '@/components/common/Pagination';
import { useGetAdminFeatures } from '@/hooks/useGetAdminFeatures';
import { useGetFeatures } from '@/hooks/useGetFeatures';
import AddEditFeature from '@/components/modal/AddEditFeature';

type FormValues = {
  name: string;
  parent_id: number | null;
  type: number;
};

// Form validation schema
// const schema = Yup.object<FormValues>().shape({
//   name: Yup.string().required('タイトルは必須です'),
//   parent_id: Yup.number().required('親IDは必須です').nullable(),
//   type: Yup.number().required('タイプは必須です'),
// }).required();

export default function FeatureMngPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [tempSearch, setTempSearch] = useState('');
  const [features, setFeatures] = useState<FeatureItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<FeatureItem | null>(null);
  const [parentFeatures, setParentFeatures] = useState<PickOption[]>([]);

  // Fetch paginated features for the table
  const { data: paginatedResponse, isLoading, refetch } = useGetAdminFeatures({
    page: currentPage,
    limit,
    searchTerm
  });

  // Fetch all features for the parent select box
  const { data: allFeaturesResponse } = useGetFeatures();

  // Mutations
  const addFeature = useMutation({
    mutationFn: (data: FormValues) => createFeatures(data as any),
    onSuccess: () => {
      toast.success('特徴を追加しました');
      setIsModalOpen(false);
      refetch();
    },
    onError: (error) => {
      console.error('Error adding feature:', error);
      toast.error('特徴の追加に失敗しました');
    }
  });

  const updateFeature = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormValues }) =>
      updateFeatures(id, data as any),
    onSuccess: () => {
      toast.success('特徴を更新しました');
      setIsModalOpen(false);
      setEditingFeature(null);
      refetch();
    },
    onError: (error) => {
      console.error('Error updating feature:', error);
      toast.error('特徴の更新に失敗しました');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFeatures,
    onSuccess: () => {
      toast.success("特徴を削除しました");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "特徴の削除に失敗しました");
    },
  });

  // Effects for table data
  useEffect(() => {
    if (paginatedResponse) {
      setFeatures(paginatedResponse.featureItems || []);
      setTotalPage(paginatedResponse.pagination?.totalPages || 1);
    }
  }, [paginatedResponse]);

  // Effect for parent features dropdown
  useEffect(() => {
    if (allFeaturesResponse) {
      console.log('allFeaturesResponse:', allFeaturesResponse);
      const parents = allFeaturesResponse.data
        .filter((f: FeatureItem) => f.type === 1 || f.type === 2)
        .map((f: FeatureItem) => ({
          value: f.id.toString(),
          option: f.name
        }));
      console.log('Filtered parents:', parents);
      setParentFeatures([{ value: '', option: '選択してください' }, ...parents]);
    }
  }, [allFeaturesResponse]);

  // Handlers
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const onChangeSearchTerm = (e: ChangeEvent<HTMLInputElement>) => {
    setTempSearch(e.target.value);
  };

  const onConfirmSearchTerm = () => {
    setSearchTerm(tempSearch);
  };

  const onClickAddNewFeature = () => {
    setEditingFeature(null);
    setIsModalOpen(true);
  };

  const handleEdit = (feature: FeatureItem) => {
    setEditingFeature(feature);
    setIsModalOpen(true);
  };

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (editingFeature) {
      updateFeature.mutate({ id: editingFeature.id, data });
    } else {
      addFeature.mutate(data);
    }
  };

  const handleDelete = (feature: FeatureItem) => {
    if (window.confirm(`${feature.name}を削除してもよろしいですか？`)) {
      deleteMutation.mutate(feature.id);
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
      {isLoading ? (
        <p>読み込む中...</p>
      ) : (
        <div className="overflow-x-auto">
          <h2 className='text-center mb-6 text-[32px] font-bold'>特徴管理</h2>

          {/* Top controls */}
          <div className="flex justify-end flex-row mx-auto my-2 w-full sm:w-[80%] md:w-full space-x-2">
            <CButton
              text="追加"
              className='bg-blue-500 text-white text-sm h-[40px]'
              size="small"
              leftIcon={<span className="text-[18px] md:text-3xl">+</span>}
              onClick={onClickAddNewFeature}
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

          {/* Features table */}
          <table className="rwd-table">
            <thead>
              <tr>
                <th scope='col'>No.</th>
                <th scope='col'>名前</th>
                <th scope='col'>タイプ</th>
                <th scope='col'>親ID</th>
                <th scope='col'>作成日</th>
                <th scope='col'>更新日</th>
                <th scope='col'>操作</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr key={feature.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td data-label="No." className="py-2 px-4 border-b border-gray-200">
                    <span className='md:hidden'>No.　：</span>　{feature.id}
                  </td>
                  <td data-label="名前" className="py-2 px-4 border-b border-gray-200">
                    <span className='md:hidden'>名前　：</span>　{feature.name}
                  </td>
                  <td data-label="タイプ" className="py-2 px-4 border-b border-gray-200">
                    <span className='md:hidden'>タイプ　：</span>　{feature.type}
                  </td>
                  <td data-label="親特徴ID" className="py-2 px-4 border-b border-gray-200">
                    <span className='md:hidden'>親ID　：</span>　{feature.parent_id || '-'}
                  </td>
                  <td data-label="作成日" className="py-2 px-4 border-b border-gray-200 hidden md:table-cell">
                    <span className='md:hidden'>作成日　：</span>　{formatDateTime(feature.created)}
                  </td>
                  <td data-label="更新日" className="py-2 px-4 border-b border-gray-200 hidden md:table-cell">
                    <span className='md:hidden'>更新日　：</span>　{formatDateTime(feature.modified)}
                  </td>
                  <td data-label="操作" className="!p-2 border-b border-gray-200">
                    <div className="flex gap-1 sm:gap-2 sm:space-x-2 justify-center items-center">
                      <CButton
                        onClick={() => handleEdit(feature)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 text-xs flex items-center"
                        text="編集"
                        leftIcon={(
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        )}
                      />
                      <CButton
                        onClick={() => handleDelete(feature)}
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

          {/* Bottom pagination */}
          <div className='flex justify-center mt-4'>
            <Pagination
              page={currentPage}
              totalPages={totalPage}
              onPageChange={onPageChange}
            />
          </div>

          {/* Replace the modal code with the new component */}
          <AddEditFeature
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingFeature(null);
            }}
            onSubmit={onSubmit}
            parentFeatures={parentFeatures}
            editData={editingFeature}
          />
        </div>
      )}
    </div>
  );
}

