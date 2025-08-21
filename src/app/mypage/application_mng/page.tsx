"use client";

import React, { ChangeEvent, useEffect, useState, useRef, Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ApplicationCard from '@/components/ApplicationCard';
import { ApplicationItem, ChatItem } from '@/utils/types';
import CButton from "@/components/common/Button";
import CInput from '@/components/common/Input';
import CSelect from '@/components/common/Select';
import Pagination from '@/components/common/Pagination';
import { JobTypeOptions } from '@/utils/constants';
import Modal from '@/components/common/Modal';
import { formatLongDateTime, generateApplicationCSVData } from '@/utils/helper';
import ChatBox from '@/components/ChatBox';
import Image from 'next/image';
import { CSVLink } from "react-csv";
import { format } from 'date-fns';
import { useGetApplicants } from '@/hooks/useGetApplicants';
import { useAuthContext } from '@/app/layout';

function ApplicationMngContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [tempSearch, setTempSearch] = useState('');
  const [jobType, setJobType] = useState<string>('0');
  const [selectedChat, setSelectedChat] = useState<ChatItem | null>(null);
  const [isHidden, setIsHidden] = useState(false);

  const router = useRouter();
  const { profile, isAdmin } = useAuthContext();
  const searchParams = useSearchParams();

  const hasLoaded = useRef(false);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationItem | null>(null);
  const [selectedApplications, setSelectedApplications] = useState<Record<number, ApplicationItem | null>>({});

  useEffect(() => {
    document.title = 'リユース転職サービス';
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const jobTypeParam = params.get('jobType');
    const searchText = params.get('searchTerm');
    setJobType(jobTypeParam || '0');
    setSearchTerm(searchText || '');
    setTempSearch(searchText || '');
    hasLoaded.current = true;
  }, [searchParams]);

  const { data: response, isLoading } = useGetApplicants({
    limit,
    page: currentPage,
    profile,
    searchTerm,
    jobType: Number(jobType)
  })

  const { data: allApplications, isLoading: aLoading } = useGetApplicants({
    limit: limit + 100,
    page: currentPage,
    profile,
    searchTerm,
    jobType: Number(jobType)
  })

  const [applications, setApplications] = useState<ApplicationItem[]>([]);

  useEffect(() => {
    if (response?.data) {
      setApplications(response?.data?.applications);
      setTotalPage(response?.data?.pagination?.totalPages);
    }
  }, [response, limit]);

  useEffect(() => {
    if (!hasLoaded.current) return;
    const params = new URLSearchParams();
    params.set('page', currentPage.toString());
    params.set('limit', limit.toString());
    params.set('searchTerm', searchTerm);
    if (jobType === '1' || jobType === '2') {
      params.set('jobType', jobType);
    } else {
      params.delete('jobType');
    }
    router.push(`?${params.toString()}`);
  }, [currentPage, limit, searchTerm, jobType, router]);

  const getSelectedApplications = useMemo(() => {
    const filtered = Object.values(selectedApplications).filter((app: ApplicationItem | null) => !!app);
    return filtered;
  }, [selectedApplications])

  const getAllApplications = useMemo(() => {
    if (aLoading || !allApplications?.data?.applications) return [];
    return allApplications.data.applications;
  }, [allApplications, aLoading])

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const onChangeSearchTerm = (e: ChangeEvent<HTMLInputElement>) => {
    setTempSearch(e.target.value);
  };

  const onConfirmSearchTerm = () => {
    setSearchTerm(tempSearch);
    setCurrentPage(1);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchTerm(tempSearch);
    }
  };

  const onSelectJobType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setJobType(e.target.value as string);
    setCurrentPage(1);
  };

  const handleDetailsClick = (app: ApplicationItem) => {
    setSelectedApplication(app);
    setShowDetailModal(true);
  };

  const handleChatClick = (app: ApplicationItem) => {
    setSelectedChat({
      ...app.chat,
      agency: profile?.role === 'admin' ? 1 : 0,
      jobInfo: app.jobInfo,
      jobSeeker: app.jobSeeker,
      unreadCount: 0,
      lastMessageTime: ''
    } as ChatItem);
    setIsHidden(false);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedApplication(null);
  };

  const toggleCheckbox = (app: ApplicationItem) => {
    setSelectedApplications((prev) => ({
      ...prev,
      [app.id]: prev[app.id] ? null : app,
    }));
  };

  const onClearSelectedApplications = () => {
    setSelectedApplications({});
  }

  return (
    <div className="container mx-auto px-4 py-8 w-full md:w-[95%] max-w-[1280px]">
      <div className="overflow-x-auto">
        <h2 className='text-center mb-6 text-[24px] md:text-[32px] font-bold'>応募管理ページ</h2>
        <div className="flex gap-2 flex-row justify-center items-center lg:flex-row lg:space-x-3 mb-4">
          {(profile?.role === 'JobSeeker' || isAdmin) && (
            <div className="flex flex-row space-x-3">
              <CSelect
                options={JobTypeOptions}
                value={jobType}
                onChange={onSelectJobType}
                width="w-30"
                height="h-10"
              />
            </div>
          )}
          <div className="flex justify-center sm:justify-end flex-row items-center mx-auto my-2 space-x-2 w-full sm:w-[80%] md:w-full">
            <CInput
              placeholder="検索"
              height="h-10"
              className="flex-1 max-w-[180px] sm:max-w-full"
              onChange={onChangeSearchTerm}
              value={tempSearch}
              onKeyDown={onKeyDown}
            />
            <CButton
              text="検索"
              className='bg-blue text-white w-30 h-[40px]'
              size="small"
              onClick={onConfirmSearchTerm}
            />
          </div>
        </div>
        <div className="">
          <div className='flex flex-col md:flex-row items-center'>
            <p className='flex-1 mb-2 md:mb-0'>
              選択済み: {getSelectedApplications.length} 応募
              <span className="ml-2 text-blue cursor-pointer" onClick={onClearSelectedApplications}>クリア</span>
            </p>
            <div className="flex items-center">
              {applications?.length > 0 && (
                <CSVLink
                  data={generateApplicationCSVData(getAllApplications)}
                  filename={`すべてのアプリ-${format(new Date(), 'yyyy年MM月dd日HH:mm')}`}
                >
                  <CButton
                    text="全体CSV出⼒"
                    className='bg-green text-white text-sm h-[40px]'
                    size="small"
                  />
                </CSVLink>
              )}
              {getSelectedApplications.length > 0 && (
                <CSVLink
                  data={generateApplicationCSVData(Object.values(getSelectedApplications) as ApplicationItem[])}
                  filename={`選択中のアプリ-${format(new Date(), 'yyyy年MM月dd日HH:mm')}`}
                >
                  <CButton
                    text="選択のみCSV出⼒"
                    className='bg-orange text-white text-sm h-[40px] ml-4'
                    size="small"
                  />
                </CSVLink>
              )}
            </div>
          </div>
          <div className="flex flex-row justify-center my-4">
            {totalPage > 0 && (
              <Pagination
                page={currentPage}
                totalPages={totalPage}
                onPageChange={onPageChange}
              />
            )}
          </div>
          {isLoading && <p>読み込み中...</p>}
          {!isLoading && applications?.length > 0 && applications?.map((app) => (
            <ApplicationCard
              key={app.id}
              data={app}
              checked={!!selectedApplications[app.id]}
              userRole={profile?.role}
              onDetailsClick={() => handleDetailsClick(app)}
              onChatClick={() => handleChatClick(app)}
              onToggleChecked={() => toggleCheckbox(app)}
            />
          ))}
          {!isLoading && <div className="flex flex-row justify-center my-4">
            {totalPage > 0 && (
              <Pagination
                page={currentPage}
                totalPages={totalPage}
                onPageChange={onPageChange}
              />
            )}
          </div>}
          {!isLoading && applications?.length === 0 && <div>応募が見つかりませんでした。</div>}
        </div>

      </div>
      {selectedChat && (
        <div className={`
          fixed bottom-10 right-4 shadow-lg z-100
          ${isHidden ? 'rounded-full' : 'h-[500px] w-[90%] max-w-[360px] bg-white rounded-sm'} 
        `}>
          {isHidden && (
            <button className="p-2 bg-white w-12 h-12 flex justify-center items-center rounded-full transition relative cursor-pointer" onClick={() => setIsHidden(false)}>
              <Image src={'/images/message_bubble.png'} width={30} height={30} alt="チャットアバター" />
            </button>
          )}
          {!isHidden && (
            <ChatBox
              data={selectedChat}
              hasHideButton
              isHidden={isHidden}
              onToggleHidden={() => setIsHidden(!isHidden)}
              onChange={() => { }}
            />
          )}
        </div>
      )}
      {showDetailModal && selectedApplication && (
        <Modal
          isOpen={showDetailModal}
          onClose={handleCloseDetailModal}
          title="求人詳細"
          okButtonTitle="閉じる"
          onPressOK={handleCloseDetailModal}
        >
          <div className="p-4 text-left">
            <div className="mb-4">
              <div className="flex flex-col sm:flex-row sm:items-baseline">
                <span className="font-semibold text-md w-full sm:w-[150px] shrink-0">求人タイトル:</span>
                <span className="text-[20px] md:text-[24px] text-green-600 font-bold text-left flex-1">{selectedApplication.jobInfo.job_title}</span>
              </div>
              <div className="mt-2 flex flex-col sm:flex-row sm:items-baseline">
                <span className="font-semibold text-md w-full sm:w-[150px] shrink-0">応募日時:</span>
                <span className="text-left flex-1">{formatLongDateTime(selectedApplication.created)}</span>
              </div>
            </div>

            {
              selectedApplication.jobInfo.recruitingCriterias &&
              selectedApplication.jobInfo.recruitingCriterias.some(criteria => criteria.JobInfosRecruitingCriteria.body) && (
                <hr className="my-4 border-gray-600 w-full sm:ml-[150px] sm:w-[calc(100%-150px)]" />
              )
            }
            {
              selectedApplication.jobInfo.recruitingCriterias &&
                selectedApplication.jobInfo.recruitingCriterias.some(criteria => criteria.JobInfosRecruitingCriteria.body) ? (
                <ul>
                  {selectedApplication.jobInfo.recruitingCriterias.filter(criteria => criteria.JobInfosRecruitingCriteria.body).map((criteria, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && <hr className="my-4 border-gray-600 w-full sm:ml-[150px] sm:w-[calc(100%-150px)]" />}
                      <li className="flex flex-col sm:flex-row sm:items-baseline">
                        <span className="font-semibold text-md w-full sm:w-[150px] shrink-0">{criteria.name}:</span>
                        <span className="text-left flex-1">{criteria.JobInfosRecruitingCriteria.body}</span>
                      </li>
                    </React.Fragment>
                  ))}
                </ul>
              ) : null
            }
          </div>
        </Modal>
      )}
    </div>
  );
}

export default function ApplicationMngPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8"><p>読み込み中...</p></div>}>
      <ApplicationMngContent />
    </Suspense>
  );
}

