import { getPaginatedFeatures } from '@/lib/api'
import { AdminCriteriaFetchParam } from '@/utils/types';
import { useQuery } from '@tanstack/react-query'

const useGetAdminFeatures = (param: AdminCriteriaFetchParam) => {
    const { page, limit, searchTerm } = param;
    return useQuery({
        queryKey: ['getAdminFeatures', page, limit, searchTerm],
        queryFn: () => getPaginatedFeatures(param)
    })
}

export { useGetAdminFeatures }