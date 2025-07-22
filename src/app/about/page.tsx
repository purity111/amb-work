"use client";
import Breadcrumb from '@/components/Breadcrumb';
import Footer from '@/components/Footer';
import JobSupportFeatureList from '@/components/JobSupportFeatureList';
import Image from 'next/image';
import React, { useEffect } from 'react';

const AboutPage: React.FC = () => {
  useEffect(() => {
    document.title = 'リユース転職サービス';
  }, []);

  return (
    <>
      <main>
        <div className="h-20 sm:h-30 md:h-75 bg-[#414141]"></div>
        {/* Text Content (Left Side - Dark Grey Background) */}
        <div className="w-full max-w-[1200px] m-auto text-white px-4 lg:px-0 md:mb-25">
          <div className="md:text-left md:mr-8 xl:mr-20">
            <div className="h-[30px] md:h-15 w-[3px] bg-green-500 mr-2 md:mt-[-30px] mb-5 md:mb-10"></div>
            <h1 className="text-[26px] md:text-[35px] lg:text-[44px] font-bold text-black mb-2">リユース転職とは</h1>
            <p className="text-[14px] md:text-[18px] text-gray-300 font-bold">What is a career change?</p>
          </div>
        </div>

        <div className="w-full my-10 sm:my-[50px] md:my-0 md:w-1/2 relative bg-white h-[160px] sm:h-[250px] md:h-[350px] flex justify-end rounded-tl-[50px] sm:rounded-tl-[80px] md:rounded-tl-[100px] overflow-hidden md:absolute md:right-0 md:top-[180px]">
          <Image
            src="/images/about/banner.jpg"
            alt="資格バナー"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Breadcrumb */}
        <Breadcrumb />
        <div className="pb-[30px] md:pb-[60px] text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-9 text-center relative inline-block mx-auto job-openings">
            サービスの特徴
          </h2>
          <p className='text-center text-[14px] text-gray-600 font-sans'>SERVICE FEATURES</p>
        </div>

        <div className="flex flex-col-reverse md:flex-row justify-start gap-[5%] pt-5">
          <div className="w-[90%] md:w-[45%] my-10 md:my-0 relative aspect-[1.175/1]">
            <Image
              src='/images/about/about1.jpg'
              alt="シンプルイラスト"
              fill
              className="object-contain rounded-tr-[100px]"
            />
          </div>
          <div className="mx-[15px] sm:max-w-[400px] lg:max-w-[450px] xl:max-w-[600px] relative">
            <h2 className='relative z-20 text-[24px] md:text-[30px] lg:text-[38px] font-bold w-full'>
              リユース転職とは
            </h2>
            <div className="absolute top-[-20px] z-10 -translate-y-1/2 right-0 max-w-[298px] h-auto relative aspect-[23/10]">
              <Image
                src='/images/about/about_text.png'
                alt="シンプルイラスト"
                fill
                className="object-contain rounded-[30px]"
              />
            </div>
            <p className='text-[#65B729] font-semibold text-sm md:text-base mt-[-60px] md:mt-[-40px]'>リユース転職は、国内唯一のリユース、リサイクル、買取業界専門のトータルキャリア支援サービスです。</p>
            <p className='text-sm md:text-base leading-[1.8]'>
              <br />リユース、リサイクル、買取業界にどのような業界特性があり、どのような仕事があるのか、まだまだ知られていないことが多いのが現状です。<br /><br />
              例えば、<br />
              鑑定士のキャリアビジョンや具体的なスキルアップ方法について<br />
              ニッチな取り扱い商材の求人案件など<br />
              それらは自分で情報を集めることが難しいです<br /><br />
              リユース転職には業界出身のキャリアアドバイザーが在籍しています。<br /><br />
              そのため、<br />
              ・最新の市場動向や求人情報　「業界を知る」<br />
              ・キャリアアップのために必要なスキル　「仕事・スキルを知る」<br />
              ・業界の経営者・人事の声　「インタビュー」<br />
              ・転職成功者の声　「インタビュー」<br />
              といった業界に特化したリアルな情報をわかりやすくお伝えすることができます。<br /><br />
              志望動機の書き方のコツなどの転職ノウハウも「コラム」からご覧いただけます。
            </p>
          </div>
        </div>

        <div className="pt-15 md:pt-30 pb-[30px] md:pb-[60px] text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-9 text-center relative inline-block mx-auto job-openings">
            求人情報サービスとは
          </h2>
          <p className='text-center text-[14px] text-gray-600 font-sans'>WHAT IS A JOB INFORMATION SERVICE?</p>
        </div>

        <div className="max-w-[960px] mx-3 md:mx-auto">
          <div className="w-full relative aspect-[12/5]">
            <Image
              src='/images/about/about2.jpg'
              alt="シンプルイラスト"
              fill
              className="object-contain rounded-[30px]"
            />
          </div>
          <p className='text-sm md:text-base mt-10'>
            リユース・リサイクル・買取業界に特化した求人情報を多数取り扱っています。<br />
            求人の応募ボタンから、企業の採用担当者に直接応募することができます。<br />
            その後、企業から直接の連絡がきます。<br /><br />
            その後のやり取り、スケジューリング、情報収集、採用手続きまですべてご自身で完結していただきます。<br /><br />
            転職支援サービスに比べると、コンサルタントによる細やかなサポートはありませんが、求人企業数、職種、雇用形態などの幅も広く、豊富な条件検索方法であなたに合う求人を検索できます。<br /><br />
            気になる求人を見つけたら「お気に入り保存」も可能です。<br />
            マイページからお気に入り保存した求人や、応募した求人の状況を確認することができます。<br /><br />
            ＜注意事項＞<br /><br />
            ※1.ご自身で応募される際にサイト上で入力した情報は、送信ボタンを押すと求人企業の採用担当者へ直接送信されます。送信ボタンを押すことで、上記についてご本人の同意があるものとします。<br /><br />
            ※2.求人内容や応募結果についてのお問い合わせは求人企業へ直接ご連絡ください。リユース転職では申し込みの訂正・削除などはお受けいたしかねますので予めご了承ください。<br /><br />
          </p>
        </div>

        <div className="pt-15 pb-[30px] md:pb-[60px] text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-9 text-center relative inline-block mx-auto job-openings">
            転職支援サービスとは
          </h2>
          <p className='text-center text-[14px] text-gray-600 font-sans'>WHAT IS THE JOBCHANGE SERVICE?</p>
        </div>

        <div className="max-w-[960px] mx-3 md:mx-auto">
          <div className="w-full relative aspect-[1.77/1] mb-15 border-[5px] border-[#dfdfdf]">
            <Image
              src='/images/about/figure.png'
              alt="シンプルイラスト"
              fill
              className="object-contain py-[50px] px-[80px]"
            />
          </div>
          <p className='text-sm md:text-base'>
            人材を募集している企業様の求人と、転職を希望している方を適切につなぎ、選考～入社までフォローアップします。<br />
            まずはご要望やお悩みをお聞かせいただきます（お電話orオンライン）。<br />
            その上で、必要な求人情報を提供し、キャリアに関するアドバイスを行っていきます。<br />
            ※ご紹介の求人案件には「非公開案件」も含みます。<br /><br />
            企業の経営者や人事に対して、企業の特徴や組織の現状や将来ビジョンを直接聞いているため、求人票上にはない情報もご提供することができます。<br /><br />
            選考通過率を上げるための書類の添削や面接アドバイスも丁寧に行います。<br />
            ご相談の申込から転職完了・入社まで、全て無料のサービスとなっています。情報収集や相談だけでも問題ありません。<br />
            まずはキャリア相談をお気軽にお申込みください。<br /><br />
            ＜注意事項＞<br />
            ※取扱い求人の状況によっては、面談や求人紹介などサービスのご提供が難しい場合もありますので予めご了承ください。<br /><br />
          </p>
          <div className="rounded-tr-[50px] md:rounded-tr-[100px] px-5 py-10 md:p-15 border border-[#dfdfdf]">
            <div className="pb-[20px] md:pb-[40px] text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-9 text-center relative inline-block mx-auto job-openings">
                リユース転職の<span className='text-[#65B729]'>12</span>の特徴
              </h2>
            </div>
            <JobSupportFeatureList />
          </div>
        </div>

        <div className="bg-[#f3f3f3] w-full py-[50px] md:py-[100px] mt-[300px] md:mt-[500px]">
          <div className="max-w-[960px] mx-3 md:mx-auto mt-[-350px] md:mt-[-600px]">
            <div className="pb-[30px] md:pb-[60px] pt-15 md:pt-25 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-9 text-center relative inline-block mx-auto job-openings">
                なぜ転職支援サービスを利用するのか
              </h2>
              <p className='text-center text-[14px] text-gray-600 font-sans'>WHY USE THE JOBCHANGE SUPPORT SERVICE?</p>
            </div>
            <div className="w-full relative aspect-[12/5] mb-15">
              <Image
                src='/images/about/about_img02.jpg'
                alt="シンプルイラスト"
                fill
                className="object-contain rounded-2xl"
              />
            </div>
            <div className="text-sm md:text-base mt-5 leading-[1.8]">
              <p>
                世の中にはたくさん求人情報が流れています。<br />
                インターネットで検索すれば、大手求人サイトや求人検索エンジンが求人情報を提供してます。<br />
                では、そのような中で、なぜ多くの人が転職の際に転職支援サービスを活用して転職をしているのでしょうか。<br />
                <strong>転職支援サービスを利用する3つのメリットをまとめてみました。</strong>
              </p>
              <hr className='bg-[#dfdfdf] border-[#dfdfdf] h-[1px] w-full my-12' />
              <div className='font-semibold flex items-center'>
                <h5 className='text-[26px] md:text-[30px] text-[#65B729]'>01.　</h5>
                <h5 className='text-[16px] md:text-[22px]'>キャリアの相談ができる</h5>
              </div>
              <p className='pt-5'>
                自分の頭で考えているより、だれかと話すことで、自分の強み・魅力やキャリアの方向性・進むべき道が整理されたり、新しく見つかることがあります。その結果、転職せずに今の職場で頑張るという道になることもあるかもしれません。<br /><br />
                転職するしないに関わらず、キャリアのことについて話をする。その相手がキャリアカウンセラー、キャリアコンサルタント、キャリアアドバイザーです。人の話を聴く技術を持ち、キャリアや業界に関する情報を知っているプロなので、安心して相談できます。<br /><br />
                転職支援サービス会社には、そのようなキャリアコンサルタントがいることが多いため、まずは、キャリアコンサルタントに相談をすることで、転職に関する情報を整理することができます。
              </p>
              <hr className='bg-[#dfdfdf] border-[#dfdfdf] h-[1px] w-full my-12' />

              <div className='font-semibold flex items-center'>
                <h5 className='text-[26px] md:text-[30px] text-[#65B729]'>02.　</h5>
                <h5 className='text-[16px] md:text-[22px]'>自分だけでは知り得なかった情報を手にすることができる</h5>
              </div>
              <p className='pt-5'>
                インターネット上や求人サイト上に載っている求人は公開案件と呼ばれています。反対に、非公開案件とは転職支援サービスのみが持っている情報なので、個人ではなかなか見つけられません。転職支援サービスに相談したからこそ出会える求人があります。<br /><br />
                また、インターネット上には載っていない業界や求人企業に関する情報も提供しています。企業の経営者や人事担当者から企業の特徴・現状・ニーズ・将来性の話を聞いているため、転職希望者様のご要望・お悩みに、より的確に応えられます。<br /><br />
                また、入社後に、待遇面や職場環境、仕事内容が違うということが防げます。
              </p>
              <hr className='bg-[#dfdfdf] border-[#dfdfdf] h-[1px] w-full my-12' />

              <div className='font-semibold flex items-center'>
                <h5 className='text-[26px] md:text-[30px] text-[#65B729]'>03.　</h5>
                <h5 className='text-[16px] md:text-[22px]'>あなたの転職を一緒に伴走してくれる</h5>
              </div>
              <p className='pt-5'>履歴書・職務経歴書の書き方から、企業ごとの面接対応、待遇面などの条件交渉などのアドバイスを随時受けることができます。 さらには、入社日からその後の様子までフォローします。必要に応じてキャリアの相談に応じることができるため、あなたのキャリアのサポーターとなってくれます。</p>
              <hr className='bg-[#dfdfdf] border-[#dfdfdf] h-[1px] w-full mt-12' />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AboutPage; 