import React, { useEffect, useMemo, useState } from 'react';
import { useGetFeatures } from '@/hooks/useGetFeatures';
import { FeatureItem, MapInfo } from '@/utils/types';
import Image from 'next/image';
import { MapData } from '@/utils/constants';
import CButton from '@/components/common/Button';
import CInput from '@/components/common/Input';

export interface JobFilterFormValue {
    prefectures?: string[];
    jobTypes?: string[];
    items?: string[];
    conditions?: string[];
    employmentTypes?: string[];
    searchTerm?: string;
}

interface JobFilterFormProps {
    onSubmit: (value: JobFilterFormValue, searchText: string) => void;
    onClose?: () => void;
    hasCloseButton?: boolean;
    footerClass?: string;
    features?: string[];
    prefectures?: string[];
    searchText?: string;
}

export default function JobFilterForm({ onSubmit, hasCloseButton = false, onClose, footerClass, features = [], prefectures = [], searchText = '' }: JobFilterFormProps) {
    const [area, setArea] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [cityList, setCityList] = useState<Array<{ id: number, text: string }>>([]);
    const [selectedOptions, setSelectedOptions] = useState<any>({})
    const { data, isLoading } = useGetFeatures();

    const filterOptions = useMemo(() => {
        if (!data?.data?.length) return { jobTypes: [], items: [], conditions: [], employmentTypes: [] };
        return {
            jobTypes: data.data.filter((i: FeatureItem) => i.parent_id === 1),
            items: data.data.filter((i: FeatureItem) => i.parent_id === 2),
            conditions: data.data.filter((i: FeatureItem) => i.parent_id === 3),
            employmentTypes: data.data.filter((i: FeatureItem) => i.parent_id === 4),
        }
    }, [data])

    useEffect(() => {
        for (const map of MapData) {
            const find = map.city.find(i => prefectures.includes(i.id.toString()))
            if (find) {
                setArea(map.id)
                setCityList(map.city)
                break;
            }
        }

        const temp: Record<string, string[]> = {}
        Object.entries(filterOptions).forEach(([key, options]) => {
            const filtered = options.filter((i: FeatureItem) => features.includes(i.id.toString()));
            temp[key] = filtered.map((i: FeatureItem) => i.id);
        })
        setSelectedOptions({
            prefectures: [...prefectures].map(Number),
            ...temp
        });
        setSearchTerm(searchText)
    }, [])

    if (isLoading) {
        return (
            <div className="flex flex-row gap-4 flex-wrap">
                <p>Loading...</p>
            </div>
        )
    }

    const onClickArea = (map: MapInfo) => {
        setArea(map.id);
        setCityList(map.city)
    }

    const onClickOptions = (key: string, id: number) => {
        const keyObj = selectedOptions[key] || []
        const index = keyObj.indexOf(id);
        if (index < 0) {
            keyObj.push(id)
        } else {
            keyObj.splice(index, 1)
        }
        setSelectedOptions({
            ...selectedOptions,
            [key]: keyObj
        })
    }

    const onChangeSearchText = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className='border border-gray-700 w-full mb-12'>
            <div className='p-5 bg-gray-800 flex flex-row items-center'>
                <Image src="/svgs/location.svg" width={24} height={24} alt="location-icon" />
                <span className='ml-[10px] text-[14px] sm:text-[16px] text-gray-300 font-bold'>都道府県</span>
            </div>

            {/* rendering map */}
            <div className='p-5 flex flex-col md:flex-row'>
                <div className='flex-2 relative aspect-602/488'>
                    <Image src={'/images/home/map-base.webp'} fill alt={'basemap'} />
                    {MapData.map(map => (
                        <Image key={map.id} src={map.map} fill alt={map.id} className={area === map.id ? 'block' : 'hidden'} />
                    ))}
                    {MapData.map(map => (
                        <span
                            key={map.id}
                            onClick={() => onClickArea(map)}
                            className={`cursor-pointer p-1 rounded-sm absolute text-[12px] sm:text-[16px] ${map.textColor || 'text-white'} ${map.class} hover:opacity-80`}
                        >
                            {map.text}
                        </span>
                    ))}
                </div>
                <div className='flex-1 py-4 md:p-4'>
                    <div className='border border-gray-700 p-3 rounded-xs'>
                        <p className='px-1 py-2 mb-2 bg-[#6c757d] text-white text-[11px] sm:text-[13px] font-light rounded-xs'>選択中の都道府県</p>
                        <div className='flex flex-row flex-wrap'>
                            {cityList.map(city => (
                                <span
                                    key={city.id}
                                    className={`
                                border border-gray-700 rounded-xs mr-3 px-2 py-1 mb-1  text-[14px] cursor-pointer duration-500
                                ${selectedOptions.prefectures?.includes(city.id) ? 'text-white bg-blue' : 'text-gray-200 hover:bg-gray-700'}
                              `}
                                    onClick={() => onClickOptions('prefectures', city.id)}
                                >
                                    {city.text}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className='p-5 bg-gray-800 flex flex-row items-center'>
                <Image src={'/svgs/person.svg'} width={24} height={24} alt="location-icon" />
                <span className='ml-[10px] text-[14px] text-gray-300 font-bold'>職種</span>
            </div>
            <div className='flex flex-row flex-wrap px-4 pt-4'>
                {filterOptions.jobTypes.map((item: FeatureItem) => (
                    <span
                        key={item.id}
                        className={`
                            border border-gray-700 rounded-xs mr-3 px-2 py-1 mb-4  text-sm cursor-pointer duration-500
                            ${selectedOptions.jobTypes?.includes(item.id) ? 'text-white bg-blue' : 'text-gray-200 hover:bg-gray-700'}
                        `}
                        onClick={() => onClickOptions('jobTypes', item.id)}
                    >
                        {item.name}
                    </span>
                ))}
            </div>

            <div className='p-5 bg-gray-800 flex flex-row items-center'>
                <Image src={'/svgs/shopping.svg'} width={24} height={24} alt="location-icon" />
                <span className='ml-[10px] text-[14px] text-gray-300 font-bold'>アイテム</span>
            </div>
            <div className='flex flex-row flex-wrap px-4 pt-4'>
                {filterOptions.items.map((item: FeatureItem) => (
                    <span
                        key={item.id}
                        className={`
                            border border-gray-700 rounded-xs mr-3 px-2 py-1 mb-4  text-sm cursor-pointer duration-500
                            ${selectedOptions.items?.includes(item.id) ? 'text-white bg-blue' : 'text-gray-200 hover:bg-gray-700'}
                        `}
                        onClick={() => onClickOptions('items', item.id)}
                    >
                        {item.name}
                    </span>
                ))}
            </div>

            <div className='p-5 bg-gray-800 flex flex-row items-center'>
                <Image src={'/svgs/bag.svg'} width={24} height={24} alt="location-icon" />
                <span className='ml-[10px] text-[14px] text-gray-300 font-bold'>勤務条件</span>
            </div>
            <div className='flex flex-row flex-wrap px-4 pt-4'>
                {filterOptions.conditions.map((item: FeatureItem) => (
                    <span
                        key={item.id}
                        className={`
                            border border-gray-700 rounded-xs mr-3 px-2 py-1 mb-4  text-sm cursor-pointer duration-500
                            ${selectedOptions.conditions?.includes(item.id) ? 'text-white bg-blue' : 'text-gray-200 hover:bg-gray-700'}
                        `}
                        onClick={() => onClickOptions('conditions', item.id)}
                    >
                        {item.name}
                    </span>
                ))}
            </div>

            <div className='p-5 bg-gray-800 flex flex-row items-center'>
                <Image src={'/svgs/user-pin.svg'} width={24} height={24} alt="location-icon" />
                <span className='ml-[10px] text-[14px] text-gray-300 font-bold'>雇用形態</span>
            </div>
            <div className='flex flex-row flex-wrap px-4 pt-4'>
                {filterOptions.employmentTypes.map((item: FeatureItem) => (
                    <span
                        key={item.id}
                        className={`
                            border border-gray-700 rounded-xs mr-3 px-2 py-1 mb-4  text-sm cursor-pointer duration-500
                            ${selectedOptions.employmentTypes?.includes(item.id) ? 'text-white bg-blue' : 'text-gray-200 hover:bg-gray-700'}
                        `}
                        onClick={() => onClickOptions('employmentTypes', item.id)}
                    >
                        {item.name}
                    </span>
                ))}
            </div>

            <div className='p-5 bg-gray-800 flex flex-row items-center'>
                <Image src={'/svgs/search.svg'} width={24} height={24} alt="location-icon" />
                <span className='ml-[10px] text-gray-300 font-bold'>キーワードで検索</span>
            </div>
            <div className='p-4 border-b border-gray-700'>
                <CInput onChange={onChangeSearchText} defaultValue={searchText} />
            </div>

            <div className={`flex flex-row items-center justify-center py-4 space-x-4 ${footerClass}`}>
                {hasCloseButton && (
                    <CButton
                        text={'閉じる'}
                        className={`bg-gray-400 rounded-sm text-white`}
                        onClick={onClose}
                    />
                )}
                <CButton
                    text={'この条件で検索'}
                    className={`bg-green rounded-sm text-white`}
                    onClick={() => onSubmit(selectedOptions, searchTerm)}
                />
            </div>
        </div>
    );
} 