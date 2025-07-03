'use client'

import Breadcrumb from '@/components/Breadcrumb';
import ColumnCard from '@/components/ColumnCard';
import { useGetColumns } from '@/hooks/useGetColumns';
import { useAuth } from '@/hooks/useAuth';
import Pagination from '@/components/common/Pagination';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';

export default function ColumnPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [tempSearch, setTempSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [limit] = useState(12);
    const [columns, setColumns] = useState<any[]>([]);
    const { profile } = useAuth();
    const router = useRouter();

    const { data: response, isLoading } = useGetColumns({
        page: currentPage,
        limit,
        searchTerm: searchTerm || undefined
    });

    useEffect(() => {
        if (response) {
            setColumns(response?.ColumnItems || [0]);
            setTotalPage(response?.pagination?.totalPages || 1);
        }
    }, [response, limit]);
    useEffect(() => {
        // console.log('response', response.data);
    }, [response])
    useEffect(() => {
        const params = new URLSearchParams();
        params.set('page', currentPage.toString());
        params.set('limit', limit.toString());
        params.set('searchTerm', searchTerm);
        router.push(`?${params.toString()}`);
    }, [currentPage, limit, searchTerm, router]);

    // Check if user is admin or subadmin
    const isAdmin = profile?.role === 'admin' || profile?.role === 'subadmin';

    const onPageChange = (page: number) => {
        setCurrentPage(page);
    };

    const onChangeSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTempSearch(e.target.value);
    };

    const onConfirmSearchTerm = () => {
        setSearchTerm(tempSearch);
    };

    return (
        <>
            <main className="bg-white">
                <div className="h-20 sm:h-30 md:h-75 bg-[#414141]"></div>
                {/* Text Content (Left Side - Dark Grey Background) */}
                <div className="w-full max-w-[1200px] m-auto text-white px-4 lg:px-0 md:mb-25">
                    <div className="md:text-left md:mr-8 xl:mr-20">
                        <div className="h-[30px] md:h-15 w-[3px] bg-green-500 mr-2 md:mt-[-30px] mb-5 md:mb-10"></div>
                        <h1 className="text-[26px] md:text-[35px] lg:text-[44px] font-bold text-black mb-2">コラム</h1>
                        <p className="text-[14px] md:text-[18px] text-gray-300 font-bold">Column</p>
                    </div>
                </div>

                <div className="pl-4">
                    <div className="w-full my-10 sm:my-[50px] md:my-0 md:w-1/2 relative bg-white h-[160px] sm:h-[250px] md:h-[350px] flex justify-end rounded-tl-[50px] sm:rounded-tl-[80px] md:rounded-tl-[100px] overflow-hidden md:absolute md:right-0 md:top-[180px]">
                        <Image
                            src="/images/column/top.jpg"
                            alt="Column Page Top"
                            fill
                            className="object-cover object-center"
                            priority
                        />
                    </div>
                </div>

                {/* Breadcrumb */}
                <Breadcrumb />

                {/* Search and Admin Section */}
                <div className="max-w-[1200px] mx-auto px-4 lg:px-0 mt-8 mb-12">
                    <div className="flex flex-col md:flex-row items-center justify-end gap-2 w-full">
                        {isAdmin && (
                            <button
                                className="bg-blue-500 hover:bg-blue-600 flex items-center text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 whitespace-nowrap"
                            >
                                <span className="mr-2 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                </span>
                                追加
                            </button>
                        )}
                        <div className="flex gap-5">
                            <input
                                type="text"
                                placeholder="検索"
                                value={tempSearch}
                                onChange={onChangeSearchTerm}
                                className="cursor-pointer lg:w-[300px] p-[10px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                            <button
                                onClick={onConfirmSearchTerm}
                                className="bg-blue-400 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 whitespace-nowrap"
                            >
                                検索
                            </button>
                        </div>
                    </div>
                </div>

                {/* Columns Grid */}
                <div className="max-w-[1200px] mx-auto px-4 lg:px-0 mb-8">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                        </div>
                    ) : columns.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">コラムが見つかりませんでした。</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {columns.map((column) => (
                                <ColumnCard key={column.id} column={column} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <div className="max-w-[1200px] mx-auto px-4 lg:px-0 mb-16">
                    <div className="flex justify-center">
                        <Pagination
                            page={currentPage}
                            totalPages={totalPage}
                            onPageChange={onPageChange}
                        />
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
