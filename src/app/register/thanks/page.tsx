import Breadcrumb from '@/components/Breadcrumb';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function RegisterThanksPage() {
  return (
    <>
      <main className="bg-white">
        <div className="h-20 sm:h-30 md:h-75 bg-[#414141]"></div>
        
        {/* Text Content (Left Side - Dark Grey Background) */}
        <div className="w-full max-w-[1200px] m-auto text-white px-4 lg:px-0 md:mb-25">
          <div className="md:text-left md:mr-8 xl:mr-20">
            <div className="h-[30px] md:h-15 w-[3px] bg-green-500 mr-2 md:mt-[-30px] mb-5 md:mb-10"></div>
            <h1 className="text-[26px] md:text-[35px] lg:text-[44px] font-bold text-black mb-2">登録完了</h1>
            <p className="text-[14px] md:text-[18px] text-gray-300 font-bold">Registration Complete</p>
          </div>
        </div>

        {/* Breadcrumb */}
        <Breadcrumb />
        
        <div className="container mx-auto px-4 pb-8 md:pb-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                ご登録ありがとうございます
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                ご入力いただいたメールアドレスに確認メールをお送りしました。
                <br />
                24時間以内にメール内のリンクをクリックして登録を完了してください。
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">登録確認について</h3>
              <p className="text-gray-600 mb-4">
                ご登録いただいた内容は、リユース転職運営事務局で確認いたします。
                確認メールが届かない場合は、迷惑メールフォルダをご確認ください。
              </p>
              <p className="text-gray-600">
                メール内のリンクをクリックしていただくことで、登録が完了いたします。
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg transition-colors duration-300"
              >
                ホームに戻る
              </Link>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 