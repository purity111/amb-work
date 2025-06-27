"use client";

import { useForm, Controller } from "react-hook-form";
import { useEffect, useRef } from "react";
import CInput from "@/components/common/Input";
import CSelect from "@/components/common/Select";
import CButton from "@/components/common/Button";
import RequiredLabel from "@/components/common/RequiredLabel";
import useGetCurrentUser from "@/hooks/useGetCurrentUser";
import { PrefectureOptions } from "@/utils/constants";
import { toast } from "react-toastify";

type FormValues = {
    name: string;
    email: string;
    tel: string;
    zip: string;
    prefectures: string;
    role: string;
};

export default function SimpleUserProfileForm() {
    const hasPreloaded = useRef(false);
    
    // Use the getCurrentUser hook to fetch user data
    const { data: currentUserData, isLoading, isError, refetch } = useGetCurrentUser({
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isDirty },
    } = useForm<FormValues>({
        defaultValues: {
            name: '',
            email: '',
            tel: '',
            zip: '',
            prefectures: '',
            role: '',
        }
    });

    const watchedRole = watch('role');

    // Fill form fields when current user data is loaded
    useEffect(() => {
        if (!hasPreloaded.current && currentUserData?.success && currentUserData?.data) {
            const userData = currentUserData.data;
            
            // Reset form with current user data
            reset({
                name: userData.name || '',
                email: userData.email || '',
                tel: userData.tel || '',
                zip: userData.zip || '',
                prefectures: userData.prefectures?.toString() || '',
                role: userData.role || '',
            });
            
            hasPreloaded.current = true;
        }
    }, [currentUserData, reset]);

    const onSubmit = async (data: FormValues) => {
        try {
            console.log('Form submitted with data:', data);
            toast.success('プロフィールが更新されました');
            
            // Refresh current user data from API
            await refetch();
            
            // Reset the preloaded flag to allow re-population with fresh data
            hasPreloaded.current = false;
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('プロフィールの更新に失敗しました');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center text-red-500 p-4">
                ユーザー情報の取得に失敗しました
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">シンプルプロフィール編集 (getCurrentUser API使用)</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Role Display */}
                <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">
                        ユーザータイプ: <span className="font-semibold">
                            {watchedRole === 'JobSeeker' ? '求職者' : 
                             watchedRole === 'Employer' ? '採用企業' : 
                             watchedRole === 'admin' ? '管理者' : 
                             watchedRole === 'subadmin' ? 'サブ管理者' : ''}
                        </span>
                    </p>
                </div>

                {/* Name */}
                <div>
                    <div className="flex items-center gap-1 mb-2">
                        <label className="block text-sm font-medium">名前</label>
                        <RequiredLabel />
                    </div>
                    <Controller
                        name="name"
                        control={control}
                        rules={{ required: '名前は必須です' }}
                        render={({ field }) => (
                            <CInput
                                {...field}
                                placeholder="名前を入力"
                                isError={!!errors.name}
                                errorText={errors.name?.message}
                            />
                        )}
                    />
                </div>

                {/* Email */}
                <div>
                    <div className="flex items-center gap-1 mb-2">
                        <label className="block text-sm font-medium">メールアドレス</label>
                        <RequiredLabel />
                    </div>
                    <Controller
                        name="email"
                        control={control}
                        rules={{ 
                            required: 'メールアドレスは必須です',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: '有効なメールアドレスを入力してください'
                            }
                        }}
                        render={({ field }) => (
                            <CInput
                                {...field}
                                type="email"
                                placeholder="メールアドレスを入力"
                                isError={!!errors.email}
                                errorText={errors.email?.message}
                            />
                        )}
                    />
                </div>

                {/* Phone */}
                <div>
                    <div className="flex items-center gap-1 mb-2">
                        <label className="block text-sm font-medium">電話番号</label>
                        <RequiredLabel />
                    </div>
                    <Controller
                        name="tel"
                        control={control}
                        rules={{ required: '電話番号は必須です' }}
                        render={({ field }) => (
                            <CInput
                                {...field}
                                placeholder="電話番号を入力"
                                isError={!!errors.tel}
                                errorText={errors.tel?.message}
                            />
                        )}
                    />
                </div>

                {/* Zip Code */}
                <div>
                    <div className="flex items-center gap-1 mb-2">
                        <label className="block text-sm font-medium">郵便番号</label>
                        <RequiredLabel />
                    </div>
                    <Controller
                        name="zip"
                        control={control}
                        rules={{ 
                            required: '郵便番号は必須です',
                            pattern: {
                                value: /^\d{7}$/,
                                message: '郵便番号は7桁の数字で入力してください'
                            }
                        }}
                        render={({ field }) => (
                            <CInput
                                {...field}
                                placeholder="郵便番号を入力 (例: 1234567)"
                                isError={!!errors.zip}
                                errorText={errors.zip?.message}
                            />
                        )}
                    />
                </div>

                {/* Prefectures */}
                <div>
                    <div className="flex items-center gap-1 mb-2">
                        <label className="block text-sm font-medium">都道府県</label>
                        <RequiredLabel />
                    </div>
                    <Controller
                        name="prefectures"
                        control={control}
                        rules={{ required: '都道府県は必須です' }}
                        render={({ field }) => (
                            <CSelect
                                {...field}
                                options={PrefectureOptions}
                                placeholder="都道府県を選択"
                                isError={!!errors.prefectures}
                                errorText={errors.prefectures?.message}
                            />
                        )}
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <CButton
                        text="更新"
                        type="submit"
                        className="bg-blue-500 text-white px-6 py-2"
                        disabled={!isDirty}
                    />
                </div>
            </form>

            {/* Debug Info */}
            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                <h3 className="text-sm font-semibold mb-2">デバッグ情報:</h3>
                <p className="text-xs text-gray-600">
                    API データ: {currentUserData?.success ? '取得成功' : '取得失敗'}
                </p>
                <p className="text-xs text-gray-600">
                    フォーム変更: {isDirty ? '変更あり' : '変更なし'}
                </p>
                <p className="text-xs text-gray-600">
                    プリロード状態: {hasPreloaded.current ? '完了' : '未完了'}
                </p>
            </div>
        </div>
    );
} 