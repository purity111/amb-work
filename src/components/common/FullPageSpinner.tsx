import React from "react";

export default function FullPageSpinner() {
    return (
        <div className="fixed inset-0 bg-gray-700/70 flex justify-center items-center z-1000">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
}