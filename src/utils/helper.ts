import {
    format,
    isToday,
    isYesterday,
    isThisYear,
    isThisWeek,
    differenceInMinutes,
    formatDistanceToNow,
    lastDayOfMonth,
    parse,
    isValid
} from 'date-fns';
import { ja } from 'date-fns/locale';
import { FeatureItem, FeatureParams, ImageDetail, JobDetail } from "./types";
import { UPLOADS_BASE_URL } from "./config";
import { MapData, PrefectureOptions } from "./constants";
import { Area } from "react-easy-crop";
import { JobFilterFormValue } from '@/components/pages/jobs/JobFilterForm';

export const getEstablishmentYearOptions = () => {
    const cYear = new Date().getFullYear();
    return Array.from({ length: 150 }, (_, i) => {
        if (i) {
            return {
                value: String(cYear - i),
                option: String(cYear - i)
            }
        } else {
            return {
                value: '0',
                option: '年'
            }
        }
    })
}

export const getEstablishmentDateOptions = (year: number, month: number) => {
    const date = new Date(year, month - 1); // month is 0-based
    const lastDate = lastDayOfMonth(date);
    const maxDate = lastDate.getDate();
    return Array.from({ length: maxDate + 1 }, (_, i) => {
        if (i) {
            return {
                value: String(i),
                option: String(i)
            }
        } else {
            return {
                value: '0',
                option: '日'
            }
        }
    })
}

export const formatFlexibleDate = (year?: number, month?: number, day?: number) => {
    let str = '';
    if (year != null) str += `${year}年`;
    if (month != null) str += `${month}月`;
    if (day != null) str += `${day}日`;
    return str;
}

export const toQueryString = (params: Record<string, any>) => {
    return new URLSearchParams(
        Object.entries(params).reduce((acc, [key, val]) => {
            if (Array.isArray(val)) acc[key] = `[${val.join(',')}]`
            else if (val !== undefined && val !== null) acc[key] = String(val);
            return acc;
        }, {} as Record<string, string>)
    ).toString();
}

export const getFirstFullImage = (images: ImageDetail[]) => {
    if (!images?.length) return null;
    const last = images[images.length - 1];
    return `${UPLOADS_BASE_URL}/${last?.image_name}`
}

export const getImageFile = (image: File | string | null) => {
    let thumb = image;
    if (typeof image === 'string') {
        thumb = image.split('/').pop() as string;
    }
    return thumb;
}

export const getPrefectureName = (id: number) => {
    const find = PrefectureOptions.find(i => i.value === id.toString());
    return find?.option || '???'
}

export const parsePublicDate = (date: string, mask = 'yyyy/mm/dd') => {
    const parsed = parse(date, 'yyyymmdd', new Date());
    if (isValid(parsed)) {
        return format(parsed, mask)
    } else {
        return '無期限'
    }
}

export default async function getCroppedImage(
    imageSrc: string,
    crop: Area,
    rotation = 0
): Promise<Blob> {
    const image = await loadImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('Failed to get canvas context');

    canvas.width = crop.width;
    canvas.height = crop.height;

    // Apply rotation if needed
    ctx.translate(-crop.x, -crop.y);
    if (rotation !== 0) {
        ctx.rotate((rotation * Math.PI) / 180);
    }

    ctx.drawImage(image, 0, 0);

    return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Failed to create blob from canvas'));
        }, 'image/jpeg');
    });
}

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

export function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result as string); // This is your base64 string
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

export function linkify(text: string) {
    const urlPattern = /(\bhttps?:\/\/[^\s]+)/g;
    const wwwPattern = /(^|[^\/])(www\.[^\s]+)/g;
    const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,})/gi;

    return text
        .replace(urlPattern, '<a href="$1" class="underline" target="_blank">$1</a>')
        .replace(wwwPattern, '$1<a href="http://$2" class="underline" target="_blank">$2</a>')
        .replace(emailPattern, '<a href="mailto:$1" class="underline">$1</a>');
}

export function formatTimeAgo(date: Date) {
    const now = new Date()
    const secondsDiff = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (secondsDiff < 5) return 'now' // customize threshold as needed

    return formatDistanceToNow(date, { addSuffix: true, locale: ja })
}

export function formatMessageDate(date: Date): string {
    const now = new Date();
    const diffInMinutes = differenceInMinutes(now, date);

    if (diffInMinutes < 1) {
        return '1分未満前';
    }

    if (diffInMinutes < 60) {
        return `${formatDistanceToNow(date, { addSuffix: true })}`;
    }

    if (isToday(date)) {
        return format(date, 'h:mm a'); // e.g. 2:30 PM
    }

    if (isYesterday(date)) {
        return `Yesterday at ${format(date, 'h:mm a')}`;
    }

    if (isThisWeek(date, { weekStartsOn: 1 })) {
        return format(date, 'EEEE, h:mm a'); // e.g. Wednesday at 2:30 PM
    }

    if (isThisYear(date)) {
        return format(date, 'MMM d, h:mm a'); // e.g. Mar 5 at 2:30 PM
    }

    return format(date, 'MMM d, yyyy, h:mm a'); // e.g. Mar 5, 2023 at 2:30 PM
}

export const formatLongDateTime = (dateString: string) => {
    if (!dateString) return '';
    try {
        return format(new Date(dateString), 'yyyy年MM月dd日HH:mm:ss');
    } catch (error) {
        console.error("Error formatting date:", error);
        return dateString;
    }
};

export const getFeatureParam = (param: FeatureParams | null) => {
    const { jobTypes = [], items = [], conditions = [], employmentTypes = [] } = param || {};
    return [...jobTypes, ...items, ...conditions, ...employmentTypes]
}

export const getFilterJobUrl = (value: JobFilterFormValue, featureList: FeatureItem[]) => {
    let cityList: Array<{ id: number, text: string }> = [];
    MapData.forEach(item => {
        cityList = cityList.concat(item.city)
    })

    const pString = value.prefectures?.length
        ? cityList.filter(i => value.prefectures?.includes(i.id)).map(i => i.text).join('-')
        : '';
    const { conditions = [], employmentTypes = [], items = [], jobTypes = [] } = value;
    const jString = jobTypes?.length
        ? featureList.filter((i: FeatureItem) => jobTypes.includes(i.id)).map((i: FeatureItem) => i.name).join('-')
        : '';
    const iString = items?.length
        ? featureList.filter((i: FeatureItem) => items.includes(i.id)).map((i: FeatureItem) => i.name).join('-')
        : '';
    const cString = conditions?.length
        ? featureList.filter((i: FeatureItem) => conditions.includes(i.id)).map((i: FeatureItem) => i.name).join('-')
        : '';
    const eString = employmentTypes?.length
        ? featureList.filter((i: FeatureItem) => employmentTypes.includes(i.id)).map((i: FeatureItem) => i.name).join('-')
        : '';

    // Build segments array, only including non-empty segments, in order
    const segments = [pString, jString, iString, cString, eString].filter(Boolean);
    return `/job-openings/${segments.join('/')}`;
}

export const generateCSVData = (data: JobDetail[]) => {
    return data.map(item => ({
        'ID': item.id,
        'Job Title': item.job_title,
        'Job Posting Date': item.job_posting_date,
        'Job Category': item.job_category,
        'Job Introduction': item.job_lead_statement,
        'Salary': item.pay,
        'Public Status': item.public_status,
        'Job Type': item.job_detail_page_template_id === 1 ? '直接応募のみ' : '転職⽀援サービス',
        'Thumbnail': getFirstFullImage(item.jobThumbnails),
        'Employment Type': item.employmentType.name,
        'Employer': item.employer.clinic_name,
        'Public Start Date': item.clinic_public_date_start,
        'Public End Date': item.clinic_public_date_end,
        'Youtube Url': item.youtube_url,
        'Another Url': item.another_url_text,
        'Features': item.features.map(i => i.name).join(',')
    }));
}