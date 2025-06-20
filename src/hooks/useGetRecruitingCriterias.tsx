import { getRecruitingCriterias } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

const useGetRecruitingCriterias = (options?: Record<string, any>) => {
    return useQuery({
        queryKey: ['getRecruitingCriterias'],
        queryFn: () => getRecruitingCriterias(),
        ...options
    })
}

export { useGetRecruitingCriterias }