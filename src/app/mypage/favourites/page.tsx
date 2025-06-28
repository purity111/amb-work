"use client";

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@/app/layout';
import { useGetBookmarkedJobs } from '@/hooks/useGetBookmarkedJobs';
import FavoriteCard from '@/components/FavoriteCard';
import Pagination from '@/components/common/Pagination';
import Spinner from '@/components/common/Spinner';
import Input from '@/components/common/Input';
import CButton from '@/components/common/Button';
import { useRouter, useSearchParams } from 'next/navigation';
import { getApplicationsByRole } from '@/lib/api';

export default function FavouritesPage() {
  const [limit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [tempSearch, setTempSearch] = useState('');
  const [totalJobCount, setTotalJobCount] = useState(0);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [favoriteJobs, setFavoriteJobs] = useState<any>(null);
  const [jobseekerApplications, setJobseekerApplications] = useState<number[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { profile } = useAuthContext();

  const { data, isLoading, isError, refetch } = useGetBookmarkedJobs({
    page: currentPage,
    limit,
    searchTerm
  });

  useEffect(() => {
    if (profile && profile.role !== 'JobSeeker') {
      router.replace("/mypage");
    }
  }, [profile, router]);

  // Fetch applications for the current jobseeker
  useEffect(() => {
    if (profile?.role === 'JobSeeker' && profile?.id) {
      getApplicationsByRole({ job_seeker_id: profile.id, page: 1, limit: 1000 }).then(res => {
        if (res?.data?.applications) {
          setJobseekerApplications(res.data.applications.map((a: any) => a.job_info_id));
        }
      });
    }
  }, [profile]);

  useEffect(() => {
    if (isLoading) return;
    if (data?.success && data.data) {
      setFavoriteJobs(data.data);
      setTotalJobCount(data.data.pagination?.total || 0);
      setTotalPageCount(data.data.pagination?.totalPages || 0);
    }
  }, [data, isLoading]);

  // Handle URL parameters
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const searchText = params.get('searchTerm');
    const page = params.get('page');
    setSearchTerm(searchText || '');
    setTempSearch(searchText || '');
    setCurrentPage(Number(page) || 1);
  }, [searchParams]);

  // Update URL when state changes
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

  const onChangeSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempSearch(e.target.value);
  };

  const onConfirmSearchTerm = () => {
    setSearchTerm(tempSearch);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleBookmarkToggle = (jobId: number) => {
    setFavoriteJobs((prev: any) => {
      if (prev && typeof prev === 'object' && 'favouritejobs' in prev && Array.isArray(prev.favouritejobs)) {
        return {
          ...prev,
          favouritejobs: prev.favouritejobs.filter((job: any) => job.job_info_id !== jobId)
        };
      } else if (prev && typeof prev === 'object' && 'jobs' in prev && Array.isArray(prev.jobs)) {
        return {
          ...prev,
          jobs: prev.jobs.filter((job: any) => job.job_info_id !== jobId)
        };
      } else if (Array.isArray(prev)) {
        return prev.filter((job: any) => job.job_info_id !== jobId);
      }
      return prev;
    });
    refetch();
  };

  const handleDetailsClick = (job: any) => {
    window.open(`/jobs/recruit/${job.jobId}`, '_blank');
  };

  if (!profile?.role || profile.role !== 'JobSeeker') {
    return (
      <div className="flex flex-col p-5">
        <h1 className="text-2xl font-bold mb-6">お気に入り</h1>
        <p className="text-gray-600">このページにアクセスするには求職者としてログインしてください。</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col p-5">
        <h1 className="text-2xl font-bold mb-6">お気に入り</h1>
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col p-5">
        <h1 className="text-2xl font-bold mb-6">お気に入り</h1>
        <p className="text-red-600">お気に入りの取得に失敗しました。</p>
      </div>
    );
  }

  // Determine the correct array to use for favorite jobs
  let bookmarks: any[] = [];
  if (favoriteJobs?.favouritejobs) {
    bookmarks = favoriteJobs.favouritejobs;
  } else if (favoriteJobs?.jobs) {
    bookmarks = favoriteJobs.jobs;
  } else if (Array.isArray(favoriteJobs)) {
    bookmarks = favoriteJobs;
  }

  return (
    <div className="flex flex-col p-5">
      <h1 className="text-2xl font-bold mb-6">お気に入り</h1>

      {/* Search Section */}
      <div className="mb-6 flex justify-start gap-2 items-center">
        <Input
          type="text"
          placeholder="求人を検索..."
          value={tempSearch}
          onChange={onChangeSearchTerm}
          className="max-w-md"
        />
        <CButton
          text="検索"
          className='bg-blue text-white h-10'
          size="small"
          onClick={onConfirmSearchTerm}
        />
        <p className="text-gray-600">
          {totalJobCount}件のお気に入り求人が見つかりました
        </p>
      </div>

      {/* Favorite Jobs List */}
      <div className="space-y-4">
        {bookmarks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">お気に入りの求人がありません。</p>
          </div>
        ) : (
          bookmarks.map((bookmark: any) => {
            const job = bookmark.jobInfo;
            const isApplied = jobseekerApplications.includes(job.id);
            return (
              <FavoriteCard
                key={bookmark.id}
                companyName={job.employer.clinic_name}
                jobTitle={job.job_title}
                storeName={job.employer.clinic_name}
                applicationDate={bookmark.created}
                salary={job.pay}
                zip=""
                prefecture={job.employer.prefectures?.toString?.() ?? ""}
                city={job.employer.city}
                tel=""
                templateId={job.job_detail_page_template_id}
                jobId={job.id}
                isBookmarked={true}
                isApplied={isApplied}
                onBookmarkToggle={handleBookmarkToggle}
                onDetailsClick={handleDetailsClick}
              />
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPageCount > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            page={currentPage}
            totalPages={totalPageCount}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}

