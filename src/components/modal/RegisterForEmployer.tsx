import React from "react";
import { useForm, Controller, useWatch } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CInput from "../common/Input";
import RequiredLabel from "../common/RequiredLabel";
import CSelect from "../common/Select";
import { MonthOptions, PrefectureOptions } from "@/utils/constants";
import { formatFlexibleDate, getEstablishmentDateOptions, getEstablishmentYearOptions } from "@/utils/helper";
import { useMutation } from "@tanstack/react-query";
import { registerAsEmployer } from "@/lib/api";
import { toast } from "react-toastify";

interface FormProps {
    onSuccess: () => void;
}

type FormValues = {
    name: string;
    company: string;
    postCode: string;
    prefecture: number;
    address: string;
    phonenumber: string;
    numberOfEmployee?: number;
    establishment_year?: number;
    establishment_month?: number;
    establishment_date?: number;
    capital_stock?: number;
    business_content?: string;
    website?: string;
    email: string;
    password: string;
    confirm: string;
};

const schema = Yup.object().shape({
    name: Yup.string()
        .required('必須項目です。'),
    company: Yup.string()
        .required('必須項目です。'),
    postCode: Yup.string()
        .required('必須項目です。')
        .matches(/^\d{3}-\d{4}$/, 'PostCode is not valid'),
    prefecture: Yup.number().required('必須項目です。'),
    address: Yup.string().required('必須項目です。'),
    phonenumber: Yup.string()
        .required('必須項目です。')
        .matches(/^0\d{2}\d{3,4}\d{4}$/, '無効な電話番号です。'),
    numberOfEmployee: Yup.number()
        .transform((value, originalValue) => {
            return originalValue === '' ? undefined : value;
        })
        .typeError("数値型である必要があります。")
        .moreThan(0, '0より大きくなければなりません。'),
    establishment_date: Yup.number(),
    establishment_year: Yup.number(),
    establishment_month: Yup.number(),
    capital_stock: Yup.number()
        .typeError('数値型である必要があります。')
        .positive('0より大きくなければなりません。'),
    business_content: Yup.string(),
    website: Yup.string()
        .url('無効なURL'),
    email: Yup.string()
        .email('無効なメールアドレス')
        .required('必須項目です。'),
    password: Yup.string()
        .required('必須項目です。')
        .min(8, '8文字以上である必要があります。')
        .matches(/[0-9]/, '数字を含める必要があります。')
        .matches(/[@$!%*?&#]/, '特殊文字を含める必要があります。'),
    confirm: Yup.string()
        .oneOf([Yup.ref('password')], 'パスワードは一致する必要があります。')
        .required('必須項目です。'),
});

export default function RegisterForEmployer({ onSuccess }: FormProps) {
    // const [imagePreview, setImagePreview] = useState<string | null>(null);
    const {
        handleSubmit,
        control,
        formState: { errors },
        getValues
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
        },
    });

    const eYear = useWatch({ control, name: 'establishment_year' });
    const eMonth = useWatch({ control, name: 'establishment_month' });

    const mutation = useMutation({
        mutationFn: registerAsEmployer,
        onSuccess: (data) => {
            // Optionally invalidate or refetch queries here
            console.log('login success: ', data)
            toast.success('企業として登録が完了しました。');
            onSuccess()
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
        mutation.mutate({
            clinic_name: data.name,
            clinic_name_kana: data.company,
            zip: data.postCode,
            prefectures: data.prefecture,
            closest_stataion: data.address,
            tel: data.phonenumber,
            employee_number: data.numberOfEmployee,
            establishment_year: formatFlexibleDate(data.establishment_year, data.establishment_month, data.establishment_date),
            city: String(data.capital_stock),
            business: data.business_content,
            home_page_url: data.website,
            email: data.email,
            password: data.password
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
                <div className="flex flex-col items-left md:flex-row  py-2">
                    <div className="flex-2 flex flex-row items-center">
                        <p className="text-sm text-gray-400 py-2">会社名</p>
                        <RequiredLabel />
                    </div>
                    <div className="flex-3">
                        <Controller
                            name="name"
                            control={control}
                            defaultValue=""
                            rules={{ required: 'Name is required' }}
                            render={({ field }) => (
                                <CInput
                                    {...field}
                                    isError={!!errors.name}
                                    errorText={errors.name?.message}
                                    height="h-[40px]"
                                    className="rounded-sm placeholder-gray-700"
                                    placeholder="会社名"
                                    onChange={(e) => field.onChange(e)}
                                />
                            )}
                        />
                    </div>
                </div>
                <div className="flex flex-col items-left md:flex-row  py-2">
                    <div className="flex-2 flex flex-row items-center">
                        <p className="text-sm text-gray-400 py-2">会社名フリガナ</p>
                        <RequiredLabel />
                    </div>
                    <div className="flex-3">
                        <Controller
                            name="company"
                            control={control}
                            defaultValue=""
                            rules={{ required: 'Company name is required' }}
                            render={({ field }) => (
                                <CInput
                                    {...field}
                                    isError={!!errors.company}
                                    errorText={errors.company?.message}
                                    height="h-[40px]"
                                    className="rounded-sm placeholder-gray-700"
                                    placeholder="会社名フリガナ"
                                    onChange={(e) => field.onChange(e)}
                                />
                            )}
                        />
                    </div>
                </div>
                <div className="flex flex-col items-left md:flex-row  py-2">
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
                        <p className="text-[11px] text-gray-600">※ハイフンを含めて入力してください。</p>
                    </div>
                </div>
                <div className="flex flex-col items-left md:flex-row  py-2 mt-3">
                    <div className="flex-2 flex flex-row items-center">
                        <p className="text-sm text-gray-400 py-2">都道府県</p>
                        <RequiredLabel />
                    </div>
                    <div className="flex-3">
                        <Controller
                            name="prefecture"
                            control={control}
                            render={({ field }) => (
                                <CSelect
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
                <div className="flex flex-col items-left md:flex-row  py-2">
                    <div className="flex-2 flex flex-row items-center">
                        <p className="text-sm text-gray-400 py-2">都道府県以降の住所</p>
                        <RequiredLabel />
                    </div>
                    <div className="flex-3">
                        <Controller
                            name="address"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <CInput
                                    {...field}
                                    isError={!!errors.address}
                                    errorText={errors.address?.message}
                                    height="h-[40px]"
                                    className="rounded-sm placeholder-gray-700"
                                    onChange={(e) => field.onChange(e)}
                                />
                            )}
                        />
                    </div>
                </div>
                <div className="flex flex-col items-left md:flex-row  py-2">
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
                        <p className="text-[11px] text-gray-600">※ハイフンはつけずに入力してください。</p>
                    </div>
                </div>
                <div className="flex flex-col items-left md:flex-row  py-2 mt-4">
                    <div className="flex-2 flex flex-row ">
                        <p className="text-sm text-gray-400 py-2">従業員数</p>
                    </div>
                    <div className="flex-3">
                        <Controller
                            name="numberOfEmployee"
                            control={control}
                            render={({ field }) => (
                                <CInput
                                    {...field}
                                    isError={!!errors.numberOfEmployee}
                                    errorText={errors.numberOfEmployee?.message}
                                    height="h-[40px]"
                                    maxLength={5}
                                    className="rounded-sm placeholder-gray-700"
                                    onChange={(e) => field.onChange(e)}
                                />
                            )}
                        />
                    </div>
                </div>
                <div className="flex flex-col items-left md:flex-row  py-2">
                    <div className="flex-2 flex flex-row ">
                        <p className="text-sm text-gray-400 py-2">設立年月日</p>
                    </div>
                    <div className="flex-3 flex flex-row space-x-2">
                        <Controller
                            name="establishment_year"
                            control={control}
                            render={({ field }) => (
                                <CSelect
                                    {...field}
                                    isError={!!errors.establishment_year}
                                    errorText={errors.establishment_year?.message}
                                    options={getEstablishmentYearOptions()}
                                    width="w-24"
                                    className="h-[40px] rounded-sm placeholder-gray-700"
                                    onChange={(e) => field.onChange(e)}
                                />
                            )}
                        />
                        {eYear && (
                            <Controller
                                name="establishment_month"
                                control={control}
                                render={({ field }) => (
                                    <CSelect
                                        {...field}
                                        isError={!!errors.establishment_month}
                                        errorText={errors.establishment_month?.message}
                                        options={MonthOptions}
                                        width="w-24"
                                        className="h-[40px] rounded-sm placeholder-gray-700"
                                        onChange={(e) => field.onChange(e)}
                                    />
                                )}
                            />
                        )}
                        {eYear && eMonth && (
                            <Controller
                                name="establishment_date"
                                control={control}
                                render={({ field }) => (
                                    <CSelect
                                        {...field}
                                        isError={!!errors.establishment_date}
                                        errorText={errors.establishment_date?.message}
                                        options={getEstablishmentDateOptions(getValues('establishment_year') || 2025, getValues('establishment_month') || 1)}
                                        width="w-24"
                                        className="h-[40px] rounded-sm placeholder-gray-700"
                                        onChange={(e) => field.onChange(e)}
                                    />
                                )}
                            />
                        )}

                    </div>
                </div>
                <div className="flex flex-col items-left md:flex-row  py-2">
                    <div className="flex-2 flex flex-row ">
                        <p className="text-sm text-gray-400 py-2">資本金（万円）</p>
                    </div>
                    <div className="flex-3">
                        <Controller
                            name="capital_stock"
                            control={control}
                            render={({ field }) => (
                                <CInput
                                    {...field}
                                    isError={!!errors.capital_stock}
                                    errorText={errors.capital_stock?.message}
                                    height="h-[40px]"
                                    className="rounded-sm placeholder-gray-700"
                                    onChange={(e) => field.onChange(e)}
                                />
                            )}
                        />
                    </div>
                </div>
                <div className="flex flex-col items-left md:flex-row  py-2">
                    <div className="flex-2 flex flex-row ">
                        <p className="text-sm text-gray-400 py-2">事業内容</p>
                    </div>
                    <div className="flex-3">
                        <Controller
                            name="business_content"
                            control={control}
                            render={({ field }) => (
                                <CInput {...field} multiline height="h-[200px]" className="rounded-sm placeholder-gray-700" onChange={(e) => field.onChange(e)} />
                            )}
                        />
                    </div>
                </div>
                <div className="flex flex-col items-left md:flex-row  py-2">
                    <div className="flex-2 flex flex-row ">
                        <p className="text-sm text-gray-400 py-2">サイトURL</p>
                    </div>
                    <div className="flex-3">
                        <Controller
                            name="website"
                            control={control}
                            render={({ field }) => (
                                <CInput
                                    {...field}
                                    isError={!!errors.website}
                                    errorText={errors.website?.message}
                                    height="h-[40px]"
                                    className="rounded-sm placeholder-gray-700"
                                    onChange={(e) => field.onChange(e)}
                                />
                            )}
                        />
                    </div>
                </div>
                <div className="flex flex-col items-left md:flex-row  py-2">
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
                <div className="flex flex-col items-left md:flex-row  py-2">
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
                        <p className="text-[11px] text-gray-600">8文字以上かつ、半角英数字および特殊記号（!, %, # など）を含めてください。</p>
                    </div>
                </div>
                <div className="flex flex-col items-left md:flex-row  py-2">
                    <div className="flex-2 flex flex-row items-center">
                        <p className="text-sm text-gray-400 py-2">確認用パスワード</p>
                        <RequiredLabel />
                    </div>
                    <div className="flex-3">
                        <Controller
                            name="confirm"
                            control={control}
                            render={({ field }) => (
                                <CInput
                                    {...field}
                                    isError={!!errors.confirm}
                                    errorText={errors.confirm?.message}
                                    height="h-[40px]"
                                    type="password"
                                    className="rounded-sm placeholder-gray-700"
                                    onChange={(e) => field.onChange(e)}
                                />
                            )}
                        />
                        <p className="text-[11px] text-gray-600">パスワード欄と同じものを入力してください。</p>
                    </div>
                </div>
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