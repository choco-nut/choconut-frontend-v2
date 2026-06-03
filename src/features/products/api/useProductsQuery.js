import { useQuery } from '@tanstack/react-query';
import api from '../../../shared/api/apiClient';

export const useProductsQuery = (params) => {
    return useQuery({
        queryKey: ['products', params],
        queryFn: async () => {
            const { data } = await api.get('products/', { params });
            return data;
        },
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
