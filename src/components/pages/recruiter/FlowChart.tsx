import React from 'react';
import Image from 'next/image';
import { RecruiterFlowSteps } from '@/utils/constants';

export default function FlowChart() {
    return (
        <div className="py-16 md:py-24">
            <h2 className="text-xl md:text-2xl font-bold mb-8 text-center">掲載までのフロー</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-6">
                {RecruiterFlowSteps.map((item, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
                        <p className="text-green-600 font-bold text-lg mb-2">{item.step}</p>
                        <div className="relative w-full aspect-[4/3] mb-4"> {/* Adjust aspect ratio if needed */}
                            <Image
                                src={item.image}
                                alt={item.title || `Step ${index + 1}`}
                                fill
                                className="object-contain" // Use object-contain for icons
                            />
                        </div>
                        <h3 className="text-lg font-bold mb-2 whitespace-pre-line">{item.title}</h3>
                        <p className="text-gray-700 whitespace-pre-line">{item.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
} 