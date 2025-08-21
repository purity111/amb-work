"use client";

import { useState } from 'react';

export default function SummerCampaignPage() {
    const [formData, setFormData] = useState({
        company: '',
        name1: '',
        name2: '',
        free10: '',
        mail: '',
        tel: '',
        free5: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name.replace('data[User][', '').replace(']', '')]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Submit the form to the external URL
        const form = e.target as HTMLFormElement;
        form.submit();
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative">
                {/* Right Side - Image and CTA */}
                <div>
                    <img
                        src="/images/2025-summer/pc/fv.png"
                        alt="リソコース・リユーズ"
                        className="h-auto w-full hidden md:block"
                    />
                    <img
                        src="/images/2025-summer/sp/sp_fv.png"
                        alt="リソコース・リユーズ"
                        className="h-auto w-full md:hidden"
                    />
                </div>
                <a href="#form" className="absolute bottom-0 md:bottom-10 right-3 md:right-10 active:scale-95">
                    <img
                        src="/images/2025-summer/button.png"
                        alt="申請ボタン"
                        className="h-auto w-[350px] md:w-[500px]"
                    />
                </a>
            </section>

            {/* Concern Section */}
            <section className="relative">
                {/* Right Side - Image and CTA */}
                <div>
                    <img
                        src="/images/2025-summer/pc/concern.png"
                        alt="リソコース・リユーズ"
                        className="h-auto w-full hidden md:block"
                    />
                    <img
                        src="/images/2025-summer/sp/concern.png"
                        alt="リソコース・リユーズ"
                        className="h-auto w-full md:hidden"
                    />
                </div>
            </section>

            {/* Apply Section */}
            <section className="bg-[#5AC1E9] relative pt-[50px] md:pt-[100px] pb-[120px] md:pb-[200px] text-center">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-white text-base md:text-[24px] font-bold">
                        「ヒトの力」で事業を加速させたい企業様を<br className='md:hidden' />私たちが全力でサポートします！
                    </p>
                    <p className="pt-[30px] md:pt-[50px] text-white text-[22px] md:text-[32px] font-bold">
                        \ 申込締切：８月３１日まで /
                    </p>
                </div>

                <a href="#form" className="absolute bottom-[40px] md:bottom-[80px] left-1/2 active:scale-95 -translate-x-1/2 h-auto w-[350px] md:w-[500px]">
                    <img
                        src="/images/2025-summer/button1.png"
                        alt="申請ボタン"
                    />
                </a>
            </section>

            {/* Advanage Section */}
            <section className="relative">
                {/* Right Side - Image and CTA */}
                <div>
                    <img
                        src="/images/2025-summer/pc/advantage.png"
                        alt="リソコース・リユーズ"
                        className="h-auto w-full hidden md:block"
                    />
                    <img
                        src="/images/2025-summer/sp/advantage.png"
                        alt="リソコース・リユーズ"
                        className="h-auto w-full md:hidden"
                    />
                </div>
            </section>

            {/* Data Section */}
            <section className="relative">
                {/* Right Side - Image and CTA */}
                <div>
                    <img
                        src="/images/2025-summer/pc/data.png"
                        alt="リソコース・リユーズ"
                        className="h-auto w-full hidden md:block"
                    />
                    <img
                        src="/images/2025-summer/sp/data.png"
                        alt="リソコース・リユーズ"
                        className="h-auto w-full md:hidden"
                    />
                </div>
            </section>

            {/* Detail Section */}
            <section className="relative">
                {/* Right Side - Image and CTA */}
                <div>
                    <img
                        src="/images/2025-summer/pc/detail.png"
                        alt="リソコース・リユーズ"
                        className="h-auto w-full hidden md:block"
                    />
                    <img
                        src="/images/2025-summer/sp/detail.png"
                        alt="リソコース・リユーズ"
                        className="h-auto w-full md:hidden"
                    />
                </div>
            </section>

            {/* Apply Section */}
            <section className="bg-[#5AC1E9] relative pt-[50px] md:pt-[100px] pb-[120px] md:pb-[200px] text-center">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-white text-base md:text-[24px] font-bold">
                        「ヒトの力」で事業を加速させたい企業様を<br className='md:hidden' />私たちが全力でサポートします！
                    </p>
                    <p className="pt-[30px] md:pt-[50px] text-white text-[22px] md:text-[32px] font-bold">
                        \ 申込締切：８月３１日まで /
                    </p>
                </div>

                <a href="#form" className="absolute bottom-[40px] md:bottom-[80px] left-1/2 active:scale-95 -translate-x-1/2 h-auto w-[350px] md:w-[500px]">
                    <img
                        src="/images/2025-summer/button1.png"
                        alt="申請ボタン"
                    />
                </a>
            </section>

            {/* flow Section */}
            <section className="relative">
                {/* Right Side - Image and CTA */}
                <div>
                    <img
                        src="/images/2025-summer/pc/flow.png"
                        alt="フロー"
                        className="h-auto w-full hidden md:block"
                    />
                    <img
                        src="/images/2025-summer/sp/flow.png"
                        alt="フロー"
                        className="h-auto w-full md:hidden"
                    />
                </div>
            </section>

            {/* Detail Section */}
            <section className="relative">
                {/* Right Side - Image and CTA */}
                <div>
                    <img
                        src="/images/2025-summer/pc/faq.png"
                        alt="FAQ"
                        className="h-auto w-full hidden md:block"
                    />
                    <img
                        src="/images/2025-summer/sp/faq.png"
                        alt="FAQ"
                        className="h-auto w-full md:hidden"
                    />
                </div>
            </section>

            {/* Form Section */}
            <div id="form" className="max-w-4xl mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-[24px] md:text-4xl font-bold leading-[1.5]">
                        企業ご担当者様　申込フォーム<br />【夏の企業応援キャンペーン】
                    </h2>
                </div>

                <div className="bg-white md:p-8">
                    <form 
                        action="https://my183p.com/p/r/gw7V0Ihn" 
                        encType="multipart/form-data" 
                        id="UserItemForm" 
                        className="space-y-8" 
                        method="post" 
                        acceptCharset="utf-8"
                        onSubmit={handleSubmit}
                    >
                        <input type="hidden" name="_method" value="POST" />

                        {/* 会社名 */}
                        <div className="space-y-2">
                            <label htmlFor="Usercompany" className="block text-[18px] font-medium">
                                会社名 <span className="inline-block bg-red-500 text-white text-base py-[2px] px-[15px] rounded ml-2">必須</span>
                            </label>
                            <input 
                                name="data[User][company]" 
                                id="Usercompany" 
                                value={formData.company}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-[#FFE6E6] border-[#E2E0E0] border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-pink-50" 
                                type="text" 
                                required 
                            />
                        </div>

                        {/* 部署名 */}
                        <div className="space-y-2">
                            <label htmlFor="Username1" className="block text-[18px] font-medium">
                                部署名 <span className="inline-block bg-red-500 text-white text-base py-[2px] px-[15px] rounded ml-2">必須</span>
                            </label>
                            <input 
                                name="data[User][name1]" 
                                id="Username1" 
                                value={formData.name1}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-[#FFE6E6] border-[#E2E0E0] border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-pink-50" 
                                type="text" 
                                required 
                            />
                        </div>

                        {/* 姓 */}
                        <div className="space-y-2">
                            <label htmlFor="Username2" className="block text-[18px] font-medium">
                                姓 <span className="inline-block bg-red-500 text-white text-base py-[2px] px-[15px] rounded ml-2">必須</span>
                            </label>
                            <input 
                                name="data[User][name2]" 
                                id="Username2" 
                                value={formData.name2}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-[#FFE6E6] border-[#E2E0E0] border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-pink-50" 
                                type="text" 
                                required 
                            />
                        </div>

                        {/* 名 */}
                        <div className="space-y-2">
                            <label htmlFor="Userfree10" className="block text-[18px] font-medium">
                                名 <span className="inline-block bg-red-500 text-white text-base py-[2px] px-[15px] rounded ml-2">必須</span>
                            </label>
                            <input 
                                name="data[User][free10]" 
                                id="Userfree10" 
                                value={formData.free10}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-[#FFE6E6] border-[#E2E0E0] border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-pink-50" 
                                type="text" 
                                required 
                            />
                        </div>

                        {/* メールアドレス */}
                        <div className="space-y-2">
                            <label htmlFor="Usermail" className="block text-[18px] font-medium">
                                メールアドレス <span className="inline-block bg-red-500 text-white text-base py-[2px] px-[15px] rounded ml-2">必須</span>
                            </label>
                            <input 
                                name="data[User][mail]" 
                                id="Usermail" 
                                value={formData.mail}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-[#FFE6E6] border-[#E2E0E0] border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-pink-50" 
                                type="email" 
                                required 
                            />
                        </div>

                        {/* 電話番号 */}
                        <div className="space-y-2">
                            <label htmlFor="Usertel" className="block text-[18px] font-medium">
                                電話番号 <span className="inline-block bg-red-500 text-white text-base py-[2px] px-[15px] rounded ml-2">必須</span>
                            </label>
                            <input 
                                name="data[User][tel]" 
                                id="Usertel" 
                                value={formData.tel}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-[#FFE6E6] border-[#E2E0E0] border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-pink-50" 
                                type="tel" 
                                required 
                            />
                        </div>

                        {/* 備考欄 */}
                        <div className="space-y-2">
                            <label htmlFor="Userfree5" className="block text-[18px] font-medium">
                                備考欄
                            </label>
                            <textarea 
                                name="data[User][free5]" 
                                id="Userfree5" 
                                value={formData.free5}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border-[#E2E0E0] border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none" 
                                cols={30} 
                                rows={5}
                            ></textarea>
                        </div>

                        {/* 確認ボタン */}
                        <div className="flex justify-center pt-8">
                            <button 
                                type="submit" 
                                className="bg-[#0793C3] hover:bg-blue-700 text-white font-bold py-[20px] md:py-[30px] px-[110px] md:px-[120px] text-[17px] md:text-[28px] rounded-lg transition duration-200 transform hover:scale-105"
                            >
                                確認する
                            </button>
                        </div>

                        <input type="hidden" id="server_url" value="https://my183p.com/" />

                        {/* ▼リファラ */}
                        <input type="hidden" name="data[User][referer_form_url]" value="" className="UserRefererFormUrl" />
                        <input type="hidden" name="data[User][referer_url]" value="" className="UserRefererUrl" />
                    </form>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-[#5AC1E9] py-[50px] md:py-[100px] text-white font-bold">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-white text-sm md:text-[20px] pb-[30px] md:pb-[50px]">
                        プライバシーポリシー
                    </p>
                    <p className="text-white text-sm md:text-[20px] md:pb-0">
                        Copyright ©2025 ©リユース・リサイクル・<br className='md:hidden' />買取業界専門の転職・求人サイト「リユース<br className='md:hidden' />転職」 All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}