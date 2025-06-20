'use client'

import React from 'react';
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumb";

export default function SimplifiedTestPage() {
    return (
        <main className="min-h-screen bg-gray-50">
            {/* Hero Section - Identical Split Layout */}
            <div className="h-20 sm:h-30 md:h-75 bg-[#414141]"></div>
            {/* Text Content (Left Side - Dark Grey Background) */}
            <div className="w-full max-w-[1200px] m-auto text-white px-4 lg:px-0 md:mb-25">
                <div className="md:text-left md:mr-8 xl:mr-20">
                    <div className="h-[30px] md:h-15 w-[3px] bg-green-500 mr-2 md:mt-[-30px] mb-5 md:mb-10"></div>
                    <h1 className="text-[26px] md:text-[35px] lg:text-[44px] font-medium text-black mb-2">真贋スキル簡易テスト</h1>
                    <p className="text-[14px] md:text-[18px] text-gray-300 font-medium">Simplified Test</p>
                </div>
            </div>

            <div className="pl-4">
                <div className="w-full my-10 sm:my-[50px] md:my-0 md:w-1/2 relative bg-white h-[160px] sm:h-[250px] md:h-[350px] flex justify-end rounded-tl-[50px] sm:rounded-tl-[80px] md:rounded-tl-[100px] overflow-hidden md:absolute md:right-0 md:top-[180px]">
                    <Image
                        src="/images/test/top.jpg"
                        alt="Company Page Top"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                </div>
            </div>

            {/* Breadcrumb */}
            <Breadcrumb />
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="pb-[30px] md:pb-[60px] text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-9 text-center relative inline-block mx-auto job-openings">
                        無料・簡単15分！真贋スキルチェックテストとは
                    </h2>
                    <p className='text-center text-[14px] md:text-base text-gray-600 font-sans'>What is the Authenticity Skills Check Test?</p>
                </div>

                {/* What is the Authenticity Skills Check Test? */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                        無料・簡単15分！真贋スキルチェックテストとは
                        <span className="block text-xl font-normal text-gray-600">What is the Authenticity Skills Check Test?</span>
                    </h2>
                    <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">真贋スキルチェックテストとは</h3>
                        <p className="text-gray-700">
                            リユース・リサイクル業界で仕事をするときに身に着けたい専門スキルの中でも、特に重要なブランド品・時計・貴金属の真贋スキルを簡単にチェックすることができる無料のテストです。
                            現在の自分のスキルを見える化しておくことは非常に重要です！
                        </p>
                        <p className="text-gray-700">
                            転職においても応募企業のニーズとのずれが生じにくくなります。また、今後の自分のスキルアップについての計画を立てるための参考にもあります。一度、自分のスキルを見直してみませんか。
                        </p>

                        {/* Points */}
                        <div className="space-y-4">
                            {[1, 2, 3].map((pointNum) => (
                                <div key={pointNum} className="flex items-start">
                                    <div className="flex-shrink-0 bg-green-600 text-white rounded-full h-8 w-8 flex items-center justify-center text-sm font-bold mr-3">
                                        {`0${pointNum}`}
                                    </div>
                                    <div className="flex-grow text-gray-700">
                                        {pointNum === 1 && "無料・簡単15分！写真画像を見て、〇✕をチェックするだけ。後日、点数とランク（Ａ～Ｄ）を返送します。"}
                                        {pointNum === 2 && "自分のスキルを見える化！転職活動で活かすことができたり、今後スキルアップや市場価値高めるための参考になります。"}
                                        {pointNum === 3 && "国内唯一のリユース・リサイクル業界専門の転職支援、スキルアップ支援を行う「リユース転職」が、業界のプロ鑑定士とともに作成！"}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recommended for people like this */}
                <div className="mb-12">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">このような方におススメ</h3>
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>現在の自分の真贋スキルを客観的に知りたい</li>
                            <li>自分の真贋スキルがリユース業界で通用するものなのか知りたい</li>
                            <li>今後どのように真贋スキルを高めていけばよいか知りたい</li>
                            <li>手に職をつける感覚でリユース業界でプロフェッショナル人材になっていきたい</li>
                        </ul>
                    </div>
                </div>

                {/* Test Overview */}
                <div className="mb-12">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">テスト概要</h3>
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <p className="text-gray-700 mb-4"><span className="font-bold">・スキルチェックテストは、登録特典となっております。</span>さらに<span className="font-bold">真贋スキルアップに役立つ（全３０問）は、キャリア相談のご登録者</span>にご案内いたします。</p>
                        <p className="text-gray-700 mb-4"><span className="font-bold">・</span>ブランド品、時計、貴金属の真贋鑑定力を総合的に判定する簡易テストです。</p>
                        <p className="text-gray-700 mb-4"><span className="font-bold">・</span>問題数は30問、時間は15分程度で行ってください。</p>
                        <p className="text-gray-700 mb-4"><span className="font-bold">・</span>問題文を読み、○か×を選択してください。</p>
                        <p className="text-gray-700 mb-4"><span className="font-bold">・</span>商品を真贋鑑定している目線で撮影しています。通常、真贋鑑定は総合的に判断するものですが、問題では明らかな正規品・模造品が分かるポイントを撮影しています。</p>
                        <p className="text-gray-700"><span className="font-bold">・</span>回答がすべて終わったら完了ボタンを押してください。</p>
                        <p className="text-gray-700 mt-4"><span className="font-bold">・</span>結果は後日、ご登録のメールアドレス宛にご連絡いたします。</p>
                    </div>
                </div>

                {/* Call to Action for Consultation */}
                <div className="text-center mb-12">
                    <p className="text-gray-700 mb-4">まずは、こちらから</p>
                    <p className="text-gray-700 mb-6">無料のキャリア相談をお申込みください。</p>
                    <a
                        href="#" // Replace with actual link for consultation
                        className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        無料のキャリア相談はこちら
                    </a>
                </div>

                {/* Trial Test Section */}
                <div className="mb-12">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">お試しテスト</h3>
                    {/* Placeholder for Q1 Image */}
                    <div className="flex justify-center mb-4">
                        <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-md">Placeholder for Q1 Image</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <p className="text-gray-700 mb-4"><span className="font-bold">Q1</span>正規品なら〇、模倣品なら×のボタンを押してください [ブランド品]</p>
                        <div className="flex justify-center space-x-8 mb-4">
                            <button className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg">○</button>
                            <button className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg">×</button>
                        </div>

                        {/* Placeholder for Q2 Image */}
                        <div className="flex justify-center mb-4 mt-8">
                            <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-md">Placeholder for Q2 Image</div>
                        </div>
                        <p className="text-gray-700 mb-4"><span className="font-bold">Q2</span>正規品なら〇、模倣品なら×のボタンを押してください [ブランド品]</p>
                        <div className="flex justify-center space-x-8 mb-4">
                            <button className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg">○</button>
                            <button className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg">×</button>
                        </div>

                        {/* Placeholder for Q3 Image */}
                        <div className="flex justify-center mb-4 mt-8">
                            <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-md">Placeholder for Q3 Image</div>
                        </div>
                        <p className="text-gray-700 mb-4"><span className="font-bold">Q3</span>正規品なら〇、模倣品なら×のボタンを押してください [ブランド品]</p>
                        <div className="flex justify-center space-x-8 mb-4">
                            <button className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg">○</button>
                            <button className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg">×</button>
                        </div>

                        {/* Answer Key */}
                        <div className="mt-8">
                            <h4 className="font-bold text-gray-900 mb-2">正答</h4>
                            <p className="text-gray-700">問１．× 問２．○ 問３．×</p>
                        </div>
                    </div>
                </div>

                {/* Job Info and Support Links */}
                <div className="mt-12 text-center">
                    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <a href="/jobs" className="text-blue-600 hover:underline font-medium">求人情報はこちら</a>
                        <a href="/support" className="text-blue-600 hover:underline font-medium">転職支援サービス（無料）はこちら</a>
                    </div>
                </div>
            </div>
        </main>
    );
}