import { lastDayOfMonth, parse, format, isValid } from "date-fns";
import { ImageDetail } from "./types";
import { UPLOADS_BASE_URL } from "./config";
import { PrefectureOptions } from "./constants";

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
    return Array.from({ length: maxDate }, (_, i) => {
        if (i) {
            return {
                value: String(i + 1),
                option: String(i + 1)
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