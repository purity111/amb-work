import { getBookmarkedJobs } from '@/lib/api'
import { BookmarkedJobsFetchParams } from '@/utils/types'
import { useQuery } from '@tanstack/react-query'

const useGetBookmarkedJobs = (param: BookmarkedJobsFetchParams) => {
    const { page, limit, searchTerm } = param;
    return useQuery({
        queryKey: ['getBookmarkedJobs', page, limit, searchTerm],
        queryFn: () => getBookmarkedJobs(param),
    })
}

export { useGetBookmarkedJobs }