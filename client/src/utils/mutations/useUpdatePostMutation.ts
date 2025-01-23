import { postService } from '@/api/services/post.service';
import { useMutation } from '@tanstack/react-query';

export const useUpdatePostMutation = () => {
  return useMutation({
    mutationFn: ({
      postId,
      formData,
    }: {
      postId: number;
      formData: FormData;
    }) => postService.update(postId, formData),
    mutationKey: ['post', 'create'],
  });
};
