'use client'

import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import CheckList from "@/components/pages/experience/CheckList";
import SuccessCaseCard from "@/components/pages/experience/SuccessCaseCard";
import ReasonCardGrid from "@/components/pages/experience/ReasonCardGrid";
import { EXPERIENCE_SUPPORT_ITEMS, EXPERIENCE_NAYAMI_ITEMS, EXPERIENCE_SUCCESS_CASES, EXPERIENCE_REASON_ITEMS } from "@/utils/constants";
import CareerCounselingForm from "@/components/common/CareerCounselingForm";

export default function CompanyPage() {
    return (
        <>
            <main>
                <div className="h-20 sm:h-30 md:h-75 bg-[#414141]"></div>
                {/* Text Content (Left Side - Dark Grey Background) */}
                <div className="w-full max-w-[1200px] m-auto text-white px-4 lg:px-0 md:mb-25">
                    <div className="md:text-left md:mr-8 xl:mr-20">
                        <div className="h-[30px] md:h-15 w-[3px] bg-green-500 mr-2 md:mt-[-30px] mb-5 md:mb-10"></div>
                        <h1 className="text-[26px] md:text-[35px] lg:text-[44px] font-semibold text-black mb-2">経験者サポート</h1>
                        <p className="text-[14px] md:text-[18px] text-gray-300 font-semibold">Experienced Support</p>
                    </div>
                </div>

                <div className="w-full my-10 sm:my-[50px] md:my-0 md:w-1/2 relative bg-white h-[160px] sm:h-[250px] md:h-[350px] flex justify-end rounded-tl-[50px] sm:rounded-tl-[80px] md:rounded-tl-[100px] overflow-hidden md:absolute md:right-0 md:top-[180px]">
                    <Image
                        src="/images/qualifications/banner.jpg"
                        alt="資格バナー"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                </div>

                {/* Breadcrumb */}
                <Breadcrumb />

                {/* Responsive Info Banner */}
                <div className="py-12 relative experience px-4 md:px-0">
                    <div className="flex justify-center">
                        <div className="border border-gray-400 text-center font-semibold px-2 py-1 inline-block text-[16px] md:text-[20px]">
                            鑑定士、バイヤー、店長、買取スタッフ、査定士、販売、EC、出張買取営業など
                        </div>
                    </div>
                    <div className="mt-6 text-center">
                        <div className="text-[20px] md:text-[28px] font-bold leading-snug">
                            リユース・リサイクル・買取業界で経験がある方へ<br className="hidden md:inline" />
                            <span className="block md:inline">よりキャリアを上げる転職を叶えませんか？</span>
                        </div>
                    </div>
                </div>
                <div className="py-[30px] md:py-[60px] text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-9 text-center relative inline-block mx-auto job-openings">
                        このようなお悩みはありませんか？
                    </h2>
                    <p className='text-center text-[14px] text-gray-600 font-sans'>DO YOU HAVE ANY OF THESE PROBLEMS?</p>
                </div>

                {/* Two-column section: image left, checklist right */}
                <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row gap-8 md:gap-12 mb-12 px-[5%]">
                    <div className="w-full md:w-[340px] lg:w-[430px] xl:w-[550px] flex-shrink-0 flex justify-center">
                        <Image
                            src="/images/experience/nayami.jpg"
                            alt="悩む人"
                            width={340}
                            height={260}
                            className="rounded-[32px] object-cover object-center w-full h-auto w-[340px] lg:w-[430px] h-[260px] lg:h-[328px] xl:w-[550px] xl:h-[420px]"
                        />
                    </div>
                    <div className="w-full md:flex-1">
                        <CheckList
                            items={EXPERIENCE_NAYAMI_ITEMS}
                        />
                    </div>
                </div>

                <div className="bg-[#ffffde] rounded-md my-12 p-6 md:p-12 w-[90%] sm:w-[80%] lg:max-w-[960px] mx-auto relative">
                    <h2 className="text-center text-[18px] md:text-[28px] font-bold leading-[1.6]">
                        <span className="text-[#65B729]">リユース、リサイクル、買取業界専門のキャリアアドバイザー</span>が<br />
                        親身にキャリア相談にのり、<br />
                        <span className="text-[#65B729]">あなたの転職成功</span>に向けて伴走いたします。
                    </h2>
                    <div className="aspect-[10/13] w-[96px] absolute bottom-[-80px] md:bottom-[-30px] right-0">
                        <Image
                            src='/images/experience/illust.png'
                            alt="シンプルイラスト"
                            fill
                            className="object-contain rounded-[30px]"
                        />
                    </div>
                </div>

                {/* Support Section with Blurred Background */}
                <section className="relative mt-30 py-16 md:py-24 bg-cover bg-center" style={{ backgroundImage: 'url(/images/experience/bg.jpg)' }}>
                    <div className="pb-[30px] md:pb-[60px] text-center">
                        <h2 className="text-2xl md:text-3xl font-bold mb-9 text-center relative inline-block mx-auto job-openings">
                            このようなサポートが受けられます
                        </h2>
                        <p className='text-center text-[14px] text-gray-600 font-sans'>THIS KIND OF SUPPORTIS AVAILABLE</p>
                    </div>
                    <div className="relative z-10 max-w-[960px] mx-4 lg:mx-auto bg-white rounded-tl-[40px] md:rounded-tl-[100px] shadow-lg px-[20px] pt-[40px] pb-[20px] md:p-16 md:pb-[30px]">
                        <ul className="space-y-6">
                            {EXPERIENCE_SUPPORT_ITEMS.map((item, idx) => (
                                <div key={idx}>
                                    <li className="flex items-start gap-3 text-[17px] md:text-[19px]">
                                        <span className="mt-1 min-w-[20px]">
                                            <Image src="/images/experience/dot.png" alt="check" width={15} height={15} />
                                        </span>
                                        <span className="text-left font-semibold">{item}</span>
                                    </li>
                                    <hr className="border-t mb-6 border-[#dfdfdf]" />
                                </div>
                            ))}
                        </ul>
                    </div>
                </section>

                <div className="bg-gray-800 rounded-tl-[100px] md:rounded-tl-[200px] mt-20">
                    <div className="pt-16 md:pt-24 max-w-[1000px] mx-auto px-4 md:px-0">
                        <div className="pb-[30px] md:pb-[60px] text-center">
                            <h2 className="text-2xl md:text-3xl font-bold mb-9 text-center relative inline-block mx-auto job-openings">
                                転職成功者の声
                            </h2>
                            <p className='text-center text-[14px] text-gray-600 font-sans'>VOICE OF SUCCESS</p>
                        </div>

                    </div>
                    {/* Success Cases Section */}
                    <section className="py-6">
                        <div className="max-w-[1200px] md:m-auto mx-3 flex flex-col md:flex-row justify-center gap-15 md:gap-10">
                            {EXPERIENCE_SUCCESS_CASES.map((props, idx) => (
                                <SuccessCaseCard key={props.caseNo} {...props} />
                            ))}
                        </div>
                    </section>
                    {/* Reason Card Grid Section */}
                    <div className="pb-[30px] mt-10 md:mt-20 md:pb-[60px] text-center">
                        <h2 className="text-2xl md:text-3xl font-bold mb-9 text-center relative inline-block mx-auto job-openings">
                            リユース転職が選ばれる理由
                        </h2>
                        <p className='text-center text-[14px] text-gray-600 font-sans'>WHY REUSE JOBCHANGE?</p>
                    </div>
                    <ReasonCardGrid items={EXPERIENCE_REASON_ITEMS} />
                    <h2 className="text-[20px] md:text-[28px] font-bold text-center pt-20 pb-10">
                        リユース、リサイクル、買取業界で<br />
                        より良いキャリアを築きたい方はまずは<span className="text-[#65B729]">無料相談</span>
                    </h2>
                </div>
                <div className="">
                    <div className="py-[30px] md:py-[60px] text-center">
                        <h2 className="text-2xl md:text-3xl font-bold mb-9 text-center relative inline-block mx-auto job-openings">
                            転職支援サービス（無料・キャリア相談）<br />
                            のお申込みフォーム
                        </h2>
                        <p className='text-center text-[14px] text-gray-600 font-sans'>CLICK HERE TO APPLY FOR A CAREER CONSULTATION</p>
                    </div>
                    <CareerCounselingForm />
                </div>
            </main>
            <Footer />
        </>
    );
}