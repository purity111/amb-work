"use client";

import { useParams } from "next/navigation";

export default function JobPreviewPage() {
    const params = useParams();
    const id = params.id; // This will be a string
    return (
        <div className="flex flex-col p-5">
            <h1 className="text-2xl font-bold mb-6">プレビュー(Job Preview Page)</h1>
            <h1 className="text-2xl font-bold mb-6">Job ID: {id}</h1>
        </div >
    );
}

