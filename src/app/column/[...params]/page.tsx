"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Spinner from '@/components/common/Spinner';
import { getColumn, deleteColumn } from '@/lib/api';
import type { Column } from '@/utils/types';
import Footer from '@/components/Footer';
import CategorySidebar from '@/components/pages/columns/CategorySidebar';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import EditColumnModal from '@/components/modal/EditColumnModal';
import Breadcrumb from '@/components/Breadcrumb';

export default function ColumnDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { profile } = useAuth();
    
    // All hooks must be called at the top level
    const [column, setColumn] = useState<Column | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    
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
    
    const isAdmin = profile?.role === 'admin' || profile?.role === 'subadmin';
    
    // Extract the ID from the params array
    const paramsArray = params.params as string[];
    
    let id: number | null = null;
    
    if (paramsArray && paramsArray.length > 0) {
        const firstParam = paramsArray[0];
        if (firstParam.startsWith('column-')) {
            const idString = firstParam.replace('column-', '');
            id = Number(idString);
        }
    }

    useEffect(() => {
        // Check if params exist and are valid
        if (!paramsArray || paramsArray.length === 0) {
            router.push('/column');
            return;
        }
        
        // If no valid ID found, redirect to column list
        if (!id || isNaN(id)) {
            router.push('/column');
            return;
        }
        
        // Only fetch data if we have a valid ID
        if (id) {
            setIsLoading(true);
            getColumn(id)
                .then((data) => setColumn(data))
                .catch(() => setColumn(null))
                .finally(() => setIsLoading(false));
        }
    }, [id, paramsArray, router]);

    const handleCategoryClick = (cat: string) => {
        setSelectedCategory(cat === 'すべて' ? '' : cat);
        // Optionally, navigate to the column list page with the selected category as a query param
        if (cat && cat !== 'すべて') {
            router.push(`/column?category=${encodeURIComponent(cat)}`);
        } else {
            router.push('/column');
        }
    };

    const handleDelete = async () => {
        if (!column) return;
        if (window.confirm('このコラムを削除してもよろしいですか？')) {
            try {
                await deleteColumn(column.id);
                toast.success('コラムが削除されました');
                router.push('/column');
            } catch (error) {
                toast.error('エラーが発生しました');
                console.log(error);
                
            }
        }
    };

    const handleEdit = () => {
        setEditModalOpen(true);
    };

    const handleEditModalClose = () => {
        setEditModalOpen(false);
        // Refresh column after edit
        if (id) {
            setIsLoading(true);
            getColumn(id)
                .then((data) => setColumn(data))
                .catch(() => setColumn(null))
                .finally(() => setIsLoading(false));
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-row justify-center pt-10">
                <Spinner />
            </div>
        );
    }

    // If no valid ID, show loading (will redirect in useEffect)
    if (!id || isNaN(id)) {
        return (
            <div className="flex flex-row justify-center pt-10">
                <Spinner />
            </div>
        );
    }

    if (!column) {
        return <div className="text-center py-10">Not found</div>;
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}.${month}.${day} ${hours}:${minutes}`;
    };

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
                <div className="flex-1 relative md:max-w-[72%]" >
                    {isAdmin && (
                        <div className="flex gap-3 shrink-0 pb-6">
                            <button
                                onClick={handleEdit}
                                className="bg-blue-500 cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 text-base flex items-center rounded shadow"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                編集
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 cursor-pointer hover:bg-red-700 text-white font-bold py-2 px-4 text-base flex items-center rounded shadow"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                削除
                            </button>
                        </div>
                    )}
                    <div className="flex flex-col-reverse md:flex-row flex-wrap items-start gap-4">
                        <h1 className="text-[24px] md:text-[36px] font-bold min-w-0 flex-1">
                            {column.title}
                        </h1>
                    </div>
                    <p className='mb-6 text-sm md:text-md'>{formatDate(column.created)}</p>
                    <div className="relative md:w-[80%] m-auto aspect-[3/2] mb-4 rounded rounded-[20px] object-contain">
                        <Image
                            src={column.thumbnail?.entity_path || ''}
                            alt='インタビュー'
                            fill
                            className="object-contain"
                        />
                    </div>
                    <div
                        className="prose w-full m-auto mt-10"
                        dangerouslySetInnerHTML={{ __html: column.content }}
                    />
                </div>
                <CategorySidebar
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryClick={handleCategoryClick}
                />
            </main>
            <Footer />
            <EditColumnModal isOpen={isEditModalOpen} onClose={handleEditModalClose} column={column} />
        </>
    );
}
