'use client'

import { useState, useEffect, useRef } from 'react';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import { createColumn } from '@/lib/api';
import { useForm, Controller } from 'react-hook-form';
import RequiredLabel from '@/components/common/RequiredLabel';
import { Editor } from '@tinymce/tinymce-react';
import { toast } from 'react-toastify';

export interface PickOption {
    value: string;
    option: string;
}

interface AddColumnModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void; // Callback when column is successfully added
}

const categories = [
    { value: '', option: '選択' },
    ...[
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
    ].map(cat => ({ value: cat, option: cat }))
];

export default function AddColumnModal({ isOpen, onClose, onSuccess }: AddColumnModalProps) {
    const {
        handleSubmit,
        control,
        reset,
        watch,
        getValues, // <-- add this line
        formState: { errors }
    } = useForm({
        defaultValues: {
            title: '',
            category: '', // Ensure default is empty string
            custom_id: '',
            thumbnail: null as File | null,
            is_published: true, // Default to published
        }
    });
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [htmlContent, setHtmlContent] = useState('');
    const thumbnail = watch('thumbnail');
    const modalRef = useRef<HTMLDivElement>(null);

    // Lock scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleCancel = () => {
        reset();
        setStep(1);
        setHtmlContent('');
        onClose();
    };

    const handleNext = handleSubmit(() => setStep(2));
    const handleBack = () => setStep(1);

    const handleAdd = async () => {
        setIsLoading(true);
        try {
            const values = getValues();
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('category', values.category);
            if (values.custom_id) {
                formData.append('custom_id', values.custom_id.toString());
            }
            formData.append('content', htmlContent);
            
            console.log('AddColumn - values.is_published:', values.is_published);
            console.log('AddColumn - values.is_published type:', typeof values.is_published);
            
            // Ensure is_published is set
            const isPublishedValue = values.is_published !== undefined ? values.is_published.toString() : 'true';
            formData.append('is_published', isPublishedValue);
            console.log('AddColumn - Setting is_published to:', isPublishedValue);
            
            if (values.thumbnail) {
                formData.append('thumbnail', values.thumbnail);
            }
            await createColumn(formData);
            toast.success('コラムが追加されました');
            reset();
            setStep(1);
            setHtmlContent('');
            onClose();
            // Call the success callback to refresh the parent component
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            toast.error('エラーが発生しました');
            console.log(error);
            
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center md:p-4 bg-gray-300/80 overflow-y-auto">
            <div
                ref={modalRef}
                className={
                    `relative bg-white rounded-lg shadow-xl p-4 md:py-8 md:px-12 w-[95%] sm:w-[90%] flex flex-col ` +
                    (step === 2
                        ? 'max-w-[900px] max-h-[80vh]'
                        : 'md:w-[80%] max-w-md max-h-[90vh]')
                }
                role="dialog"
                aria-modal="true"
            >
                <h2 className="text-xl font-semibold mb-4">新しいコラムを追加</h2>
                {step === 1 ? (
                    <form onSubmit={handleNext} className="space-y-4">
                        <div>
                            <div className="flex items-center gap-1 mb-1">
                                <label className="block text-sm font-medium">タイトル</label>
                                <RequiredLabel />
                            </div>
                            <Controller
                                name="title"
                                control={control}
                                rules={{ required: 'タイトルは必須です' }}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        {...field}
                                        placeholder="コラムのタイトルを入力"
                                        isError={!!errors.title}
                                        errorText={errors.title?.message as string}
                                    />
                                )}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-1 mb-1">
                                <label className="block text-sm font-medium">カテゴリー</label>
                                <RequiredLabel />
                            </div>
                            <Controller
                                name="category"
                                control={control}
                                rules={{ required: 'カテゴリーを選択してください' }}
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={categories}
                                        placeholder="カテゴリーを選択"
                                        isError={!!errors.category?.message}
                                        errorText={errors.category?.message}
                                    />
                                )}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-1 mb-1">
                                <label className="block text-sm font-medium">カスタムID</label>
                            </div>
                            <Controller
                                name="custom_id"
                                control={control}
                                rules={{ 
                                    validate: (value) => {
                                        if (!value) return true; // Optional field
                                        const numericValue = Number(value);
                                        if (isNaN(numericValue) || !Number.isInteger(numericValue) || numericValue <= 0) {
                                            return 'カスタムIDは正の整数である必要があります';
                                        }
                                        return true;
                                    }
                                }}
                                render={({ field }) => (
                                    <Input
                                        type="number"
                                        {...field}
                                        placeholder="例: 1001, 2024 (空白の場合は自動生成)"
                                        isError={!!errors.custom_id}
                                        errorText={errors.custom_id?.message as string}
                                    />
                                )}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-1 mb-1">
                                <label className="block text-sm font-medium">サムネイル画像</label>
                                <RequiredLabel />
                            </div>
                            <Controller
                                name="thumbnail"
                                control={control}
                                rules={{ required: 'サムネイル画像は必須です' }}
                                render={({ field }) => (
                                    <div>
                                        <label htmlFor="thumbnail-upload" className="inline-block px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition-colors">
                                            ファイルを選択
                                        </label>
                                        <input
                                            id="thumbnail-upload"
                                            type="file"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={e => {
                                                const file = e.target.files?.[0] || null;
                                                field.onChange(file);
                                            }}
                                        />
                                        <span className="ml-3 text-gray-700 align-middle">
                                            {field.value && typeof field.value !== 'string' ? field.value.name : '未選択'}
                                        </span>
                                    </div>
                                )}
                            />
                            {errors.thumbnail && <p className="text-red-500 text-xs mt-1">{errors.thumbnail.message as string}</p>}
                            {thumbnail && typeof thumbnail !== 'string' && (
                                <div className="mt-2 flex justify-center">
                                    <img
                                        src={URL.createObjectURL(thumbnail)}
                                        alt="サムネイルプレビュー"
                                        className="w-32 h-32 object-cover rounded border"
                                    />
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-1 mb-1">
                                <label className="block text-sm font-medium">公開状態</label>
                                <RequiredLabel />
                            </div>
                            <Controller
                                name="is_published"
                                control={control}
                                rules={{ 
                                    validate: (value) => value !== undefined && value !== null || '公開状態を選択してください'
                                }}
                                render={({ field }) => (
                                    <div className="flex gap-4">
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="is_published"
                                                value="true"
                                                checked={field.value === true}
                                                onChange={() => field.onChange(true)}
                                                className="mr-2"
                                            />
                                            公開
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="is_published"
                                                value="false"
                                                checked={field.value === false}
                                                onChange={() => field.onChange(false)}
                                                className="mr-2"
                                            />
                                            下書き
                                        </label>
                                    </div>
                                )}
                            />
                            {errors.is_published && <p className="text-red-500 text-xs mt-1">{errors.is_published.message as string}</p>}
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="cursor-pointer flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                キャンセル
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="cursor-pointer flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                次へ
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="flex flex-col h-full">
                        <div className="flex-1 mb-4">
                            <Editor
                                apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                                value={htmlContent}
                                onEditorChange={setHtmlContent}
                                init={{
                                    className: "flex-1 text-sm font-light border-1 border-gray-200 rounded-md p-2 min-h-20 max-h-100",
                                    height: '500px',
                                    language: 'ja',
                                    menubar: 'file edit view insert format tools table help',
                                    plugins: [
                                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                    ],
                                    toolbar: 'undo redo | formatselect | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table | removeformat | help',
                                    block_formats: '段落=p; 見出し1=h1; 見出し2=h2; 見出し3=h3; 見出し4=h4; 見出し5=h5; 見出し6=h6; 引用=blockquote; コード=code; 整形済み=pre',
                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                    content_css: '/css/style.css',
                                    file_picker_types: 'image',
                                    paste_data_images: true,
                                    forced_root_block: 'p',
                                    force_br_newlines: false,
                                    force_p_newlines: true,
                                    convert_newlines_to_brs: false,
                                    remove_linebreaks: false,
                                    entity_encoding: 'raw',
                                    verify_html: false,
                                    cleanup: true,
                                    cleanup_on_startup: true,
                                    formats: {
                                        p: { block: 'p', title: '段落' },
                                        h1: { block: 'h1', title: '見出し1' },
                                        h2: { block: 'h2', title: '見出し2' },
                                        h3: { block: 'h3', title: '見出し3' },
                                        h4: { block: 'h4', title: '見出し4' },
                                        h5: { block: 'h5', title: '見出し5' },
                                        h6: { block: 'h6', title: '見出し6' },
                                        blockquote: { block: 'blockquote', title: '引用' },
                                        code: { block: 'code', title: 'コード' },
                                        pre: { block: 'pre', title: '整形済み' }
                                    }
                                }}
                            />
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="cursor-pointer flex-1 px-4 py-2 bg-[#ff953e] border-gray-300 text-white rounded-md hover:bg-gray-50 transition-colors"
                            >
                                戻る
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="cursor-pointer flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                キャンセル
                            </button>
                            <button
                                type="button"
                                onClick={handleAdd}
                                disabled={isLoading || !htmlContent}
                                className="cursor-pointer flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                追加
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 