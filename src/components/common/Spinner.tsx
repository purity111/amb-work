import React from "react";

interface SpinnerProps {
    size?: number;
    color?: string;
}

export default function Spinner({ size = 8, color = 'blue-500' }: SpinnerProps) {
    return (
        <div className={`w-${size} h-${size} border-${size / 2} border-${color} border-t-transparent rounded-full animate-spin`}></div>
    );
}