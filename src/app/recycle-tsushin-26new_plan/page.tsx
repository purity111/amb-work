"use client";

import { useState, useEffect } from 'react';
import ToInquiryCta from '@/components/pages/ToInquiryCta';
// import TestimonialCard from '@/components/TestimonialCard';

export default function LandingPage() {
    const [formData, setFormData] = useState({
        company: '',
        name1: '',
        name2: '',
        free10: '',
        mail: '',
        tel: '',
        free5: ''
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.company.trim()) {
            newErrors.company = '会社名は必須です';
        }
        if (!formData.name1.trim()) {
            newErrors.name1 = '部署名は必須です';
        }
        if (!formData.name2.trim()) {
            newErrors.name2 = '姓は必須です';
        }
        if (!formData.free10.trim()) {
            newErrors.free10 = '名は必須です';
        }
        if (!formData.mail.trim()) {
            newErrors.mail = 'メールアドレスは必須です';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.mail)) {
            newErrors.mail = '有効なメールアドレスを入力してください';
        }
        if (!formData.tel.trim()) {
            newErrors.tel = '電話番号は必須です';
        } else if (!/^[\d\-\(\)\+\s]+$/.test(formData.tel)) {
            newErrors.tel = '有効な電話番号を入力してください';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        // Submit the form (the external form handler will take over)
        const form = e.target as HTMLFormElement;
        form.submit();
    };

    useEffect(() => {
        // Handle referrer form URL
        if (document.referrer.length !== 0) {
            const userRefererUrl = document.getElementsByClassName("UserRefererUrl");
            if (userRefererUrl.length > 0) {
                for (let i = 0; i < userRefererUrl.length; i++) {
                    (userRefererUrl[i] as HTMLInputElement).value = document.referrer;
                }
            } else if (document.getElementById("UserRefererUrl")) {
                (document.getElementById("UserRefererUrl") as HTMLInputElement).value = document.referrer;
            }
        }

        // Handle referrer form URL
        const userRefererFormUrl = document.getElementsByClassName("UserRefererFormUrl");
        if (userRefererFormUrl.length > 0) {
            for (let i = 0; i < userRefererFormUrl.length; i++) {
                (userRefererFormUrl[i] as HTMLInputElement).value = location.href;
            }
        } else if (document.getElementById("UserRefererFormUrl")) {
            (document.getElementById("UserRefererFormUrl") as HTMLInputElement).value = location.href;
        }

        // Load external validation script
        const script = document.createElement('script');
        script.src = 'https://my183p.com/js/validation.js?d=20250923172331';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            // Cleanup script on component unmount
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative">
                {/* Right Side - Image and CTA */}
                <div>
                    <img
                        src="/images/landing/pc/header-bg.png"
                        alt="リソコース・リユーズ"
                        className="h-auto w-full hidden md:block"
                    />
                    <img
                        src="/images/landing/sp/header-bg.png"
                        alt="リソコース・リユーズ"
                        className="h-auto w-full md:hidden"
                    />
                </div>
                <div className="hidden md:block absolute bottom-65 left-[455px]">
                    <a
                        href="#price"
                        aria-label="申請ボタン"
                        className="w-[421px] h-[84px] bg-[url('/images/landing/pc/seePlanBtn.png')] bg-[length:100%_100%] bg-no-repeat bg-center active:scale-95 block"
                    >
                        <span className="sr-only">申請ボタン</span>
                    </a>
                </div>
                <div className="md:hidden absolute bottom-52 left-[37px]">
                    <a
                        href="#price"
                        aria-label="申請ボタン"
                        className="w-[218px] h-[31px] bg-[url('/images/landing/sp/seePlanBtn.png')] bg-[length:100%_100%] bg-no-repeat bg-center active:scale-95 block"
                    >
                        <span className="sr-only">申請ボタン</span>
                    </a>
                </div>
                <div className="gap-4 hidden md:flex absolute bottom-6 inset-x-0 mx-auto w-fit">
                    <a
                        href="#jinjai"
                        aria-label="申請ボタン"
                        className="block w-[609px] h-[84px] bg-[url('/images/landing/pc/button1.png')] bg-[length:100%_100%] bg-no-repeat bg-center active:scale-95"
                    >
                    </a>
                    <a
                        href="#form"
                        aria-label="申請ボタン"
                        className="block w-[609px] h-[84px] bg-[url('/images/landing/pc/button2.png')] bg-[length:100%_100%] bg-no-repeat bg-center active:scale-95"
                    >
                    </a>
                </div>
                <div className="gap-4 md:hidden absolute bottom-5 inset-x-0 mx-auto w-fit">
                    <a
                        href="#jinjai"
                        aria-label="申請ボタン"
                        className="block w-[335px] h-[44px] bg-[url('/images/landing/pc/button1.png')] bg-[length:100%_100%] bg-no-repeat bg-center active:scale-95"
                    >
                    </a>
                    <a
                        href="#form"
                        aria-label="申請ボタン"
                        className="block w-[335px] h-[44px] bg-[url('/images/landing/pc/button2.png')] bg-[length:100%_100%] bg-no-repeat bg-center active:scale-95"
                    >
                    </a>
                </div>
            </section>

            {/* Naomi Section */}
            <section className="relative">
                {/* Right Side - Image and CTA */}
                <div>
                    <img
                        src="/images/landing/pc/naomi.png"
                        alt="リソコース・リユーズ"
                        className="h-auto w-full hidden md:block"
                    />
                    <img
                        src="/images/landing/sp/naomi.png"
                        alt="リソコース・リユーズ"
                        className="h-auto w-full md:hidden"
                    />
                </div>
            </section>

            {/* Reason Section */}
            <section className="relative">
                {/* Right Side - Image and CTA */}
                <div>
                    <img
                        src="/images/landing/pc/reason.png"
                        alt="リソコース・リユーズ"
                        className="h-auto w-full hidden md:block"
                    />
                    <img
                        src="/images/landing/sp/reason.png"
                        alt="リソコース・リユーズ"
                        className="h-auto w-full md:hidden"
                    />
                </div>
            </section>


            {/* Jinjai Section */}
            <section className="relative">
                {/* Right Side - Image and CTA */}
                <div>
                    <img
                        src="/images/landing/pc/jinjai.png"
                        alt="リソコース・リユーズ"
                        className="h-auto w-full hidden md:block"
                    />
                    <img
                        src="/images/landing/sp/jinjai.png"
                        alt="リソコース・リユーズ"
                        className="h-auto w-full md:hidden"
                    />
                </div>
            </section>

            {/* Price CTA (after Jinjai) */}
            <ToInquiryCta />

            {/* Use-case Section */}
            <section className="relative" id="price">
                {/* Right Side - Image and CTA */}
                <div>
                    <img
                        src="/images/landing/pc/use-case.png"
                        alt="リソコース・リユーズ"
                        className="h-auto w-full hidden md:block"
                    />
                    <div className="md:hidden">
                        <img
                            src="/images/landing/sp/use-case.png"
                            alt="リソコース・リユーズ"
                            className="h-auto w-full md:hidden"
                        />
                        <img
                            src="/images/landing/sp/price.png"
                            alt="リソコース・リユーズ"
                            className="h-auto w-full md:hidden"
                        />
                        <img
                            src="/images/landing/sp/extent.png"
                            alt="リソコース・リユーズ"
                            className="h-auto w-full md:hidden"
                        />

                    </div>
                </div>
            </section>

            {/* Option Section */}
            <section className="relative">
                {/* Right Side - Image and CTA */}
                <div>
                    <img
                        src="/images/landing/pc/option.png"
                        alt="リソコース・リユーズ"
                        className="h-auto w-full hidden md:block"
                    />
                    <img
                        src="/images/landing/sp/option.png"
                        alt="リソコース・リユーズ"
                        className="h-auto w-full md:hidden"
                    />
                </div>
            </section>

            <ToInquiryCta />

            {/* Testimonial Section */}
            {/* <section className="py-10 md:py-25 bg-gray-50 md:bg-[#EDF7FF]">
                <h2 className='text-[24px] md:text-[38px] font-bold text-[#1F86C3] text-center'>導入事例</h2>
                <div className="max-w-6xl mx-auto px-5">
                    <TestimonialCard className='mt-[62px] md:mt-[116px]' />
                    <TestimonialCard className='mt-[56px] md:mt-[136px]' />
                    <TestimonialCard className='mt-[56px] md:mt-[136px]' />
                </div>
            </section> */}

            {/* flow Section */}
            <section className="relative">
                {/* Right Side - Image and CTA */}
                <div>
                    <img
                        src="/images/landing/pc/flow.png"
                        alt="フロー"
                        className="h-auto w-full hidden md:block"
                    />
                    <img
                        src="/images/landing/sp/flow.png"
                        alt="フロー"
                        className="h-auto w-full md:hidden"
                    />
                </div>
            </section>

            {/* FAQ Section */}
            <section className="relative">
                {/* Right Side - Image and CTA */}
                <div>
                    <img
                        src="/images/landing/pc/faq.png"
                        alt="FAQ"
                        className="h-auto w-full hidden md:block"
                    />
                    <img
                        src="/images/landing/sp/faq.png"
                        alt="FAQ"
                        className="h-auto w-full md:hidden"
                    />
                </div>
            </section>

            {/* Form Section */}
            <section>
                <div>
                    <img
                        src="/images/landing/pc/inquiry-banner.png"
                        alt="フロー"
                        className="h-auto w-full hidden md:block"
                    />
                    <img
                        src="/images/landing/sp/inquiry-banner.png"
                        alt="フロー"
                        className="h-auto w-full md:hidden"
                    />
                </div>
                <div id="form" className="max-w-4xl mx-auto px-5 pt-6 pb-8 md:px-4 md:py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-[15px] md:text-[25px] text-[#186DAD] font-bold leading-[1.5]">
                            まずは、お気軽にご相談ください<br />
                            貴社の採用課題やご希望に合わせて<br className='md:hidden' /><span className='hidden md:inline'>、</span>最適なご提案をいたします
                        </h2>
                    </div>
                    <link rel="stylesheet" type="text/css" href="https://my183p.com/p/format_css?item_id=kCvr10zJ&format=div&form_align=&label_align=&radio_float=&checkbox_float=&label_width=0&input_width=0&theme_name=1_1&ver=3" />
                    <link rel="stylesheet" type="text/css" href="https://my183p.com/p/mobile_css?item_id=kCvr10zJ&format=div&form_align=&label_align=&radio_float=&checkbox_float=&label_width=0&input_width=0&theme_name=1_1&ver=3" />
                    <link rel="stylesheet" type="text/css" href="https://my183p.com/css/form/myasp-ui-form.css?d=20250810224710" />
                    <style jsx>{`
                        .content_form {
                            display: block !important;
                            visibility: visible !important;
                            opacity: 1 !important;
                        }
                        .input, .input_unit {
                            display: flex !important;
                            visibility: visible !important;
                            opacity: 1 !important;
                        }
                        input, textarea {
                            display: block !important;
                            visibility: visible !important;
                            opacity: 1 !important;
                        }
                        label {
                            display: block !important;
                            visibility: visible !important;
                            opacity: 1 !important;
                        }
                    `}</style>

                    <div className="content_form" style={{
                        display: 'block',
                        visibility: 'visible',
                        opacity: '1',
                        backgroundColor: 'white',
                    }}>
                        <form onSubmit={handleSubmit} action="https://my183p.com/p/r/kCvr10zJ" encType="multipart/form-data" id="UserItemForm" className="myForm" method="post" acceptCharset="utf-8">
                            <input type="hidden" name="_method" value="POST" />

                            {/* 会社名 */}
                            <div className="input text input_unit required" style={{ display: 'flex', alignItems: 'flex-start' }}>
                                <div className="my_column my_left" style={{ width: '30%' }}>
                                    <div className="label_frame">
                                        <label htmlFor="Usercompany" className="form_input_label required" style={{ fontWeight: 'bold', color: '#333' }}>会社名</label>
                                    </div>
                                </div>
                                <div className="my_column my_right" style={{ width: '70%' }}>
                                    <input
                                        name="company"
                                        id="Usercompany"
                                        value={formData.company}
                                        onChange={handleInputChange}
                                        className={`required ${errors.company ? 'border-red-500' : ''}`}
                                        type="text"
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            fontSize: '16px',
                                            backgroundColor: '#fff'
                                        }}
                                    />
                                    {errors.company && <div className="text-red-500 text-sm mt-1">{errors.company}</div>}
                                </div>
                            </div>


                            {/* 部署名 */}
                            <div className="input text input_unit required" style={{ display: 'flex', alignItems: 'flex-start' }}>
                                <div className="my_column my_left" style={{ width: '30%' }}>
                                    <div className="label_frame">
                                        <label htmlFor="Username1" className="form_input_label required" style={{ fontWeight: 'bold', color: '#333' }}>部署名</label>
                                    </div>
                                </div>
                                <div className="my_column my_right" style={{ width: '70%' }}>
                                    <input
                                        name="name1"
                                        id="Username1"
                                        value={formData.name1}
                                        onChange={handleInputChange}
                                        className={`required ${errors.name1 ? 'border-red-500' : ''}`}
                                        type="text"
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            fontSize: '16px',
                                            backgroundColor: '#fff'
                                        }}
                                    />
                                    {errors.name1 && <div className="text-red-500 text-sm mt-1">{errors.name1}</div>}
                                </div>
                            </div>


                            {/* 姓 */}
                            <div className="input text input_unit required" style={{ display: 'flex', alignItems: 'flex-start' }}>
                                <div className="my_column my_left" style={{ width: '30%' }}>
                                    <div className="label_frame">
                                        <label htmlFor="Username2" className="form_input_label required" style={{ fontWeight: 'bold', color: '#333' }}>姓</label>
                                    </div>
                                </div>
                                <div className="my_column my_right" style={{ width: '70%' }}>
                                    <input
                                        name="name2"
                                        id="Username2"
                                        value={formData.name2}
                                        onChange={handleInputChange}
                                        className={`required ${errors.name2 ? 'border-red-500' : ''}`}
                                        type="text"
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            fontSize: '16px',
                                            backgroundColor: '#fff'
                                        }}
                                    />
                                    {errors.name2 && <div className="text-red-500 text-sm mt-1">{errors.name2}</div>}
                                </div>
                            </div>


                            {/* 名 */}
                            <div className="input text input_unit required" style={{ display: 'flex', alignItems: 'flex-start' }}>
                                <div className="my_column my_left" style={{ width: '30%' }}>
                                    <div className="label_frame">
                                        <label htmlFor="Userfree10" className="form_input_label required" style={{ fontWeight: 'bold', color: '#333' }}>名</label>
                                    </div>
                                </div>
                                <div className="my_column my_right" style={{ width: '70%' }}>
                                    <input
                                        name="free10"
                                        id="Userfree10"
                                        value={formData.free10}
                                        onChange={handleInputChange}
                                        className={`required ${errors.free10 ? 'border-red-500' : ''}`}
                                        type="text"
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            fontSize: '16px',
                                            backgroundColor: '#fff'
                                        }}
                                    />
                                    {errors.free10 && <div className="text-red-500 text-sm mt-1">{errors.free10}</div>}
                                </div>
                            </div>


                            {/* メールアドレス */}
                            <div className="input text input_unit required" style={{ display: 'flex', alignItems: 'flex-start' }}>
                                <div className="my_column my_left" style={{ width: '30%' }}>
                                    <div className="label_frame">
                                        <label htmlFor="Usermail" className="form_input_label required" style={{ fontWeight: 'bold', color: '#333' }}>メールアドレス</label>
                                    </div>
                                </div>
                                <div className="my_column my_right" style={{ width: '70%' }}>
                                    <input
                                        name="mail"
                                        id="Usermail"
                                        value={formData.mail}
                                        onChange={handleInputChange}
                                        className={`required ${errors.mail ? 'border-red-500' : ''}`}
                                        type="email"
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            fontSize: '16px',
                                            backgroundColor: '#fff'
                                        }}
                                    />
                                    {errors.mail && <div className="text-red-500 text-sm mt-1">{errors.mail}</div>}
                                </div>
                            </div>


                            {/* 電話番号 */}
                            <div className="input text input_unit required" style={{ display: 'flex', alignItems: 'flex-start' }}>
                                <div className="my_column my_left" style={{ width: '30%' }}>
                                    <div className="label_frame">
                                        <label htmlFor="Usertel" className="form_input_label required" style={{ fontWeight: 'bold', color: '#333' }}>電話番号</label>
                                    </div>
                                </div>
                                <div className="my_column my_right" style={{ width: '70%' }}>
                                    <input
                                        name="tel"
                                        id="Usertel"
                                        value={formData.tel}
                                        onChange={handleInputChange}
                                        className={`required ${errors.tel ? 'border-red-500' : ''}`}
                                        type="tel"
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            fontSize: '16px',
                                            backgroundColor: '#fff'
                                        }}
                                    />
                                    {errors.tel && <div className="text-red-500 text-sm mt-1">{errors.tel}</div>}
                                </div>
                            </div>


                            {/* お問い合わせ内容について */}
                            <div className="input text input_unit" style={{ display: 'flex', alignItems: 'flex-start' }}>
                                <div className="my_column my_left" style={{ width: '30%' }}>
                                    <div className="label_frame">
                                        <label htmlFor="Userfree5" className="form_input_label" style={{ fontWeight: 'bold', color: '#333' }}>お問い合わせ内容について</label>
                                    </div>
                                </div>
                                <div className="my_column my_right" style={{ width: '70%' }}>
                                    <div className="textarea_frame">
                                        <textarea
                                            name="free5"
                                            id="Userfree5"
                                            value={formData.free5}
                                            onChange={handleInputChange}
                                            className="form_input_input"
                                            cols={30}
                                            rows={5}
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                border: '1px solid #ccc',
                                                borderRadius: '4px',
                                                fontSize: '16px',
                                                backgroundColor: '#fff',
                                                resize: 'vertical'
                                            }}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* お支払い金額 */}

                            {/* 画像認証 */}


                            {/* 確認ボタン */}
                            <div className="submit form_input_submit text-center mt-8">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-12 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:transform-none disabled:cursor-not-allowed text-lg min-w-[200px]"
                                >
                                    {isSubmitting ? '送信中...' : '確認する'}
                                </button>
                            </div>

                            {/* Hidden inputs for external form handler */}
                            <input type="hidden" name="data[User][company]" value={formData.company} />
                            <input type="hidden" name="data[User][name1]" value={formData.name1} />
                            <input type="hidden" name="data[User][name2]" value={formData.name2} />
                            <input type="hidden" name="data[User][free10]" value={formData.free10} />
                            <input type="hidden" name="data[User][mail]" value={formData.mail} />
                            <input type="hidden" name="data[User][tel]" value={formData.tel} />
                            <input type="hidden" name="data[User][free5]" value={formData.free5} />

                            <input type="hidden" id="server_url" value="https://my183p.com/" />

                            {/* ▼リファラ */}
                            <input type="hidden" name="data[User][referer_form_url]" value="" className="UserRefererFormUrl" />
                            <input type="hidden" name="data[User][referer_url]" value="" className="UserRefererUrl" />

                            {/* ▲リファラ */}

                        </form>
                    </div>
                </div>
            </section>

            {/* Privacy */}
            <footer className="relative">
                <div>
                    <img
                        src="/images/landing/pc/privacy.png"
                        alt="privacy"
                        className="h-auto w-full hidden md:block"
                    />
                    <img
                        src="/images/landing/sp/privacy.png"
                        alt="privacy"
                        className="h-auto w-full md:hidden"
                    />
                </div>
            </footer>

            {/* More Section */}
            <section className="max-w-[1154px] mx-auto px-5 pt-6 pb-8 md:px-4 md:py-16" id="jinjai">
                {/* Right Side - Image and CTA */}
                <div className='relative'>
                    <img
                        src="/images/landing/pc/more1.png"
                        alt="もっと見る"
                        className="h-auto w-full hidden md:block"
                    />
                    <img
                        src="/images/landing/sp/more1.png"
                        alt="もっと見る"
                        className="h-auto w-full md:hidden"
                    />
                    <a
                        href="#form"
                        aria-label="申請ボタン"
                        className="absolute bottom-8 md:bottom-18 left-[48%] -translate-x-1/2 md:left-[190px] w-[292px] md:w-[460px] h-[56px] md:h-[100px] bg-[url('/images/landing/CTA-btn.png')] bg-[length:100%_100%] bg-no-repeat bg-center active:scale-95"
                    >
                    </a>
                </div>
            </section>
        </div>
    );
}