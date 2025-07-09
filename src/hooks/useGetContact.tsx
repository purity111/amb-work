import { getContacts } from '@/lib/api';
import { ContactFetchParam } from '@/utils/types';
import { useQuery } from '@tanstack/react-query';

const useGetContactInquiries = (param: ContactFetchParam) => {
    const { page, limit, searchTerm } = param;
    return useQuery({
        queryKey: ['getContactInquiries', page, limit, searchTerm],
        queryFn: () => getContacts(param)
    });
};

export { useGetContactInquiries }; 