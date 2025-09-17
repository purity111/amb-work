import React from 'react';
import Button from './common/Button';
import { ApplicationItem } from '@/utils/types';
import { formatLongDateTime, getPrefectureName } from '@/utils/helper';

interface ApplicationCardProps {
  data: ApplicationItem
  // User role for conditional display
  userRole?: string;
  checked: boolean;
  onDetailsClick: () => void; // Callback for details button click
  onChatClick: () => void; // Callback for chat button click
  onToggleChecked: () => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  data,
  userRole,
  checked,
  onDetailsClick,
  onChatClick,
  onToggleChecked
}) => {
  const headerBgClass = data.jobInfo.job_detail_page_template_id === 1 ? 'bg-blue' : 'bg-orange';

  const formatSex = (sex: number) => {
    return sex === 1 ? '男性' : sex === 2 ? '女性' : 'その他';
  };

  const formatBirthdate = (birthdate: string) => {
    if (!birthdate) return '';
    try {
      const date = new Date(birthdate);
      return date.toLocaleDateString('ja-JP');
    } catch (error) {
      console.log(error);
      return birthdate;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg mb-4">
      <div className={`${headerBgClass} text-white p-3 flex justify-between items-center rounded-t-lg gap-1`}>
        <div>
          <h2 className="text-sm md:text-base text-black font-semibold">{data.jobInfo.employer.clinic_name}</h2>
          <h3 className="text-base md:text-lg font-bold mt-1">{data.jobInfo.job_title}</h3>
        </div>
        <span className="bg-gray-600 text-white min-w-[76px] md:min-w-[86px] text-xs md:text-sm px-2 py-1 rounded">状態未設定</span>
      </div>

      <div className="p-4 border border-[#d7d7d7]">
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold">応募日時</span>
            <p className="mt-1">{formatLongDateTime(data.created)}</p>
          </div>
          <div>
            <span className="font-semibold">メールアドレス</span>
            <p className="mt-1">{data.jobSeeker.email}</p>
          </div>
        </div>

        <div className="border-t border-black my-4"></div>

        {/* Admin View - Both information in a row */}
        {userRole === 'admin' && data.jobSeeker.name && (
          <div className="flex-col sm:flex-row flex gap-6">
            <div className="text-md flex-1">
              <h4 className="font-bold text-lg mb-2">会社情報</h4>
              <p><span className="font-semibold">会社名：</span>{data.jobInfo.employer.clinic_name}</p>
              <p><span className="font-semibold">Zip：</span>{data.jobInfo.employer.zip}</p>
              <p><span className="font-semibold">住所：</span>{getPrefectureName(data.jobInfo.employer.prefectures)}{data.jobInfo.employer.city}</p>
              <p><span className="font-semibold">Tel：</span>{data.jobInfo.employer.tel}</p>
            </div>
            <div className="text-md flex-1">
              <h4 className="font-bold text-lg mb-2">応募者情報</h4>
              <p><span className="font-semibold">氏名：</span>{data.jobSeeker.name}</p>
              <p><span className="font-semibold">生年月日：</span>{formatBirthdate(data.jobSeeker.birthdate || '')}</p>
              <p><span className="font-semibold">性別：</span>{formatSex(data.jobSeeker.sex || 0)}</p>
              <p><span className="font-semibold">都道府県：</span>{getPrefectureName(data.jobSeeker.prefectures)}</p>
              <p><span className="font-semibold">Tel：</span>{data.jobSeeker.tel}</p>
            </div>
          </div>
        )}

        {/* Non-admin views - Keep original layout */}
        {userRole !== 'admin' && (
          <>
            {/* Company Information - Show for Jobseeker */}
            {userRole === 'JobSeeker' && (
              <div className="text-md mb-4">
                <h4 className="font-bold text-lg mb-2">会社情報</h4>
                <p><span className="font-semibold">会社名：</span>{data.jobInfo.employer.clinic_name}</p>
                <p><span className="font-semibold">Zip：</span>{data.jobInfo.employer.zip}</p>
                <p><span className="font-semibold">住所：</span>{getPrefectureName(data.jobInfo.employer.prefectures)}{data.jobInfo.employer.city}</p>
                <p><span className="font-semibold">Tel：</span>{data.jobInfo.employer.tel}</p>
              </div>
            )}

            {/* Jobseeker Information - Show for Employer */}
            {userRole === 'Employer' && data.jobSeeker.name && (
              <div className="text-md">
                <h4 className="font-bold text-lg mb-2">応募者情報</h4>
                <p><span className="font-semibold">氏名：</span>{data.jobSeeker.name}</p>
                <p><span className="font-semibold">生年月日：</span>{formatBirthdate(data.jobSeeker.birthdate || '')}</p>
                <p><span className="font-semibold">性別：</span>{formatSex(data.jobSeeker.sex || 0)}</p>
                <p><span className="font-semibold">都道府県：</span>{getPrefectureName(data.jobSeeker.prefectures)}</p>
                <p><span className="font-semibold">Tel：</span>{data.jobSeeker.tel}</p>
              </div>
            )}
          </>
        )}

        <div className="flex items-end space-x-3 mt-6">
          <div className='flex-1'>
            <input
              type="checkbox"
              checked={checked}
              onChange={onToggleChecked}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
          </div>
          <Button
            text="詳細"
            className="bg-green-600 text-white"
            onClick={onDetailsClick}
          />
          {/* Hide chat button for direct applications (template_id === 1) */}
          {data.jobInfo.job_detail_page_template_id !== 1 && (
            <Button
              text="チャットで連絡を取る"
              className="bg-blue-600 text-white"
              onClick={onChatClick}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard; 