import { getAllEmployerInfos } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

const useGetAllEmployerInfos = (role?: string) => {
    return useQuery({
        queryKey: ['getAllEmployerInfos', role],
        queryFn: () => {
            if (role === 'admin' || role === 'subadmin') {
                return getAllEmployerInfos()
            }
            return []
        }
    })
}

export { useGetAllEmployerInfos }