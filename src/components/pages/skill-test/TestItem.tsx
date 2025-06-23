import Image from "next/image";
import React, { useState } from "react";

interface TestItemProps {
    order: number
    imgUrl: string;
}

export default function TestItem({ order, imgUrl }: TestItemProps) {
    const [selected, setSelected] = useState<null | 'maru' | 'batsu'>(null);
    return (
        <div className="">
            <div className="text-base md:text-[20px] font-medium flex justify-start items-center">
                <span className="text-[#65B729] border border-[#65B729] px-[15px] py-[6px] rounded-lg mr-8">Q{order}</span>
                <h5>正規品なら〇、模倣品なら×のボタンを押してください　[ブランド品]</h5>
            </div>
            <div className="my-5 md:my-8 relative aspect-[5/3] w-[90%] sm:w-[80%] m-auto mb-4">
                <Image
                    src={imgUrl}
                    alt="シンプルイラスト"
                    fill
                    className="object-contain"
                />
            </div>
            <div className="flex justify-center space-x-8">
                <button
                    className={`
                        w-[50px] cursor-pointer h-[50px] text-[23px] rounded-lg text-white border border-b-[3px] transition-colors
                        ${selected === 'maru'
                            ? 'bg-[#65B729] border-[#4d911a]'
                            : 'bg-[#838383] border-[#6c5f5f] hover:bg-[#65B729] hover:border-[#4d911a]'}
                    `}
                    onClick={() => setSelected(selected === 'maru' ? null : 'maru')}
                >○</button>
                <button
                    className={`
                        w-[50px] cursor-pointer h-[50px] text-[23px] rounded-lg text-white border border-b-[3px] transition-colors
                        ${selected === 'batsu'
                            ? 'bg-[#65B729] border-[#4d911a]'
                            : 'bg-[#838383] border-[#6c5f5f] hover:bg-[#65B729] hover:border-[#4d911a]'}
                    `}
                    onClick={() => setSelected(selected === 'batsu' ? null : 'batsu')}
                >×</button>
            </div>
            <hr className="border border-t-1 border-b-0 border-[#DFDFDF] w-full my-15" />
        </div>
    );
} 