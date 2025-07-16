'use client'

import Breadcrumb from '@/components/Breadcrumb';
import { useGetColumns } from '@/hooks/useGetColumns';
import { useAuth } from '@/hooks/useAuth';
import Pagination from '@/components/common/Pagination';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Footer from '@/components/Footer';
import AddColumnModal from '@/components/modal/AddColumnModal';
import CategorySidebar from '@/components/pages/columns/CategorySidebar';
import ColumnCard from '@/components/pages/columns/ColumnCard';
import { Suspense } from 'react';

function ColumnsPageInner() {
    const searchParams = useSearchParams();

    const initialPage = Number(searchParams.get('page')) || 1;
    const initialLimit = Number(searchParams.get('limit')) || 10;
    const initialSearchTerm = searchParams.get('searchTerm') || '';
    const initialCategory = searchParams.get('category') || '';

    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
    const [tempSearch, setTempSearch] = useState(initialSearchTerm);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalPage, setTotalPage] = useState(1);
    const [limit] = useState(initialLimit);
    const [columns, setColumns] = useState<any[]>([]);
    const { profile } = useAuth();
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [isAddModalOpen, setAddModalOpen] = useState(false);

    const { data: response, isLoading } = useGetColumns({
        page: currentPage,
        limit,
        searchTerm: searchTerm || undefined,
        category: selectedCategory || undefined
    });

    useEffect(() => {
        if (response) {
            setColumns(response?.ColumnItems || [0]);
            setTotalPage(response?.pagination?.totalPages || 1);
        }
    }, [response, limit]);

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const params = new URLSearchParams();
        params.set('page', currentPage.toString());
        params.set('limit', limit.toString());
        params.set('searchTerm', searchTerm);
        if (selectedCategory) params.set('category', selectedCategory);
        router.push(`?${params.toString()}`);
    }, [currentPage, limit, searchTerm, selectedCategory, router]);

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

    const categories = [
        'すべて',
        'コラム',
        'スキルアップ方法',
        'バイヤー',
        'ブランド',
        '出張買取',
        '業界ニュース',
        '業界・市場動向',
        '疑問・悩み',
        '転職活動ノウハウ',
        '鑑定士',
    ];

    const handleCategoryClick = (cat: string) => {
        setSelectedCategory(cat === 'すべて' ? '' : cat);
        setCurrentPage(1);

        // Build new query params
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', '1');
        if (cat && cat !== 'すべて') {
            params.set('category', cat);
        } else {
            params.delete('category');
        }
        router.push(`?${params.toString()}`);
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
                <div className="max-w-[1200px] mx-auto px-4 lg:px-0 mb-12">
                    <div className="pb-[30px] md:flex-row flex-col inline-flex md:gap-4 justify-start md:pb-0">
                        <h2 className="text-2xl md:text-3xl font-bold mb-9 text-center relative inline-block mx-auto job-openings">
                            コラム一覧
                        </h2>
                        <p className='text-[14px] md:pt-3 md:text-base text-gray-600 font-sans'>COLUMN LIST</p>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-end gap-2 w-full">
                        {isAdmin && (
                            <button
                                className="cursor-pointer bg-blue-500 hover:bg-blue-600 flex items-center text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 whitespace-nowrap"
                                onClick={() => setAddModalOpen(true)}
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
                                className="cursor-pointer bg-blue-400 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 whitespace-nowrap"
                            >
                                検索
                            </button>
                        </div>
                    </div>
                </div>

                {/* Columns Grid */}
                <div className="max-w-[1200px] mx-auto px-4 lg:px-0 mb-8 flex flex-col md:flex-row gap-20">
                    {/* Columns grid */}
                    <div className="flex-1">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                            </div>
                        ) : columns.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500">コラムが見つかりませんでした。</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {columns.map((column) => (
                                    <ColumnCard key={column.id} column={column} />
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Categories sidebar */}
                    <CategorySidebar
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategoryClick={handleCategoryClick}
                    />
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
            <AddColumnModal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} />
        </>
    );
}

export default function ColumnsPage() {
    return (
        <Suspense fallback={<div>読み込む中...</div>}>
            <ColumnsPageInner />
        </Suspense>
    );
}
