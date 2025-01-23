import { API_ENDPOINTS } from '@/const/APIEndpoints';
import { Post } from '@/types/post';
import { axiosInstance } from '../axios.instance';

class PostService {
  async findAll(): Promise<Post[]> {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.POST.BASE);

      return response.data;
    } catch (error) {
      console.error('Failed to get all posts', error);
      throw error;
    }
  }

  async create(formData: FormData) {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.POST.BASE,
        formData
      );

      return response.data;
    } catch (error) {
      console.error('Failed to create post', error);
      throw error;
    }
  }

  async update(postId: number, formData: FormData) {
    try {
      const response = await axiosInstance.patch(
        `${API_ENDPOINTS.POST.BASE}/${postId}`,
        formData
      );

      return response.data;
    } catch (error) {
      console.error('Failed to update post', error);
      throw error;
    }
  }

  async delete(postId: number) {
    try {
      const response = await axiosInstance.delete(
        `${API_ENDPOINTS.POST.BASE}/${postId}`
      );

      return response.data;
    } catch (error) {
      console.error('Failed to update post', error);
      throw error;
    }
  }
}

export const postService = new PostService();
