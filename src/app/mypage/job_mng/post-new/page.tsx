"use client";

import CreateNewJobComponent from "@/components/pages/jobs/CreateNewJob";
import { Suspense } from "react";

export default function PostNewJobPage() {
    return (
        <Suspense>
            <CreateNewJobComponent />
        </Suspense>
    );
}

