"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Spinner from '@/components/common/Spinner';
import { getInterview } from '@/lib/api';
import type { Interview } from '@/utils/types';
import Image from 'next/image';
import EditInterviewModal from '@/components/modal/EditInterviewModal';
import { deleteInterview } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function CareerChangerInterviewDetailPage() {
    const params = useParams();
    const id = Number(params.id);
    const [interview, setInterview] = useState<Interview | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { isAdmin } = useAuth();
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!id) return;
        setIsLoading(true);
        getInterview(id)
            .then((data) => setInterview(data))
            .catch(() => setInterview(null))
            .finally(() => setIsLoading(false));
    }, [id]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}.${month}.${day} ${hours}:${minutes}`;
    };

    const handleEdit = () => {
        setEditModalOpen(true);
    };

    const handleDelete = async () => {
        if (!interview) return;
        if (window.confirm('このインタビューを削除してもよろしいですか？')) {
            try {
                await deleteInterview(interview.id);
                toast.success('インタビューが削除されました');
                router.push('/interview/career-changer');
            } catch (error) {
                toast.error('エラーが発生しました');
                console.log(error);
                
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-row justify-center pt-10">
                <Spinner />
            </div>
        );
    }

    if (!interview) {
        return <div className="text-center py-10">Not found</div>;
    }

    return (
        <main className="max-w-[900px] mx-auto px-4 lg:px-0 mb-8 w-full">
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
                    {interview.title}
                </h1>
            </div>
            <p className='mb-6 text-sm md:text-md'>{formatDate(interview.created)}</p>
            <div className="relative md:w-[80%] m-auto aspect-[1/1] mb-4 rounded rounded-[20px] object-contain">
                {interview.thumbnail?.entity_path && (
                    <Image
                        src={interview.thumbnail.entity_path}
                        alt='インタビュー'
                        fill
                        className="object-contain"
                    />
                )}
            </div>
            <div
                className="prose w-full m-auto mt-10"
                dangerouslySetInnerHTML={{ __html: interview.content }}
            />
            <EditInterviewModal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} interview={interview} />
        </main>
    );
}
