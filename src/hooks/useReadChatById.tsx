import { readChatById } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

const useReadChatById = (id: number) => {
    return useQuery({
        queryKey: ['readChatById', id],
        queryFn: () => readChatById(id),
        enabled: id > 0
    })
}

export { useReadChatById }