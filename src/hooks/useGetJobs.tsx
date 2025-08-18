import { getJobs } from '@/lib/api'
import { JobFetchParam } from '@/utils/types'
import { useQuery } from '@tanstack/react-query'

const useGetJobs = (param: JobFetchParam) => {
    const { page, limit, searchTerm, jobType, isAdmin, companyID, employer_id, features, prefectures, public_status, sortBy, recommend } = param;
    return useQuery({
        queryKey: ['getJobs', page, limit, searchTerm, jobType, isAdmin, companyID, employer_id, features, prefectures, public_status, sortBy, recommend],
        queryFn: () => getJobs(page, limit, searchTerm, jobType, isAdmin, companyID, employer_id, features, prefectures, public_status, sortBy, recommend),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: Infinity, // mark data as fresh
    })
}

export { useGetJobs }