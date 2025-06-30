'use client'

import { useState } from 'react';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import { createColumn } from '@/lib/api';

export interface PickOption {
    value: string;
    option: string;
}

interface AddColumnModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CATEGORIES = [
    { value: 'コラム', option: 'コラム' },
    { value: 'スキルアップ方法', option: 'スキルアップ方法' },
    { value: 'バイヤー', option: 'バイヤー' },
    { value: 'ブランド', option: 'ブランド' },
    { value: '出張買取', option: '出張買取' },
    { value: '業界ニュース', option: '業界ニュース' },
    { value: '業界・市場動向', option: '業界・市場動向' },
    { value: '疑問・悩み', option: '疑問・悩み' },
    { value: '転職活動ノウハウ', option: '転職活動ノウハウ' }
];

export default function AddColumnModal({ isOpen, onClose }: AddColumnModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        content: '',
        thumbnail: null as File | null
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData(prev => ({
            ...prev,
            thumbnail: file
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('content', formData.content);
            if (formData.thumbnail) {
                formDataToSend.append('thumbnail', formData.thumbnail);
            }

            await createColumn(formDataToSend);
            alert('コラムが追加されました');
            onClose();
        } catch (error) {
            console.error('Error creating column:', error);
            alert('エラーが発生しました');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto">
                <h2 className="text-xl font-semibold mb-4">新しいコラムを追加</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            タイトル *
                        </label>
                        <Input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            placeholder="コラムのタイトルを入力"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            カテゴリー *
                        </label>
                        <Select
                            value={formData.category}
                            onChange={(e) => handleInputChange('category', e.target.value)}
                            required
                            options={CATEGORIES}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            サムネイル画像
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            内容 *
                        </label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => handleInputChange('content', e.target.value)}
                            placeholder="コラムの内容を入力"
                            required
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            キャンセル
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !formData.title || !formData.category || !formData.content}
                            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? '追加中...' : '追加'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
} 