import { useState, useEffect, useRef } from 'react';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import { createInterview } from '@/lib/api';
import { useForm, Controller } from 'react-hook-form';
import RequiredLabel from '@/components/common/RequiredLabel';
import { Editor } from '@tinymce/tinymce-react';
import { toast } from 'react-toastify';

interface AddInterviewModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TAGS = [
    { value: '0', option: 'ビジネス' },
    { value: '1', option: 'キャリアチェンジ' },
];

export default function AddInterviewModal({ isOpen, onClose }: AddInterviewModalProps) {
    const { control, handleSubmit, formState: { errors }, watch, reset, getValues } = useForm({
        defaultValues: {
            title: '',
            description: '',
            tag: '',
            category: '',
            thumbnail: null as File | null,
        },
    });
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [htmlContent, setHtmlContent] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const thumbnail = watch('thumbnail');
    const modalRef = useRef<HTMLDivElement>(null);

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
        setSelectedTag('');
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
            formData.append('description', values.description);
            formData.append('tag', selectedTag); // Use selectedTag
            formData.append('category', values.category);
            formData.append('content', htmlContent);
            formData.append('type', 'career-changer'); // If needed for your backend
            console.log('formData', selectedTag);
            
            if (values.thumbnail) {
                formData.append('thumbnail', values.thumbnail);
            }
            
            await createInterview(formData);
            toast.success('インタビューが追加されました');
            reset();
            setStep(1);
            setHtmlContent('');
            setSelectedTag('');
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
                <h2 className="text-xl font-semibold mb-4">新しいインタビューを追加</h2>
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
                                        placeholder="インタビューのタイトルを入力"
                                        isError={!!errors.title}
                                        errorText={errors.title?.message as string}
                                    />
                                )}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-1 mb-1">
                                <label className="block text-sm font-medium">タグ</label>
                                <RequiredLabel />
                            </div>
                            <Controller
                                name="tag"
                                control={control}
                                rules={{ required: 'タグは必須です' }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        value={selectedTag}
                                        onChange={e => {
                                            field.onChange(e);
                                            setSelectedTag(e.target.value);
                                        }}
                                        options={TAGS}
                                        isError={!!errors.tag}
                                        errorText={errors.tag?.message as string}
                                    />
                                )}

                            />
                        </div>
                        {/* Show 説明 only for career-changer (tag === '1'), after タグ */}
                        {selectedTag === '1' && (
                            <div>
                                <div className="flex items-center gap-1 mb-1">
                                    <label className="block text-sm font-medium">説明</label>
                                    <RequiredLabel />
                                </div>
                                <Controller
                                    name="description"
                                    control={control}
                                    rules={{ required: '説明は必須です' }}
                                    render={({ field }) => (
                                        <Input
                                            type="text"
                                            {...field}
                                            placeholder="インタビューの説明を入力"
                                            isError={!!errors.description}
                                            errorText={errors.description?.message as string}
                                        />
                                    )}
                                />
                            </div>
                        )}
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
                ) : (
                    <div>
                        <div className="mb-4">
                            <Editor
                                apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                                value={htmlContent}
                                onEditorChange={setHtmlContent}
                                init={{
                                    className: "flex-1 text-sm font-light border-1 border-gray-200 rounded-md p-2 min-h-20 max-h-100",
                                    height: '500px',
                                    // menubar: true,
                                    menubar: 'file edit view insert format tools table help',
                                    plugins: [
                                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                    ],
                                    toolbar: 'undo redo | blocks | code | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table | removeformat | help',
                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                    file_picker_types: 'image',
                                    // Optional: clean pasted images into base64
                                    paste_data_images: true,
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
                                onClick={handleAdd}
                                className="cursor-pointer flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                                disabled={isLoading}
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