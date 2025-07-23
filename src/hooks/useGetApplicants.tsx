import { getApplicationsByRole } from '@/lib/api'
import { ApplicationFetchParam } from '@/utils/types'
import { useQuery } from '@tanstack/react-query'

const useGetApplicants = (param: any) => {
    const { limit, page, profile, searchTerm, jobType } = param;
    const params: ApplicationFetchParam = {
        limit,
        page,
        searchTerm
    }
    if (jobType) {
        params.jobType = jobType;
    }
    if (profile?.role === 'JobSeeker') {
        params.job_seeker_id = profile.id;
    } else if (profile?.role === 'Employer') {
        params.employer_id = profile.id;
    } else {
        //admin
        params.jobType = 2;
    }
    return useQuery({
        queryKey: ['getApplicants', limit, page, profile, searchTerm, jobType],
        queryFn: () => getApplicationsByRole(params),
        enabled: !!profile
    })
}

export { useGetApplicants }