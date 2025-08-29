"use client";
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Spinner from '@/components/common/Spinner';
import { getColumnsAdmin } from '@/lib/api';
import type { Column } from '@/utils/types';
import Footer from '@/components/Footer';
import CategorySidebar from '@/components/pages/columns/CategorySidebar';
import ColumnCard from '@/components/pages/columns/ColumnCard';
import Image from 'next/image';
import Breadcrumb from '@/components/Breadcrumb';
import { useAuth } from '@/hooks/useAuth';
import Pagination from '@/components/common/Pagination';
import AddColumnModal from '@/components/modal/AddColumnModal';

function ColumnListContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const category = searchParams.get('category');
    const initialPage = Number(searchParams.get('page')) || 1;
    const initialLimit = 12;
    const initialSearchTerm = searchParams.get('searchTerm') || '';
    
    const [columns, setColumns] = useState<Column[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
    const [tempSearch, setTempSearch] = useState(initialSearchTerm);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalPage, setTotalPage] = useState(1);
    const [limit] = useState(initialLimit);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [publishFilter, setPublishFilter] = useState<string>('all'); // 'all', 'published', 'draft'
    
    const { isAdmin } = useAuth();

    // Function to fetch and filter columns data
    const fetchColumns = () => {
        setIsLoading(true);
        
        // Prepare API parameters
        const apiParams: any = {};
        if (category && category !== 'すべて') {
            apiParams.category = category;
        }
        if (searchTerm) {
            apiParams.searchTerm = searchTerm;
        }
        
        // Always use admin API to show all columns (published and draft) with status badges
        // Apply publish filter only for admin users through dropdown
        if (isAdmin && publishFilter !== 'all') {
            if (publishFilter === 'published') {
                apiParams.is_published = true;
            } else if (publishFilter === 'draft') {
                apiParams.is_published = false;
            }
        }
        
        // Always use admin API to get all columns including draft status
        const apiCall = getColumnsAdmin(apiParams);
        
        apiCall
            .then((data: any) => {
                // Always using admin API now, which returns 'articles'
                const columnItems = data?.articles || [];
                setColumns(columnItems);
                setTotalPage(Math.ceil(columnItems.length / limit));
                setCurrentPage(1);
            })
            .catch((error: any) => {
                console.error('Error fetching columns:', error);
                setColumns([]);
            })
            .finally(() => {
                console.log('Setting isLoading to false');
                setIsLoading(false);
            });
    };

    // Function to refetch columns data (alias for fetchColumns)
    const refetchColumns = fetchColumns;
    
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
    const [selectedCategory, setSelectedCategory] = useState(category || '');

    useEffect(() => {
        fetchColumns();
    }, [category, searchTerm, limit, publishFilter, isAdmin]);

    const handleCategoryClick = (cat: string) => {
        setSelectedCategory(cat === 'すべて' ? '' : cat);
        if (cat && cat !== 'すべて') {
            router.push(`/column?category=${encodeURIComponent(cat)}`);
        } else {
            router.push('/column');
        }
    };

    const paginatedColumns = columns.slice((currentPage - 1) * limit, currentPage * limit);

    const onPageChange = (page: number) => {
        setCurrentPage(page);
    };

    const onChangeSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTempSearch(e.target.value);
    };

    const onConfirmSearchTerm = () => {
        setSearchTerm(tempSearch);
    };

    // Update URL when page or search changes
    useEffect(() => {
        const params = new URLSearchParams();
        if (currentPage > 1) params.set('page', currentPage.toString());
        if (searchTerm) params.set('searchTerm', searchTerm);
        if (category) params.set('category', category);
        
        const newUrl = `/column${params.toString() ? `?${params.toString()}` : ''}`;
        router.push(newUrl);
    }, [currentPage, searchTerm, category, router]);
    
    if (isLoading) {
        return (
            <div className="flex flex-row justify-center pt-10">
                <Spinner />
            </div>
        );
    }

    return (
        <>
            <div className="h-20 sm:h-30 md:h-75 bg-[#414141]"></div>
            {/* Text Content (Left Side - Dark Grey Background) */}
            <div className="w-full max-w-[1200px] m-auto text-white px-4 lg:px-0 md:mb-25">
                <div className="md:text-left md:mr-8 xl:mr-20">
                    <div className="h-[30px] md:h-15 w-[3px] bg-green-500 mr-2 md:mt-[-30px] mb-5 md:mb-10"></div>
                    <h2 className="text-[26px] md:text-[35px] lg:text-[44px] font-bold text-black mb-2">コラム</h2>
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

            <div className="max-w-[1200px] mx-auto px-4 lg:px-0 mb-6">
                <div className="flex flex-col-reverse md:flex-row gap-5 mb-6 justify-end">
                    <div className="flex justify-center gap-5">
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
                    {isAdmin && (
                        <div className="flex gap-3 items-center">
                            <select
                                value={publishFilter}
                                onChange={(e) => setPublishFilter(e.target.value)}
                                className="cursor-pointer px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                                <option value="all">すべて</option>
                                <option value="published">公開</option>
                                <option value="draft">下書き</option>
                            </select>
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
                        </div>
                    )}
                </div>
            </div>

            <main className="max-w-[1200px] mx-auto px-4 lg:px-0 mb-8 flex flex-col md:flex-row gap-20 w-full sm:w-[80%] md:w-full">
                <div className="flex-1 relative md:max-w-[72%]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.isArray(paginatedColumns) && paginatedColumns.map((column) => (
                            <ColumnCard
                                key={column.id}
                                column={column}
                            />
                        ))}
                    </div>
                    {(!paginatedColumns || paginatedColumns.length === 0) && (
                        <div className="text-center py-10 text-gray-500">
                            コラムが見つかりませんでした。
                        </div>
                    )}
                    
                    {/* Pagination */}
                    {totalPage > 0 && (
                        <div className="flex justify-center mt-8">
                            <Pagination
                                page={currentPage}
                                totalPages={totalPage}
                                onPageChange={onPageChange}
                            />
                        </div>
                    )}
                </div>
                <CategorySidebar
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryClick={handleCategoryClick}
                />
            </main>
            
            {/* Add Column Modal */}
            <AddColumnModal 
                isOpen={isAddModalOpen} 
                onClose={() => setAddModalOpen(false)} 
                onSuccess={refetchColumns}
            />
            
            <Footer />
        </>
    );
}

export default function ColumnListPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-row justify-center pt-10">
                <Spinner />
            </div>
        }>
            <ColumnListContent />
        </Suspense>
    );
}
