"use client";

import { useEffect, useState } from "react";
import { deleteContactInquiry } from "@/lib/api";
import type { ContactInquiryParam } from "@/utils/types";
import Image from "next/image";
import Pagination from "@/components/common/Pagination";
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import CInput from "@/components/common/Input";
import CButton from "@/components/common/Button";
import { format } from 'date-fns';
import { useGetContactInquiries } from "@/hooks/useGetContact";

export default function ContactInquiryList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [tempSearch, setTempSearch] = useState('');

  const { data: response, isLoading, refetch } = useGetContactInquiries({
    page: currentPage,
    limit,
    searchTerm
  });

  const [inquiries, setInquiries] = useState<ContactInquiryParam[]>([]);

  const deleteMutation = useMutation({
    mutationFn: deleteContactInquiry,
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
      setInquiries(response.data.contacts || []);
      setTotalPage(response.data.pagination?.totalPages || 1);
    }
  }, [response]);

  useEffect(() => {
    console.log('inquiries', inquiries);
  }, [inquiries])
  const handleDelete = async (index: number) => {
    if (!window.confirm("本当に削除しますか？")) return;
    toast.error('削除機能はIDが必要です');
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

  // Inquiry label mapping for numeric codes
  const inquiryLabels: Record<string, string> = {
    0: 'サービスについて',
    1: '取材について',
    2: '「リユース転職」の仕事に興味がある',
    3: 'その他',
  };

  const truncateText = (text: string, maxLength: number = 15) => {
    if (text.length <= maxLength) {
      return text;
    }
    return `${text.substring(0, maxLength)}...`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <p>読み込む中...</p>
      ) : (
        <div className="overflow-x-auto">
          <h2 className='text-center mb-6 text-[32px] font-bold'>お問い合わせ一覧</h2>
          {/* Search Bar */}
          <div className="flex justify-end flex-row items-center mx-auto my-2 space-x-2 w-full sm:w-[80%] md:w-full">
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

          {inquiries.length === 0 ? (
            <div className="text-center py-8">問い合わせはありません。</div>
          ) : (
            <>
              {/* Main Table */}
              <table className="rwd-table">
                <thead>
                  <tr>
                    <th scope='col' className="text-center">No.</th>
                    <th scope='col' className="text-center">会社名</th>
                    <th scope='col' className="text-center">お名前</th>
                    <th scope='col' className="text-center">メールアドレス</th>
                    <th scope='col' className="text-center">電話番号</th>
                    <th scope='col' className="text-center">お問い合わせ内容</th>
                    <th scope='col' className="text-center">詳細</th>
                    <th scope='col' className="text-center">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((inq, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td data-label="No." className="py-2 px-4 border-b border-gray-200 text-center">
                        {((currentPage - 1) * limit) + index + 1}
                      </td>
                      <td data-label="会社名" className="py-2 px-4 border-b border-gray-200 text-center">
                        {truncateText(inq.company_name || '')}
                      </td>
                      <td data-label="お名前" className="py-2 px-4 border-b border-gray-200 text-center">
                        {truncateText(inq.name)}
                      </td>
                      <td data-label="メールアドレス" className="py-2 px-4 border-b border-gray-200 text-center">
                        <div className="flex justify-between items-center w-full max-w-[180px] mx-auto">
                          <span className="truncate text-left">{truncateText(inq.email)}</span>
                          <a
                            href={`mailto:${inq.email}`}
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
                          <span className="text-left">{truncateText(inq.telephone)}</span>
                          <a href={`tel:${inq.telephone}`} className="flex-shrink-0 ml-2">
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
                        <span className="whitespace-pre-wrap">{inquiryLabels[inq.inquiry] || truncateText(inq.inquiry)}</span>
                      </td>
                      <td data-label="詳細" className="py-2 px-4 border-b border-gray-200 text-center">
                        <span className="whitespace-pre-wrap">{truncateText(inq.inquiry_detail || '')}</span>
                      </td>
                      <td data-label="操作" className="!p-2 border-b border-gray-200 text-center">
                        <CButton
                          onClick={() => handleDelete(index)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 text-xs flex items-center mx-auto"
                          text="削除"
                          leftIcon={(
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination Controls */}
              {totalPage > 0 && (
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
    </div>
  );
}
