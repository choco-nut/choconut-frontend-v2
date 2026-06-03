import { useQuery } from '@tanstack/react-query';
import api from '../../../shared/api/apiClient';

export const useProductDetailsQuery = (productId) => {
    return useQuery({
        queryKey: ['product', productId],
        queryFn: async () => {
            const [productRes, reviewRes] = await Promise.all([
                api.get(`/products/${productId}/`),
                api.get(`/products/${productId}/reviews/`)
            ]);
            return {
                product: productRes.data,
                reviews: reviewRes.data.results,
                meta: {
                    count: reviewRes.data.count,
                    next: reviewRes.data.next,
                    previous: reviewRes.data.previous,
                }
            };
        },
        enabled: !!productId,
        staleTime: 5 * 60 * 1000, // 5 minutes cache
    });
};
