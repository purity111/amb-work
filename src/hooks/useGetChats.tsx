import { getChats } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

const useGetChats = () => {
    return useQuery({
        queryKey: ['getChats'],
        queryFn: () => getChats(),
    })
}

export { useGetChats }