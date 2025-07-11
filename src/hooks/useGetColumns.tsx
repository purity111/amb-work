import { getColumns } from '@/lib/api'
import { ColumnFetchParam, ColumnResponse } from '@/utils/types'
import { useQuery } from '@tanstack/react-query'

const useGetColumns = (param: ColumnFetchParam = {}) => {
    const { page, limit, searchTerm, category } = param;
    return useQuery<ColumnResponse>({
        queryKey: ['getColumns', page, limit, searchTerm, category],
        queryFn: () => getColumns(param),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: Infinity, // mark data as always fresh
    })
}

export { useGetColumns } 