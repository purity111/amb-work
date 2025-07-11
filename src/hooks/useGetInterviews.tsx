import { getInterviews } from '@/lib/api'
import { InterviewFetchParam, InterviewResponse } from '@/utils/types'
import { useQuery } from '@tanstack/react-query'

const useGetInterviews = (param: InterviewFetchParam = {}) => {
    const { page, limit, searchTerm, category, tag } = param;
    return useQuery<InterviewResponse>({
        queryKey: ['getInterviews', page, limit, searchTerm, category, tag],
        queryFn: () => getInterviews(param),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: Infinity, // mark data as always fresh
    })
}

export { useGetInterviews } 