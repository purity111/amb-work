"use client";
import { useEffect } from 'react';
import { getColumn } from '@/lib/api';
import { notFound } from 'next/navigation';

interface ColumnDetailPageProps {
    params: { id: string };
}

export default async function ColumnDetailPage({ params }: ColumnDetailPageProps) {
    const id = Number(params.id);
    if (!id) return notFound();

    let column;
    try {
        column = await getColumn(id);
    } catch (e) {
        return notFound();
    }

    useEffect(() => {
        console.log('Column detail:', column);
    }, [column]);

    if (!column) return notFound();
    return (
        <main className="max-w-2xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6">{column.title}</h1>
            <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: column.content }}
            />
        </main>
    );
}
