import React, { ChangeEvent, useEffect, useState } from 'react';
import { useGetFeatures } from '@/hooks/useGetFeatures';
import { FeatureItem } from '@/utils/types';
import CCheckBoxGroup from '@/components/common/CheckBoxGroup';
import CSelect from '@/components/common/Select';

interface JobFeaturesProps {
    selectedList: string[];
    onUpdate: (list: string[]) => void;
}

interface ExtraFeatureItem extends FeatureItem {
    hasSubSection?: boolean;
}

export default function JobFeatures({ selectedList, onUpdate }: JobFeaturesProps) {
    const [region, setRegion] = useState<string>('')
    const [prefecture, setPrefecture] = useState<string>('')
    const [sectionObj, setSectionObj] = useState<Record<number, ExtraFeatureItem>>({});
    const { data, isLoading } = useGetFeatures();

    useEffect(() => {
        if (isLoading) return;
        const array = data?.data || [] as FeatureItem[];
        // const temp: FeatureItem[] = array.filter((i: FeatureItem) => i.type === 1);
        const sectionObj: Record<number, ExtraFeatureItem> = {};
        const sectionArray = array.filter((i: FeatureItem) => i.type === 1);
        sectionArray.forEach((item: ExtraFeatureItem) => {
            const find = array.find((i: FeatureItem) => i.type === 2 && i.parent_id === item.id)
            sectionObj[item.id] = {
                ...item,
                hasSubSection: !!find
            }
        })
        setSectionObj(sectionObj);
    }, [isLoading, data])

    useEffect(() => {
        selectedList.forEach(i => {
            const [region, prefectures] = i.split('-');
            if (Number(region) > 5) {
                setRegion(region)
                setPrefecture(prefectures)
            }
        })
    }, [selectedList])

    if (isLoading) {
        return (
            <div className="flex flex-row gap-4 flex-wrap">
                <p>Loading...</p>
            </div>
        )
    }

    const renderSubFeatures = (s: FeatureItem) => {
        const regions = data.data.filter((i: FeatureItem) => i.parent_id === s.id && i.type === 2).map((j: FeatureItem) => ({
            value: j.id.toString(),
            option: j.name
        }));
        const prefectures = data.data.filter((i: FeatureItem) => i.parent_id === Number(region) && i.type === 3).map((j: FeatureItem) => ({
            value: j.id.toString(),
            option: j.name
        }));

        return (
            <div className='flex flex-row gap-4'>
                <CSelect
                    options={regions}
                    height="h-[40px]"
                    className="rounded-sm placeholder-gray-700"
                    onChange={(e) => setRegion(e.target.value)}
                    value={region}
                />
                <CSelect
                    options={prefectures}
                    height="h-[40px]"
                    width="w-[100px]"
                    className="rounded-sm placeholder-gray-700"
                    onChange={(e) => onChangeSubSectionItems(e)}
                    value={prefecture}
                />
            </div>
        )
    }

    const onChangeSubSectionItems = (e: ChangeEvent<HTMLSelectElement>) => {
        const section_num = Object.keys(sectionObj).length;
        const rest = selectedList.filter(i => Number(i.split('-')[0]) < section_num)
        onUpdate([...rest, `${region}-${e.target.value}`]);
    }

    const onUpdateSectionItems = (items: string[], s: FeatureItem) => {
        const rest = selectedList.filter(i => i.split('-')[0] !== s.id.toString())
        onUpdate([...rest, ...items]);
    }

    const renderSectionItems = (s: FeatureItem) => {
        const options = data.data.filter((i: FeatureItem) => i.parent_id === s.id && i.type === 3).map((j: FeatureItem) => ({
            value: `${s.id}-${j.id.toString()}`,
            option: j.name
        }));
        const selects = selectedList.filter(i => i.split('-')[0] === s.id.toString())
        return (
            <CCheckBoxGroup
                options={options}
                name="occupation"
                selectedValues={selects}
                onChangeOptions={(data: string[]) => onUpdateSectionItems(data, s)}
            />
        )
    }

    return (
        <div>
            {Object.values(sectionObj).map((s: ExtraFeatureItem) => {
                return (
                    <div className='pb-4' key={s.id}>
                        <p className="p-2 border-1 border-gray-700 bg-gray-800 rounded-sm mb-3">
                            {s.name}
                        </p>
                        {s.hasSubSection ? renderSubFeatures(s) : renderSectionItems(s)}
                    </div>
                )
            })}
        </div>
    );
} 