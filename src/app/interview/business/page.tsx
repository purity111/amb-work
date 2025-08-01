'use client'

import { useGetInterviews } from '@/hooks/useGetInterviews';
import InterviewCard from '@/components/pages/interview/InterviewCard';
import Pagination from '@/components/common/Pagination';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AddInterviewModal from '@/components/modal/AddInterviewModal';
import EditInterviewModal from '@/components/modal/EditInterviewModal';
import { useAuth } from '@/hooks/useAuth';
import Breadcrumb from '@/components/Breadcrumb';
import Image from 'next/image';
import Footer from '@/components/Footer';
import type { Interview } from '@/utils/types';
import { Suspense } from 'react';

function BusinessInterviewPageInner() {
    const searchParams = useSearchParams();
    const initialPage = Number(searchParams.get('page')) || 1;
    const initialLimit = 12;
    const initialSearchTerm = searchParams.get('searchTerm') || '';
    const initialCategory = searchParams.get('category') || '';

    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
    const [tempSearch, setTempSearch] = useState(initialSearchTerm);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalPage, setTotalPage] = useState(1);
    const [limit] = useState(initialLimit);
    const [interviews, setInterviews] = useState<any[]>([]);
    const [selectedCategory] = useState(initialCategory);
    const router = useRouter();
    const { isAdmin } = useAuth();
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);

    const { data: response, isLoading } = useGetInterviews({
        searchTerm: searchTerm || undefined,
        category: selectedCategory || undefined,
    });

    useEffect(() => {
        if (response) {
            const filtered = response.InterviewItems.filter((interview: Interview) => interview.tag !== 1);
            setInterviews(filtered);
            setTotalPage(Math.ceil(filtered.length / limit));
            setCurrentPage(1);
        }
    }, [response, limit, searchTerm, selectedCategory]);

    const paginatedInterviews = interviews.slice((currentPage - 1) * limit, currentPage * limit);

    useEffect(() => {
        console.log('Paginated Interviews:', paginatedInterviews);
    }, [paginatedInterviews]);

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
            <main className="bg-white min-h-screen">
                <div className="h-20 sm:h-30 md:h-75 bg-[#414141]"></div>
                {/* Text Content (Left Side - Dark Grey Background) */}
                <div className="w-full max-w-[1200px] m-auto text-white px-4 lg:px-0 md:mb-25">
                    <div className="md:text-left md:mr-8 xl:mr-20">
                        <div className="h-[30px] md:h-15 w-[3px] bg-green-500 mr-2 md:mt-[-30px] mb-5 md:mb-10"></div>
                        <h1 className="text-[26px] md:text-[35px] lg:text-[44px] font-bold text-black mb-2">インタビュー</h1>
                        <p className="text-[14px] md:text-[18px] text-gray-300 font-bold">Interview</p>
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
                <div className="max-w-[1200px] mx-auto px-4 lg:px-0 mb-12">
                    <div className="pb-[30px] md:pb-[60px] text-center">
                        <h2 className="text-2xl md:text-3xl font-bold mb-9 text-center relative inline-block mx-auto job-openings">
                            企業インタビュー
                        </h2>
                        <p className='text-center text-[14px] text-gray-600 font-sans'>INTERVIEW LIST</p>
                    </div>
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
                            <button
                                className="m-auto md:m-0 max-w-[110px] cursor-pointer bg-blue-500 hover:bg-blue-600 flex items-center text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 whitespace-nowrap"
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
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {isLoading ? (
                            <div className="col-span-3 flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                            </div>
                        ) : paginatedInterviews.length === 0 ? (
                            <div className="col-span-3 text-center py-12">
                                <p className="text-gray-500">インタビューが見つかりませんでした。</p>
                            </div>
                        ) : (
                            paginatedInterviews.map((interview) => (
                                <InterviewCard key={interview.id} interview={interview} />
                            ))
                        )}
                    </div>
                    <div className="flex justify-center mt-8">
                        <Pagination
                            page={currentPage}
                            totalPages={totalPage}
                            onPageChange={onPageChange}
                        />
                    </div>
                </div>
                <AddInterviewModal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} defaultTag="0" />
                <EditInterviewModal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} interview={null} />
            </main>
            <Footer />
        </>
    );
}

export default function BusinessInterviewPage() {
    return (
        <Suspense fallback={<div>読み込み中...</div>}>
            <BusinessInterviewPageInner />
        </Suspense>
    );
}
