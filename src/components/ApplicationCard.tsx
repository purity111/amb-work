import React from 'react';
import Button from './common/Button';

interface ApplicationCardProps {
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
  // Jobseeker information
  jobseekerName?: string;
  jobseekerBirthdate?: string;
  jobseekerSex?: number;
  jobseekerPrefecture?: string;
  jobseekerTel?: string;
  // User role for conditional display
  userRole?: string;
  onDetailsClick: (application: any) => void; // Callback for details button click
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({
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
  jobseekerName,
  jobseekerBirthdate,
  jobseekerSex,
  jobseekerPrefecture,
  jobseekerTel,
  userRole,
  onDetailsClick,
}) => {
  const headerBgClass = templateId === 1 ? 'bg-blue' : 'bg-orange';

  const formatSex = (sex: number) => {
    return sex === 1 ? '男性' : sex === 2 ? '女性' : 'その他';
  };

  const formatBirthdate = (birthdate: string) => {
    if (!birthdate) return '';
    try {
      const date = new Date(birthdate);
      return date.toLocaleDateString('ja-JP');
    } catch (error) {
      return birthdate;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg mb-4">
      <div className={`${headerBgClass} text-white p-3 flex justify-between items-center rounded-t-lg gap-1`}>
        <div>
          <h2 className="text-sm md:text-base text-black font-semibold">{companyName}</h2>
          <h3 className="text-base md:text-lg font-bold mt-1">{jobTitle} ({storeName})</h3>
        </div>
        <span className="bg-gray-600 text-white min-w-[76px] md:min-w-[86px] text-xs md:text-sm px-2 py-1 rounded">状態未設定</span>
      </div>

      <div className="p-4 border border-[#d7d7d7]">
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold">応募日時</span>
            <p className="mt-1">{applicationDate}</p>
          </div>
          <div>
            <span className="font-semibold">給料</span>
            <p className="mt-1">{salary}</p>
          </div>
        </div>

        <div className="border-t border-black my-4"></div>

        {/* Admin View - Both information in a row */}
        {userRole === 'admin' && jobseekerName && (
          <div className="flex-col sm:flex-row flex gap-6">
            <div className="text-md flex-1">
              <h4 className="font-bold text-lg mb-2">会社情報</h4>
              <p><span className="font-semibold">会社名：</span>{companyName}</p>
              <p><span className="font-semibold">Zip：</span>{zip}</p>
              <p><span className="font-semibold">住所：</span>{prefecture}{city}</p>
              <p><span className="font-semibold">Tel：</span>{tel}</p>
            </div>
            <div className="text-md flex-1">
              <h4 className="font-bold text-lg mb-2">応募者情報</h4>
              <p><span className="font-semibold">氏名：</span>{jobseekerName}</p>
              <p><span className="font-semibold">生年月日：</span>{formatBirthdate(jobseekerBirthdate || '')}</p>
              <p><span className="font-semibold">性別：</span>{formatSex(jobseekerSex || 0)}</p>
              <p><span className="font-semibold">都道府県：</span>{jobseekerPrefecture}</p>
              <p><span className="font-semibold">Tel：</span>{jobseekerTel}</p>
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
                <p><span className="font-semibold">会社名：</span>{companyName}</p>
                <p><span className="font-semibold">Zip：</span>{zip}</p>
                <p><span className="font-semibold">住所：</span>{prefecture}{city}</p>
                <p><span className="font-semibold">Tel：</span>{tel}</p>
              </div>
            )}

            {/* Jobseeker Information - Show for Employer */}
            {userRole === 'Employer' && jobseekerName && (
              <div className="text-md">
                <h4 className="font-bold text-lg mb-2">応募者情報</h4>
                <p><span className="font-semibold">氏名：</span>{jobseekerName}</p>
                <p><span className="font-semibold">生年月日：</span>{formatBirthdate(jobseekerBirthdate || '')}</p>
                <p><span className="font-semibold">性別：</span>{formatSex(jobseekerSex || 0)}</p>
                <p><span className="font-semibold">都道府県：</span>{jobseekerPrefecture}</p>
                <p><span className="font-semibold">Tel：</span>{jobseekerTel}</p>
              </div>
            )}
          </>
        )}

        <div className="flex justify-end space-x-3 mt-6">
          <Button
            text="詳細"
            className="bg-green-600 text-white"
            onClick={() => onDetailsClick({ companyName, jobTitle, storeName, applicationDate, salary, zip, prefecture, city, tel, templateId, jobseekerName, jobseekerBirthdate, jobseekerSex, jobseekerPrefecture, jobseekerTel, userRole })}
          />
          <Button
            text="チャットで連絡を取る"
            className="bg-blue-600 text-white"
          />
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard; 