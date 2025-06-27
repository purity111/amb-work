import Link from "next/link";
import { SikakuOrderItemProps } from "@/utils/types";

export default function SikakuOrderItem({ number, title, link }: SikakuOrderItemProps) {
    return (
        <div className="">
            <Link href={link || "#"} className="items-center flex justify-between border-[#dfdfdf] border-b-1 mt-5 gap-2">
                <div className="flex items-center justify-center gap-3">
                    <div className="text-[#65B729] text-[26px] md:text-[30px] font-bold">{number}</div>
                    <h5 className="text-base md:text-[18px] font-semibold">{title}</h5>
                </div>
                <div className="flex justify-center my-4">
                    <svg width="24" height="24" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 13.5L16 21.5L24 13.5" stroke="#222" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </Link>
        </div>
    );
} 