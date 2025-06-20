import CButton from '@/components/common/Button';
import CInput from '@/components/common/Input';
import Image from 'next/image';
import React, { ChangeEvent, useState } from 'react';
import { Controller } from 'react-hook-form';

interface StaffImageItemProps {
  index: number;
  control: any;
  errors: any;
  setValue: any;
  onRemove: () => void;
  onTriggerKeyValue: (key: string) => void;
}

export default function StaffImageItem({ index, control, errors, setValue, onRemove, onTriggerKeyValue }: StaffImageItemProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file)
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
      setValue(`staffImages.${index}.photo`, file);
      onTriggerKeyValue(`staffImages.${index}.photo`)
    }
  };

  const onChangeValue = (key: string, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(key, e.target.value);
    onTriggerKeyValue(key);
  }

  return (
    <div className="mb-3 border-1 border-gray-700 bg-gray-900 p-5 rounded-sm">
      <div className='flex flex-col md:flex-row gap-4'>
        <div className='flex-1'>
          <div className="w-[50%] md:w-full mx-auto aspect-1/1 border-dashed border-3 border-gray-700 flex justify-center items-center relative">
            <Controller
              name={`staffImages.${index}.photo`}
              control={control}
              render={({ field }) => {
                if (preview) {
                  return (
                    <img
                      src={preview || '/images/default-avatar.jpg'}
                      alt="Preview"
                      className="w-full h-full shadow-md"
                    />
                  )
                }
                if (field.value) {
                  return (
                    <Image
                      src={field.value}
                      alt="Preview"
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
        </div>
        <div className='flex-2 md:pl-10'>
          <div className='flex flex-col sm:flex-row mb-3'>
            <div className='flex-1 pt-2'>
              <span className='text-gray-500'>姓</span>
            </div>
            <div className='flex-2'>
              <Controller
                name={`staffImages.${index}.lastName`}
                control={control}
                render={({ field }) => (
                  <CInput
                    {...field}
                    isError={!!errors?.staffImages?.[index]?.lastName}
                    errorText={errors?.staffImages?.[index]?.lastName?.message}
                    height="h-[40px]"
                    className="rounded-sm placeholder-gray-700 p-2"
                    onChange={(e) => onChangeValue(`staffImages.${index}.lastName`, e)}
                  />
                )}
              />
              <p className="text-sm text-gray-600">
                ※10文字まで入力できます。
              </p>
            </div>
          </div>

          <div className='flex flex-col sm:flex-row mb-3'>
            <div className='flex-1'>
              <span className='text-gray-500'>名</span>
            </div>
            <div className='flex-2'>
              <Controller
                name={`staffImages.${index}.firstName`}
                control={control}
                render={({ field }) => (
                  <CInput
                    {...field}
                    isError={!!errors?.staffImages?.[index]?.firstName}
                    errorText={errors?.staffImages?.[index]?.firstName?.message}
                    className="rounded-sm placeholder-gray-700 p-2"
                    onChange={(e) => onChangeValue(`staffImages.${index}.firstName`, e)}
                  />
                )}
              />
              <p className="text-sm text-gray-600">
                ※10文字まで入力できます。
              </p>
            </div>
          </div>

          <div className='flex flex-col sm:flex-row mb-3'>
            <div className='flex-1'>
              <span className='text-gray-500'>役職</span>
            </div>
            <div className='flex-2'>
              <Controller
                name={`staffImages.${index}.position`}
                control={control}
                render={({ field }) => (
                  <CInput
                    {...field}
                    isError={!!errors?.staffImages?.[index]?.position}
                    errorText={errors?.staffImages?.[index]?.position?.message}
                    height="h-[40px]"
                    className="rounded-sm placeholder-gray-700 p-2"
                    onChange={(e) => onChangeValue(`staffImages.${index}.position`, e)}
                  />
                )}
              />
              <p className="text-sm text-gray-600">
                ※20文字まで入力できます。
              </p>
            </div>
          </div>

          <div className='flex flex-col sm:flex-row mb-3'>
            <div className='flex-1'>
              <span className='text-gray-500'>経歴など</span>
            </div>
            <div className='flex-2'>
              <Controller
                name={`staffImages.${index}.career`}
                control={control}
                render={({ field }) => (
                  <CInput
                    {...field}
                    isError={!!errors?.staffImages?.[index]?.career}
                    errorText={errors?.staffImages?.[index]?.career?.message}
                    height="h-[40px]"
                    className="rounded-sm placeholder-gray-700 p-2"
                    onChange={(e) => onChangeValue(`staffImages.${index}.career`, e)}
                  />
                )}
              />
              <p className="text-sm text-gray-600">
                ※200文字まで入力できます。
              </p>
            </div>
          </div>

          <div className='flex flex-col sm:flex-row mb-3'>
            <div className='flex-1'>
              <span className='text-gray-500'>顔写真</span>
            </div>
            <div className='flex-2'>
              <div className="flex flex-row items-center my-2">
                <label
                  htmlFor={`staff-image-upload-${index}`}
                  className="text-sm text-gray-500 border-1 rounded-sm py-1 px-4 border-gray-700"
                >
                  Choose File
                  <input
                    id={`staff-image-upload-${index}`}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <span className="ml-2">{file?.name || 'No file chosen'}</span>
              </div>
              {errors?.staffImages?.[index]?.photo && (
                <p className="text-red-400 text-[10px]">{errors?.staffImages?.[index]?.photo.message}</p>
              )}
              <p className="text-sm text-gray-600">
                ※拡張子はjpg/png/gifのいずれかです<br />
                ※最大ファイルサイズは10MBです<br />
                ※4:1の比率サイズの画像を載せてください。<br />
                ※推奨サイズは350×260です。<br />
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className='text-gray-500'>紹介文</p>
      <Controller
        name={`staffImages.${index}.introduction`}
        control={control}
        render={({ field }) => (
          <CInput
            {...field}
            isError={!!errors?.staffImages?.[index]?.introduction}
            errorText={errors?.staffImages?.[index]?.introduction?.message}
            height="h-[60px]"
            multiline
            className="rounded-sm placeholder-gray-700 p-2"
            onChange={(e) => onChangeValue(`staffImages.${index}.introduction`, e)}
          />
        )}
      />
      <p className="text-sm text-gray-600">
        ※200文字まで入力できます。
      </p>
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