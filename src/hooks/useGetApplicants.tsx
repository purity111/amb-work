import { getApplicants } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

const useGetApplicants = () => {
    return useQuery({
        queryKey: ['getApplicants'],
        queryFn: () => getApplicants(),
    })
}

export { useGetApplicants }