import React from 'react';
import Button from './common/Button';
import CButton from './common/Button';
import Spinner from './common/Spinner';
import Image from 'next/image';
import { useAuthContext } from '@/app/layout';
import { bookmarkJob } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

interface FavoriteCardProps {
  companyName: string;
  jobTitle: string;
  storeName: string;
  applicationDate: string;
  salary: string;
  zip: string;
  prefecture: string;
  city: string;
  tel: string;
  templateId: number;
  jobId: number;
  isBookmarked: boolean;
  isApplied?: boolean;
  onBookmarkToggle: (jobId: number) => void;
  onDetailsClick: (job: any) => void;
}

const FavoriteCard: React.FC<FavoriteCardProps> = ({
  companyName,
  jobTitle,
  storeName,
  applicationDate,
  salary,
  zip,
  prefecture,
  city,
  tel,
  templateId,
  jobId,
  isBookmarked,
  isApplied = false,
  onBookmarkToggle,
  onDetailsClick,
}) => {
  const headerBgClass = templateId === 1 ? 'bg-blue' : 'bg-orange';
  const { logout, profile } = useAuthContext();
  const queryClient = useQueryClient();

  // Format application date in Japanese format
  const formatApplicationDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'yyyy年M月d日');
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; // Fallback to original string if parsing fails
    }
  };

  const bookmark = useMutation({
    mutationFn: bookmarkJob,
    onSuccess: (data) => {
      if (!data.success) return;
      if (data.data) toast.success('お気に入りの登録に成功しました。');
      else toast.success('お気に入りを排除しました。');
      onBookmarkToggle(jobId);
      // Invalidate and refetch bookmarked jobs
      queryClient.invalidateQueries({ queryKey: ['getBookmarkedJobs'] });
    },
    onError: (error) => {
      console.error('Error with registering favorite:', error);
      toast.error('お気に入りをご登録できません。');
    },
  });

  const handleBookmarkToggle = () => {
    if (!profile?.role) {
      logout();
      return;
    }
    if (confirm('本当にお気に入りを解除しますか？')) {
      bookmark.mutate({ job_info_id: jobId });
    }
  };

  const bookmarkShouldBeDisabled = bookmark.isPending || profile?.role !== 'JobSeeker';

  return (
    <>
      <div className="bg-white shadow rounded-lg mb-4">
        <div className={`${headerBgClass} text-white p-3 flex justify-between items-center rounded-t-lg gap-1`}>
          <div>
            <h2 className="text-sm md:text-base text-black font-semibold">{companyName}</h2>
            <h3 className="text-base md:text-lg font-bold mt-1">{jobTitle}</h3>
          </div>
          {isApplied && (
            <span className="bg-gray-600 text-white min-w-[76px] md:min-w-[86px] text-xs md:text-sm px-2 py-1 rounded">応募済み</span>
          )}
        </div>

        <div className="p-4 border border-[#d7d7d7]">
          <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold">登録日時</span>
              <p className="mt-1">{formatApplicationDate(applicationDate)}</p>
            </div>
            <div>
              <span className="font-semibold">給料</span>
              <p className="mt-1">{salary}</p>
            </div>
          </div>

          <div className="border-t border-black my-2"></div>

          <div className="text-md mb-4">
            <h4 className="font-bold text-lg mb-2">会社情報</h4>
            <div className="flex flex-wrap gap-4">
              {companyName && (
                <div>
                  <span className="font-semibold">会社名：</span>
                  <span>{companyName}</span>
                </div>
              )}
              {zip && (
                <div>
                  <span className="font-semibold">Zip：</span>
                  <span>{zip}</span>
                </div>
              )}
              {(prefecture || city) && (
                <div>
                  <span className="font-semibold">住所：</span>
                  <span>{prefecture}{city}</span>
                </div>
              )}
              {tel && (
                <div>
                  <span className="font-semibold">Tel：</span>
                  <span>{tel}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <CButton
              text={isBookmarked ? "お気に入り解除" : "お気に入り登録"}
              className={`border-2 border-yellow text-yellow rounded-sm ${!profile?.role ? 'cursor-pointer' : bookmarkShouldBeDisabled ? '!cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={handleBookmarkToggle}
              disabled={bookmark.isPending}
              rightIcon={
                bookmark.isPending ?
                  <Spinner size={4} color="orange" />
                  : <Image src={`/images/icons/${isBookmarked ? 'favorite' : 'off_favorite'}.png`} alt="favorite-icon" width={20} height={20} />
              }
            />
            <Button
              text="詳細"
              className="bg-green-600 text-white"
              onClick={() => onDetailsClick({ companyName, jobTitle, storeName, applicationDate, salary, zip, prefecture, city, tel, templateId, jobId })}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default FavoriteCard; 