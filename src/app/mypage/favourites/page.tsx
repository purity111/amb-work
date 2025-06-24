"use client";

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@/app/layout';
import { useGetBookmarkedJobs } from '@/hooks/useGetBookmarkedJobs';
import FavoriteCard from '@/components/FavoriteCard';
import Pagination from '@/components/common/Pagination';
import Spinner from '@/components/common/Spinner';
import Input from '@/components/common/Input';
import { useRouter, useSearchParams } from 'next/navigation';
import { BookmarkJob } from '@/utils/types';

export default function FavouritesPage() {
  const [limit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalJobCount, setTotalJobCount] = useState(0);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [favoriteJobs, setFavoriteJobs] = useState<BookmarkJob[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { profile } = useAuthContext();

  const { data, isLoading, isError, refetch } = useGetBookmarkedJobs({
    page: currentPage,
    limit,
    searchTerm,
    role: profile?.role || ''
  });

  useEffect(() => {
    if (isLoading) return;
    console.log('Bookmarked jobs API response:', data);
    if (data?.success && data.data) {
      // const { jobs, pagination } = data.data;
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

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleBookmarkToggle = (jobId: number) => {
    // Remove the job from the list when unbookmarked
    setFavoriteJobs(prev => prev.filter(job => job.job_info_id !== jobId));
    refetch();
  };

  useEffect(() => {
    console.log('favoriteJobs', favoriteJobs.favouritejobs);
  }, [favoriteJobs]);

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

  return (
    <div className="flex flex-col p-5">
      <h1 className="text-2xl font-bold mb-6">お気に入り</h1>

      {/* Search Section */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="求人を検索..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-gray-600">
          {totalJobCount}件のお気に入り求人が見つかりました
        </p>
      </div>

      {/* Favorite Jobs List */}
      <div className="space-y-4">
        {favoriteJobs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">お気に入りの求人がありません。</p>
          </div>
        ) : (favoriteJobs.length &&
          favoriteJobs.favouritejobs.map((bookmark) => {
            const job = bookmark.jobInfo;
            return (
              <FavoriteCard
                key={bookmark.id}
                companyName={job.employer.clinic_name}
                jobTitle={job.job_title}
                storeName={job.employer.clinic_name}
                applicationDate={bookmark.created}
                salary={job.pay}
                zip=""
                prefecture={job.employer.prefectures.toString()}
                city={job.employer.city}
                tel=""
                templateId={job.job_detail_page_template_id}
                jobId={job.id}
                isBookmarked={true}
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

