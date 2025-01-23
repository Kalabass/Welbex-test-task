import { postService } from '@/api/services/post.service';
import { useMutation } from '@tanstack/react-query';

export const useCreatePostMutation = () => {
  return useMutation({
    mutationFn: (formData: FormData) => postService.create(formData),
    mutationKey: ['post', 'create'],
  });
};
