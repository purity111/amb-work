"use client";

import { useState } from 'react';
import Image from 'next/image';

export default function SummerCampaignPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        company: '',
        name: '',
        email: '',
        phone: '',
        inquiry: ''
    });

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', formData);
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
                <a href="#form" className="absolute bottom-0 md:bottom-10 right-3 md:right-10">
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

                <a href="#form" className="absolute bottom-[50px] md:bottom-[100px] left-1/2 -translate-x-1/2 h-auto w-[350px] md:w-[500px]">
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

                <a href="#form" className="absolute bottom-[50px] md:bottom-[100px] left-1/2 -translate-x-1/2 h-auto w-[350px] md:w-[500px]">
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
            <form id="form" className="relative py-[50px] md:py-[100px]">
                <h3 className='text-center text-[28px] md:text-[36px] font-bold'>お申込みフォーム</h3>

            </form>
            {/* Footer */}
            <footer className="bg-[#5AC1E9] py-8 tex-white font-bold">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-blue-900 text-sm md:text-[20px] text-white pb-[30px] md:pb-[50px]">
                        プライバシーポリシー
                    </p>
                    <p className="text-blue-900 text-sm md:text-[20px] text-white md:pb-[50px]">
                        Copyright ©2025 ©リユース・リサイクル・<br className='md:hidden' />買取業界専門の転職・求人サイト「リユース<br className='md:hidden' />転職」 All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}