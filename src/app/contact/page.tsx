import Breadcrumb from '@/components/Breadcrumb';
import ContactForm from '@/components/common/ContactForm';
import Footer from '@/components/Footer';
import Image from 'next/image';

export default function ContactPage() {
  return (
    <>
      <main className="bg-white">
        <div className="h-20 sm:h-30 md:h-75 bg-[#414141]"></div>
        {/* Text Content (Left Side - Dark Grey Background) */}
        <div className="w-full max-w-[1200px] m-auto text-white px-4 lg:px-0 md:mb-25">
          <div className="md:text-left md:mr-8 xl:mr-20">
            <div className="h-[30px] md:h-15 w-[3px] bg-green-500 mr-2 md:mt-[-30px] mb-5 md:mb-10"></div>
            <h1 className="text-[26px] md:text-[35px] lg:text-[44px] font-bold text-black mb-2">お問い合わせ</h1>
            <p className="text-[14px] md:text-[18px] text-gray-300 font-bold">Contact</p>
          </div>
        </div>

        <div className="pl-4">
          <div className="w-full my-10 sm:my-[50px] md:my-0 md:w-1/2 relative bg-white h-[160px] sm:h-[250px] md:h-[350px] flex justify-end rounded-tl-[50px] sm:rounded-tl-[80px] md:rounded-tl-[100px] overflow-hidden md:absolute md:right-0 md:top-[180px]">
            <Image
              src="/images/column/top.jpg"
              alt="Column Page Top"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        </div>

        {/* Breadcrumb */}
        <Breadcrumb />
        <div className="pb-[30px] md:pb-[60px] text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-9 text-center relative inline-block mx-auto job-openings">
            お問い合わせフォーム
          </h2>
          <p className='text-center text-[14px] text-gray-600 font-sans'>CONTACT FORM</p>
        </div>
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
