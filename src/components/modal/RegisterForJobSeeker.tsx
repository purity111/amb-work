import React from "react";
import { useForm, Controller, useWatch } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CInput from "../common/Input";
import RequiredLabel from "../common/RequiredLabel";
import CSelect from "../common/Select";
import { GenderOptions, MonthOptions, PrefectureOptions } from "@/utils/constants";
import { getEstablishmentDateOptions, getEstablishmentYearOptions } from "@/utils/helper";
import CRadioGroup from "../common/RadioGroup";
import { useMutation } from "@tanstack/react-query";
import { registerAsJobSeeker } from "@/lib/api";

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
};

const schema = Yup.object().shape({
    name: Yup.string()
        .matches(/^[\u4E00-\u9FAF\u30A0–\u30FF]+$/, '全角の日本語文字のみを入力してください') // Matches common Kanji + Katakana range
        .required('必須項目です'),
    name_kana: Yup.string()
        .matches(/^[ァ-ヶー　]+$/, '漢字のみを入力してください') // Matches common Kanji range
        .required('必須項目です'),
    dob_year: Yup.number().required(),
    dob_month: Yup.number().required(),
    dob_date: Yup.number().required(),
    sex: Yup.string().required(),
    postCode: Yup.string()
        .required('PostCode is required')
        .matches(/^\d{3}-\d{4}$/, 'PostCode is not valid'),
    prefecture: Yup.string().required('Prefecture is required'),
    phonenumber: Yup.string()
        .required('Phonenumber is required')
        .matches(/^0\d{2}\d{3,4}\d{4}$/, 'Phonenumber is not valid'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    confirmEmail: Yup.string()
        .oneOf([Yup.ref('email')], 'Emails must match')
        .required('Please confirm your email'),
    password: Yup.string()
        .required('Password is required')
        .min(8, 'Must be at least 8 characters')
        .matches(/[A-Z]/, 'Must contain an uppercase letter')
        .matches(/[a-z]/, 'Must contain a lowercase letter')
        .matches(/[0-9]/, 'Must contain a number')
        .matches(/[@$!%*?&#]/, 'Must contain a special character'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Please confirm your password'),
    others: Yup.string()
});

export default function RegisterForJobSeeker({ onSuccess }: FormProps) {
    // const [imagePreview, setImagePreview] = useState<string | null>(null);
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            sex: '1'
        },
    });

    const dobYear = useWatch({ control, name: 'dob_year' });
    const dobMonth = useWatch({ control, name: 'dob_month' });

    const mutation = useMutation({
        mutationFn: registerAsJobSeeker,
        onSuccess: (data) => {
            // Optionally invalidate or refetch queries here
            console.log('register success: ', data)
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

    const onSubmit = (data: FormValues) => {
        mutation.mutate({
            name: data.name,
            name_kana: data.name_kana,
            birthdate: `${data.dob_year}-${String(data.dob_month).padStart(2, '0')}-${String(data.dob_date).padStart(2, '0')}`,
            sex: Number(data.sex),
            zip: data.postCode,
            prefectures: Number(data.prefecture),
            tel: data.phonenumber,
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
                <div className="flex flex-col items-left md:flex-row  py-2">
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
                <div className="flex flex-col items-left md:flex-row  py-2">
                    <div className="flex-2 flex flex-row ">
                        <p className="text-sm text-gray-400 py-2">生年月日</p>
                    </div>
                    <div className="flex-3 flex flex-row space-x-2">
                        <Controller
                            name="dob_year"
                            control={control}
                            render={({ field }) => (
                                <div className="flex-1 sm:flex-none">
                                    <CSelect
                                        {...field}
                                        isError={!!errors.dob_year}
                                        options={getEstablishmentYearOptions()}
                                        height="h-[40px]"
                                        className="rounded-sm placeholder-gray-700 w-full sm:w-24"
                                        onChange={(e) => field.onChange(e)}
                                    />
                                </div>
                            )}
                        />
                        <Controller
                            name="dob_month"
                            control={control}
                            render={({ field }) => (
                                <div className="flex-1 sm:flex-none">
                                    <CSelect
                                        {...field}
                                        isError={!!errors.dob_month}
                                        options={MonthOptions}
                                        height="h-[40px]"
                                        width="w-24"
                                        className="rounded-sm placeholder-gray-700 w-full sm:w-24"
                                        onChange={(e) => field.onChange(e)}
                                    />
                                </div>
                            )}
                        />
                        <Controller
                            name="dob_date"
                            control={control}
                            render={({ field }) => (
                                <div className="flex-1 sm:flex-none">
                                    <CSelect
                                        {...field}
                                        isError={!!errors.dob_date}
                                        disabled={!dobYear || !dobMonth}
                                        options={getEstablishmentDateOptions(dobYear, dobMonth)}
                                        height="h-[40px]"
                                        width="w-24"
                                        className="rounded-sm placeholder-gray-700 w-full sm:w-24"
                                        onChange={(e) => field.onChange(e)}
                                    />
                                </div>
                            )}
                        />
                    </div>
                </div>
                <div className="flex flex-col items-left md:flex-row  py-2">
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
                                    // isError={!!errors.sex}
                                    // errorText={errors.sex?.message}
                                    // height="h-[40px]"
                                    options={GenderOptions}
                                    name="sex"
                                    value={field.value}
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
                        <p className="text-sm text-gray-600 h-0">※ハイフンを含めて入力してください。</p>
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
                            defaultValue=""
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
                        <p className="text-sm text-gray-600 h-0">※ハイフンはつけずに入力してください。</p>
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
                        <p className="text-sm text-gray-600 h-0">※メールアドレス欄と同じものを入力してください。</p>
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
                        <p className="text-sm text-gray-600 h-0">8文字以上かつ半角英数字及び記号が利用可能です。</p>
                    </div>
                </div>
                <div className="flex flex-col items-left md:flex-row  py-2">
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
                        <p className="text-sm text-gray-600 h-0">パスワード欄と同じものを入力してください。</p>
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