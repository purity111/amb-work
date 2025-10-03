import React from 'react';

interface TestimonialCardProps {
    companyName?: string;
    position?: string;
    challenges?: string;
    changes?: string;
    satisfaction?: string;
    className?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
    companyName = "株式会社○○○○様",
    position = "鑑定士職採用",
    challenges = "これまでは一般的な求人サイトを使っていましたが、応募が来ても経験者が少なく、求めるスキルを持つ人材との出会いに苦労していました。",
    changes = "貴サービスを利用したところ、業界に強い関心を持つ方からの応募が格段に増えました。おかげさまで、求めるスキルを持つ鑑定士を無事に採用でき、採用単価も抑えることができました。入社後の定着率も高く、満足しています。",
    satisfaction = "担当の方がリユース業界に詳しく、私たちの採用課題を深く理解してくれた点が良かったです。原稿作成からサポートしていただき、非常に助かりました。",
    className = ""
}) => {
    return (
        <div className={`bg-white border-[#1F86C3] relative border rounded-lg shadow-lg p-[22px] pt-[42px] md:pl-[62px] md:pr-[75px] md:pt-[117px] md:pb-[65px] max-w-[1153px] mx-auto ${className}`}>
            {/* Header with avatar and company info */}
            <div className="flex flex-col md:flex-row items-start md:items-center bg-[#1F86C3] pl-[83px] md:pl-[257px] text-white p-2 md:p-4 rounded-r-[50px] w-[300px] md:w-[778px] h-[47px] md:h-[94px] flex items-center absolute -translate-y-[50%] -top-0 -left-[1px]">
                <div className="font-semibold text-[14px] md:text-[25px] leading-none">{companyName}</div>
                <div className="text-[11px] md:text-[20px] pl-0 md:pl-10 font-bold">{position}</div>
            </div>
            <div className="absolute -translate-y-[50%] -top-0 left-[6px] md:left-[34px] w-[60px] md:w-[162px] h-[60px] md:h-[162px] border-[1px] md:border-[4px] border-[#1F86C3] bg-white rounded-full flex items-center justify-center mr-4">
                <svg
                    className="w-[56px] md:w-[140px] h-[56px] md:h-[140px] text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
            </div>

            {/* Content sections */}
            <div className="space-y-6">
                {/* Challenges section */}
                <div>
                    <h3 className="font-bold text-center md:text-left text-[#186DAD] text-[15px] md:text-[25px] mb-2">【導入前の課題】</h3>
                    <p className="pl-0 md:pl-[15px] font-bold text-[14px] md:text-base leading-relaxed">{challenges}</p>
                </div>

                {/* Divider */}
                <hr className="border-[#D9D7D7] hidden md:block" />
                <hr className="border-dashed font-bold border-[1px] md:hidden" />

                {/* Changes section */}
                <div>
                    <h3 className="font-bold text-center md:text-left text-[#186DAD] text-[15px] md:text-[25px] mb-2">【導入後の変化】</h3>
                    <p className="pl-0 md:pl-[15px] font-bold text-[14px] md:text-base leading-relaxed">{changes}</p>
                </div>

                {/* Divider */}
                <hr className="border-[#D9D7D7]" />

                {/* Satisfaction section */}
                <div>
                    <h3 className="font-bold text-center md:text-left text-[#186DAD] text-[15px] md:text-[25px] mb-2">【サービスの満足点】</h3>
                    <p className="pl-0 md:pl-[15px] font-bold text-[14px] md:text-base leading-relaxed">{satisfaction}</p>
                </div>
            </div>
        </div>
    );
};

export default TestimonialCard;
