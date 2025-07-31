"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import CInput from "../../common/Input";
import RequiredLabel from "../../common/RequiredLabel";
import { submitCompanyApplication } from '@/lib/api';

export default function RecruiterForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { register, handleSubmit, formState: { errors }, trigger, setFocus } = useForm({ mode: "onChange" });

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      // Submit the company application
      await submitCompanyApplication(data);
      
      // Redirect to thank you page
      router.push('/recruiter/finish');
    } catch (error) {
      alert('送信中にエラーが発生しました。');
      console.log(error);
    } finally {
      setIsSubmitting(false);
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
    <>
      <form
        className="w-full max-w-[960px] mx-auto bg-white p-4 sm:p-8 md:px-15 md:py-20 rounded shadow-lg"
        onSubmit={onValidateAndSubmit}
        noValidate
      >
        {/* 会社名 */}
        <div className="flex md:items-center gap-4 mb-2 flex-col md:flex-row">
          <label className="min-w-[120px] md:min-w-[200px] flex-shrink-0">
            会社名 <RequiredLabel />
          </label>
          <div className="w-full">
            <CInput
              placeholder="会社名を入力してください"
              {...register("company_name", { required: "会社名は必須です" })}
              isError={!!errors.company_name}
              errorText={errors.company_name?.message as string}
              className="w-full"
            />
          </div>
        </div>
        <hr className="border-[#dfdfdf] my-6" />
        {/* 部署名 */}
        <div className="flex md:items-center gap-4 mb-2 flex-col md:flex-row">
          <label className="min-w-[120px] md:min-w-[200px] flex-shrink-0">
            部署名 <RequiredLabel />
          </label>
          <div className="w-full">
            <CInput
              placeholder="部署名を入力してください"
              {...register("department_name", { required: "部署名は必須です" })}
              isError={!!errors.department_name}
              errorText={errors.department_name?.message as string}
              className="w-full"
            />
          </div>
        </div>
        <hr className="border-[#dfdfdf] my-6" />
        {/* お名前 */}
        <div className="flex md:items-center gap-4 mb-2 flex-col md:flex-row">
          <label className="min-w-[120px] md:min-w-[200px] flex-shrink-0">
            お名前 <RequiredLabel />
          </label>
          <div className="w-full">
            <CInput
              placeholder="お名前を入力してください"
              {...register("name", { required: "お名前は必須です" })}
              isError={!!errors.name}
              errorText={errors.name?.message as string}
              className="w-full"
            />
          </div>
        </div>
        <hr className="border-[#dfdfdf] my-6" />
        {/* メールアドレス */}
        <div className="flex md:items-center gap-4 mb-2 flex-col md:flex-row">
          <label className="min-w-[120px] md:min-w-[200px] flex-shrink-0">
            メールアドレス <RequiredLabel />
          </label>
          <div className="w-full">
            <CInput
              type="email"
              placeholder="メールアドレスを入力してください"
              {...register("email", {
                required: "メールアドレスは必須です",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "有効なメールアドレスを入力してください",
                },
              })}
              isError={!!errors.email}
              errorText={errors.email?.message as string}
              className="w-full"
            />
          </div>
        </div>
        <hr className="border-[#dfdfdf] my-6" />
        {/* 電話番号 */}
        <div className="flex md:items-center gap-4 mb-2 flex-col md:flex-row">
          <label className="min-w-[120px] md:min-w-[200px] flex-shrink-0">
            電話番号 <RequiredLabel />
          </label>
          <div className="w-full">
            <CInput
              type="tel"
              placeholder="電話番号を入力してください"
              {...register("telephone", { required: "電話番号は必須です" })}
              isError={!!errors.telephone}
              errorText={errors.telephone?.message as string}
              className="w-full"
            />
          </div>
        </div>
        <hr className="border-[#dfdfdf] my-6" />
        {/* お問い合わせ内容について */}
        <div className="flex md:items-center gap-4 mb-2 flex-col md:flex-row">
          <label className="min-w-[120px] md:min-w-[200px] flex-shrink-0">
            お問い合わせ内容について
          </label>
          <div className="w-full">
            <CInput
              multiline
              placeholder="お問い合わせ内容を入力してください"
              {...register("inquiry")}
              className="w-full"
              height="h-[100px]"
            />
          </div>
        </div>
        <hr className="border-[#dfdfdf] my-6" />
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer bg-blue-500 text-white px-15 py-3 rounded text-base transition-all duration-300 ease-in-out hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting && (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isSubmitting ? '送信中...' : '送信'}
          </button>
        </div>
      </form>
    </>
  );
} 