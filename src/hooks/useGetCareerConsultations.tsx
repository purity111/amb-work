import { useQuery } from '@tanstack/react-query';
import { getCareerConsultations } from '@/lib/api';
import type { AdminCriteriaFetchParam } from '@/utils/types';

const useGetCareerConsultations = (param: AdminCriteriaFetchParam) => {
  const { page, limit, searchTerm } = param;
  return useQuery({
    queryKey: ['getCareerConsultations', page, limit, searchTerm],
    queryFn: () => getCareerConsultations(param)
  });
};

export { useGetCareerConsultations }; 