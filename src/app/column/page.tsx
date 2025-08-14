"use client";
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Spinner from '@/components/common/Spinner';
import { getColumns } from '@/lib/api';
import type { Column } from '@/utils/types';
import Footer from '@/components/Footer';
import CategorySidebar from '@/components/pages/columns/CategorySidebar';
import ColumnCard from '@/components/pages/columns/ColumnCard';
import Image from 'next/image';
import Breadcrumb from '@/components/Breadcrumb';

function ColumnListContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const category = searchParams.get('category');
    
    const [columns, setColumns] = useState<Column[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
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
        setIsLoading(true);
        getColumns()
            .then((data) => {
                // Extract the ColumnItems array from the response
                const columnItems = data?.ColumnItems || [];
                let filteredColumns = columnItems;
                if (category && category !== 'すべて') {
                    filteredColumns = columnItems.filter(col => col.category === category);
                }
                setColumns(filteredColumns);
            })
            .catch((error) => {
                console.error('Error fetching columns:', error);
                setColumns([]);
            })
            .finally(() => setIsLoading(false));
    }, [category]);

    const handleCategoryClick = (cat: string) => {
        setSelectedCategory(cat === 'すべて' ? '' : cat);
        if (cat && cat !== 'すべて') {
            router.push(`/column?category=${encodeURIComponent(cat)}`);
        } else {
            router.push('/column');
        }
    };

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

            <main className="max-w-[1200px] mx-auto px-4 lg:px-0 mb-8 flex flex-col md:flex-row gap-20 w-full sm:w-[80%] md:w-full">
                <div className="flex-1 relative md:max-w-[72%]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.isArray(columns) && columns.map((column) => (
                            <ColumnCard
                                key={column.id}
                                column={column}
                            />
                        ))}
                    </div>
                    {(!columns || columns.length === 0) && (
                        <div className="text-center py-10 text-gray-500">
                            コラムが見つかりませんでした。
                        </div>
                    )}
                </div>
                <CategorySidebar
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryClick={handleCategoryClick}
                />
            </main>
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
