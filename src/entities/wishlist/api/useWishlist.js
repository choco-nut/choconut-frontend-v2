import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../shared/api/apiClient';

export const useWishlist = () => {
  const queryClient = useQueryClient();

  const wishlistQuery = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const { data } = await api.get('/wishlist/');
      return data.items.map(item => item.product);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (productId) => api.post('/wishlist/toggle/', { product_id: productId }),
    onSuccess: () => {
      // "Perfect" Sync: Refresh wishlist and related product views
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    }
  });

  return { ...wishlistQuery, toggle: toggleMutation.mutate };
};