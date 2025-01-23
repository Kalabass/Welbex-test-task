import { uesAuthModalStore } from '@/lib/store/authModa.store';
import { Box, Modal, styled } from '@mui/material';
import { FC } from 'react';
import { AuthForm } from './AuthForm';

export const AuthModal: FC = () => {
  const { isOpen, closeModal } = uesAuthModalStore();

  return (
    <Modal open={isOpen} onClose={closeModal}>
      <StyledBox>
        <AuthForm />
      </StyledBox>
    </Modal>
  );
};

const StyledBox = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 552px;
  height: 696px;
  padding: 40px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  outline: none;
`;
