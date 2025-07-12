import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import CInput from './Input';
import Select from './Select';
import RequiredLabel from './RequiredLabel';
import CDatePicker from './DatePicker';
import { PrefectureOptions } from '@/utils/constants';
import { addYears } from 'date-fns';
import { addCareerInquiry } from '@/lib/api';
import { toast } from 'react-toastify';

const inquiryOptions = [
    { value: '', option: '選択してください' },
    { value: 'career', option: '転職相談をしたい' },
    { value: 'counseling', option: 'キャリアカウンセリングを受けたい' },
    { value: 'industry', option: '業界情報について話を聞きたい' },
    { value: 'seminar', option: '研修・セミナー内容について知りたい' },
    { value: 'other', option: 'その他' },
];

export default function CareerCounselingForm() {
    const { register, handleSubmit, control, formState: { errors }, trigger, setFocus, reset } = useForm({ mode: 'onChange' });
    const [privacyChecked, setPrivacyChecked] = useState(false);

    const onSubmit = async (data: any) => {
        try {
            await addCareerInquiry({
                name: data.name,
                email: data.email,
                telephone: data.tel,
                birthday: data.birthdate,
                prefectures: data.prefecture,
                experience: data.experience,
                inquiry: data.inquiry,
                desired_job_type: data.jobType,
                request: data.request,
            });
            toast.success('キャリア相談が送信されました');
            reset();
        } catch (error) {
            toast.error('送信に失敗しました');
            console.log(error);
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
        <form className="w-full max-w-2xl mx-auto bg-white p-4 md:p-8 rounded shadow-lg mb-20" onSubmit={onValidateAndSubmit} noValidate>
            {/* お名前 */}
            <div className="flex items-center gap-4 mb-2 flex-col md:flex-row">
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
            {/* メールアドレス */}
            <div className="flex items-center gap-4 mb-2 flex-col md:flex-row">
                <label className="min-w-[120px] md:min-w-[160px] flex-shrink-0">メールアドレス <RequiredLabel /></label>
                <div className="w-full">
                    <CInput type="email" {...register('email', { required: 'メールアドレスは必須です', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '有効なメールアドレスを入力してください' } })} isError={!!errors.email} errorText={errors.email?.message as string} className="w-full" />
                </div>
            </div>
            <hr className="border-[#dfdfdf] my-6" />
            {/* 電話番号 */}
            <div className="flex items-center gap-4 mb-2 flex-col md:flex-row">
                <label className="min-w-[120px] md:min-w-[160px] flex-shrink-0">電話番号 <RequiredLabel /></label>
                <div className="w-full">
                    <CInput type="tel" {...register('tel', { required: '電話番号は必須です' })} isError={!!errors.tel} errorText={errors.tel?.message as string} className="w-full" />
                </div>
            </div>
            <hr className="border-[#dfdfdf] my-6" />
            {/* 生年月日 */}
            <div className="flex items-center gap-4 mb-2 flex-col md:flex-row">
                <label className="min-w-[120px] text-center md:text-left md:min-w-[160px] flex-shrink-0">生年月日</label>
                <div className="w-full">
                    <Controller
                        name="birthdate"
                        control={control}
                        render={({ field }) => (
                            <CDatePicker
                                {...field}
                                selected={field.value}
                                onChange={field.onChange}
                                dateFormat="yyyy/MM/dd"
                                placeholderText="生年月日を選択"
                                isError={!!errors.birthdate}
                                errorText={errors.birthdate?.message as string}
                                maxDate={addYears(new Date(), -10)}
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                className="w-full"
                                height="h-[50px]"
                            />
                        )}
                    />
                </div>
            </div>
            <hr className="border-[#dfdfdf] my-6" />
            {/* 都道府県 */}
            <div className="flex items-center gap-4 mb-2 flex-col md:flex-row">
                <label className="min-w-[120px] text-center md:text-left md:min-w-[160px] flex-shrink-0">都道府県</label>
                <div className="w-full">
                    <Controller
                        name="prefecture"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={PrefectureOptions}
                                isError={!!errors.prefecture}
                                errorText={errors.prefecture?.message as string}
                                className="w-full"
                            />
                        )}
                    />
                </div>
            </div>
            <hr className="border-[#dfdfdf] my-6" />
            {/* リユース業界経験 */}
            <div className="flex items-center gap-4 mb-2 flex-col md:flex-row">
                <label className="min-w-[120px] md:min-w-[160px] flex-shrink-0 text-center">リユース業界、買取業務<br className='hidden md:block' />ご経験について</label>
                <div className="flex gap-4 justify-center w-full">
                    <label className="flex items-center gap-1">
                        <input type="radio" {...register('experience', { required: false })} value="ご経験がある" className="accent-blue-500" /> ご経験がある
                    </label>
                    <label className="flex items-center gap-1">
                        <input type="radio" {...register('experience', { required: false })} value="ご経験がない" className="accent-blue-500" /> ご経験がない
                    </label>
                </div>
            </div>
            <hr className="border-[#dfdfdf] my-6" />
            {/* お問い合わせ内容について */}
            <div className="flex items-center gap-4 mb-2 flex-col md:flex-row">
                <label className="min-w-[120px] md:min-w-[160px] flex-shrink-0">お問い合わせ<br className='hidden md:block' />内容について</label>
                <div className="w-full">
                    <Controller
                        name="inquiry"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={inquiryOptions}
                                isError={!!errors.inquiry}
                                errorText={errors.inquiry?.message as string}
                                className="w-full"
                            />
                        )}
                    />
                </div>
            </div>
            <hr className="border-[#dfdfdf] my-6" />
            {/* 希望職種 */}
            <div className="flex items-center gap-4 mb-2 flex-col md:flex-row">
                <label className="min-w-[120px] md:min-w-[160px] flex-shrink-0">希望職種</label>
                <div className="w-full">
                    <CInput {...register('jobType')} className="w-full" />
                </div>
            </div>
            <hr className="border-[#dfdfdf] my-6" />
            {/* ご要望 */}
            <div className="flex items-center gap-4 mb-2 flex-col md:flex-row">
                <label className="min-w-[120px] md:min-w-[160px] flex-shrink-0">ご要望となれば、<br className='hidden md:block' />ご記入ください。</label>
                <div className="w-full">
                    <CInput multiline {...register('request')} className="w-full" height="h-[100px]" />
                </div>
            </div>
            <hr className="border-[#dfdfdf] my-6" />
            {/* プライバシーポリシー同意 */}
            <div className="flex items-center justify-center gap-2 m-auto mb-10 md:mb-20">
                <label className="flex items-center gap-1 ml-2">
                    <input type="checkbox" className="accent-blue-500" checked={privacyChecked} onChange={e => setPrivacyChecked(e.target.checked)} />
                    <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">プライバシーポリシー</a>
                    <span className="text-sm">に同意する</span>
                </label>
            </div>
            <div className="flex justify-center">
                <button
                    type="submit"
                    className={`cursor-pointer bg-blue-500 text-white px-15 py-3 rounded text-base transition-all duration-300 ease-in-out hover:opacity-90 ${(!privacyChecked) ? 'opacity-50 pointer-events-none' : ''}`}
                    disabled={!privacyChecked}
                >
                    確認する
                </button>
            </div>
        </form>
    );
} 