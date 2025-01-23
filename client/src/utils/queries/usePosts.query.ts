import { postService } from '@/api/services/post.service';
import { useQuery } from '@tanstack/react-query';

export const usePostsQuery = () => {
  return useQuery({
    queryFn: () => postService.findAll(),
    queryKey: ['posts'],
  });
};
