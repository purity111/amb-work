import { getJobById } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

const useGetJobById = (id: number, options?: Record<string, any>) => {
    return useQuery({
        queryKey: ['getJobById', id],
        queryFn: () => getJobById(id),
        enabled: !isNaN(id) && id > 0,
        ...options,
    })
}

export { useGetJobById }