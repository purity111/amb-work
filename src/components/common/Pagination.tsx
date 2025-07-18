import ReactPaginate from "react-paginate";
import { useEffect, useState } from "react";

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
    const [isSP, setIsSP] = useState(false);

    useEffect(() => {
        const checkSP = () => setIsSP(window.innerWidth < 768);
        checkSP();
        window.addEventListener("resize", checkSP);
        return () => window.removeEventListener("resize", checkSP);
    }, []);

    return (
        <ReactPaginate
            breakLabel="..."
            nextLabel={isSP ? ">" : "次へ >"}
            onPageChange={(event) => onPageChange(event.selected + 1)}
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            pageCount={totalPages}
            forcePage={page - 1}
            previousLabel={isSP ? "<" : "< 前へ"}
            containerClassName="flex items-center space-x-2"
            pageLinkClassName="border border-[#dfdfdf] px-2 py-1 cursor-pointer hover:bg-gray-700"
            activeLinkClassName="bg-blue text-white"
            previousClassName="px-3 py-1 rounded bg-gray-700 cursor-pointer hover:bg-gray-300 hover:text-white"
            nextClassName="px-3 py-1 rounded bg-gray-700 cursor-pointer hover:bg-gray-300 hover:text-white"
            breakClassName="px-3 py-1"
        />
    );
}