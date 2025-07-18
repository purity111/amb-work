"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Pagination from "@/components/common/Pagination";
import CInput from "@/components/common/Input";
import CButton from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import { format } from "date-fns";
import { useGetCareerConsultations } from "@/hooks/useGetCareerConsultations";
import { PrefectureOptions } from '@/utils/constants';
import { toast } from 'react-toastify';
import { deleteCareerConsultation } from '@/lib/api';

export default function CareerInquiryList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSearch, setTempSearch] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);

  const { data: response, isLoading } = useGetCareerConsultations({
    page: currentPage,
    limit,
    searchTerm,
  });

  const [inquiries, setInquiries] = useState<any[]>([]);

  useEffect(() => {
    if (response) {
      setInquiries(response.data?.careerConsultations || response.careerConsultations || []);
      setTotalPage(response.data?.pagination?.totalPages || response.pagination?.totalPages || 1);
    }
  }, [response]);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    console.log(inquiries);
    
  }, [inquiries]);
  const onChangeSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempSearch(e.target.value);
  };

  const onConfirmSearchTerm = () => {
    setSearchTerm(tempSearch);
    setCurrentPage(1); // Reset to first page when searching
  };

  const formatDateTime = (dateString: string, withTime: boolean = true) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), withTime ? "yyyy年MM月dd日HH:mm:ss" : "yyyy年MM月dd日");
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const truncateText = (text: any, maxLength: number = 12) => {
    if (!text) return "";
    const str = String(text);
    if (str.length <= maxLength) {
      return str;
    }
    return `${str.substring(0, maxLength)}...`;
  };

  // Experience and inquiry label mapping
  const experienceLabel = (val: any) => val === 0 || val === '0' ? 'ある' : 'なし';
  const inquiryLabels: Record<string, string> = {
    0: '転職相談をしたい',
    1: 'キャリアカウンセリングを受けたい',
    2: '業界情報について話を聞きたい',
    3: '研修・セミナー内容について知りたい',
    4: 'その他',
  };

  // Helper to get prefecture name from value
  const getPrefectureName = (val: any) => {
    const found = PrefectureOptions.find(opt => opt.value === String(val));
    return found ? found.option : '';
  };

  // Delete handler
  const handleDelete = async (id: any) => {
    if (!window.confirm("本当に削除しますか？")) return;
    try {
      await deleteCareerConsultation(id);
      toast.success('削除しました');
      // Refresh list
      setInquiries(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      toast.error('削除に失敗しました');
      console.log(error);
      
    }
  };

  // Detail modal handlers
  const handleDetailsClick = (inquiry: any) => {
    setSelectedInquiry(inquiry);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedInquiry(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <p>読み込み中...</p>
      ) : (
        <div className="overflow-x-auto">
          <h2 className="text-center mb-6 text-[24px] md:text-[32px] font-bold">キャリア相談一覧</h2>
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
              className="bg-blue text-white h-[40px]"
              size="small"
              onClick={onConfirmSearchTerm}
            />
          </div>

          {inquiries.length === 0 ? (
            <div className="text-center py-8">キャリア相談はありません。</div>
          ) : (
            <>
              {/* Card layout for mobile (SP) */}
              <div className="block md:hidden">
                {inquiries.map((inq, index) => (
                  <div
                    key={inq.id || index}
                    className="bg-white rounded-lg shadow-md mb-4 p-4 border border-gray-200"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-lg">No.{((currentPage - 1) * limit) + index + 1}</span>
                      <span className="text-xs text-gray-400">{inq.created ? formatDateTime(inq.created) : ''}</span>
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">お名前: </span>
                      <span>{inq.name}</span>
                    </div>
                    <div className="mb-2 flex items-center">
                      <span className="font-semibold">メール: </span>
                      <span className="ml-1 truncate">{truncateText(inq.email)}</span>
                      <a href={`mailto:${inq.email}`} className="ml-2">
                        <Image src="/images/icons/email.png" alt="email" width={18} height={18} />
                      </a>
                    </div>
                    <div className="mb-2 flex items-center">
                      <span className="font-semibold">電話: </span>
                      <span className="ml-1">{truncateText(inq.telephone)}</span>
                      <a href={`tel:${inq.telephone}`} className="ml-2">
                        <Image src="/images/icons/phone.png" alt="phone" width={18} height={18} />
                      </a>
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">生年月日: </span>
                      <span>{inq.birthday ? formatDateTime(inq.birthday, false) : ''}</span>
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">都道府県: </span>
                      <span>{getPrefectureName(inq.prefectures)}</span>
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">経験: </span>
                      <span>{experienceLabel(inq.experience)}</span>
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">お問い合わせ内容: </span>
                      <span>{inquiryLabels[inq.inquiry] ?? truncateText(inq.inquiry || '')}</span>
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">希望職種: </span>
                      <span>{truncateText(inq.desired_job_type || '')}</span>
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">ご要望: </span>
                      <span>{truncateText(inq.request || '')}</span>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <CButton
                        onClick={() => handleDetailsClick(inq)}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 text-xs"
                        text="詳細"
                      />
                      <CButton
                        onClick={() => handleDelete(inq.id || index)}
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
                      <th scope="col" className="text-center">No.</th>
                      <th scope="col" className="text-center">お名前</th>
                      <th scope="col" className="text-center">メールアドレス</th>
                      <th scope="col" className="text-center">電話番号</th>
                      <th scope="col" className="text-center">生年月日</th>
                      <th scope="col" className="text-center">都道府県</th>
                      <th scope="col" className="text-center">経験</th>
                      <th scope="col" className="text-center">お問い合わせ内容</th>
                      <th scope="col" className="text-center">希望職種</th>
                      <th scope="col" className="text-center">ご要望</th>
                      <th scope="col" className="text-center">作成日時</th>
                      <th scope="col" className="text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.map((inq, index) => (
                      <tr key={inq.id || index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td data-label="No." className="py-2 px-4 border-b border-gray-200 text-center">
                          {((currentPage - 1) * limit) + index + 1}
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
                        <td data-label="生年月日" className="py-2 px-4 border-b border-gray-200 text-center">
                          {inq.birthday ? formatDateTime(inq.birthday, false) : ''}
                        </td>
                        <td data-label="都道府県" className="py-2 px-4 border-b border-gray-200 text-center">
                          {getPrefectureName(inq.prefectures)}
                        </td>
                        <td data-label="経験" className="py-2 px-4 border-b border-gray-200 text-center">
                          {experienceLabel(inq.experience)}
                        </td>
                        <td data-label="お問い合わせ内容" className="py-2 px-4 border-b border-gray-200 text-center">
                          {inquiryLabels[inq.inquiry] ?? truncateText(inq.inquiry || '')}
                        </td>
                        <td data-label="希望職種" className="py-2 px-4 border-b border-gray-200 text-center">
                          {truncateText(inq.desired_job_type || '')}
                        </td>
                        <td data-label="ご要望" className="py-2 px-4 border-b border-gray-200 text-center">
                          {truncateText(inq.request || '')}
                        </td>
                        <td data-label="作成日時" className="py-2 px-4 border-b border-gray-200 text-center">
                          {inq.created ? formatDateTime(inq.created) : ''}
                        </td>
                        <td data-label="操作" className="!p-2 border-b border-gray-200 text-center">
                          <div className="flex justify-center space-x-2">
                            <CButton
                              onClick={() => handleDetailsClick(inq)}
                              className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-2 text-xs flex items-center"
                              text="詳細"
                            />
                          <CButton
                            onClick={() => handleDelete(inq.id || index)}
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

      {showDetailModal && selectedInquiry && (
        <Modal
          isOpen={showDetailModal}
          onClose={handleCloseDetailModal}
          title="キャリア相談詳細"
          okButtonTitle="閉じる"
          onPressOK={handleCloseDetailModal}
        >
          <div className="p-4 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="mb-3">
                  <span className="font-semibold text-md">お名前:</span>
                  <span className="ml-2">{selectedInquiry.name}</span>
                </div>
                <div className="mb-3">
                  <span className="font-semibold text-md">メールアドレス:</span>
                  <span className="ml-2">{selectedInquiry.email}</span>
                </div>
                <div className="mb-3">
                  <span className="font-semibold text-md">電話番号:</span>
                  <span className="ml-2">{selectedInquiry.telephone}</span>
                </div>
                <div className="mb-3">
                  <span className="font-semibold text-md">生年月日:</span>
                  <span className="ml-2">{selectedInquiry.birthday ? formatDateTime(selectedInquiry.birthday, false) : ''}</span>
                </div>
                <div className="mb-3">
                  <span className="font-semibold text-md">都道府県:</span>
                  <span className="ml-2">{getPrefectureName(selectedInquiry.prefectures)}</span>
                </div>
                <div className="mb-3">
                  <span className="font-semibold text-md">作成日時:</span>
                  <span className="ml-2">{selectedInquiry.created ? formatDateTime(selectedInquiry.created) : ''}</span>
                </div>
              </div>
              <div>
                <div className="mb-3">
                  <span className="font-semibold text-md">経験:</span>
                  <span className="ml-2">{experienceLabel(selectedInquiry.experience)}</span>
                </div>
                <div className="mb-3">
                  <span className="font-semibold text-md">お問い合わせ内容:</span>
                  <span className="ml-2">{inquiryLabels[selectedInquiry.inquiry] ?? selectedInquiry.inquiry}</span>
                </div>
                <div className="mb-3">
                  <span className="font-semibold text-md">希望職種:</span>
                  <span className="ml-2">{selectedInquiry.desired_job_type || ''}</span>
                </div>
                <div className="mb-3">
                  <span className="font-semibold text-md">ご要望:</span>
                  <span className="ml-2 whitespace-pre-wrap">{selectedInquiry.request || ''}</span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
