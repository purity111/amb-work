import { getApplicantsByJobId } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

const useGetApplicantsByJobId = (id: number) => {
    return useQuery({
        queryKey: ['getApplicants', id],
        queryFn: () => getApplicantsByJobId(id),
        enabled: id > 0
    })
}

export { useGetApplicantsByJobId }