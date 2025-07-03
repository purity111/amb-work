import { getJobSeekers } from '@/lib/api'
import { JobSeekerFilterParam } from '@/utils/types'
import { useQuery } from '@tanstack/react-query'

const useGetJobSeekers = (param: JobSeekerFilterParam) => {
    const { page, limit, sortBy, sortOrder = 'ASC', prefectures, searchTerm } = param;
    return useQuery({
        queryKey: ['getJobSeekers', page, limit, sortBy, sortOrder, prefectures, searchTerm],
        queryFn: () => getJobSeekers(param)
    })
}

export { useGetJobSeekers }