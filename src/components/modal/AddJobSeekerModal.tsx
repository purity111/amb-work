import React from "react";
import * as Yup from 'yup';
import { JobSeekerDetail } from "@/utils/types";
import RequiredLabel from "../common/RequiredLabel";
import { Controller, useForm, useWatch } from "react-hook-form";
import CInput from "../common/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import CSelect from "../common/Select";
import { getEstablishmentDateOptions, getEstablishmentYearOptions } from "@/utils/helper";
import { GenderOptions, MonthOptions, PrefectureOptions } from "@/utils/constants";
import CRadioGroup from "../common/RadioGroup";

export type JobSeekerFormValues = {
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
    password: string;
};

const schema = Yup.object().shape({
    name: Yup.string()
        .matches(/^[\u4E00-\u9FAF\u30A0–\u30FF]+$/, '全角の日本語文字のみを入力してください') // Matches common Kanji + Katakana range
        .required('必須項目です。'),
    name_kana: Yup.string()
        .matches(/^[ァ-ヶー　]+$/, '漢字のみを入力してください') // Matches common Kanji range
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
    password: Yup.string()
        .required('必須項目です。')
        .min(8, '8文字以上である必要があります')
        .matches(/[0-9]/, '数字を含めてください。')
        .matches(/[@$!%*?&#]/, '特殊記号を含めてください。'),
});

interface RegisterModalProps {
    onClose: (success?: boolean) => void;
    preLoad: JobSeekerDetail | null;
    onSubmit: (data: JobSeekerFormValues) => void;
}

export default function AddJobSeekerModal({ onSubmit, preLoad, onClose }: RegisterModalProps) {
    const {
        handleSubmit,
        control,
        formState: { errors, isDirty },
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            name: preLoad?.name || '',
            name_kana: preLoad?.name_kana || '',
            sex: preLoad?.sex?.toString() || '1',
            dob_year: Number(preLoad?.birthdate?.split('-')?.[0]) || 2000,
            dob_month: Number(preLoad?.birthdate?.split('-')?.[1]) || 1,
            dob_date: Number(preLoad?.birthdate?.split('-')?.[2]) || 1,
            postCode: preLoad?.zip || '',
            prefecture: preLoad?.prefectures?.toString() || '',
            phonenumber: preLoad?.tel || '',
            email: preLoad?.email || '',
            password: preLoad ? 'Test1234!' : ''
        },
    });

    const dobYear = useWatch({ control, name: 'dob_year' });
    const dobMonth = useWatch({ control, name: 'dob_month' });

    return (
        <div
            className="fixed inset-0 z-50 flex  justify-center bg-gray-300/80"
        >
            <div className="relative flex flex-col bg-white rounded-lg border-none shadow-xl my-auto w-full max-h-3/4 max-w-3xl pt-6 pb-16 relative border-1 border-gray-700 overflow-hidden">
                <p className="text-center text-blue text-2xl">{preLoad ? 'Edit a JobSeeker' : 'Create new JobSeeker'}</p>
                <div className="flex-1 flex flex-col overflow-y-auto px-6">
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
                                                className="h-[40px] rounded-sm placeholder-gray-700 w-full sm:w-24"
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
                                                width="w-24"
                                                className="h-[40px] rounded-sm placeholder-gray-700 w-full sm:w-24"
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
                                                width="w-24"
                                                className="h-[40px] rounded-sm placeholder-gray-700 w-full sm:w-24"
                                                onChange={(e) => field.onChange(e)}
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
                                            disabled={!!preLoad}
                                            height="h-[40px]"
                                            className="rounded-sm placeholder-gray-700"
                                            onChange={(e) => field.onChange(e)}
                                        />
                                    )}
                                />
                                <p className="text-[11px] text-gray-600 h-0">8文字以上かつ、半角英数字および特殊記号（!, %, # など）を含めてください。</p>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="absolute left-0 bottom-0 right-0 bg-blue h-12 flex items-center justify-center cursor-pointer disabled:opacity-60"
                            disabled={!isDirty}
                        >
                            <span className="text-white">保存</span>
                        </button>
                    </form>
                </div>
                <button
                    className="absolute top-1 right-2 w-10 h-10 font-bold text-2xl text-gray-500 hover:text-gray-300 rounded-full cursor-pointer"
                    onClick={() => onClose()}
                >
                    &times;
                </button>
            </div>
        </div>
    );
}