import { getRecommendedJobs } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

const useGetRecommendedJobs = () => {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    return useQuery({
        queryKey: ['getRecommendedJobs'],
        queryFn: () => getRecommendedJobs(),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: Infinity, // mark data as always fresh
        enabled: isClient, // Only run query on client side
    })
}

export { useGetRecommendedJobs }
