import ReactPaginate from "react-paginate";

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
    return (
        <ReactPaginate
            breakLabel="..."
            nextLabel="Next >"
            onPageChange={(event) => onPageChange(event.selected + 1)}
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            pageCount={totalPages}
            forcePage={page - 1}
            previousLabel="< Prev"
            containerClassName="flex items-center space-x-2"
            pageClassName="border px-3 py-1 rounded border-gray-700 cursor-pointer hover:bg-gray-700"
            activeClassName="bg-blue text-white"
            previousClassName="px-3 py-1 rounded bg-gray-700 cursor-pointer hover:bg-gray-300 hover:text-white"
            nextClassName="px-3 py-1 rounded bg-gray-700 cursor-pointer hover:bg-gray-300 hover:text-white"
            breakClassName="px-3 py-1"
        />
    );
}