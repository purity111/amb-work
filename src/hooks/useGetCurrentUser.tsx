import { getCurrentUser } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

const useGetCurrentUser = (options?: Record<string, any>) => {
    return useQuery({
        queryKey: ['getCurrentUser'],
        queryFn: () => getCurrentUser(),
        ...options,
    })
}

export default useGetCurrentUser 