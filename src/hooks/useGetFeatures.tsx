import { getAllFeatures } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

const useGetFeatures = () => {
    return useQuery({
        queryKey: ['getFeatures'],
        queryFn: () => getAllFeatures()
    })
}

export { useGetFeatures }