"use client";

import dynamic from 'next/dynamic';
import React, { Suspense, useState } from "react";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useParams } from 'next/navigation';
import { useGetFeatures } from '@/hooks/useGetFeatures';
import { FeatureItem } from '@/utils/types';
import { MapData } from '@/utils/constants';
import AuthModal from "@/components/modal/Auth";
import PageTitle from '@/components/PageTitle';
import { getDynamicJobPageInfo } from '@/utils/titles';

// Dynamically import JobList to avoid SSR issues with React Query
const JobList = dynamic(() => import("@/components/pages/jobs/JobOpenings"), {
    ssr: false,
    loading: () => <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue"></div></div>
});

export default function JobOpeningsPage() {
    const [authModalState, setAuthModalState] = useState(0); // 1: Login, 2: Register
    const [jobCount, setJobCount] = useState(0);
    const { isAuthenticated } = useAuthContext();
    const params = useParams();
    // params.params is an array of segments, may be undefined
    const segments = Array.isArray(params?.params) ? params.params : [];

    // Build lookup helpers
    let cityList: Array<{ id: number, text: string }> = [];
    MapData.forEach(item => { cityList = cityList.concat(item.city) })
    const { data: featuresData } = useGetFeatures();
    const allFeatures: FeatureItem[] = featuresData?.data || [];

    // Infer classes by name
    let prefectures = '';
    let jobTypes = '';
    let items = '';
    let conditions = '';
    let employmentTypes = '';

    const normalizePref = (s: string) => s.replace(/[都道府県]$/u, '');

    segments.forEach((seg: string) => {
        if (!seg || seg === '-') return;
        const decoded = decodeURIComponent(seg);
        // prefecture (city) match single or multiple (joined by '-')
        const prefNames = decoded.split('-');
        const isAllPref = prefNames.every(n => cityList.some(c => normalizePref(c.text) === normalizePref(n)));
        if (isAllPref) {
            prefectures = seg;
            return;
        }
        // features match
        const names = decoded.split('-');
        const matched = allFeatures.filter((f: FeatureItem) => names.includes(f.name));
        if (matched.length) {
            // choose class by majority parent_id
            const pid = matched.reduce((acc: Record<number, number>, f: FeatureItem) => {
                const k = Number(f.parent_id || 0);
                acc[k] = (acc[k] || 0) + 1; return acc;
            }, {} as Record<number, number>);
            const top = Object.entries(pid).sort((a,b)=>b[1]-a[1])[0]?.[0];
            switch (Number(top)) {
                case 1: jobTypes = seg; break;
                case 2: items = seg; break;
                case 3: conditions = seg; break;
                case 4: employmentTypes = seg; break;
            }
        }
    });
    
    // Get dynamic page info based on filters
    // Use jobCount if available, otherwise use a placeholder
    const pageInfo = getDynamicJobPageInfo(segments, jobCount || 0);

    return (
        <>
            <PageTitle
                title={pageInfo.title}
                description={pageInfo.description}
                keywords={pageInfo.keywords}
            />
            <Suspense>
                <div className="narrow-container md:pt-20">
                    <h1 className="job-openings text-3xl font-bold text-center text-gray-300 relative mb-10">求人検索結果</h1>
                    <p className="text-gray-300 text-lg hidden md:block">
                        リユース・リサイクル・買取業界の求人情報を探すならリユース転職！リユース・リサイクル・買取の最新の求人情報をお届けします。
                    </p>
                    <p className="hidden md:block">
                        企業への直接応募をする場合は、
                        {!isAuthenticated ? (
                            <>
                                <span
                                    className="text-blue-600 underline cursor-pointer"
                                    onClick={() => setAuthModalState(2)}
                                >
                                    会員登録
                                </span>
                                ・
                                <span
                                    className="text-blue-600 underline cursor-pointer"
                                    onClick={() => setAuthModalState(1)}
                                >
                                    ログイン
                                </span>
                            </>
                        ) : (
                            <>
                                <span className="text-gray-400">会員登録</span>・<span className="text-gray-400">ログイン</span>
                            </>
                        )}
                        が必要です。
                    </p>
                    <p className="text-orange text-lg hidden md:block">
                        専任のキャリアアドバイザーによる転職支援サービス（無料）を受けられる場合は、
                        <a
                            href="/career-counseling"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-blue-600 hover:text-orange-800 mx-1" 
                        >
                            転職支援サービス申込みフォーム
                        </a>
                        からお申込ください。
                    </p>
                    {/* Pass parsed filters to JobList */}
                    <JobList
                        prefectures={prefectures}
                        jobTypes={jobTypes}
                        items={items}
                        conditions={conditions}
                        employmentTypes={employmentTypes}
                        onJobCountChange={setJobCount}
                    />
                </div>
            </Suspense>
            {authModalState > 0 && (
                <AuthModal initialStep={authModalState === 1 ? 'Login' : 'Register'} onClose={() => setAuthModalState(0)} />
            )}
        </>
    )
} 