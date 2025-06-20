import React from 'react';
import Link from 'next/link';
import { pricePlans } from '@/utils/constants';
import { PricePlanData } from '@/utils/types';

function PricePlanCard({ plan }: { plan: PricePlanData }) {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Top green section */}
            <div className="bg-green px-6 py-4 text-white text-center">
                <p className="text-sm font-bold mb-1 bg-white px-3 py-1 text-green inline-block">{plan.planTitle}</p>
                <h3 className="text-xl font-bold mb-1">{plan.title}</h3>
                <p className="text-sm">{plan.subtitle}</p>
            </div>

            {/* Bottom details section */}
            <div className="p-6">
                <table className="w-full">
                    <tbody>
                        {plan.details.map((detail, idx) => (
                            <tr key={idx}>
                                <th className="text-left py-2 pr-4 align-top w-1/3 font-normal">{detail.label}</th>
                                <td className="py-2">
                                    <div>{detail.value}</div>
                                    {detail.description && (
                                        <div className="text-sm whitespace-pre-line">{detail.description}</div>
                                    )}
                                    {detail.link && (
                                        <Link href={detail.link.href} className="text-blue-600 hover:underline text-sm">
                                            {detail.link.text}
                                        </Link>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default function PricePlan() {
    return (
        <div className="py-16 md:py-24 bg-[#FFFBA8]">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-8 xl:px-0">
                <p className="text-center pb-2">Rate Plans</p>
                <h2 className="text-[26px] md:text-[34px] lg:text-[40px] font-bold mb-15 text-center">料金プラン</h2>
                <p className="text-center mb-12">
                    求人広告サービスと人材紹介サービスの併用が可能。<br />
                    求人案件・ポジションによって適切な採用手法をご選択いただけます。<br />
                    まずはお気軽にお問い合わせください。
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {pricePlans.map((plan, index) => (
                        <PricePlanCard key={index} plan={plan} />
                    ))}
                </div>
            </div>
        </div>
    );
} 