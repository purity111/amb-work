import { Interview } from '@/utils/types';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

interface InterviewCardProps {
    interview: Interview;
}

export default function InterviewCard({ interview, onEdit, onDelete }: InterviewCardProps) {
    const { isAdmin } = useAuth();
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}.${month}.${day} ${hours}:${minutes}`;
    };

    // Determine route based on tag
    const route = interview.tag === 1
        ? `/interview/career-changer/${interview.id}`
        : `/interview/business/${interview.id}`;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <Link href={route}>
                <div className="relative h-48 sm:h-56">
                    {interview.thumbnail ? (
                        <Image
                            src={interview?.thumbnail.entity_path}
                            alt={interview?.title}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">画像なし</span>
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                        <span>{formatDate(interview.created)}</span>
                        {/* <span className="ml-4 border-[2px] border-[#65B729] px-2 py-1 rounded-md">{interview?.category}</span> */}
                    </div>
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                        {interview?.title}
                    </h3>
                    <div className="">
                        <span>閲覧数: {interview?.view_cnt || 0}</span>
                    </div>
                </div>
            </Link>
        </div>
    );
} 