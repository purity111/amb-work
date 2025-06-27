"use client";

import { useForm, Controller } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import useGetCurrentUser from "@/hooks/useGetCurrentUser";
import { PrefectureOptions, GenderOptions } from "@/utils/constants";
import { toast } from "react-toastify";
import CInput from "@/components/common/Input";
import CSelect from "@/components/common/Select";
import CButton from "@/components/common/Button";
import RequiredLabel from "@/components/common/RequiredLabel";
import Image from "next/image";
import { updateJobSeekerProfile, updateEmployerProfile } from "@/lib/api";

type FormValues = {
    name: string;
    name_kana: string;
    birthdate: string;
    sex: string;
    tel: string;
    zip: string;
    prefectures: string;
    role: string;
    avatarUrl?: string;
    // Employer fields
    clinic_name?: string;
    clinic_name_kana?: string;
    closest_stataion?: string;
    employee_number?: number;
    establishment_year?: string;
    city?: string;
    business?: string;
    home_page_url?: string;
};

export default function ProfilePage() {
    const hasPreloaded = useRef(false);
    const { data: currentUserData, isLoading, isError, refetch } = useGetCurrentUser({
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    });

    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isDirty },
    } = useForm<FormValues>({
        defaultValues: {
            name: '',
            name_kana: '',
            birthdate: '',
            sex: '',
            tel: '',
            zip: '',
            prefectures: '',
            role: '',
            avatarUrl: '',
            clinic_name: '',
            clinic_name_kana: '',
            closest_stataion: '',
            employee_number: undefined,
            establishment_year: '',
            city: '',
            business: '',
            home_page_url: '',
        }
    });

    const watchedRole = watch('role');
    const watchedAvatarUrl = watch('avatarUrl');
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    useEffect(() => {
        if (!hasPreloaded.current && currentUserData?.success && currentUserData?.data) {
            const userData = currentUserData.data;
            console.log('main-data', userData);
            
            reset({
                name: userData.name || userData.clinic_name || '',
                name_kana: userData.name_kana || userData.clinic_name_kana || '',
                birthdate: userData.birthdate || '',
                sex: userData.sex?.toString() || '',
                tel: userData.tel || '',
                zip: userData.zip || '',
                prefectures: userData.prefectures?.toString() || '',
                role: userData.role || '',
                avatarUrl: userData.avatarUrl || '',
                clinic_name: userData.clinic_name || '',
                clinic_name_kana: userData.clinic_name_kana || '',
                closest_stataion: userData.closest_stataion || '',
                employee_number: userData.employee_number,
                establishment_year: userData.establishment_year || '',
                city: userData.city || '',
                business: userData.business || '',
                home_page_url: userData.home_page_url || '',
            });
            hasPreloaded.current = true;
        }
    }, [currentUserData, reset]);

    const onSubmit = async (data: FormValues) => {
        try {
            if (!currentUserData?.data?.id) {
                toast.error('ユーザーIDが見つかりません');
                return;
            }

            const userId = currentUserData.data.id;
            const userRole = currentUserData.data.role; // Use actual user role from API
            const prefecturesNumber = parseInt(data.prefectures);

            console.log('Form data:', data);

            if (userRole === 'jobseeker') {
                // Update JobSeeker profile with FormData (including avatar if selected)
                const formData = new FormData();
                formData.append('id', userId);
                formData.append('name', data.name);
                formData.append('name_kana', data.name_kana);
                formData.append('birthdate', data.birthdate);
                formData.append('sex', data.sex);
                formData.append('zip', data.zip);
                formData.append('prefectures', data.prefectures);
                formData.append('tel', data.tel);
                if (avatarFile) {
                    formData.append('avatar', avatarFile);
                }

                console.log('Updating JobSeeker with data:', Object.fromEntries(formData.entries()));
                const response = await updateJobSeekerProfile(formData);
                console.log('JobSeeker update API response:', response);

                if (response.success) {
                    toast.success('プロフィールが更新されました');
                    await refetch();
                    hasPreloaded.current = false;
                    setAvatarFile(null);
                    setAvatarPreview(null);
                } else {
                    toast.error(response.message || 'プロフィールの更新に失敗しました');
                }
            } else if (userRole === 'employer') {
                // Update Employer profile (add avatar if API supports it)
                const updateData: any = {
                    id: userId,
                    clinic_name: data.clinic_name || '',
                    clinic_name_kana: data.clinic_name_kana || '',
                    zip: data.zip,
                    prefectures: prefecturesNumber,
                    closest_stataion: data.closest_stataion || '',
                    tel: data.tel,
                    employee_number: data.employee_number,
                    establishment_year: data.establishment_year || '',
                    city: data.city || '',
                    business: data.business || '',
                    home_page_url: data.home_page_url || '',
                };
                if (avatarFile) {
                    updateData.avatar = avatarFile; // Only if API supports file upload for employer
                }

                console.log('Updating Employer with data:', updateData);
                const response = await updateEmployerProfile(updateData);
                console.log('Employer update API response:', response);

                if (response.success) {
                    toast.success('プロフィールが更新されました');
                    await refetch();
                    hasPreloaded.current = false;
                    setAvatarFile(null);
                    setAvatarPreview(null);
                } else {
                    toast.error(response.message || 'プロフィールの更新に失敗しました');
                }
            } else {
                console.error('Unsupported user role:', userRole);
                toast.error(`サポートされていないユーザータイプです: ${userRole}`);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('プロフィールの更新に失敗しました');
        }
    };

    // Avatar image change handler
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setAvatarPreview(previewUrl);
            setAvatarFile(file);
            setValue('avatarUrl', previewUrl, { shouldDirty: true });
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
        <div className="flex flex-col p-3 md:p-10 lg:max-w-[960px] mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-10 text-center">プロフィール管理</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-8 gap-10 w-full justify-center items-center md:[align-items:unset]">
                {/* Avatar section */}
                <div className="flex flex-col items-center w-1/2 w-1/2 md:w-[25%]">
                    <Image
                        src={avatarPreview || `${process.env.NEXT_PUBLIC_UPLOADS_BASE_URL}/${currentUserData?.data?.avatar}` || '/images/default-avatar.jpg'}
                        alt="avatar"
                        width={160}
                        height={160}
                        className="rounded-full border mb-4 w-40 h-40 object-cover"
                    />
                    <label
                        htmlFor="avatar-upload"
                        className="w-full text-center font-semibold mb-1 bg-blue-100 py-2 px-4 rounded cursor-pointer hover:bg-blue-200"
                    >
                        画像選択
                    </label>
                    <input
                        id="avatar-upload"
                        type="file"
                        className="hidden"
                        onChange={handleAvatarChange}
                    />
                </div>

                <div className="w-full md:w-[70%]">
                    {/* Form Fields */}
                    <div className="w-full space-y-6">

                        {watchedRole === 'jobseeker' ? (
                            // JobSeeker Fields
                            <>
                                {/* Name */}
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1 min-w-[130px]">
                                        <label className="block text-sm font-medium">氏名</label>
                                        <RequiredLabel />
                                    </div>
                                    <div className="flex-1">
                                        <Controller
                                            name="name"
                                            control={control}
                                            rules={{ required: '氏名は必須です' }}
                                            render={({ field }) => (
                                                <CInput
                                                    {...field}
                                                    placeholder="氏名を入力"
                                                    isError={!!errors.name}
                                                    errorText={errors.name?.message}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Name Kana */}
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1 min-w-[130px]">
                                        <label className="block text-sm font-medium">氏名フリガナ</label>
                                        <RequiredLabel />
                                    </div>
                                    <div className="flex-1">
                                        <Controller
                                            name="name_kana"
                                            control={control}
                                            rules={{ required: '氏名フリガナは必須です' }}
                                            render={({ field }) => (
                                                <CInput
                                                    {...field}
                                                    placeholder="氏名フリガナを入力"
                                                    isError={!!errors.name_kana}
                                                    errorText={errors.name_kana?.message}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Birthdate */}
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1 min-w-[130px]">
                                        <label className="block text-sm font-medium">生年月日</label>
                                    </div>
                                    <div className="flex-1">
                                        <Controller
                                            name="birthdate"
                                            control={control}
                                            render={({ field }) => (
                                                <CInput
                                                    {...field}
                                                    type="date"
                                                    placeholder="生年月日を入力"
                                                    isError={!!errors.birthdate}
                                                    errorText={errors.birthdate?.message}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Sex */}
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1 min-w-[130px]">
                                        <label className="block text-sm font-medium">性別</label>
                                        <RequiredLabel />
                                    </div>
                                    <div className="flex-1">
                                        <Controller
                                            name="sex"
                                            control={control}
                                            rules={{ required: '性別は必須です' }}
                                            render={({ field }) => (
                                                <CSelect
                                                    {...field}
                                                    options={GenderOptions}
                                                    placeholder="性別を選択"
                                                    isError={!!errors.sex}
                                                    errorText={errors.sex?.message}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            </>
                        ) : watchedRole === 'employer' ? (
                            // Employer Fields
                            <>
                                {/* Clinic Name */}
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1 min-w-[130px]">
                                        <label className="block text-sm font-medium">クリニック名</label>
                                        <RequiredLabel />
                                    </div>
                                    <div className="flex-1">
                                        <Controller
                                            name="clinic_name"
                                            control={control}
                                            rules={{ required: 'クリニック名は必須です' }}
                                            render={({ field }) => (
                                                <CInput
                                                    {...field}
                                                    placeholder="クリニック名を入力"
                                                    isError={!!errors.clinic_name}
                                                    errorText={errors.clinic_name?.message}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Clinic Name Kana */}
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1 min-w-[130px]">
                                        <label className="block text-sm font-medium">クリニック名フリガナ</label>
                                        <RequiredLabel />
                                    </div>
                                    <div className="flex-1">
                                        <Controller
                                            name="clinic_name_kana"
                                            control={control}
                                            rules={{ required: 'クリニック名フリガナは必須です' }}
                                            render={({ field }) => (
                                                <CInput
                                                    {...field}
                                                    placeholder="クリニック名フリガナを入力"
                                                    isError={!!errors.clinic_name_kana}
                                                    errorText={errors.clinic_name_kana?.message}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            </>
                        ) : null}

                        {/* Common Fields for both roles */}
                        {/* Phone */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 min-w-[130px]">
                                <label className="block text-sm font-medium">電話番号</label>
                                <RequiredLabel />
                            </div>
                            <div className="flex-1">
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
                        </div>

                        {/* Zip Code */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 min-w-[130px]">
                                <label className="block text-sm font-medium">郵便番号</label>
                                <RequiredLabel />
                            </div>
                            <div className="flex-1">
                                <Controller
                                    name="zip"
                                    control={control}
                                    rules={{
                                        required: '郵便番号は必須です',
                                        pattern: {
                                            value: /^\d{3}-\d{4}$/,
                                            message: '郵便番号は「123-4567」の形式で入力してください'
                                        }
                                    }}
                                    render={({ field }) => (
                                        <CInput
                                            {...field}
                                            placeholder="123-4567"
                                            isError={!!errors.zip}
                                            errorText={errors.zip?.message}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* Prefectures */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 min-w-[130px]">
                                <label className="block text-sm font-medium">都道府県</label>
                                <RequiredLabel />
                            </div>
                            <div className="flex-1">
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
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end w-full mt-5">
                        <CButton
                            text="更新"
                            type="submit"
                            className="bg-blue-500 text-white px-[60px] py-2"
                            disabled={!isDirty}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
} 