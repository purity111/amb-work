"use client";

import JobList from "@/components/pages/jobs/JobOpenings";
import React, { Suspense } from "react";
import { useState } from "react";
import RegisterModal from "@/components/modal/Register";
import LoginModal from "@/components/modal/Login";
import { useAuthContext } from "@/app/layout";
import { useParams } from 'next/navigation';

export default function JobOpeningsPage() {
    const [registerModalShown, setRegisterModalShown] = useState(false);
    const [loginModalShown, setLoginModalShown] = useState(false);
    const { isAuthenticated } = useAuthContext();
    const params = useParams();
    // params.params is an array of segments, may be undefined
    const segments = Array.isArray(params?.params) ? params.params : [];
    // Map segments to filters in order: [prefectures, jobTypes, items, conditions, employmentTypes]
    const [prefectures, jobTypes, items, conditions, employmentTypes] = segments;

    const onNavigateRegister = () => {
        setLoginModalShown(false);
        setRegisterModalShown(true);
    };

    return (
        <>
            <Suspense>
                <div className="narrow-container pt-10 md:pt-20">
                    <div className="flex mb-10 items-center justify-between">
                        <p className="job-openings-title text-3xl font-bold text-gray-300 relative">求人検索結果</p>
                    </div>
                    <p className="text-gray-300 text-lg">
                        リユース・リサイクル・買取業界の求人情報を探すならリユース転職！リユース・リサイクル・買取の最新の求人情報をお届けします。
                    </p>
                    企業への直接応募をする場合は、
                    {!isAuthenticated ? (
                        <>
                            <span
                                className="text-blue-600 underline cursor-pointer"
                                onClick={() => setRegisterModalShown(true)}
                            >
                                会員登録
                            </span>
                            ・
                            <span
                                className="text-blue-600 underline cursor-pointer"
                                onClick={() => setLoginModalShown(true)}
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
                    <p className="text-orange text-lg">
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
                    {/* Pass parsed filters to JobList as needed */}
                    <JobList
                        prefectures={prefectures}
                        jobTypes={jobTypes}
                        items={items}
                        conditions={conditions}
                        employmentTypes={employmentTypes}
                    />
                </div>
            </Suspense>
            {registerModalShown && (
                <RegisterModal onClose={() => setRegisterModalShown(false)} />
            )}
            {loginModalShown && (
                <LoginModal
                    onClose={() => setLoginModalShown(false)}
                    onSuccess={() => setLoginModalShown(false)}
                    onNavigateRegister={onNavigateRegister}
                />
            )}
        </>
    )
} 