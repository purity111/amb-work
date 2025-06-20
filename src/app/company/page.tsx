'use client'

import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";

export default function CompanyPage() {
    return (
        <main>
            {/* Hero Section - Identical Split Layout */}
            <div className="h-20 sm:h-30 md:h-75 bg-[#414141]"></div>
            {/* Text Content (Left Side - Dark Grey Background) */}
            <div className="w-full max-w-[1200px] m-auto text-white px-4 lg:px-0 md:mb-25">
                <div className="md:text-left md:mr-8 xl:mr-20">
                    <div className="h-[30px] md:h-15 w-[3px] bg-green-500 mr-2 md:mt-[-30px] mb-5 md:mb-10"></div>
                    <h1 className="text-[26px] md:text-[35px] lg:text-[44px] font-bold text-black mb-2">会社概要</h1>
                    <p className="text-[14px] md:text-[18px] text-gray-300 font-bold">Company Profile</p>
                </div>
            </div>

            <div className="pl-4">
                <div className="w-full my-10 sm:my-[50px] md:my-0 md:w-1/2 relative bg-white h-[160px] sm:h-[250px] md:h-[350px] flex justify-end rounded-tl-[50px] sm:rounded-tl-[80px] md:rounded-tl-[100px] overflow-hidden md:absolute md:right-0 md:top-[180px]">
                    <Image
                        src="/images/company/page-top.jpg"
                        alt="Company Page Top"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                </div>
            </div>

            {/* Breadcrumb */}
            <Breadcrumb />

            {/* Company Profile Section */}
            <div className="max-w-[1000px] mx-auto px-4 sm:px-10 md:px-15 lg:px-8 pb-12 pt-0">
                <div className="mb-15 md:mb-25 rounded-lg shadow-lg px-4 py-6 md:p-8 bg-[#ededed]">
                    <dl className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-y-6 md:gap-y-8">
                        <dt className="font-bold text-gray-700 text-[14px] md:text-[16px]">会社名</dt>
                        <dd className="mb-2">
                            <a href="https://ambsolutions.jp/" target="_blank" rel="noopener noreferrer" className="hover:underline text-[14px] md:text-[16px]">
                                株式会社AMBソリューションズ
                            </a><br />
                            <a href="https://ambsolutions.jp/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-[14px] md:text-[16px]">
                                https://ambsolutions.jp/
                            </a>
                        </dd>

                        <dt className="font-bold text-gray-700 text-[14px] md:text-[16px]">代表取締役</dt>
                        <dd className="mb-2 text-[14px] md:text-[16px]">山口桃子</dd>

                        <dt className="font-bold text-gray-700 text-[14px] md:text-[16px]">事業内容</dt>
                        <dd className="mb-2">
                            <ul className="list-disc list-inside space-y-1 text-[14px] md:text-[16px]">
                                <li>リユース・リサイクル・買取業界専門の転職・求人サイト「リユース転職」の運営</li>
                                <li>人材紹介事業</li>
                                <li>採用コンサルティング事業</li>
                                <li>研修販売代行・研修企画事業</li>
                            </ul>
                        </dd>

                        <dt className="font-bold text-gray-700 text-[14px] md:text-[16px]">事業者許可番号</dt>
                        <dd className="mb-2 text-[14px] md:text-[16px]">13-ユ-311089</dd>

                        <dt className="font-bold text-gray-700 text-[14px] md:text-[16px]">所在地</dt>
                        <dd className="mb-2 text-[14px] md:text-[16px]">
                            〒105-0004<br />
                            東京都港区新橋2-16-1 ニュー新橋ビル603-2<br />
                            TEL : 080-7300-8586<br />
                        </dd>
                        <dt className="font-bold text-gray-700 text-[14px] md:text-[16px]">交通</dt>
                        <dd className="mb-2 text-[14px] md:text-[16px]">JR「新橋駅」徒歩1分</dd>
                    </dl>
                </div>

                {/* Google Map Section */}
                <div className="mb-4 md:mb-12">
                    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-sm">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.4351408647235!2d139.75480657636743!3d35.66628613079395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188bbe762e8b41%3A0x27b0613386313216!2z44Oq44Om44O844K56Lui6IG377yI5qCq5byP5Lya56S-QU1C44K944Oq44Ol44O844K344On44Oz44K677yJ!5e0!3m2!1sen!2sde!4v1748580876016!5m2!1sen!2sdeimage.png"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="AMB Solutions Location"
                        ></iframe>
                    </div>
                </div>

                {/* CEO Message Section */}
                <div className="mb-0 md:mb-12 text-center">
                    <div className="pt-[50px] pb-[30px] md:pt-[100px] md:pb-[60px]">
                        <h2 className="text-2xl md:text-3xl font-bold mb-9 text-center relative inline-block mx-auto job-openings">
                            代表メッセージ
                        </h2>
                        <p className='text-center text-[14px] md:text-base text-gray-600 font-sans'>CEO MESSAGE</p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-8 items-start text-left">
                        <div className="w-full md:w-2/5">
                            <div className="relative aspect-[4/4] w-full mx-auto">
                                <Image
                                    src="/images/company/ceo.jpg"
                                    alt="CEO Mooko Yamaguchi"
                                    fill
                                    className="object-cover rounded-tr-[30px] rounded-bl-[30px]"
                                />
                            </div>
                        </div>
                        <div className="w-full md:w-3/5">
                            <div className="bg-[#ededed] rounded-lg shadow-lg p-6 md:p-8">
                                <p className="mb-4 text-[14px] md:text-[16px] leading-relaxed">
                                    会社名の"AMB"とは"明るく まじめに ベストを尽くす"のローマ字表記の頭文字をとりました。創業者の2名が大事にしているポリシーです。専門エージェントとして、"明るく まじめに ベストを尽くす"そんな人材と企業を適切にマッチングしていきます。<br /><br />
                                    創業者の2名は、リサイクル・リユースの中でも特にジュエリー・貴金属業界に10年いた経営者と、6年いた店長及び人事の経験者です。価格設定や相場がカスタマーに不透明になりがちな業界の構造改革を目指し、独自のスキルマップ（評価制度）や研修を導入することで社員のスキルアップに注力してきた経緯があります。<br /><br />
                                    その知見と業界大手を網羅する厚い人脈を生かして、RE（リサイクル・リユース・リフォーム）ビジネス特化の転職サイト、「リユース転職」を開設しました。転職支援だけでなく、業界情報や仕事紹介などの情報を随時発信していくとともに、セミナーを企画してユーザーのスキルアップ支援を行っていきます。<br /><br />
                                    スキルの高い人材育成とスキルに見合う処遇水準の階層化を実現することにより、業界への人材流入の活発化、リテンション強化を図り、人材不足が市場の発展のボトルネックにならないよう人材面での業界インフラを目指します。<br /><br />
                                </p>
                                <p className="text-right font-bold text-[16px] md:text-[20px]">
                                    代表取締役 山口桃子
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
} 