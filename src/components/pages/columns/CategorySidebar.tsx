import React, { useEffect, useState } from 'react';
import { getRecommendedColumns } from '@/lib/api';
import type { Column } from '@/utils/types';
import Image from 'next/image';

interface CategorySidebarProps {
    categories: string[];
    selectedCategory: string;
    onCategoryClick: (cat: string) => void;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({ categories, selectedCategory, onCategoryClick }) => {
    const [recommended, setRecommended] = useState<Column[]>([]);

    useEffect(() => {
        getRecommendedColumns().then((columns: Column[]) => {
            // Filter to only show published columns (is_published = true)
            const publishedColumns = columns.filter((col: Column) => col.is_published !== false);
            setRecommended(publishedColumns);
        });
    }, []);

    useEffect(() => {
        console.log(recommended);
    }, [recommended]);
    return (
        <aside className="w-full md:w-64 min-w-[144px]">
            {/* Recommended Columns */}
            <h2 className="font-bold text-lg pb-2 mb-8 relative after:content-[''] after:block after:h-0.5 after:w-full after:absolute after:left-0 after:bottom-0 after:bg-[linear-gradient(to_right,#65B729_0_20%,#000_20%_100%)]">
                人気記事
            </h2>
            <div className="flex flex-col gap-5 mb-8">
                {recommended.map((col, idx) => (
                    <a
                        key={col.id}
                        href={`/column/column-${col.id}/`}
                        className="relative flex items-center bg-white rounded-lg shadow p-3 pr-4 transition hover:shadow-lg min-h-[80px]"
                        style={{ minHeight: 80 }}
                    >
                        {/* Number circle, overlapping top left */}
                        <span className="absolute -top-3 -left-3 bg-green-600 text-white font-bold rounded-full w-7 h-7 flex items-center justify-center text-base shadow-md z-10">
                            {idx + 1}
                        </span>
                        {/* Thumbnail */}
                        {typeof col.thumbnail?.entity_path === 'string' && col.thumbnail.entity_path.trim().length > 0 &&
                            (col.thumbnail.entity_path.startsWith('/') || col.thumbnail.entity_path.startsWith('http')) ? (
                            <Image
                                src={col.thumbnail.entity_path}
                                alt={col.title}
                                width={60}
                                height={60}
                                className="rounded object-cover flex-shrink-0 mr-3"
                                style={{ minWidth: 60, minHeight: 60 }}
                            />
                        ) : (
                            <div className="w-[60px] h-[60px] bg-gray-200 rounded flex-shrink-0 mr-3" />
                        )}
                        {/* Title */}
                        <div className="flex-1 flex items-center min-w-0">
                            <div className="font-bold text-[15px] leading-snug line-clamp-3 break-words">
                                {col.title}
                            </div>
                        </div>
                    </a>
                ))}
            </div>
            {/* Categories */}
            <h2 className="font-bold text-lg pb-2 mb-4 relative after:content-[''] after:block after:h-0.5 after:w-full after:absolute after:left-0 after:bottom-0 after:bg-[linear-gradient(to_right,#65B729_0_20%,#000_20%_100%)]">
                カテゴリー
            </h2>
            <ul className="divide-y pt-2">
                {categories.map((cat) => (
                    <li
                        key={cat}
                        className={`flex items-center py-4 cursor-pointer hover:bg-gray-100 border-b-[#dfdfdf] ${selectedCategory === cat ? 'font-bold text-green-600' : ''}`}
                        onClick={() => onCategoryClick(cat)}
                    >
                        <span className="mr-2 text-lg">・</span>
                        <span className="flex-1">{cat}</span>
                        <span className="ml-auto text-gray-400">
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default CategorySidebar; 