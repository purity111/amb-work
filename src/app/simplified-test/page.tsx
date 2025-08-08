'use client'

import React from 'react';
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from '@/components/Footer';
import PointItem from '@/components/pages/skill-test/PointItem';
import TestItem from '@/components/pages/skill-test/TestItem';
import LinkButton from '@/components/LinkButton';
import { getFullUrl } from '@/utils/config';
import PageTitle from '@/components/PageTitle';
import { getPageTitle } from '@/utils/titles';

export default function SimplifiedTestPage() {
    const pageInfo = getPageTitle('simplifiedTest');

    return (
        <>
            <PageTitle
                title={pageInfo.title}
                description={pageInfo.description}
                keywords={pageInfo.keywords}
            />
            <main className="min-h-screen">
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
                            alt="スキルテストトップイメージ"
                            fill
                            className="object-cover object-center"
                            priority
                        />
                    </div>
                </div>

                {/* Breadcrumb */}
                <Breadcrumb />
                <div className="max-w-[960px] mx-auto px-6 sm:px-8 md:px-10 lg:px-0">
                    <div className="pb-[30px] md:pb-[60px] text-center">
                        <h2 className="text-2xl md:text-3xl font-bold mb-9 text-center relative inline-block mx-auto job-openings">
                            無料・簡単15分！真贋スキルチェックテストとは
                        </h2>
                        <p className='text-center text-[14px] md:text-base text-gray-600 font-sans'>WHAT IS THE AUTHENTICITY SKILLS CHECK TEST?</p>
                    </div>

                    {/* What is the Authenticity Skills Check Test? */}
                    <div className="mb-12 flex flex-col md:flex-row gap-[6%]">
                        <div className="relative aspect-[5/3] w-[90%] sm:w-[80%] m-auto mb-4">
                            <Image
                                src="/images/test/checktest-illust.png"
                                alt="シンプルイラスト"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <p className="w-full leading-[2] font-normal">
                            リユース・リサイクル業界で仕事をするときに身に着けたい専門スキルの中でも、特に重要なブランド品・時計・貴金属の真贋スキルを簡単にチェックすることができる無料のテストです。
                            現在の自分のスキルを見える化しておくことは非常に重要です！<br /><br />
                            転職においても応募企業のニーズとのずれが生じにくくなります。また、今後の自分のスキルアップについての計画を立てるための参考にもあります。一度、自分のスキルを見直してみませんか。
                        </p>
                    </div>

                    {/* Points */}
                    <div className="pt-[50px] flex flex-col md:flex-row items-center justify-between gap-[2%]">
                        <PointItem order='01' text='無料・簡単15分！写真画像を見て、〇✕をチェックするだけ。後日、点数とランク（Ａ～Ｄ）を返送します。' />
                        <PointItem order='02' text='自分のスキルを見える化！転職活動で活かすことができたり、今後スキルアップや市場価値高めるための参考になります。' />
                        <PointItem order='03' text='国内唯一のリユース・リサイクル業界専門の転職支援、スキルアップ支援を行う「リユース転職」が、業界のプロ鑑定士とともに作成！' />
                    </div>

                    {/* Recommended for people like this */}
                    <div className="lg:mx-[90px] border-[2px] border-[#DFDFDF] border-l-0 border-r-0 my-15 p-[50px]">
                        <h3 className="text-2xl font-bold text-[#65B729] mb-4 text-center text-[18px] md:text-[22px]">このような方におススメ</h3>
                        <ul className="list-disc list-inside space-y-2 font-normal text-sm md:text-base">
                            <li>現在の自分の真贋スキルを客観的に知りたい</li>
                            <li>自分の真贋スキルがリユース業界で通用するものなのか知りたい</li>
                            <li>今後どのように真贋スキルを高めていけばよいか知りたい</li>
                            <li>手に職をつける感覚でリユース業界でプロフェッショナル人材になっていきたい</li>
                        </ul>
                    </div>
                </div>
                <div className="bg-[#f3f3f3] rounded rounded-tr-[80px] md:rounded-tr-[120px] lg:rounded-tr-[200px] py-[60px] md:py-[120px]">
                    <div className="max-w-[960px] mx-auto px-6 py-[50px] md:py-[70px] sm:px-8 md:px-10 lg:px-20 w-[92%] sm:w-[85%] md:w-full md:px-[70px] md:px-[90px] bg-white">
                        <div className="mb-12">
                            <div className="text-center">
                                <h3 className="text-[20px] md:text-[28px] font-bold mb-4 hyphen text-center"><span className='text-[#65B729]'>テ</span>スト概要</h3>
                            </div>
                            <p className="border border-[#DFDFDF] p-5 py-10 md:p-[50px] font-medium leading-[1.8]">
                                ・スキルチェックテストは、登録特典となっております。さらに<span className='text-[#65B729]'>真贋スキルアップに役立つ（全３０問）は、キャリア相談のご登録者</span>にご案内いたします。<br />
                                ・ブランド品、時計、貴金属の真贋鑑定力を総合的に判定する簡易テストです。<br />
                                ・問題数は30問、時間は15分程度で行ってください。<br />
                                ・問題文を読み、○か×を選択してください。<br />
                                ・商品を真贋鑑定している目線で撮影しています。通常、真贋鑑定は総合的に判断するものですが、問題では明らかな正規品・模造品が分かるポイントを撮影しています。<br />
                                ・回答がすべて終わったら完了ボタンを押してください。<br />
                                ・結果は後日、ご登録のメールアドレス宛にご連絡いたします。
                            </p>
                        </div>

                        {/* Call to Action for Consultation */}
                        <div className="text-center mb-12">
                            <p className="my-6">まずは、こちらから<br className='md:hidden' />無料のキャリア相談をお申込みください。</p>
                            <LinkButton
                                to={getFullUrl('/career-counseling')} // Replace with actual link for consultation
                                text="無料のキャリア相談はこちら"
                                className="bg-[#65B729] hover:opacity-90 inline-block text-white px-8 py-3 rounded-lg font-medium transition-colors"
                                hasNavIcon
                            />
                        </div>

                        {/* Trial Test Section */}
                        <div className="mb-12">
                            <div className="text-center">
                                <h3 className="text-[20px] md:text-[28px] font-bold mb-4 hyphen text-center"><span className='text-[#65B729]'>お</span>試しテスト</h3>
                            </div>
                            <TestItem order={1} imgUrl='/images/test/item1.jpg' />
                            <TestItem order={2} imgUrl='/images/test/item2.jpg' />
                            <TestItem order={3} imgUrl='/images/test/item3.jpg' />
                        </div>
                        <p className='text-sm md:text-base font-normal mt-[-20px]'>
                            正答<br />
                            問１．×　問２．○　問３．×
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}