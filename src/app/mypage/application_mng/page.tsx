"use client";

import React, { ChangeEvent, useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ApplicationCard from '@/components/ApplicationCard';
import { getApplicationsByRole } from '@/lib/api';
import { ApplicationItem, ApplicationFetchParam } from '@/utils/types';
import CButton from "@/components/common/Button";
import CInput from '@/components/common/Input';
import CSelect from '@/components/common/Select';
import Pagination from '@/components/common/Pagination';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { PrefectureOptions, JobTypeOptions } from '@/utils/constants';
import { useAuth } from '@/hooks/useAuth';
import Modal from '@/components/common/Modal';

export default function ApplicationMngPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [tempSearch, setTempSearch] = useState('');
  const [jobType, setJobType] = useState<string>('0');
  const router = useRouter();
  const { profile, isAdmin } = useAuth();
  const searchParams = useSearchParams();

  const hasLoaded = useRef(false);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationItem | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const jobTypeParam = params.get('jobType');
    const searchText = params.get('searchTerm');
    setJobType(jobTypeParam || '0');
    setSearchTerm(searchText || '');
    setTempSearch(searchText || '');
    hasLoaded.current = true;
  }, [searchParams]);

  const { data: response, isLoading: aLoading, refetch } = useQuery<{
    data: { applications: ApplicationItem[]; pagination: { totalPages: number } };
  }>({ queryKey: ['applications', currentPage, limit, searchTerm, jobType !== '0' ? jobType : undefined, profile?.id], queryFn: async () => {
    const params: ApplicationFetchParam = {
      limit,
      page: currentPage,
      searchTerm,
    };
    if (jobType === '1' || jobType === '2') {
      params.jobType = Number(jobType);
    }
    // Role-based filtering
    if (profile?.role === 'JobSeeker') {
      params.job_seeker_id = profile.id;
    } else if (profile?.role === 'Employer') {
      params.employer_id = profile.id;
    }
    const data = await getApplicationsByRole(params);
    return data;
  }, enabled: !!profile });

  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [allApplications, setAllApplications] = useState<ApplicationItem[]>([]);

  useEffect(() => {
    if (response?.data) {
      console.log('response.data', response.data);
      
      setAllApplications(response.data.applications);
      setTotalPage(response.data.pagination.totalPages);
    }
  }, [response, limit]);

  // Client-side filtering for search and job type
  useEffect(() => {
    let filtered = allApplications;

    // Filter by job type (job_detail_page_template_id)
    if (jobType !== '0') {
      const templateId = Number(jobType);
      filtered = filtered.filter(app => app.jobInfo.job_detail_page_template_id === templateId);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(app => {
        const searchLower = searchTerm.toLowerCase();
        return (
          app.jobInfo.employer.clinic_name.toLowerCase().includes(searchLower) ||
          app.jobInfo.job_title.toLowerCase().includes(searchLower) ||
          app.jobInfo.employer.city.toLowerCase().includes(searchLower) ||
          app.jobInfo.pay.toLowerCase().includes(searchLower) ||
          app.jobInfo.employer.zip.toLowerCase().includes(searchLower) ||
          getPrefectureName(app.jobInfo.employer.prefectures).toLowerCase().includes(searchLower) ||
          app.jobInfo.employer.tel.toLowerCase().includes(searchLower)
        );
      });
    }

    console.log(`Client-side filtering: ${allApplications.length} total, ${filtered.length} matching filters`);
    setApplications(filtered);
  }, [searchTerm, jobType, allApplications]);

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

  const onClearSearch = () => {
    setTempSearch('');
    setSearchTerm('');
    setJobType('0');
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

  const getPrefectureName = (id: number) => {
    const prefecture = PrefectureOptions.find(opt => Number(opt.value) === id);
    return prefecture ? prefecture.option : '';
  };

  const onSelectJobType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setJobType(e.target.value as string);
    setCurrentPage(1);
  };

  const handleDetailsClick = (app: ApplicationItem) => {
    setSelectedApplication(app);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedApplication(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {aLoading ? (
        <p>読み込む中...</p>
      ) : (
        <div className="overflow-x-auto">
          <h2 className='text-center mb-6 text-[32px] font-bold'>応募管理ページ</h2>
          <div className="flex flex-col sm:flex-row justify-center items-center lg:flex-row lg:space-x-3 mb-4">
            {(profile?.role === 'JobSeeker' || isAdmin) && (
              <div className="flex flex-row space-x-3">
                <CSelect
                  options={JobTypeOptions}
                  value={jobType}
                  onChange={onSelectJobType}
                  width="w-40"
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
                className='bg-blue text-white h-[40px]'
                size="small"
                onClick={onConfirmSearchTerm}
              />
              {/* <CButton
                text="クリア"
                className='bg-gray text-black h-[40px]'
                size="small"
                onClick={onClearSearch}
              /> */}
            </div>
          </div>
          <div className="">
            {applications && applications.length > 0 ? (
              applications.map((app) => (
                <ApplicationCard
                  key={app.id}
                  companyName={app.jobInfo.employer.clinic_name}
                  jobTitle={app.jobInfo.job_title}
                  storeName={app.jobInfo.employer.city}
                  applicationDate={formatDateTime(app.created)}
                  salary={app.jobInfo.pay}
                  zip={app.jobInfo.employer.zip}
                  prefecture={getPrefectureName(app.jobInfo.employer.prefectures)}
                  city={app.jobInfo.employer.city}
                  tel={app.jobInfo.employer.tel}
                  templateId={app.jobInfo.job_detail_page_template_id}
                  jobseekerName={app.jobSeeker.name}
                  jobseekerBirthdate={app.jobSeeker.birthdate}
                  jobseekerSex={app.jobSeeker.sex}
                  jobseekerPrefecture={getPrefectureName(app.jobSeeker.prefectures)}
                  jobseekerTel={app.jobSeeker.tel}
                  userRole={profile?.role}
                  onDetailsClick={() => handleDetailsClick(app)}
                />
              ))
            ) : (
              <div>応募が見つかりませんでした。</div>
            )}
          </div>
          <div className="flex flex-row justify-center mt-4">
            <Pagination
              page={currentPage}
              totalPages={totalPage}
              onPageChange={onPageChange}
            />
          </div>
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
                <span className="text-left flex-1">{formatDateTime(selectedApplication.created)}</span>
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

