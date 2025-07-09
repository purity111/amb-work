"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import CInput from "../../common/Input";
import RequiredLabel from "../../common/RequiredLabel";
import { submitCompanyApplication } from '@/lib/api';

export default function RecruiterForm() {
  const { register, handleSubmit, formState: { errors }, trigger, setFocus, watch, reset } = useForm({ mode: "onChange" });
  const [toast, setToast] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    try {
      await submitCompanyApplication(data);
      setToast('送信が完了しました。');
      reset();
      setTimeout(() => setToast(null), 2000);
    } catch (error) {
      alert('送信中にエラーが発生しました。');
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
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-green-500 text-white px-6 py-3 rounded shadow-lg animate-fadein">
          {toast}
        </div>
      )}
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
            className="cursor-pointer bg-blue-500 text-white px-15 py-3 rounded text-base transition-all duration-300 ease-in-out hover:opacity-90"
          >
            送信
          </button>
        </div>
      </form>
    </>
  );
} 