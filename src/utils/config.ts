export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3003';
export const UPLOADS_BASE_URL = process.env.NEXT_PUBLIC_UPLOADS_BASE_URL || 'http://localhost:3003';

export const getFullUrl = (path: string) => {
    return `${BASE_URL}${path}`;
}; 