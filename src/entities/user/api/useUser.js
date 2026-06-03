import { useQuery } from '@tanstack/react-query';
import { api } from '../../../shared/api/apiClient';
import { useUserStore } from '../model/useUserStore';

export const useUser = () => {
  const { setAuth, clearAuth } = useUserStore();

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/me/');
        return data;
      } catch (err) {
        // If /me/ fails, the refresh interceptor already tried to save it. 
        // If we're here, the session is truly dead.
        clearAuth(); 
        throw err;
      }
    },
    // Optimization: Only fetch if we think we might have a session
    retry: false,
    staleTime: 1000 * 60 * 10, // User info is "fresh" for 10 minutes
  });
};