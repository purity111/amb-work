import React, { useEffect, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import CInput from '@/components/common/Input';
import CButton from '@/components/common/Button';
import RequiredLabel from '@/components/common/RequiredLabel';

const schema = Yup.object().shape({
    calling_name: Yup.string().optional(),
    name: Yup.string().required('名前は必須です'),
    display_order: Yup.number()
        .required('並び順は必須です')
        .min(1, '並び順は1以上である必要があります')
        .typeError('並び順は数値で入力してください')
});

const emptySchema = Yup.object().shape({
    calling_name: Yup.string().optional(),
    name: Yup.string().required('名前は必須です'),
    display_order: Yup.mixed()
}) as Yup.ObjectSchema<FormValues>;

type FormValues = {
    calling_name?: string;
    name: string;
    display_order: number;
};

interface AddCriteriaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: FormValues) => void;
    currentCriteriaCount: number;
    editData?: {
        id: number;
        calling_name?: string;
        name: string;
        display_order: number;
    };
}

export default function AddCriteriaModal({ isOpen, onClose, onSubmit, currentCriteriaCount, editData }: AddCriteriaModalProps) {
    const {
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setError,
        setValue
    } = useForm<FormValues>({
        resolver: yupResolver<FormValues, any, any>(editData ? emptySchema : schema),
        defaultValues: {
            calling_name: '',
            name: '',
            display_order: currentCriteriaCount + 1
        }
    });

    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (editData) {
            setValue('calling_name', editData.calling_name || '');
            setValue('name', editData.name);
            setValue('display_order', editData.display_order);
        } else {
            setValue('calling_name', '');
            setValue('name', '');
            setValue('display_order', currentCriteriaCount + 1);
        }
    }, [editData, currentCriteriaCount, setValue]);

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

    const validateDisplayOrder = (value: number) => {
        if (value <= currentCriteriaCount) {
            setError('display_order', {
                type: 'manual',
                message: `並び順は${currentCriteriaCount + 1}以上である必要があります`
            });
            return false;
        }
        return true;
    };

    if (!isOpen) return null;

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleSubmitForm = (data: FormValues) => {
        if (!editData && !validateDisplayOrder(data.display_order)) {
            return;
        }
        onSubmit(data);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0, 0, 0, 0.8)' }}>
            <div
                ref={modalRef}
                className="bg-white rounded-lg p-6 w-[96%] md:w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-[24px] md:text-[30px] font-bold mb-4">{editData ? '募集条件を編集' : '募集条件を追加'}</h2>
                <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            呼出用名称
                        </label>
                        <Controller
                            name="calling_name"
                            control={control}
                            render={({ field }) => (
                                <CInput
                                    {...field}
                                    placeholder="呼出用名称を入力"
                                    className="w-full"
                                />
                            )}
                        />
                    </div>

                    <div>
                        <div className="flex items-center gap-1 mb-1">
                            <label className="block text-sm font-medium">名前</label>
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
                                    placeholder="名前を入力"
                                    className="w-full"
                                />
                            )}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <div className="flex items-center gap-1 mb-1">
                            <label className="block text-sm font-medium">並び順</label>
                            {!editData && <div><RequiredLabel /></div>}
                        </div>
                        <Controller
                            name="display_order"
                            control={control}
                            render={({ field }) => (
                                <CInput
                                    {...field}
                                    type="number"
                                    placeholder="並び順を入力"
                                    className="w-full"
                                />
                            )}
                        />
                        {!editData && (
                            <>
                                <p className="text-sm text-gray-500 mt-1">
                                    現在の条件数（{currentCriteriaCount}）より大きい値を入力してください
                                </p>
                                {errors.display_order && (
                                    <p className="text-red-500 text-sm mt-1">{errors.display_order.message}</p>
                                )}
                            </>
                        )}
                    </div>

                    <div className="flex justify-end space-x-2 mt-4">
                        <CButton
                            text="キャンセル"
                            className="bg-gray-500 text-white"
                            onClick={handleClose}
                        />
                        <CButton
                            text={editData ? '保存' : '追加'}
                            className="bg-blue-500 text-white"
                            type="submit"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
} 