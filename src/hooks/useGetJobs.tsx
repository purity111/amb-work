import { getJobs } from '@/lib/api'
import { JobFetchParam } from '@/utils/types'
import { useQuery } from '@tanstack/react-query'

const useGetJobs = (param: JobFetchParam) => {
    const { page, limit, searchTerm, jobType, companyID, employer_id, features, prefectures } = param;
    return useQuery({
        queryKey: ['getJobs', page, limit, searchTerm, jobType, companyID, employer_id, features, prefectures],
        queryFn: () => getJobs(page, limit, searchTerm, jobType, companyID, employer_id, features, prefectures),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: Infinity, // mark data as always fresh
    })
}

export { useGetJobs }