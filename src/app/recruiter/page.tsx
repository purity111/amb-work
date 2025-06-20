'use client'

import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumb";
import CircleTextItem from "@/components/pages/recruiter/CircleTextItem";
import StatisticItem from "@/components/pages/recruiter/StatisticItem";
import About from "@/components/pages/recruiter/About";
import CustomerVoiceItem from "@/components/pages/recruiter/CustomerVoiceItem";
import PricePlan from "@/components/pages/recruiter/PricePlan";
import FormField from "@/components/FormField";
import { RecruiterPainPoints, RecruiterStatistics, aboutItems, customerVoices, RecruiterFlowSteps } from "@/utils/constants";
import Footer from "@/components/Footer";

export default function RecruiterPage() {
    return (
        <main>
            {/* Hero Section */}
            <div className="md:h-45 bg-[#414141]"></div>
            {/* Text Content (Left Side - Dark Grey Background) */}
            <div className="w-full max-w-[1200px] m-auto text-white px-4 lg:px-0 mb-10">
                <div className="md:text-left md:mr-8 xl:mr-20">
                    <div className="h-[30px] md:h-15 w-[3px] bg-green-500 mr-2 md:mt-[-30px] mb-5 md:mb-10"></div>
                    <h1 className="text-[26px] md:text-[35px] lg:text-[44px] text-black mb-2">採用担当者の方へ</h1>
                    <p className="text-[14px] md:text-[18px] text-gray-300 font-bold">For Recruiters</p>
                </div>
            </div>

            {/* Breadcrumb */}
            <Breadcrumb />

            {/* Hero Section - Moved below Breadcrumb */}
            <div className="relative">
                <div className="w-full h-[250px] md:h-[600px] lg:h-[720px] md:mb-16">
                    <Image
                        src="/images/recruiter/top-pc.jpg"
                        alt="Recruiter Hero"
                        fill
                        className="object-cover hidden lg:block"
                        priority
                    />
                    <Image
                        src="/images/recruiter/top-sp.jpg"
                        alt="Recruiter Hero Mobile"
                        fill
                        className="object-cover lg:hidden"
                        priority
                    />
                </div>
                <div className="w-[128px] md:w-64 h-[27px] md:h-[54px] absolute left-1/2 transform -translate-x-1/2 top-[40px] md:top-[100px]">
                    <Image
                        src="/images/recruiter/logo-header.webp"
                        alt="sub-Logo"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="relative max-w-[1200px] m-auto mt-0 md:mt-[-200px] lg:mt-[-300px] bg-white">
                {/* Pain Points Section - Modified to match target image */}
                <div className="m-auto md:m-unset md:absolute md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 bg-gray-400 p-5 lg:px-10 text-center w-full max-w-[700px] lg:max-w-[920px]">
                    <h2 className="text-[22px] lg:text-[40px] font-bold text-white inline-block">
                        採用に関する<br className="md:hidden" /><span className="text-green">このようなお悩み</span>ありませんか？
                    </h2>
                </div>

                {/* The four items will be rendered using the new component */}
                <div className="flex md:flex-row flex-wrap justify-center items-start gap-8 pt-[80px] md:pt-[120px] lg:max-w-[960px] m-auto">
                    {RecruiterPainPoints.map((item, index) => (
                        <CircleTextItem
                            key={index}
                            text={item.text}
                            imageUrl={item.imageUrl}
                            altText={item.altText}
                        />
                    ))}
                </div>
            </div>
            <div className="py-10 md:py-15 bg-[#f3f3f3] rounded-tr-[200px] my-10 md:my-20">
                {/* Statistics Section */}
                <div className="max-w-[1200px] mx-auto px-4 md:px-8">
                    <p className="text-green text-center pb-2">Reuse tenshoku is a great place<br className="md:hidden" /> to meet people like this.</p>
                    <h2 className="text-[26px] md:text-[34px] lg:text-[40px] font-bold mb-8 text-center">リユース転職ではこのような人材に出会えます</h2>
                    <div className="md:grid md:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-6">
                        {RecruiterStatistics.map((item, index) => (
                            <StatisticItem
                                key={index}
                                step={index + 1}
                                {...item}
                            />
                        ))}
                    </div>
                </div>
                {/* Features Section */}
                <div className="pt-16 md:pt-24">
                    <div className="max-w-[500px] md:max-w-[1200px] mx-auto px-4 lg:px-8">
                        <div className="flex flex-col md:grid md:grid-cols-2 gap-8">
                            <div>
                                <div className="bg-green px-6 py-4 text-white rounded-tl-lg rounded-tr-lg">
                                    <h3 className="text-lg md:text-xl font-bold">リユースに100%共感</h3>
                                </div>
                                <div className="bg-white rounded-bl-lg rounded-br-lg shadow-lg p-6 md:min-h-54 lg:min-h-36">
                                    <div className="text-[14px] md:text-[16px]">
                                        リユース・循環型社会に100%共感している熱意ある人材のため、<br />
                                        早期離脱を防ぎ、入社後活躍を期待できる
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="bg-green px-6 py-4 text-white rounded-tl-lg rounded-tr-lg">
                                    <h3 className="text-lg md:text-xl font-bold">全領域をカバー</h3>
                                </div>
                                <div className="bg-white rounded-bl-lg rounded-br-lg shadow-lg p-6 md:min-h-54 lg:min-h-36">
                                    <div className="text-[14px] md:text-[16px]">
                                        <strong>ハイクラス：</strong>事業責任者、幹部候補<br />
                                        <strong>ミドル：</strong>管理部門、店舗統括、WEBマーケ、バイヤー<br />
                                        <strong>ジュニア：</strong>鑑定士、店舗スタッフ、EC運営<br />
                                        その他、新卒、アルバイト、業務委託など人材領域は様々
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="bg-green px-6 py-4 text-white rounded-tl-lg rounded-tr-lg">
                                    <h3 className="text-lg md:text-xl font-bold">全ジャンルカバー</h3>
                                </div>
                                <div className="bg-white rounded-bl-lg rounded-br-lg shadow-lg p-6 md:min-h-54 lg:min-h-36">
                                    <div className="text-[14px] md:text-[16px]">
                                        登録者の取り扱いアイテム経験も全ジャンル<br />
                                        ブランド品・時計、アパレル、家具・家電、PC・スマホ、ゲーム・ホビー、カメラ、工具など
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="max-w-[1200px] mx-auto px-4 md:px-0">
                {/* About Section */}
                <div className="about">
                    <p className="text-green text-center pb-2">What is Reuse tenshoku?</p>
                    <h2 className="text-[26px] md:text-[34px] lg:text-[40px] font-bold mb-8 text-center">リユース転職とは</h2>
                    <p className="text-center mb-12">
                        リユース転職は、国内唯一のリユース、リサイクル、買取業界に特化した<br />求人広告サービスと人材紹介サービスを行っております。
                    </p>
                    <p className="text-green text-center pb-2">Reuse tenshoku is chosen!</p>
                    <h2 className="text-[26px] md:text-[34px] lg:text-[40px] font-bold mb-15 text-center">リユース転職は選ばれています！</h2>
                    <About items={aboutItems} />
                </div>

                {/* Achievement Section */}
                <div className="pt-16 md:pt-24 text-center">
                    <p className="text-green text-center pb-2">Acheievement</p>
                    <h2 className="text-[26px] md:text-[34px] lg:text-[40px] font-bold mb-15 text-center">ご利用実績</h2>
                    <p className="text-[14px] md:text-[16px]">
                        リユース、リサイクル、買取に関連する事業者を中心に累計約100社が利用。<br />
                        大手企業や上場企業からベンチャー企業、地元密着の中小企業まで幅広くご利用いただいております。
                    </p>
                </div>

                {/* Customer Voices Section */}
                <div className="py-16 md:py-24">
                    <p className="text-green text-center pb-2">Customer's voice</p>
                    <h2 className="text-[26px] md:text-[34px] lg:text-[40px] font-bold mb-15 text-center">お客様の声</h2>
                    <div className="grid grid-cols-1 gap-8">
                        {customerVoices.map((item, index) => (
                            <CustomerVoiceItem key={index} item={item} />
                        ))}
                    </div>
                </div>

            </div>
            {/* Price Plans Section */}
            <PricePlan />

            {/* Flow Chart Section */}
            <div className="py-16 md:py-24">
                <div className="max-w-[1200px] mx-auto px-4 sm:px-8 xl:px-0">
                    <p className="text-green text-center pb-2">Flow chart to publication</p>
                    <h2 className="text-[26px] md:text-[34px] lg:text-[40px] font-bold mb-15 text-center">掲載までのフロー</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-6">
                        {RecruiterFlowSteps.map((item, index) => (
                            <div key={index} className="mb-10 w-[85%] sm:w-[70%] m-auto md:w-full">
                                <p className="text-green-600 text-center font-bold">STEP</p>
                                <p className="text-green-600 leading-[0.8] text-center font-bold text-[26px] md:text-[30px] -translate-x-1/2 left-[50%] hyphen whitespace-pre-line">{item.step}</p>
                                <div className="shadow-lg pb-4 text-center">
                                    <div className="relative w-full aspect-[4/3] mb-4">
                                        <Image
                                            src={item.image}
                                            alt={`Step ${index + 1}`}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <div className="px-2 md:min-h-15">
                                        <h3 className="text-lg font-bold mb-2 whitespace-pre-line">{item.title}</h3>
                                        <p className="text-[14px] whitespace-pre-line">{item.text}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Application Form Section */}
            <div className="bg-gray-800 rounded-tl-[100px] md:rounded-tl-[200px]">
                <div className="py-16 md:py-24 max-w-[1000px] mx-auto px-4 md:px-0">
                    <p className="text-green text-center pb-2">Application Form</p>
                    <h2 className="text-[26px] md:text-[34px] lg:text-[40px] font-bold mb-15 text-center">企業ご担当者様お申込みフォーム</h2>
                    <form className="space-y-6">
                        <FormField label="会社名" type="text" required />
                        <FormField label="部署名" type="text" required />
                        <FormField label="お名前" type="text" required />
                        <FormField label="メールアドレス" type="email" required />
                        <FormField label="電話番号" type="tel" required />

                        {/* Use FormField for the textarea field */}
                        <FormField
                            label="お問い合わせ内容について"
                            component="textarea"
                            required
                            rows={6} // Adjust rows as needed
                        />

                        {/* Keep the submit button */}
                        <input type="submit" value="送信" className="bg-green text-white w-[20%] flex m-auto py-2 rounded-lg cursor-pointer hover:opacity-80" />
                    </form>
                </div>
            </div>
            <Footer />
        </main >
    );
} 