import React, { useEffect } from "react";
import * as Yup from 'yup';
import { Employer } from "@/utils/types";
import RequiredLabel from "../common/RequiredLabel";
import { Controller, useForm } from "react-hook-form";
import CInput from "../common/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import CSelect from "../common/Select";
import { PrefectureOptions } from "@/utils/constants";

export type EmployerFormValues = {
    clinic_name: string;
    clinic_name_kana: string;
    business_form: string;
    zip: string;
    prefectures: string;
    city: string;
    closest_station?: string;
    tel: string;
    email: string;
    home_page_url?: string;
    access?: string;
    director_name?: string;
    employee_number?: string;
    establishment_year: string;
    business: string;
    capital_stock: string;
};

const createSchema = () => Yup.object({
    clinic_name: Yup.string().required('必須項目です。'),
    clinic_name_kana: Yup.string().required('必須項目です。'),
    business_form: Yup.string().required('必須項目です。'),
    zip: Yup.string()
        .required('郵便番号を入力してください。')
        .matches(/^\d{3}-\d{4}$/, '有効な郵便番号を入力してください。'),
    prefectures: Yup.string().required('必須項目です。'),
    city: Yup.string().required('必須項目です。'),
    closest_station: Yup.string().optional(),
    tel: Yup.string()
        .required('必須項目です。')
        .matches(/^0\d{2}\d{3,4}\d{4}$/, '電話番号は無効です。'),
    email: Yup.string()
        .required('必須項目です。')
        .email('有効なメールアドレスを入力してください。'),
    home_page_url: Yup.string().optional().url('有効なURLを入力してください。'),
    access: Yup.string().optional(),
    director_name: Yup.string().optional(),
    employee_number: Yup.string().optional(),
    establishment_year: Yup.string().required('必須項目です。'),
    business: Yup.string().required('必須項目です。'),
    capital_stock: Yup.string().required('必須項目です。'),
});

interface AddEmployerModalProps {
    onClose: (success?: boolean) => void;
    preLoad: Employer | null;
    onSubmit: (data: EmployerFormValues) => void;
}

export default function AddEmployerModal({ onSubmit, preLoad, onClose }: AddEmployerModalProps) {
    const isEdit = !!preLoad;
    const schema = createSchema();
    
    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            clinic_name: preLoad?.clinic_name || '',
            clinic_name_kana: preLoad?.clinic_name_kana || '',
            business_form: preLoad?.business_form?.toString() || '',
            zip: preLoad?.zip || '',
            prefectures: preLoad?.prefectures?.toString() || '',
            city: preLoad?.city || '',
            closest_station: preLoad?.closest_station || '',
            tel: preLoad?.tel || '',
            email: preLoad?.email || '',
            home_page_url: preLoad?.home_page_url || '',
            access: preLoad?.access || '',
            director_name: preLoad?.director_name || '',
            employee_number: preLoad?.employee_number?.toString() || '',
            establishment_year: preLoad?.establishment_year || '',
            business: preLoad?.business || '',
            capital_stock: preLoad?.capital_stock || '',
        },
    });

    // Reset form when preLoad data changes
    useEffect(() => {
        if (preLoad) {
            reset({
                clinic_name: preLoad.clinic_name || '',
                clinic_name_kana: preLoad.clinic_name_kana || '',
                business_form: preLoad.business_form?.toString() || '',
                zip: preLoad.zip || '',
                prefectures: preLoad.prefectures?.toString() || '',
                city: preLoad.city || '',
                closest_station: preLoad.closest_station || '',
                tel: preLoad.tel || '',
                email: preLoad.email || '',
                home_page_url: preLoad.home_page_url || '',
                access: preLoad.access || '',
                director_name: preLoad.director_name || '',
                employee_number: preLoad.employee_number?.toString() || '',
                establishment_year: preLoad.establishment_year || '',
                business: preLoad.business || '',
                capital_stock: preLoad.capital_stock || '',
            });
        }
    }, [preLoad, reset]);

    const businessFormOptions = [
        { value: '1', option: '株式会社' },
        { value: '2', option: '有限会社' },
        { value: '3', option: '合同会社' },
        { value: '4', option: '合資会社' },
        { value: '5', option: '合名会社' },
        { value: '6', option: '一般社団法人' },
        { value: '7', option: '一般財団法人' },
        { value: '8', option: '公益社団法人' },
        { value: '9', option: '公益財団法人' },
        { value: '10', option: 'その他' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex justify-center bg-gray-300/80">
            <div className="relative flex flex-col bg-white rounded-lg border-none shadow-xl mx-2 md:mx-0 my-auto w-full max-h-3/4 max-w-4xl pt-6 pb-16 relative border-1 border-gray-700 overflow-hidden">
                <p className="text-center text-blue text-2xl">{preLoad ? '企業編集' : '新規企業作成'}</p>
                <div className="flex-1 flex flex-col overflow-y-auto px-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
                        {/* 企業名 */}
                        <div className="flex flex-col items-start md:flex-row py-2">
                            <div className="flex-2 flex flex-row items-center">
                                <p className="text-sm text-gray-400 py-2">企業名</p>
                                <RequiredLabel />
                            </div>
                            <div className="flex-3">
                                <Controller
                                    name="clinic_name"
                                    control={control}
                                    render={({ field }) => (
                                        <CInput
                                            {...field}
                                            type="text"
                                            placeholder="企業名を入力"
                                            className="w-full"
                                        />
                                    )}
                                />
                                {errors.clinic_name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.clinic_name.message}</p>
                                )}
                            </div>
                        </div>

                        {/* 企業名（カナ） */}
                        <div className="flex flex-col items-start md:flex-row md:py-2">
                            <div className="flex-2 flex flex-row items-center">
                                <p className="text-sm text-gray-400 py-2">企業名（カナ）</p>
                                <RequiredLabel />
                            </div>
                            <div className="w-full md:flex-3">
                                <Controller
                                    name="clinic_name_kana"
                                    control={control}
                                    render={({ field }) => (
                                        <CInput
                                            {...field}
                                            type="text"
                                            placeholder="企業名（カナ）を入力"
                                            className="w-full"
                                        />
                                    )}
                                />
                                {errors.clinic_name_kana && (
                                    <p className="text-red-500 text-sm mt-1">{errors.clinic_name_kana.message}</p>
                                )}
                            </div>
                        </div>

                        {/* 事業形態 */}
                        <div className="flex flex-col items-start md:flex-row py-2">
                            <div className="flex-2 flex flex-row items-center">
                                <p className="text-sm text-gray-400 py-2">事業形態</p>
                                <RequiredLabel />
                            </div>
                            <div className="flex-3">
                                <Controller
                                    name="business_form"
                                    control={control}
                                    render={({ field }) => (
                                        <CSelect
                                            {...field}
                                            options={businessFormOptions}
                                            className="w-full"
                                        />
                                    )}
                                />
                                {errors.business_form && (
                                    <p className="text-red-500 text-sm mt-1">{errors.business_form.message}</p>
                                )}
                            </div>
                        </div>

                        {/* 郵便番号 */}
                        <div className="flex flex-col items-start md:flex-row py-2">
                            <div className="flex-2 flex flex-row items-center">
                                <p className="text-sm text-gray-400 py-2">郵便番号</p>
                                <RequiredLabel />
                            </div>
                            <div className="flex-3">
                                <Controller
                                    name="zip"
                                    control={control}
                                    render={({ field }) => (
                                        <CInput
                                            {...field}
                                            type="text"
                                            placeholder="123-4567"
                                            className="w-full"
                                        />
                                    )}
                                />
                                {errors.zip && (
                                    <p className="text-red-500 text-sm mt-1">{errors.zip.message}</p>
                                )}
                            </div>
                        </div>

                        {/* 都道府県 */}
                        <div className="flex flex-col items-start md:flex-row py-2">
                            <div className="flex-2 flex flex-row items-center">
                                <p className="text-sm text-gray-400 py-2">都道府県</p>
                                <RequiredLabel />
                            </div>
                            <div className="flex-3">
                                <Controller
                                    name="prefectures"
                                    control={control}
                                    render={({ field }) => (
                                        <CSelect
                                            {...field}
                                            options={PrefectureOptions}
                                            className="w-full"
                                        />
                                    )}
                                />
                                {errors.prefectures && (
                                    <p className="text-red-500 text-sm mt-1">{errors.prefectures.message}</p>
                                )}
                            </div>
                        </div>

                        {/* 市区町村 */}
                        <div className="flex flex-col items-start md:flex-row py-2">
                            <div className="flex-2 flex flex-row items-center">
                                <p className="text-sm text-gray-400 py-2">市区町村</p>
                                <RequiredLabel />
                            </div>
                            <div className="flex-3">
                                <Controller
                                    name="city"
                                    control={control}
                                    render={({ field }) => (
                                        <CInput
                                            {...field}
                                            type="text"
                                            placeholder="市区町村を入力"
                                            className="w-full"
                                        />
                                    )}
                                />
                                {errors.city && (
                                    <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                                )}
                            </div>
                        </div>

                        {/* 最寄り駅 */}
                        <div className="flex flex-col items-start md:flex-row py-2">
                            <div className="flex-2 flex flex-row items-center">
                                <p className="text-sm text-gray-400 py-2">最寄り駅</p>
                            </div>
                            <div className="flex-3">
                                <Controller
                                    name="closest_station"
                                    control={control}
                                    render={({ field }) => (
                                        <CInput
                                            {...field}
                                            type="text"
                                            placeholder="最寄り駅を入力"
                                            className="w-full"
                                        />
                                    )}
                                />
                                {errors.closest_station && (
                                    <p className="text-red-500 text-sm mt-1">{errors.closest_station.message}</p>
                                )}
                            </div>
                        </div>

                        {/* 電話番号 */}
                        <div className="flex flex-col items-start md:flex-row py-2">
                            <div className="flex-2 flex flex-row items-center">
                                <p className="text-sm text-gray-400 py-2">電話番号</p>
                                <RequiredLabel />
                            </div>
                            <div className="flex-3">
                                <Controller
                                    name="tel"
                                    control={control}
                                    render={({ field }) => (
                                        <CInput
                                            {...field}
                                            type="tel"
                                            placeholder="03-1234-5678"
                                            className="w-full"
                                        />
                                    )}
                                />
                                {errors.tel && (
                                    <p className="text-red-500 text-sm mt-1">{errors.tel.message}</p>
                                )}
                            </div>
                        </div>

                        {/* メールアドレス */}
                        <div className="flex flex-col items-start md:flex-row py-2">
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
                                            type="email"
                                            placeholder="example@company.com"
                                            className="w-full"
                                        />
                                    )}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                )}
                            </div>
                        </div>

                        {/* ホームページURL */}
                        <div className="flex flex-col items-start md:flex-row py-2">
                            <div className="flex-2 flex flex-row items-center">
                                <p className="text-sm text-gray-400 py-2">ホームページURL</p>
                            </div>
                            <div className="flex-3">
                                <Controller
                                    name="home_page_url"
                                    control={control}
                                    render={({ field }) => (
                                        <CInput
                                            {...field}
                                            type="url"
                                            placeholder="https://example.com"
                                            className="w-full"
                                        />
                                    )}
                                />
                                {errors.home_page_url && (
                                    <p className="text-red-500 text-sm mt-1">{errors.home_page_url.message}</p>
                                )}
                            </div>
                        </div>

                        {/* アクセス */}
                        <div className="flex flex-col items-start md:flex-row py-2">
                            <div className="flex-2 flex flex-row items-center">
                                <p className="text-sm text-gray-400 py-2">アクセス</p>
                            </div>
                            <div className="flex-3">
                                <Controller
                                    name="access"
                                    control={control}
                                    render={({ field }) => (
                                        <CInput
                                            {...field}
                                            type="text"
                                            placeholder="アクセス情報を入力"
                                            className="w-full"
                                        />
                                    )}
                                />
                                {errors.access && (
                                    <p className="text-red-500 text-sm mt-1">{errors.access.message}</p>
                                )}
                            </div>
                        </div>

                        {/* 代表者名 */}
                        <div className="flex flex-col items-start md:flex-row py-2">
                            <div className="flex-2 flex flex-row items-center">
                                <p className="text-sm text-gray-400 py-2">代表者名</p>
                            </div>
                            <div className="flex-3">
                                <Controller
                                    name="director_name"
                                    control={control}
                                    render={({ field }) => (
                                        <CInput
                                            {...field}
                                            type="text"
                                            placeholder="代表者名を入力"
                                            className="w-full"
                                        />
                                    )}
                                />
                                {errors.director_name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.director_name.message}</p>
                                )}
                            </div>
                        </div>

                        {/* 従業員数 */}
                        <div className="flex flex-col items-start md:flex-row py-2">
                            <div className="flex-2 flex flex-row items-center">
                                <p className="text-sm text-gray-400 py-2">従業員数</p>
                            </div>
                            <div className="flex-3">
                                <Controller
                                    name="employee_number"
                                    control={control}
                                    render={({ field }) => (
                                        <CInput
                                            {...field}
                                            type="number"
                                            placeholder="従業員数を入力"
                                            className="w-full"
                                        />
                                    )}
                                />
                                {errors.employee_number && (
                                    <p className="text-red-500 text-sm mt-1">{errors.employee_number.message}</p>
                                )}
                            </div>
                        </div>

                        {/* 設立年 */}
                        <div className="flex flex-col items-start md:flex-row py-2">
                            <div className="flex-2 flex flex-row items-center">
                                <p className="text-sm text-gray-400 py-2">設立年</p>
                                <RequiredLabel />
                            </div>
                            <div className="flex-3">
                                <Controller
                                    name="establishment_year"
                                    control={control}
                                    render={({ field }) => (
                                        <CInput
                                            {...field}
                                            type="text"
                                            placeholder="設立年を入力"
                                            className="w-full"
                                        />
                                    )}
                                />
                                {errors.establishment_year && (
                                    <p className="text-red-500 text-sm mt-1">{errors.establishment_year.message}</p>
                                )}
                            </div>
                        </div>

                        {/* 事業内容 */}
                        <div className="flex flex-col items-start md:flex-row py-2">
                            <div className="flex-2 flex flex-row items-center">
                                <p className="text-sm text-gray-400 py-2">事業内容</p>
                                <RequiredLabel />
                            </div>
                            <div className="flex-3">
                                <Controller
                                    name="business"
                                    control={control}
                                    render={({ field }) => (
                                        <CInput
                                            {...field}
                                            type="text"
                                            placeholder="事業内容を入力"
                                            className="w-full"
                                        />
                                    )}
                                />
                                {errors.business && (
                                    <p className="text-red-500 text-sm mt-1">{errors.business.message}</p>
                                )}
                            </div>
                        </div>

                        {/* 資本金 */}
                        <div className="flex flex-col items-start md:flex-row py-2">
                            <div className="flex-2 flex flex-row items-center">
                                <p className="text-sm text-gray-400 py-2">資本金</p>
                                <RequiredLabel />
                            </div>
                            <div className="flex-3">
                                <Controller
                                    name="capital_stock"
                                    control={control}
                                    render={({ field }) => (
                                        <CInput
                                            {...field}
                                            type="text"
                                            placeholder="資本金を入力"
                                            className="w-full"
                                        />
                                    )}
                                />
                                {errors.capital_stock && (
                                    <p className="text-red-500 text-sm mt-1">{errors.capital_stock.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-4 mt-8">
                            <button
                                type="button"
                                onClick={() => onClose()}
                                className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                キャンセル
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                {isEdit ? '更新' : '作成'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}


