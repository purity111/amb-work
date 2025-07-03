import { lastDayOfMonth, parse, format, isValid } from "date-fns";
import { ImageDetail } from "./types";
import { UPLOADS_BASE_URL } from "./config";
import { PrefectureOptions } from "./constants";
import { Area } from "react-easy-crop";

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