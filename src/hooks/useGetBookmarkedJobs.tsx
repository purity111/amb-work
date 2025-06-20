import { getBookmarkedJobs } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

const useGetBookmarkedJobs = (role: string) => {
    return useQuery({
        queryKey: ['getBookmarkedJobs'],
        queryFn: () => getBookmarkedJobs(),
        enabled: role === 'JobSeeker'
    })
}

export { useGetBookmarkedJobs }