import { getAdminCriterias } from '@/lib/api'
import { AdminCriteriaFetchParam } from '@/utils/types';
import { useQuery } from '@tanstack/react-query'

const useGetAdminCriterias = (param: AdminCriteriaFetchParam) => {
    const { page, limit, searchTerm } = param;
    return useQuery({
        queryKey: ['getAdminCriterias', page, limit, searchTerm],
        queryFn: () => getAdminCriterias(param)
    })
}

export { useGetAdminCriterias }