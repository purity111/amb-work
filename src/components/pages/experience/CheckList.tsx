import React from 'react';
import Image from 'next/image';

interface CheckListProps {
    items: string[];
}

const CheckList: React.FC<CheckListProps> = ({ items }) => {
    return (
        <div className="w-full">
            {items.map((item, idx) => (
                <div key={idx} className="">
                    <div className="flex items-start py-4">
                        <div className="pt-1 min-w-[24px]">
                            <Image src="/images/experience/check1.png" alt="check" width={20} height={20} />
                        </div>
                        <div className="ml-3 text-[16px] md:text-[18px] font-bold text-left leading-relaxed">
                            {item}
                        </div>
                    </div>
                    <hr className="border-t mb-4 border-[#dfdfdf]" style={{ top: '100%' }} />
                </div>
            ))}
        </div>
    );
};

export default CheckList; 