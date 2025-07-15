import { getChatById } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

const useGetChatById = (id: number) => {
    return useQuery({
        queryKey: ['getChats', id],
        queryFn: () => getChatById(id),
        enabled: id > 0
    })
}

export { useGetChatById }