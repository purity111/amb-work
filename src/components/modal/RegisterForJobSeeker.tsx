import React from "react";
import { useForm, Controller, useWatch } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CInput from "../common/Input";
import RequiredLabel from "../common/RequiredLabel";
import BirthDateSelect from "../common/BirthDateSelect";
import { GenderOptions, MonthOptions, PrefectureOptions, ServiceContentOptions } from "@/utils/constants";
import { getEstablishmentDateOptions, getEstablishmentYearOptions } from "@/utils/helper";
import CRadioGroup from "../common/RadioGroup";
import { useMutation } from "@tanstack/react-query";
import { registerAsJobSeeker } from "@/lib/api";
import { toast } from "react-toastify";
import PrivacyPolicyCheckbox from '../common/PrivacyPolicyCheckbox';
import { useRouter } from 'next/navigation';

interface FormProps {
    onSuccess: () => void;
}

type FormValues = {
    name: string;
    name_kana: string;
    dob_year: number;
    dob_month: number;
    dob_date: number;
    sex: string;
    postCode: string;
    prefecture: string;
    phonenumber: string;
    email: string;
    confirmEmail: string;
    password: string;
    confirmPassword: string;
    others?: string;
    serviceContent: string;
    privacyPolicy: boolean;
};

const schema = Yup.object().shape({
    name: Yup.string()
        // .matches(/^[\u4E00-\u9FAF\u30A0–\u30FF]+$/, '全角の日本語文字のみを入力してください') // Matches common Kanji + Katakana range
        .required('必須項目です。'),
    name_kana: Yup.string()
        // .matches(/^[ァ-ヶー　]+$/, '漢字のみを入力してください') // Matches common Kanji range
        .required('必須項目です。'),
    dob_year: Yup.number().required(),
    dob_month: Yup.number().required(),
    dob_date: Yup.number().required(),
    sex: Yup.string().required(),
    postCode: Yup.string()
        .required('郵便番号を入力してください。')
        .matches(/^\d{3}-\d{4}$/, '有効な郵便番号を入力してください。'),
    prefecture: Yup.string().required('必須項目です。'),
    phonenumber: Yup.string()
        .required('必須項目です。')
        .matches(/^0\d{2}\d{3,4}\d{4}$/, '電話番号は無効です。'),
    email: Yup.string()
        .email('無効なメールアドレスです。')
        .required('必須項目です。'),
    confirmEmail: Yup.string()
        .oneOf([Yup.ref('email')], 'メールアドレスは一致する必要があります。')
        .required('必須項目です。'),
    password: Yup.string()
        .required('必須項目です。')
        .min(8, '8文字以上である必要があります')
        .matches(/[0-9]/, '数字を含めてください。')
        .matches(/[@$!%*?&#]/, '特殊記号を含めてください。'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'パスワードは一致する必要があります')
        .required('必須項目です。'),
    others: Yup.string(),
    serviceContent: Yup.string().required(),
    privacyPolicy: Yup.boolean()
        .oneOf([true], '利用規約への同意が必要です')
        .required('利用規約への同意が必要です')
});

export default function RegisterForJobSeeker({ onSuccess }: FormProps) {
    const router = useRouter();
    // const [imagePreview, setImagePreview] = useState<string | null>(null);
    const {
        handleSubmit,
        control,
        formState: { errors },
        setValue,
        trigger,
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onSubmit',
        defaultValues: {
            sex: '1',
            serviceContent: '1',
            privacyPolicy: false
        },
    });

    const dobYear = useWatch({ control, name: 'dob_year' });
    const dobMonth = useWatch({ control, name: 'dob_month' });
    const sc = useWatch({ control, name: 'serviceContent' });
    console.log(sc);
    
    const mutation = useMutation({
        mutationFn: registerAsJobSeeker,
        onSuccess: (data) => {
            // Optionally invalidate or refetch queries here
            console.log('register success: ', data)
            toast.success('求職者として登録が完了しました。');
            onSuccess();
            router.push('/register/thanks');
        },
        onError: (error: any) => {
            console.error('Error:', error);
            // Check if the error is due to existing email
            if (error?.response?.data?.message?.includes('email') ||
                error?.response?.data?.message?.includes('Email') ||
                error?.response?.status === 409) {
                toast.error('このメールアドレスは既に登録されています。');
            } else {
                toast.error(error?.response?.data?.message || '登録に失敗しました。');
            }
        },
    });

    const [privacyChecked, setPrivacyChecked] = React.useState(false);
    
    // Watch the privacy policy field for validation
    const privacyPolicyError = errors.privacyPolicy?.message;
    
    // Update form value when checkbox changes
    const handlePrivacyChange = (checked: boolean) => {
        setPrivacyChecked(checked);
        setValue('privacyPolicy', checked);
    };

    // const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0];
    //     if (file && file.type.startsWith('image/')) {
    //         const reader = new FileReader();
    //         reader.onloadend = () => setImagePreview(reader.result as string);
    //         reader.readAsDataURL(file);
    //     } else {
    //         setImagePreview(null);
    //     }
    // };

    const onSubmit = async (data: FormValues) => {
        // Trigger validation for all fields including privacy policy
        const isValid = await trigger();
        
        if (!isValid) {
            // If validation fails, don't submit
            return;
        }
        
        mutation.mutate({
            name: data.name,
            name_kana: data.name_kana,
            birthdate: `${data.dob_year}-${String(data.dob_month).padStart(2, '0')}-${String(data.dob_date).padStart(2, '0')}`,
            sex: Number(data.sex),
            zip: data.postCode,
            prefectures: Number(data.prefecture),
            tel: data.phonenumber,
            email: data.email,
            password: data.password,
            service_content: Number(data.serviceContent)
        })
    };

    return (
        <>
            {/* <div className="flex flex-col items-center">
                <div className="mt-4 mb-3 w-20 h-20">
                    <img
                        src={imagePreview || '/images/default-avatar.jpg'}
                        alt="Preview"
                        className="w-full h-full rounded-full shadow-md"
                    />
                </div>
                <label
                    htmlFor="imageUpload"
                    className="text-sm text-gray-500 border-1 rounded-sm py-1 px-4 border-gray-700"
                >
                    画像選択
                    <input
                        id="imageUpload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                </label>
            </div> */}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                <div className="flex flex-col items-start md:flex-row  py-2">
                    <div className="flex-2 flex flex-row items-center">
                        <p className="text-sm text-gray-400 py-2">氏名</p>
                        <RequiredLabel />
                    </div>
                    <div className="flex-3">
                        <Controller
                            name="name"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <CInput
                                    {...field}
                                    isError={!!errors.name}
                                    errorText={errors.name?.message}
                                    height="h-[40px]"
                                    className="rounded-sm placeholder-gray-700"
                                    placeholder="氏名"
                                    onChange={(e) => field.onChange(e)}
                                />
                            )}
                        />
                    </div>
                </div>
                <div className="flex flex-col items-start md:flex-row  py-2">
                    <div className="flex-2 flex flex-row items-center">
                        <p className="text-sm text-gray-400 py-2">氏名フリガナ</p>
                        <RequiredLabel />
                    </div>
                    <div className="flex-3">
                        <Controller
                            name="name_kana"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <CInput
                                    {...field}
                                    isError={!!errors.name_kana}
                                    errorText={errors.name_kana?.message}
                                    height="h-[40px]"
                                    className="rounded-sm placeholder-gray-700"
                                    placeholder="氏名フリガナ"
                                    onChange={(e) => field.onChange(e)}
                                />
                            )}
                        />
                    </div>
                </div>
                <div className="flex flex-col items-start md:flex-row  py-2">
                    <div className="flex-2 flex flex-row items-center">
                        <p className="text-sm text-gray-400 py-2">生年月日</p>
                        <RequiredLabel />
                    </div>
                    <div className="flex-3 flex flex-row space-x-2">
                        <Controller
                            name="dob_year"
                            control={control}
                            render={({ field }) => (
                                <div className="flex-1">
                                    <BirthDateSelect
                                        {...field}
                                        isError={!!errors.dob_year}
                                        options={getEstablishmentYearOptions()}
                                        width="w-full"
                                        className="h-[40px] rounded-sm placeholder-gray-700"
                                        onChange={(e) => field.onChange(e)}
                                        placeholder="年"
                                    />
                                </div>
                            )}
                        />
                        <Controller
                            name="dob_month"
                            control={control}
                            render={({ field }) => (
                                <div className="flex-1">
                                    <BirthDateSelect
                                        {...field}
                                        isError={!!errors.dob_month}
                                        options={MonthOptions}
                                        width="w-full"
                                        className="h-[40px] rounded-sm placeholder-gray-700"
                                        onChange={(e) => field.onChange(e)}
                                        placeholder="月"
                                    />
                                </div>
                            )}
                        />
                        <Controller
                            name="dob_date"
                            control={control}
                            render={({ field }) => (
                                <div className="flex-1">
                                    <BirthDateSelect
                                        {...field}
                                        isError={!!errors.dob_date}
                                        disabled={!dobYear || !dobMonth}
                                        options={getEstablishmentDateOptions(dobYear, dobMonth)}
                                        width="w-full"
                                        className="h-[40px] rounded-sm placeholder-gray-700"
                                        onChange={(e) => field.onChange(e)}
                                        placeholder="日"
                                    />
                                </div>
                            )}
                        />
                    </div>
                </div>
                <div className="flex flex-col items-start md:flex-row  py-2">
                    <div className="flex-2 flex flex-row items-center">
                        <p className="text-sm text-gray-400 py-2">性別</p>
                        <RequiredLabel />
                    </div>
                    <div className="flex-3">
                        <Controller
                            name="sex"
                            control={control}
                            render={({ field }) => (
                                <CRadioGroup
                                    {...field}
                                    options={GenderOptions}
                                    value={field.value}
                                    onChange={(e) => field.onChange(e)}
                                />
                            )}
                        />
                    </div>
                </div>
                <div className="flex flex-col items-start md:flex-row  py-2">
                    <div className="flex-2 flex flex-row items-center">
                        <p className="text-sm text-gray-400 py-2">郵便番号</p>
                        <RequiredLabel />
                    </div>
                    <div className="flex-3">
                        <Controller
                            name="postCode"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <CInput
                                    {...field}
                                    isError={!!errors.postCode}
                                    errorText={errors.postCode?.message}
                                    height="h-[40px]"
                                    className="rounded-sm placeholder-gray-700"
                                    placeholder="000-0000"
                                    onChange={(e) => field.onChange(e)}
                                />
                            )}
                        />
                        <p className="text-[11px] text-gray-600 h-0">※ハイフンを含めて入力してください。</p>
                    </div>
                </div>
                <div className="flex flex-col items-start md:flex-row  py-2 mt-3">
                    <div className="flex-2 flex flex-row items-center">
                        <p className="text-sm text-gray-400 py-2">都道府県</p>
                        <RequiredLabel />
                    </div>
                    <div className="flex-3">
                        <Controller
                            name="prefecture"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <BirthDateSelect
                                    {...field}
                                    isError={!!errors.prefecture}
                                    errorText={errors.prefecture?.message}
                                    options={PrefectureOptions}
                                    className="h-[40px] rounded-sm placeholder-gray-700"
                                    onChange={(e) => field.onChange(e)}
                                />
                            )}
                        />
                    </div>
                </div>
                <div className="flex flex-col items-start md:flex-row  py-2">
                    <div className="flex-2 flex flex-row items-center">
                        <p className="text-sm text-gray-400 py-2">電話番号</p>
                        <RequiredLabel />
                    </div>
                    <div className="flex-3">
                        <Controller
                            name="phonenumber"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <CInput
                                    {...field}
                                    isError={!!errors.phonenumber}
                                    errorText={errors.phonenumber?.message}
                                    height="h-[40px]"
                                    className="rounded-sm placeholder-gray-700"
                                    placeholder="08012345678"
                                    onChange={(e) => field.onChange(e)}
                                />
                            )}
                        />
                        <p className="text-[11px] text-gray-600 h-0">※ハイフンはつけずに入力してください。</p>
                    </div>
                </div>
                <div className="flex flex-col items-start md:flex-row  py-2">
                    <div className="flex-2 flex flex-row items-center">
                        <p className="text-sm text-gray-400 py-2">メールアドレス</p>
                        <RequiredLabel />
                    </div>
                    <div className="flex-3">
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <CInput
                                    {...field}
                                    isError={!!errors.email}
                                    errorText={errors.email?.message}
                                    height="h-[40px]"
                                    className="rounded-sm placeholder-gray-700"
                                    onChange={(e) => field.onChange(e)}
                                />
                            )}
                        />
                    </div>
                </div>
                <div className="flex flex-col items-start md:flex-row  py-2">
                    <div className="flex-2 flex flex-row items-center">
                        <p className="text-sm text-gray-400 py-2">メールアドレス確認</p>
                        <RequiredLabel />
                    </div>
                    <div className="flex-3">
                        <Controller
                            name="confirmEmail"
                            control={control}
                            render={({ field }) => (
                                <CInput
                                    {...field}
                                    isError={!!errors.confirmEmail}
                                    errorText={errors.confirmEmail?.message}
                                    height="h-[40px]"
                                    className="rounded-sm placeholder-gray-700"
                                    onChange={(e) => field.onChange(e)}
                                />
                            )}
                        />
                        <p className="text-[11px] text-gray-600 h-0">※メールアドレス欄と同じものを入力してください。</p>
                    </div>
                </div>
                <div className="flex flex-col items-start md:flex-row  py-2">
                    <div className="flex-2 flex flex-row items-center">
                        <p className="text-sm text-gray-400 py-2">パスワード</p>
                        <RequiredLabel />
                    </div>
                    <div className="flex-3">
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <CInput
                                    {...field}
                                    isError={!!errors.password}
                                    errorText={errors.password?.message}
                                    type="password"
                                    height="h-[40px]"
                                    className="rounded-sm placeholder-gray-700"
                                    onChange={(e) => field.onChange(e)}
                                />
                            )}
                        />
                        <p className="text-[11px] text-gray-600 h-0">8文字以上かつ、半角英数字および特殊記号（!, %, # など）を含めてください。</p>
                    </div>
                </div>
                <div className="flex flex-col items-start md:flex-row  py-2">
                    <div className="flex-2 flex flex-row items-center">
                        <p className="text-sm text-gray-400 py-2">確認用パスワード</p>
                        <RequiredLabel />
                    </div>
                    <div className="flex-3">
                        <Controller
                            name="confirmPassword"
                            control={control}
                            render={({ field }) => (
                                <CInput
                                    {...field}
                                    isError={!!errors.confirmPassword}
                                    errorText={errors.confirmPassword?.message}
                                    height="h-[40px]"
                                    type="password"
                                    className="rounded-sm placeholder-gray-700"
                                    onChange={(e) => field.onChange(e)}
                                />
                            )}
                        />
                        <p className="text-[11px] text-gray-600 h-0">パスワード欄と同じものを入力してください。</p>
                    </div>
                </div>
                <div className="flex flex-col items-start md:flex-row  py-2">
                    <div className="flex-2 flex flex-row items-center">
                        <p className="text-sm text-gray-400 py-2">転職支援サービスの利用希望</p>
                        <RequiredLabel />
                    </div>
                    <div className="flex-3">
                        <Controller
                            name="serviceContent"
                            control={control}
                            render={({ field }) => (
                                <CRadioGroup
                                    {...field}
                                    direction="column"
                                    options={ServiceContentOptions}
                                    value={field.value}
                                    onChange={(e) => field.onChange(e)}
                                />
                            )}
                        />
                        <p className="text-[11px] text-gray-400 py-2">専門のキャリアアドバイザーによる無料相談を受けられます。非公開求人も多数。お気軽にご相談ください。</p>
                    </div>
                </div>
                {/* Privacy Policy Checkbox */}
                <PrivacyPolicyCheckbox
                    text="利用規約"
                    link="/terms"
                    checked={privacyChecked}
                    onChange={handlePrivacyChange}
                    error={privacyPolicyError}
                />
                <button
                    type="submit"
                    className="absolute left-0 bottom-0 right-0 bg-blue h-12 flex items-center justify-center cursor-pointer"
                >
                    <span className="text-white">登録する</span>
                </button>
            </form>
        </>
    );
}