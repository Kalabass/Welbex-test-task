import { authService } from '@/api/services/auth.service';
import { uesAuthModalStore } from '@/lib/store/authModa.store';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { setTokenToLocalStorage } from '@/lib/tokens';
import { LoginData } from '@/types/login';
import { useMutation } from '@tanstack/react-query';

export const useRegMutation = () => {
  const { closeModal } = uesAuthModalStore();
  const { setUser } = useAuthStore();
  return useMutation({
    mutationFn: (loginData: LoginData) => authService.reg(loginData),
    mutationKey: ['auth', 'login'],
    onSuccess: (data) => {
      setTokenToLocalStorage(data.access_token);
      setUser(data.access_token);
      closeModal();
    },
  });
};
