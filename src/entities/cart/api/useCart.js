import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../shared/api/apiClient';
import { useUserStore } from '../../user/model/useUserStore';

export const useCart = () => {
  const queryClient = useQueryClient();
  const { user } = useUserStore();

  // 1. Fetch Cart Data
  const cartQuery = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const { data } = await api.get('/cart/');
      return data;
    },
    enabled: !!user, // Optimization: Only fetch if user exists
  });

  // 2. Add/Update Mutation (Optimistic)
  const updateMutation = useMutation({
    mutationFn: (payload) => api.patch('/cart/update/', payload),
    onMutate: async (newItem) => {
      // Cancel outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ['cart'] });
      const previousCart = queryClient.getQueryData(['cart']);

      // Optimistically update the cache
      queryClient.setQueryData(['cart'], (old) => ({
        ...old,
        items: old.items.map(item => 
          item.product.id === newItem.product_id 
            ? { ...item, quantity: newItem.quantity } 
            : item
        )
      }));

      return { previousCart };
    },
    onError: (err, newItem, context) => {
      queryClient.setQueryData(['cart'], context.previousCart);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  return { ...cartQuery, updateQuantity: updateMutation.mutate };
};