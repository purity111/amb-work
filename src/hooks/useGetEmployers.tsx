import { getEmployers } from '@/lib/api'
import { EmployerFilterParam } from '@/utils/types'
import { useQuery } from '@tanstack/react-query'

const useGetEmployers = (param: EmployerFilterParam) => {
    const { page, limit, searchTerm, prefectures, sortBy, sortOrder } = param;
    return useQuery({
        queryKey: ['getEmployers', page, limit, searchTerm, prefectures, sortBy, sortOrder],
        queryFn: () => getEmployers(param)
    })
}

export { useGetEmployers }
