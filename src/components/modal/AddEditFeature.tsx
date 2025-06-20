import React, { useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { FeatureItem, PickOption } from '@/utils/types';
import CButton from "@/components/common/Button";
import CInput from '@/components/common/Input';
import CSelect from '@/components/common/Select';
import RequiredLabel from '@/components/common/RequiredLabel';

type FormValues = {
  name: string;
  parent_id: number | null;
  type: number;
};

// Form validation schema
const schema = Yup.object<FormValues>().shape({
  name: Yup.string().required('タイトルは必須です'),
  parent_id: Yup.number().required('親IDは必須です').nullable(),
  type: Yup.number()
    .required('タイプは必須です')
    .min(1, 'タイプは1以上である必要があります')
    .max(3, 'タイプは3以下である必要があります'),
}).required();

interface AddEditFeatureProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormValues) => void;
  parentFeatures: PickOption[];
  editData?: FeatureItem | null;
}

export default function AddEditFeature({ isOpen, onClose, onSubmit, parentFeatures, editData }: AddEditFeatureProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      parent_id: null,
      type: editData ? editData.type : 3,
    }
  });

  React.useEffect(() => {
    if (editData) {
      setValue('name', editData.name);
      setValue('parent_id', editData.parent_id || null);
      setValue('type', editData.type);
    } else {
      reset({
        name: '',
        parent_id: null,
        type: 3,
      });
    }
  }, [editData, setValue, reset]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, onChange: (value: number) => void) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= 3) {
      onChange(value);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ background: 'rgba(0, 0, 0, 0.8)' }}>
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-[24px] md:text-[30px] text-center font-medium mb-4">
          {editData ? '特徴を編集' : '新規特徴を追加'}
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <div className="flex items-center gap-1 mb-1">
              <label className="block text-sm font-medium">親ID</label>
              <div>
                <RequiredLabel />
              </div>
            </div>
            <Controller
              name="parent_id"
              control={control}
              render={({ field }) => (
                <CSelect
                  {...field}
                  options={parentFeatures}
                  value={field.value?.toString() || ''}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                  className="w-full"
                  isError={!!errors.parent_id?.message}
                  errorText={errors.parent_id?.message}
                />
              )}
            />
          </div>

          <div>
            <div className="flex items-center gap-1 mb-1">
              <label className="block text-sm font-medium">タイプ</label>
              <div>
                <RequiredLabel />
              </div>
            </div>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <CInput
                  {...field}
                  type="number"
                  min={1}
                  max={3}
                  placeholder="タイプを入力 (1-3)"
                  className="w-full"
                  isError={!!errors.type?.message}
                  errorText={errors.type?.message}
                  onChange={(e) => handleTypeChange(e, field.onChange)}
                />
              )}
            />
            <p className="text-sm text-gray-500 mt-1">
              タイプは1から3の間で入力してください
            </p>
          </div>

          <div>
            <div className="flex items-center gap-1 mb-1">
              <label className="block text-sm font-medium">タイトル</label>
              <div>
                <RequiredLabel />
              </div>
            </div>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <CInput
                  {...field}
                  placeholder="タイトルを入力"
                  className="w-full"
                  isError={!!errors.name?.message}
                  errorText={errors.name?.message}
                />
              )}
            />
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <CButton
              text="キャンセル"
              className="bg-gray-500 text-white"
              onClick={handleClose}
            />
            <CButton
              text={editData ? '更新' : '追加'}
              className="bg-blue-500 text-white"
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
} 