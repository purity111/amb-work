import { useState, useEffect } from 'react';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import { updateInterview } from '@/lib/api';
import { useForm, Controller } from 'react-hook-form';
import RequiredLabel from '@/components/common/RequiredLabel';
import { Editor } from '@tinymce/tinymce-react';
import type { Interview } from '@/utils/types';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';

interface EditInterviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    interview: Interview | null;
}

const TAGS = [
    { value: '0', option: 'ビジネス' },
    { value: '1', option: 'キャリアチェンジ' },
];

export default function EditInterviewModal({ isOpen, onClose, interview }: EditInterviewModalProps) {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [htmlContent, setHtmlContent] = useState('');
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [selectedTag, setSelectedTag] = useState('');
    const queryClient = useQueryClient();

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
            description: '',
            tag: '',
            category: '',
            thumbnail: null as File | null,
        }
    });

    useEffect(() => {
        if (interview && isOpen) {
            setValue('title', interview.title);
            setValue('description', interview.description);
            const tagValue = interview.tag === 1 ? '1' : 'business';
            setValue('tag', tagValue);
            setSelectedTag(tagValue);
            setValue('category', interview.category);
            setHtmlContent(interview.content || '');
            if (interview.thumbnail) {
                setPreviewImage(interview.thumbnail.entity_path);
            } else {
                setPreviewImage(null);
            }
        }
        if (!isOpen) {
            setHtmlContent('');
        }
    }, [interview, setValue, isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check file size (1MB limit)
            if (file.size > 3 * 1024 * 1024) {
                toast.error('ファイルサイズは3MB以下にしてください。');
                return;
            }
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
        if (!interview) return;
        setIsLoading(true);
        try {
            const values = getValues();
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('description', values.description);
            formData.append('tag', selectedTag);
            formData.append('category', values.category);
            formData.append('content', htmlContent);
            if (values.thumbnail instanceof File) {
                formData.append('thumbnail', values.thumbnail);
            }
            await updateInterview(interview.id, formData);
            toast.success('インタビューが更新されました');
            
            // Invalidate and refetch interview queries to show the updated interview
            queryClient.invalidateQueries({ queryKey: ['getInterviews'] });
            queryClient.invalidateQueries({ queryKey: ['getInterview', interview.id] });
            
            reset();
            setStep(1);
            setHtmlContent('');
            setPreviewImage(null);
            onClose();
        } catch (error) {
            toast.error('エラーが発生しました');
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-300/80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-10">
                <h2 className="text-xl font-semibold mb-4">インタビューを編集</h2>
                {step === 1 ? (
                    <div className="p-6">
                        <form onSubmit={handleNext} className="space-y-4">
                            <div>
                                <div className="flex items-center gap-1 mb-1">
                                    <label style={{ color: '#333', fontWeight: 'bold' }}>タイトル</label>
                                    <RequiredLabel />
                                </div>
                                <Input
                                    {...register('title', { required: 'タイトルを入力してください' })}
                                    placeholder="タイトルを入力"
                                    isError={!!errors.title}
                                    errorText={errors.title?.message}
                                />
                            </div>
                            <div>
                                <div className="flex items-center gap-1 mb-1">
                                    <label style={{ color: '#333', fontWeight: 'bold' }}>タグ</label>
                                    <RequiredLabel />
                                </div>
                                <Controller
                                    name="tag"
                                    control={control}
                                    rules={{ required: 'タグを選択してください' }}
                                    render={({ field }) => (
                                        <Select
                                            value={selectedTag}
                                            onChange={e => {
                                                field.onChange(e);
                                                setSelectedTag(e.target.value);
                                            }}
                                            options={TAGS}
                                            placeholder="タグを選択"
                                            isError={!!errors.tag}
                                            errorText={errors.tag?.message}
                                        />
                                    )}
                                />
                            </div>
                            {selectedTag === '1' && (
                                <div>
                                    <div className="flex items-center gap-1 mb-1">
                                        <label style={{ color: '#333', fontWeight: 'bold' }}>説明</label>
                                        <RequiredLabel />
                                    </div>
                                    <Input
                                        {...register('description', { required: '説明を入力してください' })}
                                        placeholder="説明を入力"
                                        isError={!!errors.description}
                                        errorText={errors.description?.message}
                                    />
                                </div>
                            )}
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
                                    className="cursor-pointer flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                    disabled={isLoading}
                                >
                                    次へ
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">本文</label>
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
                                className="cursor-pointer flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                戻る
                            </button>
                            <button
                                type="button"
                                onClick={handleUpdate}
                                className="cursor-pointer flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                                disabled={isLoading}
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