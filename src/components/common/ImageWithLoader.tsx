'use client';
import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface ComponentProps {
    spinnerSize?: number;
    spinnerColor?: string;
}

export default function ImageWithLoader({ spinnerSize = 18, spinnerColor = 'gray-700', ...props }: ComponentProps & ImageProps) {
    const [loading, setLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    return (
        <>
            {/* Loading Spinner */}
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
                    <div className={`w-${spinnerSize} h-${spinnerSize} border-4 border-${spinnerColor} border-t-transparent rounded-full animate-spin`} />
                </div>
            )}
            {isError && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
                    <div className={`w-${spinnerSize} h-${spinnerSize} border-4 border-${spinnerColor} rounded-full flex justify-center items-center`}>
                        <span className={`text-${spinnerColor}`} style={{ fontSize: `${spinnerSize * 2}px` }}>&times;</span>
                    </div>
                </div>
            )}

            {/* Image */}
            <Image
                {...props}
                onLoad={() => setLoading(false)}
                onError={() => {
                    setIsError(true)
                    setLoading(false)
                }}
            />
        </>
    );
}