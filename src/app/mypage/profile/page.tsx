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
import PasswordInput from "@/components/common/PasswordInput";
import Image from "next/image";
import { updateJobSeekerProfile, updateEmployerProfile, requestChangeEmail, changePassword } from "@/lib/api";
import { UPLOADS_BASE_URL } from "@/utils/config";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import Spinner from '@/components/common/Spinner';

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
    clinic_name?: string;
    clinic_name_kana?: string;
    closest_stataion?: string;
    employee_number?: number;
    establishment_year?: string;
    city?: string;
    business?: string;
    home_page_url?: string;
    address?: string;
    capital_stock?: string;
};

type ChangePasswordFormValues = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};

const changePasswordSchema = Yup.object().shape({
    currentPassword: Yup.string()
        .required('現在のパスワードは必須です。'),
    newPassword: Yup.string()
        .required('新しいパスワードは必須です。')
        .min(8, '8文字以上である必要があります')
        .matches(/[0-9]/, '数字を含めてください。')
        .matches(/[@$!%*?&#]/, '特殊記号を含めてください。'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'パスワードは一致する必要があります')
        .required('確認用パスワードは必須です。'),
});

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
            address: '',
            capital_stock: '',
        }
    });

    // Separate form for change password
    const {
        control: passwordControl,
        handleSubmit: handlePasswordSubmit,
        reset: resetPasswordForm,
        formState: { errors: passwordErrors, isDirty: passwordIsDirty },
    } = useForm<ChangePasswordFormValues>({
        resolver: yupResolver(changePasswordSchema),
        mode: 'onChange',
    });

    const watchedRole = watch('role');
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [emailChangeLoading, setEmailChangeLoading] = useState(false);
                      const [newEmail, setNewEmail] = useState("");
                  const [emailChangeSuccess, setEmailChangeSuccess] = useState(false);
                  const currentEmail = currentUserData?.data?.email || "";
                  const [emailError, setEmailError] = useState<string | undefined>(undefined);

    // Profile update mutation
    const profileUpdateMutation = useMutation({
        mutationFn: async (data: FormValues) => {
            if (!currentUserData?.data?.id) {
                throw new Error('ユーザーIDが見つかりません');
            }

            const userId = currentUserData.data.id;
            const userRole = currentUserData.data.role; // Use actual user role from API

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

                const response = await updateJobSeekerProfile(formData);
                if (response.success) {
                    await refetch();
                    hasPreloaded.current = false;
                    setAvatarFile(null);
                    setAvatarPreview(null);
                    return response;
                } else {
                    throw new Error(response.message || 'プロフィールの更新に失敗しました');
                }
            } else if (userRole === 'employer') {
                // Update Employer profile with FormData (including avatar if selected)
                const formData = new FormData();
                formData.append('id', userId);
                formData.append('clinic_name', data.clinic_name || '');
                formData.append('clinic_name_kana', data.clinic_name_kana || '');
                formData.append('zip', data.zip);
                formData.append('prefectures', data.prefectures);
                formData.append('city', data.address || '');
                formData.append('tel', data.tel);
                formData.append('employee_number', data.employee_number?.toString() || '');
                formData.append('establishment_year', data.establishment_year || '');
                formData.append('business', data.business || '');
                formData.append('home_page_url', data.home_page_url || '');
                formData.append('capital_stock', data.capital_stock || '');
                if (avatarFile) {
                    formData.append('avatar', avatarFile);
                }
                const response = await updateEmployerProfile(formData);

                if (response.success) {
                    await refetch();
                    hasPreloaded.current = false;
                    setAvatarFile(null);
                    setAvatarPreview(null);
                    return response;
                } else {
                    throw new Error(response.message || 'プロフィールの更新に失敗しました');
                }
            } else {
                throw new Error(`サポートされていないユーザータイプです: ${userRole}`);
            }
        },
        onSuccess: (data) => {
            console.log('Profile update success: ', data);
            toast.success('プロフィールが更新されました');
        },
        onError: (error: any) => {
            console.error('Error updating profile:', error);
            toast.error(error.message || 'プロフィールの更新に失敗しました');
        },
    });

    // Change password mutation
    const changePasswordMutation = useMutation({
        mutationFn: changePassword,
        onSuccess: (data) => {
            console.log('Password change success: ', data);
            toast.success('パスワードが正常に変更されました。');
            resetPasswordForm(); // Reset password form after successful change
        },
        onError: (error: any) => {
            console.error('Password change error: ', error);
            // Check if the error is due to incorrect current password
            if (error?.response?.data?.message?.includes('current') || 
                error?.response?.data?.message?.includes('Current') ||
                error?.response?.status === 401) {
                toast.error('現在のパスワードが正しくありません。');
            } else {
                toast.error(error?.response?.data?.message || 'パスワードの変更に失敗しました。');
            }
        },
    });

    const onChangePasswordSubmit = (data: ChangePasswordFormValues) => {
        changePasswordMutation.mutate({
            currentPassword: data.currentPassword,
            newPassword: data.newPassword
        });
    };

    useEffect(() => {
        if (!hasPreloaded.current && currentUserData?.success && currentUserData?.data) {
            const userData = currentUserData.data;
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
                address: userData.city || '',
                capital_stock: userData.capital_stock || '',
            });
            hasPreloaded.current = true;
        }
    }, [currentUserData, reset]);

    // Additional useEffect to handle form reset after updates
    useEffect(() => {
        if (currentUserData?.success && currentUserData?.data && hasPreloaded.current) {
            const userData = currentUserData.data;

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
                address: userData.city || '',
                capital_stock: userData.capital_stock || '',
            });
        }
    }, [currentUserData, reset]);

    useEffect(() => {
        if (currentEmail && !newEmail) {
            setNewEmail(currentEmail);
        }
    }, [currentEmail, newEmail]);

    // Auto-hide email change success message after 5 seconds
    useEffect(() => {
        if (emailChangeSuccess) {
            const timer = setTimeout(() => {
                setEmailChangeSuccess(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [emailChangeSuccess]);

    const onSubmit = (data: FormValues) => {
        profileUpdateMutation.mutate(data);
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

    // Email change handler
                    const handleEmailChangeRequest = async () => {
                    if (!newEmail || newEmail === currentEmail) {
                        toast.error("新しいメールアドレスを入力してください");
                        return;
                    }
                    setEmailChangeLoading(true);
                    setEmailChangeSuccess(false);
                    try {
                        const res = await requestChangeEmail(newEmail);
                        if (res.success) {
                            toast.success("確認メールを送信しました。メールをご確認ください。");
                            setEmailChangeSuccess(true);
                        } else {
                            // Show backend error message if available
                            if (res.message) {
                                toast.error(res.message);
                            } else {
                                toast.error("メールアドレスの変更リクエストに失敗しました");
                            }
                        }
                    } catch (err: any) {
                        // Handle axios error responses with backend messages
                        let errorMessage = "メールアドレスの変更リクエストに失敗しました";
                        if (err?.response?.data?.message) {
                            errorMessage = err.response.data.message;
                        } else if (err?.response?.data?.error) {
                            errorMessage = err.response.data.error;
                        }
                        toast.error(errorMessage);
                        console.log(err);
                    } finally {
                        setEmailChangeLoading(false);
                    }
                };

    function validateEmail(email: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

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
        <div className="flex flex-col justify-center p-3 md:p-0 lg:max-w-[960px] mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-10 text-center">プロフィール管理</h1>

            {/* Show empty page for admin users */}
            {watchedRole === 'admin' || watchedRole === 'subadmin' ? (
                <div className="text-center text-gray-500">
                    {/* Empty page for admin users */}
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-8 gap-10 w-full sm:w-[90%] md:w-full mx-0 justify-center items-center md:[align-items:unset]">
                    {/* Avatar section */}
                    <div className="flex flex-col items-center w-1/2 w-1/2 md:w-[25%]">
                        <Image
                            src={avatarPreview || `${UPLOADS_BASE_URL}/${currentUserData?.data?.avatar}` || '/images/default-avatar.jpg'}
                            alt="アバター"
                            width={160}
                            height={160}
                            className="rounded-full border mb-4 w-40 h-40 object-cover"
                        />
                        <label
                            htmlFor="avatar-upload"
                            className="w-full text-center font-semibold border mb-1 bg-blue-100 py-2 px-4 rounded cursor-pointer hover:bg-blue-200"
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
                                    {/* Company Name */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1 min-w-[130px]">
                                            <label className="block text-sm font-medium">会社名</label>
                                            <RequiredLabel />
                                        </div>
                                        <div className="flex-1">
                                            <Controller
                                                name="clinic_name"
                                                control={control}
                                                rules={{ required: '会社名は必須です' }}
                                                render={({ field }) => (
                                                    <CInput
                                                        {...field}
                                                        placeholder="会社名を入力"
                                                        isError={!!errors.clinic_name}
                                                        errorText={errors.clinic_name?.message}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>

                                    {/* Company Name Kana */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1 min-w-[130px]">
                                            <label className="block text-sm font-medium text-center">会社名<br />フリガナ</label>
                                            <RequiredLabel />
                                        </div>
                                        <div className="flex-1">
                                            <Controller
                                                name="clinic_name_kana"
                                                control={control}
                                                rules={{ required: '会社名フリガナは必須です' }}
                                                render={({ field }) => (
                                                    <CInput
                                                        {...field}
                                                        placeholder="会社名フリガナを入力"
                                                        isError={!!errors.clinic_name_kana}
                                                        errorText={errors.clinic_name_kana?.message}
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

                                    {/* Address */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1 min-w-[130px]">
                                            <label className="block text-sm font-medium text-center">都道府県以降<br />の住所</label>
                                            <RequiredLabel />
                                        </div>
                                        <div className="flex-1">
                                            <Controller
                                                name="address"
                                                control={control}
                                                rules={{ required: '住所は必須です' }}
                                                render={({ field }) => (
                                                    <CInput
                                                        {...field}
                                                        placeholder="住所を入力"
                                                        isError={!!errors.address}
                                                        errorText={errors.address?.message}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>

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

                                    {/* Employee Number */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1 min-w-[130px]">
                                            <label className="block text-sm font-medium">従業員数</label>
                                        </div>
                                        <div className="flex-1">
                                            <Controller
                                                name="employee_number"
                                                control={control}
                                                render={({ field }) => (
                                                    <CInput
                                                        {...field}
                                                        type="number"
                                                        placeholder="従業員数を入力"
                                                        isError={!!errors.employee_number}
                                                        errorText={errors.employee_number?.message}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>

                                    {/* Establishment Year */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1 min-w-[130px]">
                                            <label className="block text-sm font-medium">設立年月日</label>
                                        </div>
                                        <div className="flex-1">
                                            <Controller
                                                name="establishment_year"
                                                control={control}
                                                render={({ field }) => (
                                                    <CInput
                                                        {...field}
                                                        type="date"
                                                        placeholder="設立年月日を入力"
                                                        isError={!!errors.establishment_year}
                                                        errorText={errors.establishment_year?.message}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>

                                    {/* Capital */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1 min-w-[130px]">
                                            <label className="block text-sm font-medium">資本金(万円)</label>
                                        </div>
                                        <div className="flex-1">
                                            <Controller
                                                name="capital_stock"
                                                control={control}
                                                render={({ field }) => (
                                                    <CInput
                                                        {...field}
                                                        placeholder="資本金を入力"
                                                        isError={!!errors.capital_stock}
                                                        errorText={errors.capital_stock?.message}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>

                                    {/* Business Description */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1 min-w-[130px]">
                                            <label className="block text-sm font-medium">事業内容</label>
                                        </div>
                                        <div className="flex-1">
                                            <Controller
                                                name="business"
                                                control={control}
                                                render={({ field }) => (
                                                    <CInput
                                                        {...field}
                                                        placeholder="事業内容を入力"
                                                        isError={!!errors.business}
                                                        errorText={errors.business?.message}
                                                        multiline
                                                        height="h-[100px]"
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>

                                    {/* Website URL */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1 min-w-[130px]">
                                            <label className="block text-sm font-medium">サイトURL</label>
                                        </div>
                                        <div className="flex-1">
                                            <Controller
                                                name="home_page_url"
                                                control={control}
                                                render={({ field }) => (
                                                    <CInput
                                                        {...field}
                                                        placeholder="サイトURLを入力"
                                                        isError={!!errors.home_page_url}
                                                        errorText={errors.home_page_url?.message}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : null}

                            {/* Common Fields for jobseekers only */}
                            {watchedRole === 'jobseeker' && (
                                <>
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
                                </>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end w-full mt-5">
                            <CButton
                                text={profileUpdateMutation.isPending ? (
                                    <div className="flex items-center justify-center">
                                        <Spinner size={4} />
                                        <span className="ml-2">更新中...</span>
                                    </div>
                                ) : "更新"}
                                type="submit"
                                className="bg-blue-500 text-white px-[60px] py-2"
                                disabled={!isDirty || profileUpdateMutation.isPending}
                            />
                        </div>
                    </div>
                </form>
            )}

            {/* Email Change Section */}
            <div className="mb-8 p-4 border-[#dfdfdf] rounded mt-10 md:mt-20 bg-gray-50">

                <div className="flex flex-col md:flex-row items-center gap-4 mb-2">
                    <div className="flex items-center gap-1 min-w-[130px]">
                        <label className="block text-sm font-medium">メールアドレス</label>
                    </div>
                    <div className="flex-1 flex flex-col md:flex-row gap-2 justify-end">
                                                            <CInput
                                        type="email"
                                        value={newEmail}
                                        onChange={e => {
                                            setNewEmail(e.target.value);
                                            if (!validateEmail(e.target.value)) {
                                                setEmailError("有効なメールアドレスを入力してください");
                                            } else {
                                                setEmailError(undefined);
                                            }
                                        }}
                                        placeholder="新しいメールアドレス"
                                        className="w-full lg:w-80"
                                        disabled={emailChangeLoading}
                                        isError={!!emailError}
                                        errorText={emailError}
                                    />
                        <CButton
                            type="button"
                            text={emailChangeLoading ? "送信中..." : "メールアドレス変更"}
                            className="bg-blue-500 text-white"
                            onClick={handleEmailChangeRequest}
                            disabled={emailChangeLoading || !newEmail || newEmail === currentEmail || !!emailError}
                        />
                    </div>
                </div>
                                                {emailChangeSuccess && (
                                    <div className="text-green-600 text-sm mt-2">確認メールを送信しました。メールをご確認ください。</div>
                                )}
            </div>

            {/* Change Password Section */}
            <div className="mb-8 p-4 border-[#dfdfdf] rounded bg-gray-50">
                <h2 className="text-xl font-bold mb-4">パスワード変更</h2>
                <form onSubmit={handlePasswordSubmit(onChangePasswordSubmit)} className="flex flex-col gap-4">
                    <Controller
                        name="currentPassword"
                        control={passwordControl}
                        rules={{ required: '現在のパスワードは必須です。' }}
                        render={({ field }) => (
                            <PasswordInput
                                {...field}
                                placeholder="現在のパスワード"
                                isError={!!passwordErrors.currentPassword}
                                errorText={passwordErrors.currentPassword?.message}
                            />
                        )}
                    />
                    <Controller
                        name="newPassword"
                        control={passwordControl}
                        render={({ field }) => (
                            <PasswordInput
                                {...field}
                                placeholder="新しいパスワード"
                                isError={!!passwordErrors.newPassword}
                                errorText={passwordErrors.newPassword?.message}
                            />
                        )}
                    />
                    <Controller
                        name="confirmPassword"
                        control={passwordControl}
                        render={({ field }) => (
                            <PasswordInput
                                {...field}
                                placeholder="確認用パスワード"
                                isError={!!passwordErrors.confirmPassword}
                                errorText={passwordErrors.confirmPassword?.message}
                            />
                        )}
                    />
                    <CButton
                        text={changePasswordMutation.isPending ? (
                            <div className="flex items-center justify-center">
                                <Spinner size={4} />
                                <span className="ml-2">変更中...</span>
                            </div>
                        ) : "パスワードを変更"}
                        type="submit"
                        className="bg-blue-500 text-white px-[60px] py-2"
                        disabled={!passwordIsDirty || changePasswordMutation.isPending}
                    />
                </form>
                {changePasswordMutation.isSuccess && (
                    <div className="text-green-600 text-sm mt-2">パスワードが変更されました。</div>
                )}
            </div>
        </div>
    );
} 