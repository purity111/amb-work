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
import { ApplicationItem, FeatureItem, FeatureParams, ImageDetail, JobDetail } from "./types";
import { UPLOADS_BASE_URL } from "./config";
import { MapData, PrefectureOptions } from "./constants";
import { Area } from "react-easy-crop";
import { JobFilterFormValue } from '@/components/pages/jobs/JobFilterForm';

export const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export const getEstablishmentYearOptions = () => {
    const cYear = new Date().getFullYear();
    return Array.from({ length: 100 }, (_, i) => {
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
    const maxDate = lastDate.getDate(); // Show all days
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

    if (secondsDiff < 5) return '現在' // customize threshold as needed

    return formatDistanceToNow(date, { addSuffix: true, locale: ja })
}

export function formatMessageDate(date: Date): string {
    const now = new Date();
    const diffInMinutes = differenceInMinutes(now, date);

    if (diffInMinutes < 1) {
        return '1分未満前';
    }

    if (diffInMinutes < 60) {
        return `${formatDistanceToNow(date, { addSuffix: true, locale: ja })}`;
    }

    if (isToday(date)) {
        return format(date, 'h:mm a', { locale: ja }); // e.g. 2:30 PM
    }

    if (isYesterday(date)) {
        return `昨日 ${format(date, 'h:mm a', { locale: ja })}`;
    }

    if (isThisWeek(date, { weekStartsOn: 1 })) {
        return format(date, 'EEEE, h:mm a', { locale: ja }); // e.g. Wednesday at 2:30 PM
    }

    if (isThisYear(date)) {
        return format(date, 'MMM d, h:mm a', { locale: ja }); // e.g. Mar 5 at 2:30 PM
    }

    return format(date, 'MMM d, yyyy, h:mm a', { locale: ja }); // e.g. Mar 5, 2023 at 2:30 PM
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
        ? cityList
            .filter(i => value.prefectures?.includes(i.id))
            .map(i => i.text)
            .join('-')
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

    // Build segments array in fixed order: [prefectures, jobTypes, items, conditions, employmentTypes]
    const segments = [pString, jString, iString, cString, eString];

    // Filter out empty segments to create clean URLs without placeholders
    const nonEmptySegments = segments.filter(Boolean);

    // If no segments have values, return the base URL
    if (nonEmptySegments.length === 0) {
        return '/job-openings';
    }

    return `/job-openings/${nonEmptySegments.join('/')}`;
}

export const generateJobCSVData = (data: JobDetail[], baseURL: string) => {
    return data.map(item => ({
        '求人ID': item.id,
        '会社名': item.employer.clinic_name,
        '求人名': item.job_title,
        '設定タグ': item.features.map(i => i.name).join(', '),
        '掲載開始日': item.clinic_public_date_start,
        '掲載終了日': item.clinic_public_date_end || '無制限',
        '求人のリンク': `${baseURL}/job-openings/recruit/${item.id}`,
        '求人閲覧数': item.recruits_count,
        'お気に入り数': item.favourite_count,
        '応募総数': item.application_count,
        '応募数（面接日決定数）': 0,
        '応募数（面接済数）': 0,
        '応募数（最終面接済）': 0,
        '応募数（面接決定済）': 0,
        '公開／非公開': item.public_status === 1 ? '公開' : '非公開',
        '応募方法': item.job_detail_page_template_id === 1 ? '直接応募' : '転職サポート',
    }));
}

export const generateApplicationCSVData = (data: ApplicationItem[]) => {
    return data.map(item => ({
        '求人ID': item.job_info_id,
        '企業名': item.jobInfo?.employer?.clinic_name,
        '求人タイトル': item.job_title,
        '求人作成日': item.created,
        '応募者ID': item.job_seeker_id,
        '応募者名': item.jobSeeker?.name,
        '生年月日': item.jobSeeker?.birthdate,
        '性別': item.jobSeeker?.sex === 1 ? '男性' : item.jobSeeker?.sex === 2 ? '女性' : 'その他',
        '電話番号': item.jobSeeker?.tel,
        'メールアドレス': item.jobSeeker?.email,
        '求人詳細': item.jobInfo?.job_lead_statement,
        '公開開始日': item.jobInfo?.clinic_public_date_start,
        '公開終了日': item.jobInfo?.clinic_public_date_end,
        '応募種別': item.jobInfo?.job_detail_page_template_id === 1 ? '直接応募' : '転職支援',
    }))
}

export const generateCareerConsultationCSVData = (data: any[]) => {
    // Helper functions for data formatting
    const experienceLabel = (val: any) => val === 0 || val === '0' ? 'ある' : 'なし';
    
    const inquiryLabels: Record<string, string> = {
        0: '転職相談をしたい',
        1: 'キャリアカウンセリングを受けたい', 
        2: '業界情報について話を聞きたい',
        3: '研修・セミナー内容について知りたい',
        4: 'その他',
    };

    // Helper to get prefecture name from value
    const getPrefectureName = (val: any) => {
        const found = PrefectureOptions.find(opt => opt.value === String(val));
        return found ? found.option : '';
    };

    return data.map(item => ({
        'ID': item.id || '',
        'お名前': item.name || '',
        'メールアドレス': item.email || '',
        '電話番号': item.telephone || '',
        '生年月日': item.birthday || '',
        '都道府県': getPrefectureName(item.prefectures),
        '経験': experienceLabel(item.experience),
        'お問い合わせ内容': inquiryLabels[item.inquiry] || item.inquiry || '',
        '希望職種': item.desired_job_type || '',
        'ご要望': item.request || '',
        '作成日時': item.created || '',
    }));
}

export const generateJobSeekerCSVData = (data: any[]) => {
    // Helper to get prefecture name from value
    const getPrefectureName = (val: any) => {
        const found = PrefectureOptions.find(opt => opt.value === String(val));
        return found ? found.option : '';
    };

    // Helper to format bookmark and application data as structured format
    const formatJobRelatedData = (data: any[] = [], dateField: string) => {
        if (!data || data.length === 0) return 'なし';
        
        return data.map(item => {
            const jobTitle = item.name || '（タイトルなし）';
            const jobId = item.id;
            const jobUrl = `https://reuse-tenshoku.com/job-openings/recruit/${jobId}`;
            const formattedDate = item[dateField] ? format(new Date(item[dateField]), 'yyyy年MM月dd日 HH:mm:ss') : '不明';
            
            return `求人URL: ${jobUrl}
日時: ${formattedDate}
求人タイトル: ${jobTitle}`;
        }).join('\n\n');
    };

    return data.map(item => ({
        'ID': item.id || '',
        '氏名': item.name || '',
        '氏名（カナ）': item.name_kana || '',
        '生年月日': item.birthdate || '',
        '性別': item.sex === 1 ? '男性' : item.sex === 2 ? '女性' : 'その他',
        '郵便番号': item.zip || '',
        '都道府県': getPrefectureName(item.prefectures),
        '電話番号': item.tel || '',
        'メールアドレス': item.email || '',
        '転職サポート希望': item.service_content ? '有' : '無',
        '登録日': item.created || '',
        'お気に入り': formatJobRelatedData(item.allFavoriteJobs, 'favoriteDate'),
        '応募履歴': formatJobRelatedData(item.allJobApplications, 'applicationDate'),
    }));
}

export const generateEmployerCSVData = (data: any[]) => {
    // Helper to get prefecture name from value
    const getPrefectureName = (val: any) => {
        const found = PrefectureOptions.find(opt => opt.value === String(val));
        return found ? found.option : '';
    };

    return data.map(item => ({
        'ID': item.id || '',
        '企業名': item.clinic_name || '',
        '企業名（カナ）': item.clinic_name_kana || '',
        '登録日': item.created || '',
        '郵便番号': item.zip || '',
        '都道府県': getPrefectureName(item.prefectures),
        '市区町村': item.city || '',
        '最寄り駅': item.closest_station || '',
        '電話番号': item.tel || '',
        'メールアドレス': item.email || '',
        'ホームページ': item.home_page_url || '',
        '従業員数': item.employee_number || '',
        '事業内容': item.business || '',
        '資本金': item.capital_stock || '',
        '設立年': item.establishment_year || '',
    }));
}