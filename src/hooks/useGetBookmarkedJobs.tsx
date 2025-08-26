import { useAuthContext } from '@/hooks/useAuthContext';
import { getBookmarkedJobs } from '@/lib/api'
import { BookmarkedJobsFetchParams } from '@/utils/types'
import { useQuery } from '@tanstack/react-query'

const useGetBookmarkedJobs = (param: BookmarkedJobsFetchParams) => {
    const { page, limit, searchTerm } = param;
    const {profile} = useAuthContext();
    
    return useQuery({
        queryKey: ['getBookmarkedJobs', page, limit, searchTerm, profile?.role],
        queryFn: () => getBookmarkedJobs(param),
        enabled: !!profile?.role && profile?.role !== 'admin'
    })
}

export { useGetBookmarkedJobs }