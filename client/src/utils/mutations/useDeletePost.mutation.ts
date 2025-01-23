import { postService } from '@/api/services/post.service';
import { useMutation } from '@tanstack/react-query';

export const useDeletePostMutation = () => {
  return useMutation({
    mutationFn: (postId: number) => postService.delete(postId),
    mutationKey: ['post', 'delete'],
  });
};
