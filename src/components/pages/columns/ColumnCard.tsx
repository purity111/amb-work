import { Column } from '@/utils/types';
import Image from 'next/image';
import Link from 'next/link';

interface ColumnCardProps {
    column: Column;
    onEdit?: (column: Column) => void;
}

export default function ColumnCard({ column }: ColumnCardProps) {

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}.${month}.${day} ${hours}:${minutes}`;
    };

    // const handleDelete = async () => {
    //     if (window.confirm('このコラムを削除してもよろしいですか？')) {
    //         try {
    //             await deleteColumn(column.id);
    //             alert('コラムが削除されました');
    //             router.refresh();
    //         } catch (error) {
    //             alert('エラーが発生しました');
    //             console.log(error);
                
    //         }
    //     }
    // };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <Link href={`/columns/${column.id}`}>
                <div className="relative h-48 sm:h-56">
                    {column.thumbnail ? (
                        <Image
                            src={column?.thumbnail.entity_path}
                            alt={column?.title}
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
                        <span>{formatDate(column.created)}</span>
                        <span className="ml-4 border-[2px] border-[#65B729] px-2 py-1 rounded-md">{column?.category}</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                        {column?.title}
                    </h3>
                    <div className="">
                        <span>閲覧数: {column?.view_cnt || 0}　　</span>
                        {/* <span>検索: {column?.search_cnt || 0}　　</span> */}
                        {/* <span>お気に入り: {column?.favourite_cnt || 0}</span> */}
                    </div>
                </div>
            </Link>
        </div>
    );
} 