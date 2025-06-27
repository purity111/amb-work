"use client";

import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import * as Yup from 'yup';
import { addDays, format, parse } from 'date-fns';
import { useGetAllEmployerInfos } from "@/hooks/useGetAllEmployerInfos";
import { yupResolver } from "@hookform/resolvers/yup";
import RequiredLabel from "@/components/common/RequiredLabel";
import { useAuthContext } from "@/app/layout";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import CSelect from "@/components/common/Select";
import CInput from "@/components/common/Input";
import CButton from "@/components/common/Button";
import CompanyImageItem from "@/components/pages/jobs/CompanyImageItem";
import StaffImageItem from "@/components/pages/jobs/StaffImageItem";
import CRadioGroup from "@/components/common/RadioGroup";
import CDatePicker from "@/components/common/DatePicker";
import { JobStatusOptions, WhereToApplyOptions } from "@/utils/constants";
import JobFeatures from "@/components/pages/jobs/Features";
import { JobDetailExtra, PickOption, RecruitingCriteria } from "@/utils/types";
import { useGetRecruitingCriterias } from "@/hooks/useGetRecruitingCriterias";
import { useGetEmployerInfoById } from "@/hooks/useGetEmployerInfoById";
import { createNewJob, updateJobById } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { getFirstFullImage, getImageFile } from "@/utils/helper";
import Image from "next/image";
import FullPageSpinner from "@/components/common/FullPageSpinner";
import { useGetJobById } from "@/hooks/useGetJobById";

type CreateNewJobProps = {
    preLoad?: JobDetailExtra;
}

type CompanyImage = {
    image: File | string | null;
    description: string;
}

type IntroImageItem = {
    photo: File | string | null;
    firstName: string;
    lastName: string;
    position: string;
    career: string;
    introduction: string;
}

export type FormValues = {
    company: string;
    title: string;
    thumbnail: File | string | null;
    features: string[];
    introduction: string;
    other_websites?: string;
    companyImages?: CompanyImage[];
    staffImages?: IntroImageItem[];
    salary: string;
    recruitingCriterias: Array<{ body: string }>
    publicDateStart?: string;
    publicDateEnd?: string;
    applyType: string;
    supportUrl?: string;
    status: string;
}

const schema = Yup.object().shape({
    company: Yup.string().required('Company must be selected'),
    title: Yup.string().required('Job title is required'),
    thumbnail: Yup.mixed().test(
        'file-or-url',
        'A file or URL is required',
        function (value) {
            // Accept if value is:
            // - a File (uploaded file)
            // - a non-empty string (existing URL)
            if (value instanceof File) return true;
            if (typeof value === 'string' && value.trim() !== '') return true;
            return false;
        }
    ),
    features: Yup.array().of(Yup.string().required()).min(1, 'At least one feature must be selected'), // e.g. ['1-34', '2-24', '4-89']
    introduction: Yup.string().required('Job introduction is required'),
    other_websites: Yup.string()
        .notRequired()
        .test(
            'format-per-line',
            '※1行毎に「項目名: URL」の形式で入力してください。',
            (value) => {
                if (!value) return true;
                const lines = value.trim().split('\n');
                return lines.every((line) => /^.+?:\s*https?:\/\/[^\s]+$/.test(line.trim()));
            }
        ),
    companyImages: Yup.array().of(
        Yup.object({
            image: Yup.mixed()
                .required('画像は必須です')
                .test('fileOrUrl', '有効な画像ファイルまたはURLを入力してください', (value) => {
                    // Accept File
                    if (value instanceof File) {
                        return ['image/jpeg', 'image/png', 'image/webp'].includes(value.type);
                    }
                    // Accept valid image URL
                    if (typeof value === 'string') {
                        return /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i.test(value);
                    }
                    return false;
                }),
            description: Yup.string().required('Description is required'),
        })
    ),
    staffImages: Yup.array().of(
        Yup.object({
            photo: Yup.mixed()
                .required('画像は必須です')
                .test('fileOrUrl', '有効な画像ファイルまたはURLを入力してください', (value) => {
                    // Accept File
                    if (value instanceof File) {
                        return ['image/jpeg', 'image/png', 'image/webp'].includes(value.type);
                    }
                    // Accept valid image URL
                    if (typeof value === 'string') {
                        return /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i.test(value);
                    }
                    return false;
                }),
            firstName: Yup.string().required('First name is required'),
            lastName: Yup.string().required('Last name is required'),
            position: Yup.string().required('Position is required'),
            career: Yup.string(),
            introduction: Yup.string(),
        })
    ),
    salary: Yup.string().required('Salary details are required'),
    recruitingCriterias: Yup.array().of(
        Yup.object({
            body: Yup.string(),
        })
    ),
    publicDateStart: Yup.string().test('valid-start', 'Invalid start date', (value) => !isNaN(Date.parse(value || ''))),
    publicDateEnd: Yup.string()
        .test('valid-end', 'Invalid end date', (value) => !isNaN(Date.parse(value || '')))
        .test('end-after-start', 'End date must be after or same as start date', function (value) {
            const { publicDateStart } = this.parent;
            if (!publicDateStart || !value) return false;
            return new Date(value) >= new Date(publicDateStart);
        }),
    applyType: Yup.string().required(),
    supportUrl: Yup.string().when('applyType', {
        is: '1',
        then: (schema) => schema.notRequired(),
        otherwise: (schema) => schema.url('Invalid URL').required('URL is required'),
    }),
    status: Yup.string().required(),
})

type Form = Yup.InferType<typeof schema>;
type FormKey = keyof Form;
const PublicDateFormat = 'MM/dd/yyyy'

export default function CreateNewJobComponent({ preLoad }: CreateNewJobProps) {
    const [companyOptions, setCompanyOptions] = useState<PickOption[]>([]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const { profile, isAdmin } = useAuthContext();
    const router = useRouter();
    const searchParams = useSearchParams();
    const cloneJobId = searchParams.get('source');

    const {
        handleSubmit,
        control,
        formState: { errors, isDirty },
        setValue,
        trigger,
        reset,
        getValues
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            company: isAdmin ? '' : profile?.id.toString(),
            publicDateStart: format(new Date(), PublicDateFormat),
            publicDateEnd: format(addDays(new Date(), 7), PublicDateFormat),
            applyType: '1',
            status: '1',
            features: [], // selected a default region '北海道'
        },
    });

    const { saveFormStatus } = useAuthContext();
    const company = useWatch({ control, name: 'company' });
    const thumbnail = useWatch({ control, name: 'thumbnail' }) as File | string;
    const features = useWatch({ control, name: 'features' });
    const applyType = useWatch({ control, name: 'applyType' });
    const recruitingCriterias = useWatch({ control, name: 'recruitingCriterias' });
    const { fields: companyFields, append: appendCompanyImage, remove: removeCompanyImage, replace: replaceCompanyImage } = useFieldArray({ control, name: 'companyImages' });
    const { fields: staffFields, append: appendStaffImage, remove: removeStaffImage, replace: replaceStaffImage } = useFieldArray({ control, name: 'staffImages' });

    const { data, isLoading } = useGetAllEmployerInfos(profile?.role);
    const { data: criterias, isLoading: cLoading } = useGetRecruitingCriterias({ refetchOnWindowFocus: false });
    const { data: cloneJobData, isLoading: cloneJobLoading } = useGetJobById(Number(cloneJobId), { refetchOnWindowFocus: false });
    const { data: selectedCompany, isLoading: scLoading } = useGetEmployerInfoById(Number(company), { refetchOnWindowFocus: false });
    const hasPreloaded = useRef(false);

    useEffect(() => {
        saveFormStatus(isDirty);
    }, [isDirty])

    useEffect(() => {
        if (!hasPreloaded.current && preLoad && criterias) {
            presetForm(preLoad)
        }
    }, [preLoad, criterias])

    useEffect(() => {
        if (cloneJobLoading) return;
        if (!hasPreloaded.current && cloneJobData?.data && criterias) {
            presetForm(cloneJobData.data)
        }
    }, [cloneJobData, cloneJobLoading, criterias])

    useEffect(() => {
        if (isLoading) return;
        if (data?.success) {
            const companyOptions = data.data.employers.map((i: any) => ({
                value: i.id,
                option: i.clinic_name
            }));
            setCompanyOptions([{ value: '', option: 'Select a company' }, ...companyOptions])
        }
    }, [data, isLoading, company])

    useEffect(() => {
        if (cLoading || scLoading || !selectedCompany || !criterias || !recruitingCriterias) return;
        const companyData = selectedCompany?.data;
        criterias?.forEach((c: RecruitingCriteria, index: number) => {
            if (c.clinic_flg && companyData?.[c.calling_name]) {
                recruitingCriterias[index] = { body: companyData?.[c.calling_name] }
            }
        });
        reset({
            ...getValues(),
            recruitingCriterias
        })
    }, [criterias, cLoading, selectedCompany, scLoading])

    const presetForm = (preLoad: JobDetailExtra) => {
        const updatedRecruitingCriterias = [...(recruitingCriterias || [])];
        hasPreloaded.current = true;
        preLoad.recruitingCriterias.sort((i, j) => i.display_order - j.display_order).forEach((i) => {
            if (!i.clinic_flg || i.JobInfosRecruitingCriteria.body) {
                updatedRecruitingCriterias[i.display_order - 1] = { body: i.JobInfosRecruitingCriteria.body };
            }
        })

        const updatedCompanyImages = preLoad.workplaceIntroductions.map(i => ({
            image: getFirstFullImage(i.images),
            description: i.description
        })) as any;

        const updatedStaffImages = preLoad.staffInfos.map(i => ({
            photo: getFirstFullImage(i.images),
            firstName: i.first_name,
            lastName: i.last_name,
            position: i.post,
            career: i.career,
            introduction: i.introduction_text
        })) as any;

        reset({
            company: preLoad.employer_id.toString(),
            title: preLoad.job_title,
            thumbnail: getFirstFullImage(preLoad.jobThumbnails) as any,
            features: preLoad.features.map(i => `${i.parent_id}-${i.id.toString()}`),
            introduction: preLoad.job_lead_statement,
            other_websites: preLoad.another_url_text,
            companyImages: updatedCompanyImages,
            staffImages: updatedStaffImages,
            salary: preLoad.pay,
            recruitingCriterias: updatedRecruitingCriterias,
            publicDateStart: format(parse(preLoad.clinic_public_date_start, 'yyyymmdd', new Date()), 'mm/dd/yyyy'),
            publicDateEnd: format(parse(preLoad.clinic_public_date_end, 'yyyymmdd', new Date()), 'mm/dd/yyyy'),
            applyType: preLoad.job_detail_page_template_id.toString(),
            supportUrl: preLoad.clinic_public_form_url,
            status: preLoad.public_status.toString()
        })
        replaceCompanyImage(updatedCompanyImages);
        replaceStaffImage(updatedStaffImages);
    }

    const createJob = useMutation({
        mutationFn: createNewJob,
        onSuccess: (data) => {
            // Optionally invalidate or refetch queries here
            console.log('Create new job: ', data)
            toast.success('求人作成が完了されました。')
            router.push('/mypage/job_mng')
        },
        onError: (error) => {
            console.error('Error with creating new job:', error);
            toast.error('新規求人作成に失敗しました。')
        },
    });

    const updateJob = useMutation({
        mutationFn: updateJobById,
        onSuccess: (data) => {
            // Optionally invalidate or refetch queries here
            console.log('Create new job: ', data)
            toast.success('新しい求人を作成しました。')
            router.push('/mypage/job_mng')
        },
        onError: (error) => {
            console.error('Error with update the job:', error);
            toast.error('求人情報の更新に失敗しました。')
        },
    });

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
            setValue('thumbnail', file);
            trigger('thumbnail')
        } else {
            setImagePreview(null);
        }
    };

    const onUpdateFeatures = (list: string[]) => {
        setValue('features', list)
        trigger('features')
    }

    const onClickSaveDraft = () => {
        const formData = getValues();
        submitJob(formData as FormValues, true)
    }

    const submitJob = (formData: FormValues, isDraft: boolean) => {
        const features = formData.features?.map(i => Number(i.split('-')[1])) as number[] || [];
        const rcData = formData.recruitingCriterias?.map((i, index) => ({
            id: criterias[index].id,
            body: i.body || ''
        })) || [];
        const params = {
            param: {
                employer_id: Number(formData.company),
                job_title: formData.title,
                features: features,
                job_lead_statement: formData.introduction,
                another_url_text: formData.other_websites || '',
                workplaceIntroductions: formData.companyImages?.map(i => ({ description: i.description, type: typeof i.image })) || [],
                staffInfos: formData.staffImages?.map((i, index) => ({
                    first_name: i.firstName,
                    last_name: i.lastName,
                    post: i.position,
                    career: i.career,
                    order_by: index + 1,
                    introduction_text: i.introduction,
                    type: typeof i.photo
                })) || [],
                pay: formData.salary,
                recruitingCriterias: rcData.filter(i => !!i),
                clinic_public_date_start: format(parse(formData.publicDateStart || '', 'mm/dd/yyyy', new Date()), 'yyyymmdd'),
                clinic_public_date_end: format(parse(formData.publicDateEnd || '', 'mm/dd/yyyy', new Date()), 'yyyymmdd'),
                clinic_public_form_url: formData.supportUrl,
                job_detail_page_template_id: Number(formData.applyType),
                public_status: isDraft ? 2 : 1 // private (draft)
            },
            thumbnail: getImageFile(thumbnail),
            companyImages: formData.companyImages?.map(i => getImageFile(i.image)) || [],
            staffImages: formData.staffImages?.map(i => getImageFile(i.photo)) || [],
        }
        if (preLoad) {
            updateJob.mutate({
                id: preLoad.id,
                ...params
            })
        } else {
            createJob.mutate(params)
        }
    }

    const onSubmit = async (data: any) => {
        // console.log('Form Data:', data);
        const formData = data as FormValues;
        submitJob(formData, false)
    };

    const renderSaveButtons = () => {
        return (
            <div className="w-95/100 max-w-320 mx-auto">
                <div className="flex flex-row items-center gap-10 py-4">
                    <CButton
                        text="下書き更新"
                        className='bg-blue mx-auto text-white w-[40%]'
                        onClick={onClickSaveDraft}
                    />
                    <CButton
                        text="公開更新"
                        className='bg-blue mx-auto text-white w-[40%]'
                        onClick={handleSubmit(onSubmit)}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col pb-20">
            <div className="w-95/100 max-w-320 mx-auto mt-10 pb-10 border-1 border-gray-700 rounded-sm">
                <div className="bg-gray-600 px-5 py-3">
                    <p className="text-white">検索情報</p>
                </div>
                <div className="p-5">
                    {isAdmin && (
                        <div className="flex flex-col items-left md:flex-row  py-2">
                            <div className="flex-1 flex flex-row">
                                <p className="text-sm text-gray-400 py-2">採用企業</p>
                                <RequiredLabel />
                            </div>
                            <div className="flex-3">
                                <Controller
                                    name="company"
                                    control={control}
                                    render={({ field }) => (
                                        <CSelect
                                            {...field}
                                            isError={!!errors.company}
                                            errorText={errors.company?.message}
                                            options={companyOptions}
                                            height="h-[40px]"
                                            className="rounded-sm placeholder-gray-700"
                                            onChange={(e) => field.onChange(e)}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    )}
                    <div className="flex flex-col items-left md:flex-row  py-2">
                        <div className="flex-1 flex flex-row">
                            <p className="text-sm text-gray-400 py-2">求人タイトル</p>
                            <RequiredLabel />
                        </div>
                        <div className="flex-3">
                            <Controller
                                name="title"
                                control={control}
                                render={({ field }) => (
                                    <CInput
                                        {...field}
                                        isError={!!errors.title}
                                        errorText={errors.title?.message}
                                        className="rounded-sm placeholder-gray-700"
                                        onChange={(e) => field.onChange(e)}
                                        maxLength={50}
                                    />
                                )}
                            />
                            <p className="text-sm text-gray-600 leading-loose">
                                ※50文字まで入力できます。
                                <br />
                                ※検索結果・求人詳細のタイトルとして表示されます。
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-left md:flex-row py-2">
                        <div className="flex-1 flex flex-row">
                            <p className="text-sm text-gray-400 py-2">検索時サムネイル画像</p>
                            <RequiredLabel />
                        </div>
                        <div className="flex-3">
                            {imagePreview && (
                                <div className="mt-4 mb-3 w-40 h-40">
                                    <img
                                        src={imagePreview || '/images/default-avatar.jpg'}
                                        alt="Preview"
                                        className="w-full h-full shadow-md"
                                    />
                                </div>
                            )}
                            {!imagePreview && thumbnail && (
                                <div className="mt-4 mb-3 w-40 h-40 relative">
                                    <Image
                                        src={thumbnail as string}
                                        alt="Preview"
                                        fill
                                        className="w-full h-full shadow-md object-cover"
                                    />
                                </div>
                            )}
                            <div className="flex flex-row items-center">
                                <label
                                    htmlFor="imageUpload"
                                    className="text-sm text-gray-500 border-1 rounded-sm py-1 px-4 border-gray-700"
                                >
                                    Choose File
                                    <input
                                        id="imageUpload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                                {(thumbnail instanceof File) && (
                                    <span className="ml-2">{thumbnail.name}</span>
                                )}
                            </div>
                            {errors.thumbnail && (
                                <p className="text-red-400 text-[10px]">{errors.thumbnail.message}</p>
                            )}

                            <p className="text-sm text-gray-600 leading-loose">
                                ※拡張子はjpg/png/gifのいずれかです
                                <br />
                                ※推奨横300px×縦220px
                                <br />
                                ※最大ファイルサイズは10MBです
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-left md:flex-row py-2">
                        <div className="flex-1">
                            <div className="flex flex-row">
                                <p className="text-sm text-gray-400 py-2">検索条件</p>
                                <RequiredLabel />
                            </div>
                            <p className="text-sm text-gray-600 h-0">
                                ※都道府県は1つ設定できます。
                            </p>
                        </div>
                        <div className="flex-3">
                            <JobFeatures selectedList={features || []} onUpdate={onUpdateFeatures} />
                            {errors.features && (
                                <p className="text-red-400 text-[10px]">{errors.features.message}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col items-left md:flex-row  py-2">
                        <div className="flex-1 flex flex-row">
                            <p className="text-sm text-gray-400 py-2">求人一言紹介</p>
                            <RequiredLabel />
                        </div>
                        <div className="flex-3">
                            <Controller
                                name="introduction"
                                control={control}
                                render={({ field }) => (
                                    <CInput
                                        {...field}
                                        isError={!!errors.introduction}
                                        errorText={errors.introduction?.message}
                                        className="rounded-sm placeholder-gray-700"
                                        onChange={(e) => field.onChange(e)}
                                        maxLength={30}
                                    />

                                )}
                            />
                            <p className="text-sm text-gray-600 leading-loose">
                                ※30文字まで入力できます。
                                <br />
                                ※個別の求人詳細ページでは表示されません。検索時に表示する紹介文となります。
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {renderSaveButtons()}
            <div className="w-95/100 max-w-320 mx-auto border-1 border-gray-700 rounded-sm">
                <div className="bg-gray-600 px-5 py-3">
                    <p className="text-white">会社情報</p>
                </div>
                <div className="p-5">
                    <div className="flex flex-col items-left md:flex-row  py-2">
                        <div className="flex-1 flex flex-row">
                            <p className="text-sm text-gray-400 py-2">その他ウェブサイト</p>
                        </div>
                        <div className="flex-3">
                            <Controller
                                name="other_websites"
                                control={control}
                                render={({ field }) => (
                                    <CInput
                                        isError={!!errors.other_websites}
                                        errorText={errors.other_websites?.message}
                                        height="h-[100px]"
                                        multiline
                                        className="rounded-sm placeholder-gray-700"
                                        onChange={(e) => field.onChange(e)}
                                        placeholder="項目名:URLの形式で入力してください"
                                    />
                                )}
                            />
                            <p className="text-sm text-gray-600 leading-loose">
                                ※500文字まで入力できます。
                                <br />
                                ※1行毎に項目名: URLの形式で入力してください。
                                <br />
                                ※複数設定したい場合は改行してください。
                                <br />
                                ※求人ページの会社情報カテゴリのウェブサイト項目の下に表示されます。
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {renderSaveButtons()}
            <div className="w-95/100 max-w-320 mx-auto border-1 border-gray-700 rounded-sm">
                <div className="bg-gray-600 px-5 py-3">
                    <p className="text-white">求人ページ製作情報</p>
                </div>
                <div className="p-5">
                    <div className="flex flex-col items-left lg:flex-row  py-2">
                        <div className="flex-1">
                            <p className="text-sm text-gray-400 py-2">社内風景画像画像</p>
                            <p className="text-sm text-gray-600 leading-loose">
                                ※最大9つまで追加できます。
                            </p>
                        </div>
                        <div className="flex-3">
                            <div className="flex flex-row flex-wrap justify-between space-y-4">
                                {companyFields.map((field, index) => {
                                    return (
                                        <CompanyImageItem
                                            key={`${field.id}-${index}`}
                                            index={index}
                                            errors={errors}
                                            control={control}
                                            setValue={setValue}
                                            onRemove={() => removeCompanyImage(index)}
                                            onTriggerKeyValue={(key: string) => trigger(key as FormKey)}
                                        />
                                    )
                                })}
                            </div>
                            <CButton
                                text="社内風景画像追加+"
                                size='small'
                                className='bg-blue text-white cursor-pointer mt-3'
                                onClick={() => appendCompanyImage({ image: null as any, description: '' })}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col items-left lg:flex-row  py-2">
                        <div className="flex-1">
                            <p className="text-sm text-gray-400 py-2">スタッフ紹介</p>
                            <p className="text-sm text-gray-600 leading-loose">
                                ※最大10個まで追加できます。
                            </p>
                        </div>
                        <div className="flex-3">
                            {staffFields.map((field, index) => {
                                return (
                                    <StaffImageItem
                                        key={index}
                                        index={index}
                                        errors={errors}
                                        control={control}
                                        setValue={setValue}
                                        onRemove={() => removeStaffImage(index)}
                                        onTriggerKeyValue={(key: string) => trigger(key as FormKey)}
                                    />
                                )
                            })}
                            <CButton
                                text="社内風景画像追加+"
                                size='small'
                                className='bg-blue text-white cursor-pointer'
                                onClick={() => appendStaffImage({
                                    photo: null as any,
                                    firstName: '',
                                    lastName: '',
                                    position: '',
                                    career: '',
                                    introduction: '',
                                })}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {renderSaveButtons()}
            <div className="w-95/100 max-w-320 mx-auto border-1 border-gray-700 rounded-sm">
                <div className="bg-gray-600 px-5 py-3">
                    <p className="text-white">求人情報</p>
                </div>
                <div className="p-5">
                    <div className="flex flex-col items-left md:flex-row  py-2">
                        <div className="flex-1 flex flex-row">
                            <p className="text-sm text-gray-400 py-2">給料</p>
                            <RequiredLabel />
                        </div>
                        <div className="flex-3">
                            <Controller
                                name="salary"
                                control={control}
                                render={({ field }) => (
                                    <CInput
                                        {...field}
                                        multiline
                                        isError={!!errors.salary}
                                        errorText={errors.salary?.message}
                                        className="rounded-sm placeholder-gray-700"
                                        onChange={(e) => field.onChange(e)}
                                        maxLength={30}
                                        height="h-[100px]"
                                    />

                                )}
                            />
                            <p className="text-sm text-gray-600 leading-loose">
                                ※500文字まで入力できます。
                            </p>
                        </div>
                    </div>
                    {cLoading ? (
                        <p>読み込む中...</p>
                    ) : (
                        criterias?.map((c: RecruitingCriteria, index: number) => {
                            return (
                                <div key={index} className="flex flex-col items-left md:flex-row py-2">
                                    <div className="flex-1 flex flex-row">
                                        <p className="text-sm text-gray-400 py-2">{c.name}</p>
                                    </div>
                                    <div className="flex-3">
                                        <Controller
                                            name={`recruitingCriterias.${index}.body`}
                                            control={control}
                                            render={({ field }) => (
                                                <CInput
                                                    {...field}
                                                    multiline
                                                    className="rounded-sm placeholder-gray-700"
                                                    onChange={(e) => field.onChange(e)}
                                                    maxLength={2000}
                                                    height="h-[100px]"
                                                    disabled={!!c.clinic_flg && selectedCompany?.data[c.calling_name]}
                                                />
                                            )}
                                        />
                                        <p className="text-sm text-gray-600 leading-loose">
                                            ※2000文字まで入力できます。
                                        </p>
                                    </div>
                                </div>
                            )
                        })
                    )}
                    <div className="border-1 border-gray-700 rounded-sm">
                        <div className="bg-gray-600 px-5 py-3">
                            <p className="text-white">掲載ステータス</p>
                        </div>
                        <div className="p-5">
                            <div className="flex flex-col items-left md:flex-row  py-2">
                                <div className="flex-1 flex flex-row">
                                    <p className="text-sm text-gray-400 py-2">掲載期間</p>
                                </div>
                                <div className="flex-3 flex flex-row">
                                    <Controller
                                        name="publicDateStart"
                                        control={control}
                                        render={({ field: { onChange, value } }) => {
                                            const dateValue = value ? parse(value, PublicDateFormat, new Date()) : null;
                                            return (
                                                <CDatePicker
                                                    // {...field}
                                                    selected={dateValue}
                                                    dateFormat={PublicDateFormat}
                                                    minDate={new Date()}
                                                    isError={!!errors.publicDateStart}
                                                    errorText={errors.publicDateStart?.message}
                                                    onChange={(date: Date | null) =>
                                                        onChange(date ? format(date, PublicDateFormat) : '')
                                                    }
                                                />
                                            )
                                        }}
                                    />
                                    <span className="mx-3 text-sm text-gray-600 leading-loose">
                                        ～
                                    </span>
                                    <Controller
                                        name="publicDateEnd"
                                        control={control}
                                        render={({ field: { onChange, value } }) => {
                                            const dateValue = value ? parse(value, PublicDateFormat, new Date()) : null;
                                            return (
                                                <CDatePicker
                                                    // {...field}
                                                    selected={dateValue}
                                                    dateFormat={PublicDateFormat}
                                                    isError={!!errors.publicDateEnd}
                                                    errorText={errors.publicDateEnd?.message}
                                                    onChange={(date: Date | null) =>
                                                        onChange(date ? format(date, PublicDateFormat) : '')
                                                    }
                                                />
                                            )
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col items-left md:flex-row  py-2">
                                <div className="flex-1 flex flex-row">
                                    <p className="text-sm text-gray-400 py-2">応募先のご選択</p>
                                </div>
                                <div className="flex-3">
                                    <Controller
                                        name="applyType"
                                        control={control}
                                        render={({ field }) => (
                                            <CRadioGroup
                                                {...field}
                                                options={WhereToApplyOptions}
                                                direction="column"
                                                name="applyType"
                                                value={field.value}
                                                className="py-1"
                                                onChange={(e) => field.onChange(e)}
                                            />
                                        )}
                                    />
                                    <p className="text-sm text-gray-600 leading-loose">
                                        当システムを利用するを選択した場合、当システムで応募管理を行います。<br />
                                        転職サポートサイトを利用するを選択した場合、転職サポートサイトで応募管理を行います。
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col items-left md:flex-row  py-2">
                                <div className="flex-1 flex flex-row">
                                    <p className="text-sm text-gray-400 py-2">転職サポートのURL</p>
                                </div>
                                <div className="flex-3">
                                    <Controller
                                        name="supportUrl"
                                        control={control}
                                        render={({ field }) => (
                                            <CInput
                                                {...field}
                                                disabled={applyType === '1'}
                                                isError={!!errors.supportUrl}
                                                errorText={errors.supportUrl?.message}
                                                className="rounded-sm placeholder-gray-700"
                                                onChange={(e) => field.onChange(e)}
                                                maxLength={30}
                                                height="h-[40px]"
                                            />
                                        )}
                                    />
                                    <p className="text-sm text-gray-600 leading-loose">
                                        ※URLを入力してください
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col items-left md:flex-row  py-2">
                                <div className="flex-1 flex flex-row">
                                    <p className="text-sm text-gray-400 py-2">公開状況</p>
                                </div>
                                <div className="flex-3">
                                    <Controller
                                        name="status"
                                        control={control}
                                        render={({ field }) => (
                                            <CRadioGroup
                                                {...field}
                                                options={JobStatusOptions}
                                                name="status"
                                                value={field.value}
                                                onChange={(e) => field.onChange(e)}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                    <CButton
                        text="更新する"
                        className='mt-4 bg-blue mx-auto text-white w-full'
                        onClick={handleSubmit(onSubmit)}
                    />
                    <CButton
                        text="この求人を削除"
                        className='mt-4 bg-red-600 mx-auto text-white w-full'
                    />
                </div>
            </div>
            {
                (createJob.isPending || updateJob.isPending) && (
                    <FullPageSpinner />
                )
            }
        </div>
    );
}

