'use client'

import React from "react";
import JobFilterForm, { JobFilterFormValue } from "../pages/jobs/JobFilterForm";

interface JobFilterModalProps {
    onSubmit: (value: JobFilterFormValue, searchText: string) => void;
    onClose: () => void;
    features?: string[];
    prefectures?: string[];
    searchText?: string;
}

export default function JobFilterModal({ onSubmit, onClose, prefectures = [], features = [], searchText = '' }: JobFilterModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex justify-center bg-gray-300/80">
            <div className="relative flex flex-col bg-white rounded-lg border-none shadow-xl my-auto h-fit max-h-3/4 w-[95%] max-w-200 pb-2 relative border-1 border-gray-700 overflow-hidden">
                <p className="text-white text-base p-3 bg-orange">検索条件を追加</p>
                <div className="p-6 overflow-y-scroll">
                    <JobFilterForm
                        onSubmit={onSubmit}
                        footerClass="absolute bottom-0 left-0 right-0 bg-white"
                        hasCloseButton
                        onClose={onClose}
                        features={features}
                        prefectures={prefectures}
                        searchText={searchText}
                    />
                </div>
            </div>
        </div>
    );
}