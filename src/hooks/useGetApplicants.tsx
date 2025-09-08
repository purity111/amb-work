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
    
    if (profile?.role === 'JobSeeker') {
        params.job_seeker_id = profile.id;
        // Don't add jobType for JobSeeker role
    } else if (profile?.role === 'Employer') {
        params.employer_id = profile.id;
        // For employer, always set jobType=1 for direct jobs
        params.jobType = 1;
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