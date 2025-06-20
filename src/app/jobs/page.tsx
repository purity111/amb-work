'use client'


import JobList from "@/components/pages/jobs/JobOpenings";
import React, { Suspense } from "react";

export default function JobOpeningsPage() {
    return (
        <Suspense>
            <div className="pt-20">
                <p className="job-openings-title text-3xl font-bold text-gray-300 relative mb-10">求人検索結果</p>
                <p className="text-gray-300 text-lg">
                    リユース・リサイクル・買取業界の求人情報を探すならリユース転職！リユース・リサイクル・買取の最新の求人情報をお届けします。
                </p>
                <p className="text-blue text-lg">
                    企業への直接応募をする場合は、会員登録・ログインが必要です。
                </p>
                <p className="text-orange text-lg">
                    専任のキャリアアドバイザーによる転職支援サービス（無料）を受けられる場合は、転職支援サービス申込みフォームからお申込ください。
                </p>
                <JobList />
            </div>
        </Suspense>
    )
}