"use client";

import { useGetJobById } from "@/hooks/useGetJobById";
import { useParams } from "next/navigation";
import { JobDetailExtra } from "@/utils/types";
import CreateNewJobComponent from "@/components/pages/jobs/CreateNewJob";
import { useEffect } from "react";

export default function JobEditPage() {
    const params = useParams();
    const id = params.id;

    const { data, isLoading, isError, isRefetching, refetch } = useGetJobById(Number(id));

    useEffect(() => {
        refetch();
    }, [])

    if (isLoading || isRefetching) return (
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
    )

    if (isError) return (
        <p>Failed in getting job details</p>
    )

    return (
        <div className="flex flex-col p-5">
            <CreateNewJobComponent preLoad={data.data as JobDetailExtra} />
        </div >
    );
}

