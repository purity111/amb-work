"use client";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import React from "react";

const businessImages = [
  "/images/business/back1.jpg",
  "/images/business/back2.jpg",
  "/images/business/back3.jpg",
  "/images/business/back4.png",
  "/images/business/back5.jpg",
];

export default function BusinessPage() {
  return (
    <>
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="h-20 sm:h-30 md:h-75 bg-[#414141]"></div>
        <div className="w-full max-w-[1200px] m-auto text-white px-4 lg:px-0 md:mb-25">
          <div className="md:text-left md:mr-8 xl:mr-20">
            <div className="h-[30px] md:h-15 w-[3px] bg-green-500 mr-2 md:mt-[-30px] mb-5 md:mb-10"></div>
            <h1 className="text-[26px] md:text-[35px] lg:text-[44px] font-bold text-black mb-2">リユース業界について知る</h1>
            <p className="text-[14px] md:text-[18px] text-gray-300 font-bold">About the Reuse Industry</p>
          </div>
        </div>
        <div className="pl-4">
          <div className="w-full my-10 sm:my-[50px] md:my-0 md:w-1/2 relative bg-white h-[160px] sm:h-[250px] md:h-[350px] flex justify-end rounded-tl-[50px] sm:rounded-tl-[80px] md:rounded-tl-[100px] overflow-hidden md:absolute md:right-0 md:top-[180px]">
            <Image
              src="/images/business/top.jpg"
              alt="Business Top"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        </div>
        {/* Breadcrumb */}
        <Breadcrumb />

        {/* About Section */}
        <section className="max-w-[1200px] mx-auto px-4 lg:px-0 py-12">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2 w-full">
              <Image
                src="/images/business/about.jpg"
                alt="About Business"
                width={600}
                height={400}
                className="rounded-lg object-cover w-full h-auto"
                priority
              />
            </div>
            <div className="md:w-1/2 w-full">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">リユース業界とは</h2>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                {/* Placeholder: Replace with actual content from the reference site */}
                リユース業界は、資源の有効活用や環境保護の観点から注目されている成長産業です。中古品の買取・販売、リサイクル、修理など多様なビジネスモデルが存在し、持続可能な社会の実現に貢献しています。
              </p>
            </div>
          </div>
        </section>

        {/* Background Images Section */}
        <section className="max-w-[1200px] mx-auto px-4 lg:px-0 py-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-900">業界の背景</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {businessImages.map((src, idx) => (
              <div key={src} className="w-full aspect-[4/3] relative rounded-lg overflow-hidden shadow">
                <Image
                  src={src}
                  alt={`Business Background ${idx + 1}`}
                  fill
                  className="object-cover object-center"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Climate Section */}
        <section className="max-w-[1200px] mx-auto px-4 lg:px-0 py-12 flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/2 w-full order-2 md:order-1">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">環境への影響</h2>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              {/* Placeholder: Replace with actual content from the reference site */}
              リユースは廃棄物の削減やCO2排出量の抑制に寄与し、循環型社会の実現に不可欠な役割を果たしています。
            </p>
          </div>
          <div className="md:w-1/2 w-full order-1 md:order-2">
            <Image
              src="/images/business/climate.jpg"
              alt="Climate Impact"
              width={600}
              height={400}
              className="rounded-lg object-cover w-full h-auto"
            />
          </div>
        </section>

        {/* Existence Section */}
        <section className="max-w-[1200px] mx-auto px-4 lg:px-0 py-12 flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/2 w-full">
            <Image
              src="/images/business/exist.jpg"
              alt="Existence"
              width={600}
              height={400}
              className="rounded-lg object-cover w-full h-auto"
            />
          </div>
          <div className="md:w-1/2 w-full">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">リユース業界の存在意義</h2>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              {/* Placeholder: Replace with actual content from the reference site */}
              資源循環や環境保護、経済的なメリットなど、リユース業界は多方面で社会に貢献しています。
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

