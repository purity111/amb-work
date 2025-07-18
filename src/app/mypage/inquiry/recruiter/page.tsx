"use client";

import { useEffect, useState } from "react";
import { deleteCompanyApplication } from "@/lib/api";
import type { CompanyApplicationItem } from "@/utils/types";
import Image from "next/image";
import Pagination from "@/components/common/Pagination";
import Modal from "@/components/common/Modal";
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import CInput from "@/components/common/Input";
import CButton from "@/components/common/Button";
import { format } from 'date-fns';
import { useGetCompanyApplications } from "@/hooks/useGetCompanyApplications";

export default function RecruiterInquiryList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [tempSearch, setTempSearch] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<CompanyApplicationItem | null>(null);

  const { data: response, isLoading, refetch } = useGetCompanyApplications({
    page: currentPage,
    limit,
    searchTerm
  });

  const [applications, setApplications] = useState<CompanyApplicationItem[]>([]);

  const deleteMutation = useMutation({
    mutationFn: deleteCompanyApplication,
    onSuccess: () => {
      toast.success("問い合わせを削除しました");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "問い合わせの削除に失敗しました");
    },
  });

  useEffect(() => {
    if (response) {
      setApplications(response.companyApplications);
      console.log(response.companyApplications);
      
      setTotalPage(response.pagination.totalPages);
    }
  }, [response]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("本当に削除しますか？")) return;
    deleteMutation.mutate(id);
  };

  // Detail modal handlers
  const handleDetailsClick = (application: CompanyApplicationItem) => {
    setSelectedApplication(application);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedApplication(null);
  };

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const onChangeSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempSearch(e.target.value);
  };

  const onConfirmSearchTerm = () => {
    setSearchTerm(tempSearch);
    setCurrentPage(1); // Reset to first page when searching
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

  // Helper function to truncate text longer than 20 characters
  const truncateText = (text: string, maxLength = 12) => {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <p>読み込む中...</p>
      ) : (
        <div className="overflow-x-auto">
          <h2 className='text-center mb-6 text-[24px] md:text-[32px] font-bold'>企業からの問い合わせ一覧</h2>
          {/* Search Bar */}
          <div className="flex justify-between md:justify-end flex-row items-center mx-auto my-2 space-x-2 w-full sm:w-[80%] md:w-full">
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

          {applications.length === 0 ? (
            <div className="text-center py-8">問い合わせはありません。</div>
          ) : (
            <>
              {/* Card layout for mobile (SP) */}
              <div className="block md:hidden">
                {applications.map((app, index) => (
                  <div
                    key={app.id}
                    className="bg-white rounded-lg shadow-md mb-4 p-4 border border-gray-200"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-lg">No.{((currentPage - 1) * limit) + index + 1}</span>
                      <span className="text-xs text-gray-400">{formatDateTime(app.created)}</span>
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">会社名: </span>
                      <span>{app.company_name}</span>
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">部署名: </span>
                      <span>{app.department_name}</span>
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">お名前: </span>
                      <span>{app.name}</span>
                    </div>
                    <div className="mb-2 flex items-center">
                      <span className="font-semibold">メール: </span>
                      <span className="ml-1 truncate">{truncateText(app.email)}</span>
                      <a href={`mailto:${app.email}`} className="ml-2">
                        <Image src="/images/icons/email.png" alt="email" width={18} height={18} />
                      </a>
                    </div>
                    <div className="mb-2 flex items-center">
                      <span className="font-semibold">電話: </span>
                      <span className="ml-1">{truncateText(app.telephone)}</span>
                      <a href={`tel:${app.telephone}`} className="ml-2">
                        <Image src="/images/icons/phone.png" alt="phone" width={18} height={18} />
                      </a>
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">お問い合わせ内容: </span>
                      <span className="whitespace-pre-wrap">{truncateText(app.inquiry)}</span>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <CButton
                        onClick={() => handleDetailsClick(app)}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 text-xs"
                        text="詳細"
                      />
                      <CButton
                        onClick={() => handleDelete(app.id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 text-xs"
                        text="削除"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Table layout for desktop */}
              <div className="hidden md:block">
                <table className="rwd-table">
                  <thead>
                    <tr>
                      <th scope='col' className="text-center">No.</th>
                      <th scope='col' className="text-center">会社名</th>
                      <th scope='col' className="text-center">部署名</th>
                      <th scope='col' className="text-center">お名前</th>
                      <th scope='col' className="text-center">メールアドレス</th>
                      <th scope='col' className="text-center">電話番号</th>
                      <th scope='col' className="text-center">お問い合わせ内容</th>
                      <th scope='col' className="text-center">作成日</th>
                      <th scope='col' className="text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app, index) => (
                      <tr key={app.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td data-label="No." className="py-2 px-4 border-b border-gray-200 text-center">
                          {((currentPage - 1) * limit) + index + 1}
                        </td>
                        <td data-label="会社名" className="py-2 px-4 border-b border-gray-200 text-center">
                          {truncateText(app.company_name)}
                        </td>
                        <td data-label="部署名" className="py-2 px-4 border-b border-gray-200 text-center">
                          {truncateText(app.department_name)}
                        </td>
                        <td data-label="お名前" className="py-2 px-4 border-b border-gray-200 text-center">
                          {truncateText(app.name)}
                        </td>
                        <td data-label="メールアドレス" className="py-2 px-4 border-b border-gray-200 text-center">
                          <div className="flex justify-between items-center w-full max-w-[180px] mx-auto">
                            <span className="truncate text-left">{truncateText(app.email)}</span>
                            <a
                              href={`mailto:${app.email}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-shrink-0 ml-2"
                            >
                              <Image
                                src="/images/icons/email.png"
                                alt="email"
                                width={20}
                                height={20}
                                className="cursor-pointer"
                              />
                            </a>
                          </div>
                        </td>
                        <td data-label="電話番号" className="py-2 px-4 border-b border-gray-200 text-center">
                          <div className="flex justify-between items-center w-full max-w-[140px] mx-auto">
                            <span className="text-left">{truncateText(app.telephone)}</span>
                            <a href={`tel:${app.telephone}`} className="flex-shrink-0 ml-2">
                              <Image
                                src="/images/icons/phone.png"
                                alt="phone"
                                width={20}
                                height={20}
                                className="cursor-pointer"
                              />
                            </a>
                          </div>
                        </td>
                        <td data-label="お問い合わせ内容" className="py-2 px-4 border-b border-gray-200 text-center">
                          <span className="whitespace-pre-wrap" title={app.inquiry}>{truncateText(app.inquiry)}</span>
                        </td>
                        <td data-label="作成日" className="py-2 px-4 border-b border-gray-200 text-center hidden md:table-cell">
                          {formatDateTime(app.created)}
                        </td>
                        <td data-label="操作" className="!p-2 border-b border-gray-200 text-center">
                          <div className="flex justify-center space-x-2">
                            <CButton
                              onClick={() => handleDetailsClick(app)}
                              className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-2 text-xs flex items-center"
                              text="詳細"
                            />
                          <CButton
                            onClick={() => handleDelete(app.id)}
                              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 text-xs flex items-center"
                            text="削除"
                            leftIcon={(<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>)}
                          />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPage > 1 && (
                <div className="flex flex-row justify-center mt-4">
                  <Pagination
                    page={currentPage}
                    totalPages={totalPage}
                    onPageChange={onPageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}

      {showDetailModal && selectedApplication && (
        <Modal
          isOpen={showDetailModal}
          onClose={handleCloseDetailModal}
          title="企業からの問い合わせ詳細"
          okButtonTitle="閉じる"
          onPressOK={handleCloseDetailModal}
        >
          <div className="p-4 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="mb-3">
                  <span className="font-semibold text-md">会社名:</span>
                  <span className="ml-2">{selectedApplication.company_name}</span>
                </div>
                <div className="mb-3">
                  <span className="font-semibold text-md">部署名:</span>
                  <span className="ml-2">{selectedApplication.department_name}</span>
                </div>
                <div className="mb-3">
                  <span className="font-semibold text-md">お名前:</span>
                  <span className="ml-2">{selectedApplication.name}</span>
                </div>
                <div className="mb-3">
                  <span className="font-semibold text-md">メールアドレス:</span>
                  <span className="ml-2">{selectedApplication.email}</span>
                </div>
              </div>
              <div>
                <div className="mb-3">
                  <span className="font-semibold text-md">電話番号:</span>
                  <span className="ml-2">{selectedApplication.telephone}</span>
                </div>
                <div className="mb-3">
                  <span className="font-semibold text-md">お問い合わせ内容:</span>
                  <span className="ml-2 whitespace-pre-wrap">{selectedApplication.inquiry}</span>
                </div>
                <div className="mb-3">
                  <span className="font-semibold text-md">作成日:</span>
                  <span className="ml-2">{formatDateTime(selectedApplication.created)}</span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
