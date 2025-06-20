import React from 'react';
import Link from 'next/link';
import { pricePlans } from '@/utils/constants';
import { PricePlanData, PricePlanDetail } from '@/utils/types';

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
            <div className="p-4">
                <table className="w-full">
                    <tbody>
                        {plan.details.map((detail: PricePlanDetail, idx: number) => (
                            <tr key={idx}>
                                <th className="text-left py-2 pr-4 align-top w-1/3 font-normal text-gray-700">{detail.label}</th>
                                <td className="py-2 text-green-600" style={{ color: 'green' }}> {/* Default text color for the cell */}
                                    <div className={idx === 1 ? 'text-green-600' : ''}>{detail.value}</div> {/* Apply green color when it's the first plan and second detail */}
                                    {detail.description && (
                                        <div className="text-red-600 text-sm whitespace-pre-line">{detail.description}</div>
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
        <div className="py-16 md:py-24">
            <h2 className="text-xl md:text-2xl font-bold mb-8 text-center">料金プラン</h2>
            <p className="text-center mb-12 text-gray-700">
                求人広告サービスと人材紹介サービスの併用が可能。求人案件・ポジションによって適切な採用手法をご選択いただけます。<br />
                まずはお気軽にお問い合わせください。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {pricePlans.map((plan: PricePlanData, index: number) => (
                    <PricePlanCard key={index} plan={plan} />
                ))}
            </div>
        </div>
    );
} 