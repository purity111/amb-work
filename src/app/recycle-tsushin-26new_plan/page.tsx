"use client";

import { useState, useEffect } from 'react';
import ToInquiryCta from '@/components/pages/ToInquiryCta';
import TestimonialSection from '@/components/TestimonialSection';
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
    const [currentSlide, setCurrentSlide] = useState(0);

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

    // Testimonial slideshow data
    const testimonials = [
        {
            image: "/images/landing/pc/case1.png",
            description1: "吉川商事(吉川質店)様",
            description2: "鑑定士採用",
            sections: [
                {
                    title: "【導入前の課題】",
                    description: "経験者の採用が難しく、未経験者を教育する余力がなかったため即戦力人材が必要だった。大金を扱う業務であるため、信頼できる人材を確保したかったが、これまでは知人や紹介に頼るしかなかった。また、他媒体に広告を出しても高齢者や異業種からの応募が多く、人選に苦労していた。"
                },
                {
                    title: "【導入後の変化】",
                    description: "「リユース転職」を通じて、事前の打ち合わせで希望するスキル・人物像を明確にした上で求人公開したこと、選考の流れについてもアドバイスをもらっていたことから、面接〜内定までの流れがスムーズかつスピーディーになり、人材不足にも迅速に対応できた。通年を通して供給してもらえる体制が整い、急な欠員にも対応可能となった。"
                },
                {
                    title: "【サービスの満足点】",
                    description: "求めるスキルを持つ人材を確実に採用できるため、面接時の負担が軽減された。内定までのスピード感があり、即戦力人材の採用に大きく役立っている。今後、新規プロジェクトにおいても必要なプロフェッショナル人材をお願いしたいと考えている。"
                }
            ]
        },
        {
            image: "/images/landing/pc/case2.png",
            description1: "株式会社ABC様",
            description2: "販売スタッフ採用",
            sections: [
                {
                    title: "【導入前の課題】",
                    description: "一般的な求人広告では応募はあるものの、人材の質にばらつきがあり、即戦力や社風に合う人材との出会いに苦労していた。急成長のフェーズで採用人数を拡大する必要がある一方で、定着面や人材のレベルに不安を抱えていた。"
                },
                {
                    title: "【導入後の変化】",
                    description: "リユース業界に特化した媒体を利用することで、業界に強い関心を持つ応募者が増加。実際に採用した人材は人柄・コミュニケーション力ともに高く、社内にスムーズに定着している。未経験者でも活躍できる人材を確保でき、営業組織の拡大スピードに対応できるようになった。"
                },
                {
                    title: "【サービスの満足点】",
                    description: "リユース業界に精通した担当者が採用課題を深く理解し、親身にサポートしてくれた点が非常に心強かった。応募数よりも「人材の質」を重視する採用が実現でき、期待以上の成果を感じている。柔軟な対応や、今後の提案などもあり、長期的に安心して任せられるパートナーだと感じている。"
                }
            ]
        },
        {
            image: "/images/landing/pc/case3.png",
            description1: "株式会社XYZ様",
            description2: "店舗マネージャー採用",
            sections: [
                {
                    title: "【導入前の課題】",
                    description: "事業拡大を進める中、幅広い職種で人材不足が発生していた。新卒採用を中心に行ってきたが、拡大スピードに対して人員確保が追いつかず、中途採用の必要性が高まっていた。他求人媒体や紹介会社も利用していたが、年齢層のミスマッチや外国籍人材の応募が多く、業務にフィットする人材に出会いにくかった。"
                },
                {
                    title: "【導入後の変化】",
                    description: "「リユース転職」を利用した結果、応募数は少数ながらも業務にマッチした人材を採用することができた。採用者は業界未経験ながら物流系のマネジメント経験を持ち、倉庫業務や入出庫管理など即戦力として活躍可能な人材だった。短期間で採用が決まり、採用効率が大きく改善した。"
                },
                {
                    title: "【サービスの満足点】",
                    description: "業界に特化した媒体のため、もともと関心を持つ応募者が集まりやすく、マッチ度が高い。少数精鋭で応募が来るため、採用担当者の工数を削減でき、スムーズな選考が可能。業界特化の認知度・検索性の高さがあり、「リユース転職」という媒体名自体が求職者の信頼感につながっている。今後も営業職・管理職候補・倉庫系人材など幅広い職種で活用していきたいと考えている。"
                }
            ]
        }
    ];

    // Slideshow navigation handlers
    const handlePrevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    };

    const handleNextSlide = () => {
        setCurrentSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
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
            <div className='bg-[#EDF7FF]'>
                <h2 className='text-[24px] md:text-[38px] text-[#1F86C3] text-center font-bold pt-[40px] md:pt-[100px]'>導入事例</h2>
                <div className="max-w-[1153px] mx-auto relative px-10 md:px-0 pt-[30px] md:pt-[88px] pb-[40px] md:pb-[175px]">
                    {/* Previous Button */}
                    <button
                        onClick={handlePrevSlide}
                        className="absolute cursor-pointer top-[100px] md:top-[240px] left-7 md:left-[-22px] w-[29px] md:w-18 h-[29px] md:h-18 bg-[#1F86C3] rounded-full flex items-center justify-center text-white hover:bg-[#0F5A8A] transition-colors z-10"
                        aria-label="前のスライド"
                    >
                        <svg className="w-6 md:w-15 h-6 md:h-15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Next Button */}
                    <button
                        onClick={handleNextSlide}
                        className="absolute cursor-pointer top-[100px] md:top-[240px] right-7 md:right-[-22px] w-[29px] md:w-18 h-[29px] md:h-18 bg-[#1F86C3] rounded-full flex items-center justify-center text-white hover:bg-[#0F5A8A] transition-colors z-10"
                        aria-label="次のスライド"
                    >
                        <svg className="w-6 md:w-15 h-6 md:h-15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Testimonial Slides */}
                    <div className="relative overflow-hidden">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {testimonials.map((testimonial, index) => (
                                <div key={index} className="w-full flex-shrink-0">
                                    <TestimonialSection
                                        image={testimonial.image}
                                        description1={testimonial.description1}
                                        description2={testimonial.description2}
                                        sections={testimonial.sections}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Slide Indicators */}
                    <div className="flex justify-center gap-2 mt-8">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-3 h-3 rounded-full transition-all ${currentSlide === index
                                        ? 'bg-[#1F86C3] w-8'
                                        : 'bg-[#1F86C3]/30 hover:bg-[#1F86C3]/50'
                                    }`}
                                aria-label={`スライド ${index + 1} に移動`}
                            />
                        ))}
                    </div>
                </div>
            </div>



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