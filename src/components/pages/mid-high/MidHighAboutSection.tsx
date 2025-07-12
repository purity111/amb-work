import React from "react";
import Image from "next/image";
import RedRegisterButton from "./RedRegisterButton";

const aboutData = [
    { label: "中心年齢", value: "30歳代から40歳代後半" },
    { label: "年収分布", value: "600万円〜1500万円以上" },
    { label: "企業規模", value: "リユース大企業、スタートアップ成長企業、業績の良い中堅企業" },
    { label: "職種", value: "経営者、事業責任者、新規事業立ち上げ、人事・経理・IT等専門職、シニアバイヤー、店舗統括、営業責任者、海外事業" },
];

const MidHighAboutSection: React.FC = () => {
    return (
        <section className="relative w-full flex flex-col items-center pt-8 md:pt-24 pb-8 md:pb-24 px-2 md:px-0">
            {/* Top-right rounded background */}
            <div className="absolute m-auto top-0 right-0 w-[80%] h-[640px] md:h-[540px] bg-[#f5f5f5] rounded-tl-[120px] md:max-w-[1200px] md:rounded-tl-[200px] z-0" style={{ maxWidth: '1200px' }} />
            {/* Title and underline */}
            <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">
                <h2 className="text-2xl md:text-3xl font-bold text-[#222] mb-2">ミドル・ハイクラス転職とは</h2>
                <div className="flex items-center">
                    <span className="block w-6 h-1 bg-[#22305A] rounded rounded-tr-0 rounded-br-0" />
                    <span className="block w-6 h-1 bg-[#A08B53] rounded rounded-tr-0 rounded-br-0" />
                </div>
            </div>
            {/* Main content: image and info */}
            <div className="relative z-10 w-full max-w-6xl gap-8 md:gap-20 mt-15 md:mt-8">
                {/* Image */}
                <div className="flex flex-col md:flex-row items:center justify-center">
                    <div className="w-full mx-auto md:mx-0 max-w-[300px] sm:max-w-[360px] md:max-w-[420px] aspect-[1.5/1] rounded-tl-[60px] rounded-bl-[60px] rounded-tr-[32px] rounded-br-[32px] overflow-hidden bg-white shadow-md md:ml-[-60px] md:z-10">
                        <Image
                            src="/images/mid-high/about.png"
                            alt="ミドル・ハイクラス転職とは"
                            width={420}
                            height={300}
                            className="object-cover w-full h-full"
                            priority
                        />
                    </div>
                    {/* Info Table and Button */}
                    <div className="flex-1 w-full flex flex-col justify-center items-start md:items-start mt-8 md:mt-0 md:pl-8">
                        <dl className="space-y-3 mb-8 w-full max-w-2xl">
                            {aboutData.map((item) => (
                                <div key={item.label} className="flex text-sm md:text-base w-full">
                                    <dt className="w-24 md:w-32 font-bold text-[#22305A] flex-shrink-0 text-right md:text-left">{item.label}　：</dt>
                                    <dd className="ml-4 text-[#222]">{item.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
                <div className="m-auto flex justify-center mt-10">
                    <RedRegisterButton label="無料登録はこちら">
                        無料登録して求人情報を見る
                    </RedRegisterButton>
                </div>
            </div>
        </section>
    );
};

export default MidHighAboutSection; 