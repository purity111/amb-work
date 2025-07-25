import React, { useCallback, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import CButton from "./common/Button";
import getCroppedImage from "@/utils/helper";

interface CustomCropperProps {
    image: string;
    cropWidth: number;
    cropHeight: number;
    onCancel: () => void;
    onFinished: (image: Blob) => void;
}

export default function CustomCropper({ image, cropWidth, cropHeight, onCancel, onFinished }: CustomCropperProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    const handleFinish = async () => {
        if (!image || !croppedAreaPixels) return;

        try {
            const croppedBlob = await getCroppedImage(image, croppedAreaPixels, 0);
            onFinished(croppedBlob)
        } catch (err) {
            console.error('Crop failed:', err);
        }
    };

    return (
        <div className="fixed inset-0 z-1000 w-[100vw] h-[100vh] flex flex-row justify-center items-center bg-black/60">
            <div className="w-[90%] max-w-[1000px] h-[80%] p-4 sm:p-20 bg-white rounded-sm overflow-hidden flex flex-col">
                <div className="relative flex-1">
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={1} // 1:1 for square crop
                        onCropChange={setCrop}
                        zoomWithScroll={false}
                        minZoom={0.2}
                        cropShape="rect"
                        cropSize={{ width: cropWidth, height: cropHeight }}
                        onCropComplete={onCropComplete}
                    />
                </div>
                <div className="w-full mx-auto py-4">
                    <label htmlFor="slider" className="block mb-2 text-sm font-medium text-gray-700">
                        Zoom: {zoom}
                    </label>
                    <input
                        id="slider"
                        type="range"
                        min={0.2}
                        max={3}
                        value={zoom}
                        step={0.2}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm
                   [&::-webkit-slider-thumb]:appearance-none
                   [&::-webkit-slider-thumb]:h-4
                   [&::-webkit-slider-thumb]:w-4
                   [&::-webkit-slider-thumb]:rounded-full
                   [&::-webkit-slider-thumb]:bg-blue-600
                   [&::-webkit-slider-thumb]:shadow-md
                   [&::-webkit-slider-thumb]:hover:bg-blue-700"
                    />
                </div>
                <div className="flex flex-row pt-10 justify-between">
                    <CButton
                        text="確認"
                        className='bg-blue text-white w-[40%]'
                        onClick={handleFinish}
                    />
                    <CButton
                        text="キャンセル"
                        className='bg-gray-600 text-white w-[40%]'
                        onClick={onCancel}
                    />
                </div>
            </div>
        </div>
    );
}