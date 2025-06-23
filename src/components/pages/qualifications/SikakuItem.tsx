import Image from "next/image";
import React from "react";
import { SikakuItemProps } from "@/utils/types";

export default function SikakuItem({
    id,
    number,
    title,
    subtitle,
    image,
    description,
    order_title,
    order_content,
    order_desc,
    table,
    recommend,
    notes,
}: SikakuItemProps) {
    return (
        <section className="max-w-[960px] w-[90%] lg:w-full mx-auto my-12 bg-white rounded-tr-[80px] overflow-hidden" id={id}>
            <div className="px-[15px] sm:px-[40px] md:px-[90px] py-10 md:py-15">
                <div className="text-center mb-6">
                    <div className="text-[#65B729] font-bold text-[30px] mb-1">― {number} ―</div>
                    <h2 className="text-[28px] font-bold mb-1">{title}</h2>
                    <div className="text-[14px]">{subtitle}</div>
                </div>
                <div className="w-full flex-shrink-0">
                    <div className="relative w-full lg:w-[85%] mx-auto my-10 aspect-[5/3] rounded-lg overflow-hidden">
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-contain"
                            size s="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                    </div>
                </div>
                <p className="w-full text-sm md:text-base leading-[2] mb-[30px]">
                    {description}
                </p>
                <p className="text-sm md:text-base">{order_title}</p>
                {order_content && <p className="text-sm md:text-base p-[30px] font-bold md:p-[45px] my-10 whitespace-pre-line leading-[1.8] bg-[#f3f3f3] font-medium">{order_content}</p>}
                <p className="text-sm md:text-base leading-[1.8]">{order_desc}</p>
                <div className="overflow-x-auto mb-6">
                    <table className="min-w-[300px] w-full text-left border border-[#e5e5e5] text-sm md:text-base">
                        <tbody>
                            {table.map((row, idx) => (
                                <tr key={idx} className={idx !== table.length - 1 ? "border-b border-[#e5e5e5]" : ''}>
                                    <th className="bg-gray-50 !p-2 !md:px-4 !md:py-6 font-medium w-32 md:w-40">{row.label}</th>
                                    <td className="!p-2 !md:px-4 !md:py-6">{row.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="bg-[#f6fff2] border-l-4 border-[#65B729] p-4 mb-6 rounded">
                    <div className="font-bold text-[#65B729] mb-10 text-[17px]">このような方にオススメ</div>
                    <ul className="list-disc list-inside text-sm md:text-base">
                        {recommend.map((item, idx) => (
                            <li key={idx} className="text-sm md:text-base leading-[2] whitespace-pre-line">{item}</li>
                        ))}
                    </ul>
                </div>
                {notes && (
                    <div className="text-sm md:text-base leading-[1.8]">
                        {notes}
                    </div>
                )}
            </div>
        </section>
    );
}
