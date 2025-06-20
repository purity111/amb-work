import { getEmployerInfoById } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

const useGetEmployerInfoById = (id: number, options?: Record<string, any>) => {
    return useQuery({
        queryKey: ['getEmployer', id],
        queryFn: () => getEmployerInfoById(id),
        enabled: id > 0,
        ...options
    })
}

export { useGetEmployerInfoById }