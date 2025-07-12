'use client'

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import CInput from './Input';
import RequiredLabel from './RequiredLabel';
import CRadioGroup from './RadioGroup';
import { submitContactInquiry } from '@/lib/api';
import { toast } from 'react-toastify';

const inquiryOptions = [
    { value: 'service', option: 'サービスについて' },
    { value: 'interview', option: '取材について' },
    { value: 'interest', option: '「リユース転職」の仕事に興味がある\n(WEBライティング、キャリアアドバイザーなど)' },
    { value: 'other', option: 'その他' },
];

export default function ContactForm() {
    const { register, handleSubmit, control, formState: { errors }, trigger, setFocus, reset } = useForm({ mode: 'onChange' });

    const onSubmit = async (data: any) => {
        try {
            // Map form data to ContactInquiryParam
            const contactData = {
                name: data.name,
                company_name: data.company_name,
                email: data.email,
                telephone: data.telephone,
                inquiry: data.inquiry,
                inquiry_detail: data.inquiry_detail,
            };
            await submitContactInquiry(contactData);
            toast.success('お問い合わせが送信されました。');
            reset(); // Clear the form after successful submit
        } catch (error) {
            toast.error('送信に失敗しました。');
            console.error(error);
        }
    };

    const onValidateAndSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const valid = await trigger();
        if (!valid) {
            // Focus the first error field
            const firstError = Object.keys(errors)[0];
            if (firstError) setFocus(firstError);
            return;
        }
        handleSubmit(onSubmit)();
    };

    return (
        <form className="w-full max-w-[812px] mx-auto bg-white p-4 md:p-8 rounded shadow-lg mb-20" onSubmit={onValidateAndSubmit} noValidate>
            {/* お名前 */}
            <div className="flex md:items-center gap-4 mb-2 flex-col md:flex-row">
                <label className="min-w-[120px] md:min-w-[160px] flex-shrink-0">お名前 <RequiredLabel /></label>
                <div className="w-full">
                    <CInput
                        placeholder="お名前を入力してください"
                        {...register('name', { required: 'お名前は必須です' })}
                        isError={!!errors.name}
                        errorText={errors.name?.message as string}
                        className="w-full"
                    />
                </div>
            </div>
            <hr className="border-[#dfdfdf] my-6" />
            {/* 会社名 */}
            <div className="flex md:items-center gap-4 mb-2 flex-col md:flex-row">
                <label className="min-w-[120px] md:min-w-[160px] flex-shrink-0">会社名</label>
                <div className="w-full">
                    <CInput
                        placeholder="会社名を入力してください"
                        {...register('company_name')}
                        isError={!!errors.company_name}
                        errorText={errors.company_name?.message as string}
                        className="w-full"
                    />
                </div>
            </div>
            <hr className="border-[#dfdfdf] my-6" />
            {/* メールアドレス */}
            <div className="flex md:items-center gap-4 mb-2 flex-col md:flex-row">
                <label className="min-w-[120px] md:min-w-[160px] flex-shrink-0">メールアドレス <RequiredLabel /></label>
                <div className="w-full">
                    <CInput
                        type="email"
                        placeholder="メールアドレスを入力してください"
                        {...register('email', { required: 'メールアドレスは必須です', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '有効なメールアドレスを入力してください' } })}
                        isError={!!errors.email}
                        errorText={errors.email?.message as string}
                        className="w-full"
                    />
                </div>
            </div>
            <hr className="border-[#dfdfdf] my-6" />
            {/* 電話番号 */}
            <div className="flex md:items-center gap-4 mb-2 flex-col md:flex-row">
                <label className="min-w-[120px] md:min-w-[160px] flex-shrink-0">電話番号 <RequiredLabel /></label>
                <div className="w-full">
                    <CInput
                        type="tel"
                        placeholder="電話番号を入力してください"
                        {...register('telephone', { required: '電話番号は必須です' })}
                        isError={!!errors.telephone}
                        errorText={errors.telephone?.message as string}
                        className="w-full"
                    />
                </div>
            </div>
            <hr className="border-[#dfdfdf] my-6" />
            {/* お問い合わせ内容について */}
            <div className="flex md:items-center gap-4 mb-2 flex-col md:flex-row">
                <label className="min-w-[120px] lg:min-w-[160px] flex-shrink-0">お問い合わせ<br className='hidden md:block' />内容について <RequiredLabel /></label>
                <div className="w-full">
                    <Controller
                        name="inquiry"
                        control={control}
                        rules={{ required: 'お問い合わせ内容については必須です' }}
                        render={({ field }) => (
                            <CRadioGroup
                                name={field.name}
                                options={inquiryOptions}
                                value={field.value || ''}
                                onChange={field.onChange}
                                className="whitespace-pre text-md"
                                direction="column"
                            />
                        )}
                    />
                    {errors.inquiry && (
                        <p className="text-red-400 text-[10px]">{errors.inquiry.message as string}</p>
                    )}
                </div>
            </div>
            <hr className="border-[#dfdfdf] my-6" />
            {/* お問い合わせ内容詳細 */}
            <div className="flex md:items-center gap-4 mb-2 flex-col md:flex-row">
                <label className="min-w-[120px] md:min-w-[160px] flex-shrink-0">お問い合わせ内容詳細</label>
                <div className="w-full">
                    <CInput
                        multiline
                        placeholder="お問い合わせ内容詳細を入力してください"
                        {...register('inquiry_detail')}
                        className="w-full"
                        height="h-[100px]"
                    />
                </div>
            </div>
            <hr className="border-[#dfdfdf] my-6" />
            <div className="flex justify-center">
                <button
                    type="submit"
                    className="cursor-pointer bg-blue-500 text-white px-15 py-3 rounded text-base transition-all duration-300 ease-in-out hover:opacity-90"
                >
                    確認する
                </button>
            </div>
        </form>
    );
} 