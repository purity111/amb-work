import CButton from '@/components/common/Button';
import CInput from '@/components/common/Input';
import RequiredLabel from '@/components/common/RequiredLabel';
import Image from 'next/image';
import React, { ChangeEvent, useState } from 'react';
import { Controller } from 'react-hook-form';

interface CompanyImageItemProps {
  index: number;
  control: any;
  errors: any;
  setValue: any;
  onRemove: () => void;
  onTriggerKeyValue: (key: string) => void;
}

export default function CompanyImageItem({ index, control, errors, setValue, onRemove, onTriggerKeyValue }: CompanyImageItemProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file)
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
      setValue(`companyImages.${index}.image`, file)
      onTriggerKeyValue(`companyImages.${index}.image`)
    }
  };

  return (
    <div className="w-[100%] sm:w-[48%] border-1 border-gray-700 bg-gray-900 p-2 rounded-sm">
      <div className="w-full aspect-4/3 border-dashed border-3 border-gray-700 flex justify-center items-center relative">

        <Controller
          name={`companyImages.${index}.image`}
          control={control}
          render={({ field }) => {
            if (preview) {
              return (
                <img
                  src={preview || '/images/default-avatar.jpg'}
                  alt="Preview"
                  className="w-full h-full shadow-md object-cover"
                />
              )
            }
            if (field.value) {
              return (
                <Image
                  src={field.value}
                  alt={field.value}
                  fill
                  className="w-full h-full shadow-md object-cover"
                />
              )
            } else {
              return <span className="text-gray-700">クリニック風景プレビュー</span>
            }
          }
          }
        />
      </div>
      <div className="flex flex-row items-center my-2">
        <label
          htmlFor={`company-image-upload-${index}`}
          className="text-sm text-gray-500 border-1 rounded-sm py-1 px-4 border-gray-700"
        >
          Choose File
          <input
            id={`company-image-upload-${index}`}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
        <span className="ml-2">{file?.name || 'No file chosen'}</span>
      </div>
      {errors?.companyImages?.[index]?.image && (
        <p className="text-red-400 text-[10px]">{errors?.companyImages?.[index]?.image.message}</p>
      )}
      <p className="text-sm text-gray-600">
        ※拡張子はjpg/png/gifのいずれかです<br />
        ※最大ファイルサイズは10MBです<br />
        ※5:4の比率サイズの画像を載せてください。<br />
        ※推奨サイズは520×380です。
      </p>
      <div className="flex-1 flex flex-row">
        <p className="text-sm text-gray-400 py-2">風景画像説明テキスト</p>
        <RequiredLabel />
      </div>

      <Controller
        name={`companyImages.${index}.description`}
        control={control}
        render={({ field }) => (
          <CInput
            {...field}
            isError={!!errors?.companyImages?.[index]?.description}
            errorText={errors?.companyImages?.[index]?.description?.message}
            height="h-[60px]"
            multiline
            className="rounded-sm placeholder-gray-700 p-2"
            onChange={(e) => {
              setValue(`companyImages.${index}.description`, e.target.value)
              onTriggerKeyValue(`companyImages.${index}.description`)
            }}
          />
        )}
      />


      <p className="text-sm text-gray-600 ">※50文字まで入力できます。</p>
      <div className='flex flex-row justify-end'>
        <CButton
          text="社内風景画像枠削除"
          className='bg-white border-1 border-gray-700 rounded-sm text-gray-600'
          rightIcon={<span className='text-gray-200'>&times;</span>}
          onClick={onRemove}
          size='small'
        />
      </div>
    </div>
  );
} 