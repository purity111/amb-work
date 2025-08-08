import { getInterview } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

const useGetInterview = (id: number, options?: Record<string, any>) => {
    return useQuery({
        queryKey: ['getInterview', id],
        queryFn: () => getInterview(id),
        enabled: !isNaN(id) && id > 0,
        ...options,
    })
}

export { useGetInterview }
