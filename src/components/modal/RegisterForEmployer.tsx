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
        .required('必須項目です'),
    company: Yup.string()
        .required('必須項目です'),
    postCode: Yup.string()
        .required('PostCode is required')
        .matches(/^\d{3}-\d{4}$/, 'PostCode is not valid'),
    prefecture: Yup.number().required('Prefecture is required'),
    address: Yup.string().required('Address is required'),
    phonenumber: Yup.string()
        .required('Phonenumber is required')
        .matches(/^0\d{2}\d{3,4}\d{4}$/, 'Phonenumber is not valid'),
    numberOfEmployee: Yup.number()
        .transform((value, originalValue) => {
            return originalValue === '' ? undefined : value;
        })
        .typeError("Number of employee must be a number type")
        .moreThan(0, 'Number of employee must be greater than 0'),
    establishment_date: Yup.number(),
    establishment_year: Yup.number(),
    establishment_month: Yup.number(),
    capital_stock: Yup.number()
        .typeError('Must be a number')
        .positive('Must be greater than 0'),
    business_content: Yup.string(),
    website: Yup.string()
        .url('Invalid URL'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .required('Password is required')
        .min(8, 'Must be at least 8 characters')
        .matches(/[A-Z]/, 'Must contain an uppercase letter')
        .matches(/[a-z]/, 'Must contain a lowercase letter')
        .matches(/[0-9]/, 'Must contain a number')
        .matches(/[@$!%*?&#]/, 'Must contain a special character'),
    confirm: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Please confirm your password'),
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
            onSuccess()
        },
        onError: (error) => {
            console.error('Error:', error);
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
                        <p className="text-sm text-gray-600">※ハイフンを含めて入力してください。</p>
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
                        <p className="text-sm text-gray-600">※ハイフンはつけずに入力してください。</p>
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
                                    height="h-[40px]"
                                    width="w-24"
                                    className="rounded-sm placeholder-gray-700"
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
                                        height="h-[40px]"
                                        width="w-24"
                                        className="rounded-sm placeholder-gray-700"
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
                                        height="h-[40px]"
                                        width="w-24"
                                        className="rounded-sm placeholder-gray-700"
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
                        <p className="text-sm text-gray-600">8文字以上かつ半角英数字及び記号が利用可能です。</p>
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
                        <p className="text-sm text-gray-600">パスワード欄と同じものを入力してください。</p>
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