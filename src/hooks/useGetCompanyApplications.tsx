import { getCompanyApplications } from '@/lib/api'
import { AdminCriteriaFetchParam } from '@/utils/types';
import { useQuery } from '@tanstack/react-query'

const useGetCompanyApplications = (param: AdminCriteriaFetchParam) => {
    const { page, limit, searchTerm } = param;
    return useQuery({
        queryKey: ['getCompanyApplications', page, limit, searchTerm],
        queryFn: () => getCompanyApplications(param)
    })
}

export { useGetCompanyApplications } 