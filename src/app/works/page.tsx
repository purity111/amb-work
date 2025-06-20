'use client'

import React from 'react';
import Image from 'next/image'; // Image is now used in JobCategorySection
import JobCategorySection from '@/components/pages/works/JobCategorySection';
import Breadcrumb from '@/components/Breadcrumb';
import { getFullUrl } from '@/utils/config';
import Footer from '@/components/Footer';

interface JobDetail {
    title: string;
    location: string;
    description: string;
    requiredSkills: string[];
    articleLink?: { text: string; href: string };
}

interface JobCategory {
    id: number;
    title: string;
    description: string;
    image?: string;
    jobs?: JobDetail[];
    subCategories?: string[];
    link?: { text: string; href: string };
}

const jobCategories: JobCategory[] = [
    {
        id: 1,
        title: "接客",
        description: "お客様との直接的なやり取りを通じて、商品の価値を伝え、適切なサービスを提供する仕事です。",
        image: "/images/works/customer.jpg",
        jobs: [
            {
                title: "店舗スタッフ、店舗バイヤー、買取スタッフ、買取・販売スタッフ、店長・店長候補、鑑定士",
                location: "買取店、リユースショップ、リサイクルショップ",
                description: "・お客様が持ち込まれた品物の鑑定・査定・品物の価値や適正価格をご説明・買取成立・仕分け・梱包、発送",
                requiredSkills: [
                    "コミュニケーション力（接客スキル、ヒアリング力）",
                    "査定スキル、真贋・鑑定スキル （商品知識、相場情報、相続・終活知識などの知識）",
                    "マネジメント力 （店舗運営スキル、人材育成スキル）",
                    "丁寧さ、誠実さといったヒューマンスキル"
                ],
                articleLink: { text: "買取・査定を行う鑑定士の仕事とは？やりがい、向いてる人、身につくスキルなどを解説！", href: "#" } // Replace # with actual link
            }
        ]
    },
    {
        id: 2,
        title: "営業",
        description: "訪問営業や法人営業を通じて、お客様のニーズを把握し、適切な買取提案を行う仕事です。",
        image: "/images/works/sales.jpg",
        jobs: [
            {
                title: "個人営業、出張買取営業、訪問買取営業、フィールドセールス、法人営業（顧客が法人の場合）、アポインター、インサイドセールス",
                location: "営業拠点、店舗、本部",
                description: "・訪問して品物の鑑定・査定・品物の価値や適正価格をご説明・買取成立・帰社後、買取商品の入力業務",
                requiredSkills: [
                    "営業力 （数値管理スキル、コミュニケーション力、交渉力）",
                    "マネジメント力 （数値管理スキル、人材育成スキル）",
                    "査定スキル、真贋・鑑定スキル （商品知識、相場情報、相続・終活知識などの知識）※スキルではないが普通自動車の免許が必要なケースが多い",
                    "コミュニケーション力（接客スキル、ヒアリング力）",
                    "査定スキル、真贋・鑑定スキル （商品知識、相場情報、相続・終活知識などの知識）",
                    "マネジメント力 （店舗運営スキル、人材育成スキル）",
                    "丁寧さ、誠実さといったヒューマンスキル"
                ],
                articleLink: { text: "店舗買取vs出張買取 どちらに勤めるのがよいのか！？徹底比較", href: "#" } // Replace # with actual link
            }
        ]
    },
    {
        id: 3,
        title: "バイヤー",
        description: "市場での買付けや商品の検品、値付けを行う仕事です。",
        image: "/images/works/buyer.jpg",
        jobs: [
            {
                title: "バイヤー、仕入れバイヤー、アパレルバイヤー、ジュエリーバイヤー、ブランド品バイヤー、時計バイヤー、トレカバイヤー、査定・真贋スタッフ",
                location: "本部、店舗、ロジスティクスセンター",
                description: "・市場（オークション）での買付け業務・仕入れた商品の検品、値付け",
                requiredSkills: [
                    "査定スキル、真贋・鑑定スキル （商品知識、相場情報、相続・終活知識などの知識）",
                    "セルフマネジメント力 （スケジュール管理能力、数値管理スキル）"
                ],
                articleLink: { text: "バイヤーになるには？中古・リユース業界でバイヤーになる方法や仕事内容を解説！", href: "#" } // Replace # with actual link
            }
        ]
    },
    {
        id: 4,
        title: "EC、ロジ",
        description: "オンラインストアの運営や商品の管理・発送、顧客対応を行う仕事です。",
        image: "/images/works/EC.jpg",
        jobs: [
            {
                title: "EC運営スタッフ、販売（通販）スタッフ、カスタマサポート、鑑定士・査定士、真贋スタッフ、事務（営業事務）、商品管理",
                location: "本部、店舗、ロジスティクスセンター",
                description: "・商品撮影・検品、出品・梱包、発送・顧客対応・入力業務",
                requiredSkills: [
                    "処理スピード、正確性",
                    "オペレーション構築力",
                    "データ分析力",
                    "コミュニケーション力"
                ],
                articleLink: { text: "中古品オークションとは、オークション運営の仕事の舞台裏と適した人材の特徴を解説！", href: "#" } // Replace # with actual link
            }
        ]
    },
    {
        id: 5,
        title: "本部部門",
        description: "まずは成長中のリユース・買取企業の経営をサポートしたり、事業を推進するための本部部門の仕事があります。",
        image: "/images/works/headquarter.jpg",
        subCategories: [
            "管理部門（経理、財務、人事、総務）",
            "販促、マーケティング",
            "店舗開発",
            "WEB・IT系職種（WEBマーケ、エンジニア）",
            "事業責任者、幹部候補"
        ],
        link: { text: "専用ページはこちら", href: `${getFullUrl('/mid-high')}` } // Replace # with actual link
    }
];

export default function WorksPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="md:h-45 bg-[#414141]"></div>
            {/* Text Content (Left Side - Dark Grey Background) */}
            <div className="w-full max-w-[1200px] m-auto text-white px-4 lg:px-0 mb-10">
                <div className="md:text-left md:mr-8 xl:mr-20">
                    <div className="h-[30px] md:h-15 w-[3px] bg-green-500 mr-2 md:mt-[-30px] mb-5 md:mb-10"></div>
                    <h1 className="text-[26px] md:text-[35px] lg:text-[44px] text-black mb-2">仕事・スキルに<br />ついて知る</h1>
                    <p className="text-[14px] md:text-[18px] text-gray-300 font-bold">Jobs & Skills</p>
                </div>
            </div>

            <div className="pl-4">
                <div className="w-full my-10 sm:my-[50px] md:my-0 md:w-1/2 relative bg-white h-[160px] sm:h-[250px] md:h-[350px] flex justify-end rounded-tl-[50px] sm:rounded-tl-[80px] md:rounded-tl-[100px] overflow-hidden md:absolute md:right-0 md:top-[180px]">
                    <Image
                        src="/images/works/top.jpg"
                        alt="Company Page Top"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                </div>
            </div>

            {/* Breadcrumb */}
            <Breadcrumb />
            <div className="sm:max-w-[90%] md:max-w-[720px] lg:max-w-[960px] mx-auto px-4 sm:px-6 lg:px-0">
                <div className="pb-[30px] md:pb-[60px] text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-9 text-center relative inline-block mx-auto job-openings">
                        仕事・スキルを知る
                    </h2>
                    <p className='text-center text-[14px] md:text-base text-gray-600 font-sans'>KNOW YOUR JOB/SKILLS</p>
                </div>
                <div className="relative aspect-[5/2] w-full mx-auto">
                    <Image
                        src="/images/works/explain.jpg"
                        alt="説明"
                        fill
                        className="object-cover rounded-tr-[30px] rounded-bl-[30px]"
                    />
                </div>

                <p className='text-[14px] md:text-[16px] pt-10 font-light leading-[1.8]'>
                    リユース・リサイクル・買取業界では、上場企業からスタートアップ、地域密着の中小企業まで、企業規模や組織風土が幅広いのが特徴です。成長戦略もIT・テクノロジーを駆使する会社、海外進出に積極的な会社など様々。そのため、自分の価値観や、キャリアイメージにマッチした企業選択、仕事選びは重要です。<br /><br />
                    不用品を買い取りし、再度流通させているリユースビジネスは持続可能な社会を作る循環型ビジネスです。SDGsにも合致しており、社会貢献性の高い仕事であることから今後も注目をされる仕事であることは間違いないでしょう。
                </p>

                {/* Main business */}
                <div className="pt-[50px] md:pt-[100px] text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-9 text-center relative inline-block mx-auto job-openings">
                        リユース・リサイクル・買取業界の主な仕事
                    </h2>
                    <p className='text-center text-[14px] md:text-base text-gray-600 font-sans'>Main business</p>
                </div>
                <p className='text-[14px] md:text-[16px] py-16 font-light leading-[1.8] text-center'>
                    リユース・リサイクル・買取業界の主な仕事（職種）と、その仕事に必要な知識やスキルを整理しました。<br />
                    経験や知識・スキルを向上させていくことで、市場価値が高まり、キャリアアップしていくことができます。
                </p>

                {/* Main Business Section */}
                <div className="space-y-12">
                    {jobCategories.map((category) => (
                        <JobCategorySection key={category.id} category={category} />
                    ))}
                </div>

                {/* Consulting */}
                <div className="lg:flex justify-between items-center gap-10">
                    <div className="relative aspect-[4/4] w-full mx-auto max-w-[500px]">
                        <Image
                            src="/images/works/graph.jpg"
                            alt="グラフ"
                            fill
                            className="object-cover rounded-tr-[30px] rounded-bl-[30px]"
                        />
                    </div>
                    <div className="">
                        <h3 className='text-center pb-10 text-[26px] md:text-[32px] font-bold'>
                            専門のキャリアアドバイザーに<br />
                            無料相談
                        </h3>
                        <p className='text-[14px] text-base font-light leading-[1.8]'>具体的にどのような方法で知識やスキルを向上させていけばよいのかなど、詳細を知りたい方は専門のキャリアアドバイザーにまずは無料相談をしてみましょう。</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}