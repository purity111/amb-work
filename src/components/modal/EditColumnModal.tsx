'use client'

import { useState, useEffect } from 'react';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import { updateColumn } from '@/lib/api';
import { useForm, Controller } from 'react-hook-form';
import RequiredLabel from '@/components/common/RequiredLabel';
import { Editor } from '@tinymce/tinymce-react';
import type { Column } from '@/utils/types';
import { toast } from 'react-toastify';

export interface PickOption {
    value: string;
    option: string;
}

interface EditColumnModalProps {
    isOpen: boolean;
    onClose: () => void;
    column: Column | null;
}

export default function EditColumnModal({ isOpen, onClose, column }: EditColumnModalProps) {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [htmlContent, setHtmlContent] = useState('');
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        control,
        reset,
        getValues,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            title: '',
            category: '', // Ensure default is empty string
            custom_id: '' as any,
            thumbnail: null as File | null,
            is_published: true, // Default to published
        }
    });

    useEffect(() => {
        if (column) {
            setValue('title', column.title);
            setValue('category', column.category);
            setValue('custom_id', column.custom_id ? column.custom_id.toString() : '' as any);
            setValue('is_published', column.is_published ?? true);
            setHtmlContent(column.content);
            if (column.thumbnail) {
                setPreviewImage(column.thumbnail.entity_path);
            }
        }
    }, [column, setValue]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setValue('thumbnail', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleNext = handleSubmit(() => {
        setStep(2);
    });

    const handleBack = () => {
        setStep(1);
    };

    const handleCancel = () => {
        reset();
        setStep(1);
        setHtmlContent('');
        setPreviewImage(null);
        onClose();
    };

    const handleUpdate = async () => {
        if (!column) return;
        setIsLoading(true);
        try {
            const values = getValues();
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('category', values.category);
            formData.append('custom_id', String(values.custom_id || ''));
            formData.append('content', htmlContent);
            
            console.log('EditColumn - values.is_published:', values.is_published);
            console.log('EditColumn - values.is_published type:', typeof values.is_published);
            
            // Ensure is_published is set
            const isPublishedValue = values.is_published !== undefined ? values.is_published.toString() : 'true';
            formData.append('is_published', isPublishedValue);
            console.log('EditColumn - Setting is_published to:', isPublishedValue);
            
            if (values.thumbnail instanceof File) {
                formData.append('thumbnail', values.thumbnail);
            }
            await updateColumn(column.id, formData);
            toast.success('コラムが更新されました');
            reset();
            setStep(1);
            setHtmlContent('');
            setPreviewImage(null);
            onClose();
        } catch (error: any) {
            console.log('EditColumn error:', error);
            
            // Check if the error is related to custom_id conflict
            if (error?.response?.status === 400 || error?.response?.status === 422) {
                const errorMessage = error?.response?.data?.message || error?.message || '';
                
                // Check for custom_id related errors
                if (errorMessage.toLowerCase().includes('custom_id') || 
                    errorMessage.toLowerCase().includes('custom id') ||
                    errorMessage.toLowerCase().includes('duplicate') ||
                    errorMessage.toLowerCase().includes('already exists') ||
                    errorMessage.toLowerCase().includes('既に存在')) {
                    toast.error('このカスタムIDは既に使用されています。別のIDを入力してください。');
                } else {
                    toast.error(errorMessage || 'エラーが発生しました');
                }
            } else {
                toast.error('エラーが発生しました');
            }
            
        } finally {
            setIsLoading(false);
        }
    };

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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-300/80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-10">
                <h2 className="text-xl font-semibold mb-4">コラムを編集</h2>
                {step === 1 ? (
                    <div className="p-6">
                        {/* No heading here */}
                        <form onSubmit={handleNext} className="space-y-4">
                            <div>
                                <div className="flex items-center gap-1 mb-1">
                                    <label style={{ color: '#333', fontWeight: 'bold' }}>タイトル</label>
                                    <RequiredLabel />
                                </div>
                                <Input
                                    {...register('title', { required: 'タイトルを入力してください' })}
                                    placeholder="タイトルを入力"
                                    isError={!!errors.title?.message}
                                    errorText={errors.title?.message}
                                />
                            </div>
                            <div>
                                <div className="flex items-center gap-1 mb-1">
                                    <label style={{ color: '#333', fontWeight: 'bold' }}>カテゴリー</label>
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
                                    <label style={{ color: '#333', fontWeight: 'bold' }}>サムネイル</label>
                                    <RequiredLabel />
                                </div>
                                <div className="mt-2">
                                    <label className="inline-block bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600">
                                        <span>ファイルを選択</span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                    <span className="ml-3">
                                        {previewImage ? '選択済み' : '未選択'}
                                    </span>
                                </div>
                                {previewImage && (
                                    <div className="mt-4">
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            className="max-w-xs h-auto"
                                        />
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className="flex items-center gap-1 mb-1">
                                    <label style={{ color: '#333', fontWeight: 'bold' }}>公開状態</label>
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
                                    className="cursor-pointer flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                                >
                                    次へ
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="flex flex-col h-full">
                        {/* Heading only in step 2 */}
                        <div className="mb-4">
                            <div className="flex items-center gap-1 mb-1">
                                <label style={{ color: '#333', fontWeight: 'bold' }}>カスタムID</label>
                                <RequiredLabel />
                            </div>
                            <Input
                                type="number"
                                {...register('custom_id', { 
                                    required: 'カスタムIDは必須です',
                                    validate: (value) => {
                                        if (!value) return true; // Required validation handles empty values
                                        const numericValue = Number(value);
                                        if (isNaN(numericValue) || !Number.isInteger(numericValue) || numericValue <= 0) {
                                            return 'カスタムIDは正の整数である必要があります';
                                        }
                                        return true;
                                    }
                                })}
                                placeholder="例: 1001, 2024"
                                isError={!!errors.custom_id?.message}
                                errorText={errors.custom_id?.message as string}
                            />
                        </div>
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
                                    cleanup: false,
                                    cleanup_on_startup: false,
                                    valid_elements: '*[*]',
                                    valid_styles: '*[*]',
                                    extended_valid_elements: '*[*]',
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
                                className="flex-1 cursor-pointer px-4 bg-[#ff953e] text-white py-2 rounded-md hover:opacity-80 transition-colors"
                            >
                                戻る
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="flex-1 cursor-pointer px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                キャンセル
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    handleUpdate();
                                }}
                                disabled={isLoading}
                                className="flex-1 cursor-pointer px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                更新
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 