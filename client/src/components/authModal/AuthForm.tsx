import { ERROR_CODES } from '@/const/errorCodes';
import { LoginData } from '@/types/login';
import { useLoginMutation } from '@/utils/mutations/useLogin.mutation';
import { useRegMutation } from '@/utils/mutations/useReg.mutation';
import { Button, Stack, styled, TextField, Typography } from '@mui/material';
import { FC, ReactNode, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

const AuthForm: FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const { handleSubmit, control } = useForm<LoginData>();

  const loginMutation = useLoginMutation();
  const regMutation = useRegMutation();

  const onErrorHandler = (error: Error) => {
    console.log(error);
    const { response } = error as {
      response?: { data: { errorCode: string; message: string } };
    };
    console.log(response);
    if (response?.data.errorCode === ERROR_CODES.invalidLoginCode)
      setLoginErrorMessage(response.data.message);
    if (response?.data.errorCode === ERROR_CODES.invalidPasswordCode)
      setPasswordErrorMessage(response.data.message);
  };

  const onSubmit: SubmitHandler<LoginData> = (data) => {
    setLoginErrorMessage(undefined);
    setPasswordErrorMessage(undefined);
    isLogin
      ? loginMutation.mutate(data, {
          onError: onErrorHandler,
        })
      : regMutation.mutate(data, {
          onError: onErrorHandler,
        });
  };

  const [loginErrorMessage, setLoginErrorMessage] = useState<
    string | undefined
  >(undefined);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<
    string | undefined
  >(undefined);

  return (
    <StyledStack component='form' onSubmit={handleSubmit(onSubmit)}>
      <Typography variant='h4' fontWeight={600} color='primary'>
        {isLogin ? 'Вход' : 'Регистрация'}
      </Typography>

      <Controller
        defaultValue=''
        name='login'
        control={control}
        rules={{
          required: 'Введите логин',
          minLength: {
            value: 4,
            message: 'Логин должен быть длиннее 4 символов',
          },
          maxLength: {
            value: 20,
            message: 'Логин должен быть менее 20 символов',
          },
        }}
        render={({ field, fieldState: { error } }) => (
          <TextField
            label='Логин'
            variant='outlined'
            error={!!error || !!loginErrorMessage}
            helperText={error?.message || loginErrorMessage}
            fullWidth
            {...field}
          />
        )}
      />

      <Controller
        defaultValue=''
        name='password'
        control={control}
        rules={{
          required: 'Введите пароль',
          minLength: {
            value: 6,
            message: 'Пароль должен быть длиннее 6 символов',
          },
          maxLength: {
            value: 20,
            message: 'Пароль должен быть менее 20 символов',
          },
        }}
        render={({ field, fieldState: { error } }) => (
          <TextField
            label='Пароль'
            type='password'
            variant='outlined'
            error={!!error || !!passwordErrorMessage}
            helperText={error?.message || passwordErrorMessage}
            fullWidth
            {...field}
          />
        )}
      />

      <Button variant='contained' type='submit' fullWidth>
        {isLogin ? 'Войти' : 'Зарегистрироваться'}
      </Button>

      <StyledButton
        variant='text'
        color='secondary'
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? 'Создать аккаунт' : 'Уже есть аккаунт?'}
      </StyledButton>
    </StyledStack>
  );
};

export { AuthForm };
interface StyledProps {
  component: ReactNode;
}

const StyledStack = styled(Stack)<StyledProps>`
  width: 100%;
  max-width: 400px;
  text-align: center;
  margin: 0 auto;
  gap: 24px;
`;

const StyledButton = styled(Button)`
  font-size: 12px;
  font-weight: 500;
  text-transform: 'none';
`;
